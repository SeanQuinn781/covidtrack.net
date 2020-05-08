import React from "react";
import { geoCentroid } from "d3-geo";
import './UnitedStatesMap.css';
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import tooltip from "wsdm-tooltip"
import PropTypes from 'prop-types';
import exampleUsCovidData from './utils/testData/exampleUsData' 
import allStates from './allstates.json';
// utils
import format from './utils/format';
import { offsets } from './utils/Constants';
import randomGeographyColor from './utils/randomGeographyColor';
import stateColorPalette from './utils/stateColorPalette'
import sortLocation from './utils/sortLocation'
import relativeIndexScale from './utils/relativeIndexScale';
// markers
import USMapTextMarkers from './components/svgMarkers/US/USMapTextMarkers';
import USMapAnnotations from './components/svgMarkers/US/USMapAnnotations';

class UnitedStatesMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // U.S. state data
      unitedStatesData: [],
      // offline mode for testing (offline mode only requires the front end to be running)
      offline: true,
      testData: exampleUsCovidData,
      geographyColor: '#ddd',
      renderCasualties: true,
      renderConfirmed: false,
    }

    this.handleMouseMove   = this.handleMouseMove.bind(this);
    this.handleMouseLeave  = this.handleMouseLeave.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {

    const {
      props: {
        renderCasesHeatmap,
        renderCasualtiesHeatmap,
      }
    } = this;


    this.tip = tooltip();
    this.tip.create();
    

    if (!this.state.offline) {
      fetch("/covidUnitedStates").then(res => res.json())
      .then(data => {
        this.setState(
          state => {
            const unitedStatesData = state.unitedStatesData.concat(data);
            return {unitedStatesData}
          }
        )
      })
      .catch(function(error) {
        // console.log('error ', error)
        return error;
      });
    }
    // check for active metrics and sort geographic locations by 
    // their coresponding metric and how it ranks in relation to 
    // reach other location. This allows for varying brightness 
    // of the color as they correspond with their relative rankings
    /*
     */
    else {

      let data = this.state.testData;
      // TODO: export
      // pre sort data in order by any active metrics before saving to state
      if (renderCasualtiesHeatmap) {
        data.sort(function(a,b) {
          return a.death - b.death;
        }).reverse()
      }
      else if (renderCasesHeatmap) {
        data = data.slice(0)
        data.sort(function(a,b) {
          return a.positive - b.positive;
        }).reverse()
      }

      this.setState(
        state => {
          const unitedStatesData = state.unitedStatesData.concat(data);
          return {unitedStatesData}
        }
      )
    }
  }

  // renders data in tooltip 
  handleMouseMove(evt, stateData) {

    this.tip.position({ pageX: evt.pageX, pageY: evt.pageY })

    if (typeof stateData.state !== "string") {
      this.tip.show('Data Unavailable')
    }
    else {
      // TODO refactor set keys
      this.tip.show(
        `
        <key=${ stateData.id }>
          State: ${ format(stateData.state)}
          commercialScore: ${ format(stateData.commercialScore)}
          death: ${ format(stateData.death)}
          fips: ${ format(stateData.fips)}
          Grade: ${ format(stateData.grade)} 
          Hospitalized: ${  format(stateData.hospitalized)}
          inIcuCumulative: ${  format(stateData.inIcuCumulative)}
          inIcuCurrently: ${  format(stateData.inIcuCurrently)}
          negative: ${  format(stateData.negative)}
          onVentilatorCumulative: ${  format(stateData.onVentilatorCumulative)}
          onVentilatorCurrently: ${  format(stateData.onVentilatorCurrently)}
          pending: ${  format(stateData.pending)}
          posNeg: ${  format(stateData.posNeg)}
          positive: ${  format(stateData.positive)}
          positiveScore: ${  format(stateData.positiveScore)}
          recovered: ${  format(stateData.recovered)}
          score: ${  format(stateData.score)}
          totalTestResults: ${ stateData.totalTestResults}
        </>
        `
      )
    }
  }

  handleMouseLeave() {
    this.tip.hide()
  }

  render() {

    const { unitedStatesData } = this.state;
    const {
      renderCasesHeatmap,
      renderCasualtiesHeatmap,
      renderCasualties,
      renderCasualtiesCount,
      renderConfirmed,
      renderConfirmedCount,
    } = this.props;
    
    if(unitedStatesData.length < 2) {
      return (<p>Data Pending...</p>)
    }

    return (
        <ComposableMap 
          projection="geoAlbersUsa"
          id="unitedStatesMap"
        >
          <Geographies 
            geography="states-10m.json">
            {({ geographies }) => (
              <>
                {geographies.map((geo, i) => {
                   // generate the state labels, annotations and the state svg markers
                   const centroid = geoCentroid(geo);
                   // set the current U.S. state
                   const currentState = allStates.find(s => s.val === geo.id);
                   // use the current U.S. state (cur) id to find the corresponding 
                   // U.S. state data previosly returned from the API & saved to state
                   const locationData = unitedStatesData.find(s => s.state === currentState.id);
                   // generate the corresponding SVG marker and append to markersArray

                   if(!locationData) {
                     console.log('no loc' , centroid[0])
                     return (
                      <Geography
                        key={geo.rsmKey+centroid[0]}
                        onMouseMove={(e,props) => this.handleMouseMove(e,locationData,geo.properties.name)}
                        onMouseLeave={this.handleMouseLeave}
                        style={{
                          hover: { fill: "#DDD", outline: "none" },
                          pressed: { fill: "#AAA", outline: "none" },
                        }}
                        fill="darkgray"
                        geography={geo}
                      />
                     )
                   }
                  
                   let sortedMetric = [];
                   let relativeIndex; 
                   let stateColor;
                  // assign the state geography a color based on the value of total cases or deaths 
                  if (renderCasualtiesHeatmap) {
                    relativeIndex = relativeIndexScale('death', locationData.death, unitedStatesData)
                    stateColor   = stateColorPalette(unitedStatesData, relativeIndex, 'death');
                  } else if(renderCasesHeatmap) {
                    relativeIndex = relativeIndexScale('positive', locationData.positive, unitedStatesData)
                    stateColor   = stateColorPalette(unitedStatesData, relativeIndex, 'positive')
                  } else {
                    stateColor = randomGeographyColor();
                  }

                  return (
                    <>
                      <Geography
                        className="locationData"
                        key={geo.rsmKey}
                        onMouseMove={(e,props) => this.handleMouseMove(e,locationData)}
                        onMouseLeave={this.handleMouseLeave}
                        style={{
                          hover: { fill: "darkgray" },
                          pressed: { fill: "#aaa", outline: "none" },
                        }}
                        fill={stateColor}
                        stroke="#fff"
                        geography={geo}
                      />
                      <g key={`${geo.rsmKey  }-name`}>
                        {currentState &&
                          centroid[0] > -160 &&
                          centroid[0] < -67 &&
                          
                          /* Render a text marker or an annotation for each U.S. state name
                             Annotations are used when the state is too small for a text label.
                             States that need annotations are listed in the offsets array.
                          */

                          (Object.keys(offsets).indexOf(currentState.id) === -1 ? (
                            <USMapTextMarkers 
                              currentState={currentState}
                              locationData={locationData}
                              centroid={centroid}
                              renderCasualties={renderCasualties}
                              renderCasualtiesCount={renderCasualtiesCount}
                              renderConfirmed={renderConfirmed}
                              renderConfirmedCount={renderConfirmedCount}
                            />
                          ) : (
                            <USMapAnnotations 
                              currentState={currentState}
                              locationData={locationData}
                              centroid={centroid}
                              renderCasualties={renderCasualties}
                              renderCasualtiesCount={renderCasualtiesCount}
                              renderConfirmed={renderConfirmed}
                              renderConfirmedCount={renderConfirmedCount}
                            />
                          ))}
                      </g>
                    </>
                  );
                })}
              </>
            )} 
          </Geographies>
        </ComposableMap>
      )
  }
};

UnitedStatesMap.defaultProps = {
  renderCasualties: true,
  renderCasualtiesCount: true,
  renderCasualtiesHeatmap: true,
  stateData: {
    state: 'pending'
  },
  currentState: {
    name: 'pending'
  }
};

UnitedStatesMap.propTypes = {
  currentState: PropTypes.object,
  stateData: PropTypes.object,
  centroid: PropTypes.arrayOf(PropTypes.number),
  renderCasualties: PropTypes.bool,
  renderCasualtiesCount: PropTypes.bool.isRequired,
  renderConfirmed: PropTypes.bool,
  renderConfirmedCount: PropTypes.bool.isRequired,
};

export default UnitedStatesMap;
