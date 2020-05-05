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
import format from './Format';
import UnitedStatesTextMarkers from './UnitedStatesTextMarkers';
import UnitedStatesAnnotations from './UnitedStatesAnnotations';
import exampleUsCovidData from './exampleUsCovidData' 
import allStates from './allstates.json';


const offsets = {
  VT: [50, -8],
  NH: [34, 2],
  MA: [30, -1],
  RI: [28, 2],
  CT: [35, 10],
  NJ: [34, 1],
  DE: [33, 0],
  MD: [47, 10],
  DC: [49, 21]
};

class UnitedStatesMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      unitedStatesData: [],
      // offline mode for testing (offline mode only requires the front end to be running)
      offline: true,
      testData: exampleUsCovidData,
    }

    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  componentDidMount() {

    this.tip = tooltip()
    this.tip.create()
    
    if (!this.state.offline)
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
  handleMouseMove(evt, curStateData) {

    this.tip.position({ pageX: evt.pageX, pageY: evt.pageY })

    if (typeof curStateData.state !== "string")
      this.tip.show('Data Unavailable')
    else
      // TODO refactor 
      this.tip.show(
        `
        State: ${ format(curStateData.state)}
        commercialScore: ${ format(curStateData.commercialScore)}
        death: ${ format(curStateData.death)}
        fips: ${ format(curStateData.fips)}
        Grade: ${ format(curStateData.grade)} 
        Hospitalized: ${  format(curStateData.hospitalized)}
        inIcuCumulative: ${  format(curStateData.inIcuCumulative)}
        inIcuCurrently: ${  format(curStateData.inIcuCurrently)}
        negative: ${  format(curStateData.negative)}
        onVentilatorCumulative: ${  format(curStateData.onVentilatorCumulative)}
        onVentilatorCurrently: ${  format(curStateData.onVentilatorCurrently)}
        pending: ${  format(curStateData.pending)}
        posNeg: ${  format(curStateData.posNeg)}
        positive: ${  format(curStateData.positive)}
        positiveScore: ${  format(curStateData.positiveScore)}
        recovered: ${  format(curStateData.recovered)}
        score: ${  format(curStateData.score)}
        totalTestResults: ${  curStateData.totalTestResults}`,
      )
  }

  handleMouseLeave() {
    this.tip.hide()
  }

  render() {

    const { unitedStatesData } = this.state;
    const { 
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
                   const curStateData = unitedStatesData.find(s => s.state === currentState.id);
                   // generate the corresponding SVG marker and append to markersArray
                  return (
                    <>
                      <Geography
                        key={geo.rsmKey}
                        onMouseMove={(e,props) => this.handleMouseMove(e,curStateData)}
                        onMouseLeave={this.handleMouseLeave}
                        style={{
                          default: { fill: "#EEE", outline: "none" },
                          hover: { fill: "#DDD", outline: "none" },
                          pressed: { fill: "#AAA", outline: "none" },
                        }}
                        stroke="#FFF"
                        geography={geo}
                        fill="#DDD"
                      />
                      <g key={`${geo.rsmKey  }-name`}>
                        {currentState &&
                          centroid[0] > -160 &&
                          centroid[0] < -67 &&

                          /* Either render a text marker or a annotation for each state
                             Annotations (floating state labels) are used when the state is too small
                             for a text label to fit. States that need annotations are listed in the
                             offsets array.
                          */
                          (Object.keys(offsets).indexOf(currentState.id) === -1 ? (
                            <UnitedStatesTextMarkers 
                              currentState={currentState}
                              curStateData={curStateData}
                              centroid={centroid}
                              renderCasualties={renderCasualties}
                              renderCasualtiesCount={renderCasualtiesCount}
                              renderConfirmed={renderConfirmed}
                              renderConfirmedCount={renderConfirmedCount}
                            />
                            // End Render State Text Labels
                            // ------------------------------------------------------------------
                          ) : (
                            <UnitedStatesAnnotations 
                              currentState={currentState}
                              curStateData={curStateData}
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

UnitedStatesMap.propTypes = {
  currentState: PropTypes.shape({
    id: PropTypes.string,
    val: PropTypes.string,
    name: PropTypes.string
  }),
  curStateData: PropTypes.shape({
    state: PropTypes.string,
    commercialScore: PropTypes.number,
    death: PropTypes.number,
    fips: PropTypes.number,
    grade: PropTypes.string,
    hostipitalized: PropTypes.number,
    inIcuCumulative: PropTypes.number,
    inIcuCurrently: PropTypes.number,
    negative: PropTypes.number,
    onVentilatorCumulative: PropTypes.number,
    onVentilatorCurrently: PropTypes.number,
    pending: PropTypes.number,
    posNeg: PropTypes.number,
    positive: PropTypes.number,
    positiveScore: PropTypes.number,
    recovered: PropTypes.number,
    score: PropTypes.string,
    totalTestResults: PropTypes.number
}).isRequired,
  centroid: PropTypes.arrayOf(PropTypes.number),
  renderCasualties: PropTypes.bool.isRequired,
  renderCasualtiesCount: PropTypes.bool.isRequired,
  renderConfirmed: PropTypes.bool.isRequired,
  renderConfirmedCount: PropTypes.bool.isRequired,
};

export default UnitedStatesMap;
