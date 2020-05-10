import React from "react";
import { geoCentroid } from "d3-geo";
import './UnitedStatesMap.css';
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import tooltip from "wsdm-tooltip";
import exampleUsCovidData from './utils/testData/exampleUsData';
import allStates from './allstates.json';
// component markers
import USMapTextMarkers from './components/svgMarkers/US/USMapTextMarkers';
import USMapAnnotations from './components/svgMarkers/US/USMapAnnotations';
// utils
import format from './utils/format';
import { offsets } from './utils/Constants';
import randomGeographyColor from './utils/randomGeographyColor';
import geographyColorPalette from './utils/geographyColorPalette';
import relativeIndexScale from './utils/relativeIndexScale';

class UnitedStatesMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      unitedStatesData: [],
      offline: false,
      testData: exampleUsCovidData,
    }

    this.handleMouseMove   = this.handleMouseMove.bind(this);
    this.handleMouseLeave  = this.handleMouseLeave.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {

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
          return error;
        });
    }

    else {
      this.setState(
        state => {
          const unitedStatesData = state.unitedStatesData.concat(this.state.testData);
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
      // TODO refactor
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

    if (renderCasualtiesHeatmap) {
      unitedStatesData.sort(function(a,b) {
        return a.death - b.death;
      }).reverse()
    }
    else if (renderCasesHeatmap) {
      unitedStatesData.sort(function(a,b) {
        return a.positive - b.positive;
      }).reverse()
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
                // create state labels, annotations and U.S. state svg markers
                const centroid = geoCentroid(geo);
                // set current U.S. state
                const currentState = allStates.find(s => s.val === geo.id);
                // match currentState with corresponding data 
                const locationData = unitedStatesData.find(s => s.state === currentState.id);

                if(!locationData) {
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
                  
                let relativeIndex; 
                let stateColor;
                // assign the state a color based on the value of total cases or deaths heatmap
                if (renderCasualtiesHeatmap) {
                  relativeIndex = relativeIndexScale('death', locationData.death, unitedStatesData)
                  stateColor   = geographyColorPalette(unitedStatesData, relativeIndex, 'death');
                } else if(renderCasesHeatmap) {
                  relativeIndex = relativeIndexScale('positive', locationData.positive, unitedStatesData)
                  stateColor   = geographyColorPalette(unitedStatesData, relativeIndex, 'positive')
                } else {
                  stateColor = randomGeographyColor();
                }

                return (
                  <>
                    <Geography
                      className="locationData"
                      key={geo.rsmKey + locationData.state}
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
                    <g key={`${geo.rsmKey  + locationData.id}-name`}>
                      {currentState &&
                          centroid[0] > -160 &&
                          centroid[0] < -67 &&
                         //  Render text marker or an annotation for each state

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

export default UnitedStatesMap;
