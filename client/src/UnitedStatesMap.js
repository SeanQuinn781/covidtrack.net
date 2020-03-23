import React from "react";
import { geoCentroid } from "d3-geo";
import './UnitedStatesMap.css'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation
} from "react-simple-maps";

import allStates from './allstates.json'
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

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
      unitedStatesDataMarkers: [],
      allStates: allStates,
    }
  }

  componentDidMount() {
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
      console.log('error ', error)
    });  
  }

  render() {
    
    if(this.state.unitedStatesData.length < 2) {
      return (<p>Data Pending...</p>)
    }
    return (
        <ComposableMap 
          projection="geoAlbersUsa"
          id="unitedStatesMap"
        >
          <Geographies 

            geography={geoUrl}>
            {({ geographies }) => (
              <>
                {geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    stroke="#FFF"
                    geography={geo}
                    fill="#DDD"
                  />
                ))}
                {geographies.map(geo => {
                  const markers = [];
                  // generate the state labels, and the state data markers
                  const centroid = geoCentroid(geo);
                  // set the current U.S. state
                  const cur = allStates.find(s => s.val === geo.id);
                  // use the current U.S. state (cur) id to find the corresponding 
                  // U.S. state data previosly returned from the API & saved to state
                  const curStateData = this.state.unitedStatesData.find(s => s.state === cur.id);
                  // generate the corresponding SVG marker and append to markersArray

                  return (
                    <g key={geo.rsmKey + "-name"}>
                      {cur &&
                        centroid[0] > -160 &&
                        centroid[0] < -67 &&
                        // Either render a text marker or annotation for each state
                        (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                          <>
                            <Marker coordinates={centroid}>
                              <text y="2" fontSize={14} textAnchor="middle">
                                {cur.id}
                              </text>
                            </Marker>
                            {
                              this.props.renderCasualties ?
                                <Marker
                                  coordinates={centroid}
                                  key={`deaths-${curStateData.id+curStateData.death}`}
                                  className="deaths"
                                  className="covidMarkers currentCovidMarker"
                                >
                                    <circle
                                      coordinates={centroid}
                                      // set the radius of the svg circle data point to the total death count divided by 50 
                                      // TODO: dynamic scaling based on window size (using the total count as radius makes them way too large)
                                      r={curStateData.death/25}
                                      className="stateCircle"
                                      stroke="red"
                                      strokeWidth="1.5"
                                      fill="red"
                                      fillOpacity=".5"
                                      stroke="goldenrod" 
                                    />
                                </Marker>
                              : ''
                            }
                            {
                              this.props.renderCasualtiesCount ? 
                                <Marker 
                                  className="deaths"
                                  coordinates={centroid}
                                >
                                  <text 
                                    y="20" 
                                    fontSize={14} 
                                    textAnchor="middle"
                                    fill="#D32F2F"
                                    stroke="#D32F2F"
                                  >
                                    {curStateData.death}
                                  </text>
                                </Marker>
                              : ''  
                            }
                            { 
                              this.props.renderConfirmed ? 
                                <Marker
                                  key={`confirmed-${curStateData.id + curStateData.total}`}
                                  className="confirmed"
                                  className="covidMarkers currentCovidMarker"
                                  coordinates={centroid}
                                >
                                  <circle
                                    coordinates={centroid}
                                    r={curStateData.total/500}
                                    stroke="#03A9F4"
                                    strokeWidth="1.5"
                                    fill="#03A9F4"
                                    fillOpacity=".3"
                                    stroke="#40c4ff" />
                                </Marker>
                              : ''
                            }
                            { 
                              this.props.renderConfirmedCount ? 
                                <Marker
                                  key={`confirmed-${curStateData.id + curStateData.total}`}
                                  className="confirmed"
                                  className="covidMarkers currentCovidMarker"
                                  coordinates={centroid}
                                >
                                 <text
                                  className="confirmedCount"
                                  y={40}
                                  // x offset for rendering confirmed count to the left of casualties count
                                  // only render cases count for countries with over 10 cases to avoid crowding data points
                                  x={-20}>
                                  { curStateData.total }
                                </text>
                                </Marker>
                              : ''
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
                            {
                              this.props.renderCasualties ?
                                <Marker
                                  coordinates={centroid}
                                  key={`deaths-${curStateData.id+curStateData.death}`}
                                  className="deaths"
                                  className="covidMarkers currentCovidMarker"
                                >
                                  <circle
                                    coordinates={centroid}
                                    // set the radius of the svg circle data point to the total death count divided by 50 
                                    // TODO: dynamic scaling based on window size (using the total count as radius makes them way too large)
                                    r={curStateData.death/25}
                                    className="stateCircle"
                                    stroke="red"
                                    strokeWidth="1.5"
                                    fill="red"
                                    fillOpacity=".5"
                                    stroke="goldenrod" />
                                </Marker>
                              : ''
                            }
                            {
                              this.props.renderCasualtiesCount ? 
                                <Marker 
                                  className="deaths"
                                  coordinates={centroid}
                                >
                                  <text 
                                    y="20" 
                                    fontSize={14} 
                                    textAnchor="middle"
                                    fill="#D32F2F"
                                    stroke="#D32F2F"
                                  >
                                    {curStateData.death}
                                  </text>
                                </Marker>
                              : ''  
                              // End render State Annotations Labels
                            }
                            { 
                              this.props.renderConfirmed ? 
                                <Marker
                                  key={`confirmed-${curStateData.id + curStateData.total}`}
                                  className="confirmed"
                                  className="covidMarkers currentCovidMarker"
                                  coordinates={centroid}
                                >
                                  <circle
                                    coordinates={centroid}
                                    r={curStateData.total/500}
                                    stroke="#03A9F4"
                                    strokeWidth="1.5"
                                    fill="#03A9F4"
                                    fillOpacity=".3"
                                    stroke="#40c4ff" />
                                </Marker>
                              : ''
                            }
                            { 
                              this.props.renderConfirmedCount ? 
                                <Marker
                                  key={`confirmed-${curStateData.id + curStateData.total}`}
                                  className="confirmed"
                                  className="covidMarkers currentCovidMarker"
                                  coordinates={centroid}
                                >
                                 <text
                                  className="confirmedCount"
                                  y={40}
                                  // x offset for rendering confirmed count to the left of casualties count
                                  // only render cases count for countries with over 10 cases to avoid crowding data points
                                  x={-20}>
                                  { curStateData.total }
                                </text>
                                </Marker>
                              : ''
                            }
                            
                          </>
                        
                        ))}
                    </g>
                  );
                }
                )}
              </>
            )} 
          </Geographies>
        </ComposableMap>
      )
  }
};

export default UnitedStatesMap;
