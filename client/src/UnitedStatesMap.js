import React from "react";
import { geoCentroid } from "d3-geo";
import './UnitedStatesMap.css';
import format from './Format';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation
} from "react-simple-maps";
import tooltip from "wsdm-tooltip"
import exampleUsCovidData from './exampleUsCovidData.js' 

import allStates from './allstates.json'

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
  handleMouseMove(evt, stateData) {

    this.tip.position({ pageX: evt.pageX, pageY: evt.pageY })
    // TODO refactor w/ object.entries for label/val
    this.tip.show(
      `
      State: ${ format(stateData.state)}
      commercialScore: ${  format(stateData.commercialScore)}
      death: ${  format(stateData.death)}
      fips: ${  format(stateData.fips)}
      Grade: ${  format(stateData.grade)} 
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
      totalTestResults: ${  stateData.totalTestResults}`,
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
      renderConfirmedCount
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
                   const cur = allStates.find(s => s.val === geo.id);
                   // use the current U.S. state (cur) id to find the corresponding 
                   // U.S. state data previosly returned from the API & saved to state
                   const curStateData = unitedStatesData.find(s => s.state === cur.id);
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
                        {cur &&
                          centroid[0] > -160 &&
                          centroid[0] < -67 &&
                          // Either render a text marker or annotation for each state
                          // TODO refactor ternary
                          (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                            <>
                              <Marker coordinates={centroid}>
                                <text 
                                  y="2" 
                                  fontSize={14} 
                                  textAnchor="middle"
                                  className="stateLabel">
                                  {cur.id}
                                </text>
                              </Marker>
                              { renderCasualties &&
                                  <Marker
                                    className="covidMarkers currentCovidMarker deaths"
                                    coordinates={centroid}
                                    key={`deaths-${`${curStateData.id+curStateData.death}-svg`}`}
                                  >
                                      <circle
                                        className="stateCircle"
                                        coordinates={centroid}
                                        fill="red"
                                        fillOpacity=".5"
                                        // set the radius of the svg circle data point to the total death count divided by 50 
                                        // TODO: dynamic scaling based on window size (using the total count as radius makes them way too large)
                                        r={curStateData.death/1200}
                                        strokeWidth="1.5"
                                        stroke="goldenrod" 
                                      />
                                  </Marker>
                              }
                              { renderCasualtiesCount && 
                                  <Marker 
                                    className="deaths"
                                    coordinates={centroid}
                                    key={`deaths-${curStateData.id+curStateData.death}`}
                                  >
                                    <text 
                                      coordinates={centroid}
                                      y="20" 
                                      fontSize={14} 
                                      textAnchor="middle"
                                      fill="#D32F2F"
                                      stroke="#D32F2F"
                                    >
                                      {curStateData.death}
                                    </text>
                                  </Marker>
                              }
                              { renderConfirmed &&
                                  <Marker
                                    className="covidMarkers confirmed currentCovidMarker"
                                    coordinates={centroid}
                                    key={`confirmed-${`${curStateData.id + curStateData.totalTestResults  }-svg`}`}
                                  >
                                    <circle
                                      coordinates={centroid}
                                      r={curStateData.totalTestResults/1200}
                                      strokeWidth="1.5"
                                      fill="#03A9F4"
                                      fillOpacity=".3"
                                      stroke="#40c4ff" 
                                    />
                                  </Marker>
                              }
                              { renderConfirmedCount &&
                                  <Marker
                                    className="confirmed covidMarkers currentCovidMarker"
                                    coordinates={centroid}
                                    key={`confirmed-${curStateData.id + curStateData.totalTestResults}`}
                                  >
                                    <text
                                      className="confirmedCount text"
                                      y={-15}
                                      // x offset for rendering confirmed count to the left of casualties count
                                      // only render cases count for countries with over 10 cases to avoid crowding data points
                                      x={-20}>
                                      { curStateData.totalTestResults > 5000 ? curStateData.totalTestResults : '' }
                                    </text>
                                  </Marker>
                              }
                            </>
                            // End Render State Text Labels
                            // ------------------------------------------------------------------
                          ) : (
                            <>
                              <Annotation
                                subject={centroid}
                                dx={offsets[cur.id][0]}
                                dy={offsets[cur.id][1]}
                              >
                                <text x={4} fontSize={14} alignmentBaseline="middle">
                                  {cur.id}
                                </text>
                              </Annotation>
                              { renderCasualties &&
                                  <Marker
                                    className="covidMarkers currentCovidMarker deaths"
                                    coordinates={centroid}
                                    key={`deaths-${`${curStateData.id+curStateData.death}-svg`}`}
                                  >
                                    <circle
                                      className="stateConfirmedSvg"
                                      coordinates={centroid}
                                      // set the radius of the svg circle data point to the total death count divided by 50 
                                      // TODO: dynamic scaling based on window size (using the total count as radius makes them way too large)
                                      r={curStateData.death/1200}
                                      strokeWidth="1.5"
                                      fill="red"
                                      fillOpacity=".5"
                                      stroke="goldenrod" />
                                  </Marker>
                              }
                              { renderCasualtiesCount &&
                                  <Marker 
                                    className="covidMarkers currentCovidMarker deathsCount"
                                    coordinates={centroid}
                                    key={`deaths-${curStateData.id+curStateData.death}`}
                                  >
                                    <text 
                                      fontSize={14} 
                                      textAnchor="middle"
                                      fill="#D32F2F"
                                      stroke="#D32F2F"
                                    >
                                      {curStateData.death}
                                    </text>
                                  </Marker>
                                // End render State Annotations Labels
                              }
                              { 
                                renderConfirmed &&
                                  <Marker
                                    className="confirmed covidMarkers currentCovidMarker"
                                    coordinates={centroid}
                                    key={`confirmed-${`${curStateData.id + curStateData.totalTestResults  }-svg`}`}
                                  >
                                    <circle
                                      coordinates={centroid}
                                      fill="#03A9F4"
                                      fillOpacity=".3"
                                      r={curStateData.totalTestResults/1200}
                                      strokeWidth="1.5"
                                      stroke="#40c4ff" 
                                    />
                                  </Marker>
                              }
                              { 
                                renderConfirmedCount &&
                                  <Marker
                                    key={`confirmed-${curStateData.id + curStateData.totalTestResults}`}
                                    className="confirmed covidMarkers currentCovidMarker"
                                    coordinates={centroid}
                                  >
                                  <text
                                    className="confirmedCount text"
                                    // x offset for rendering confirmed count to the left of casualties count
                                    // only render cases count for countries with over 10 cases to avoid crowding data points
                                    x={-20}>
                                    { curStateData.totalTestResults > 5000 ? curStateData.totalTestResults : '' }
                                  </text>
                                  </Marker>
                              }
                            </>
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
