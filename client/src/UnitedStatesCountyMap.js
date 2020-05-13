import React from "react";
import { geoCentroid } from "d3-geo";
import './UnitedStatesMap.css';
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import tooltip from "wsdm-tooltip";
import usCountiesTestData from './utils/testData/usCountiesTestData';
import usTestData from './utils/testData/usTestData';
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
      unitedStatesCountyData: [],
      countyMap: true,
      statesMap: false,
      offline: true,
      testData: [],
    }

    this.handleMouseMove   = this.handleMouseMove.bind(this);
    this.handleMouseLeave  = this.handleMouseLeave.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {

    this.tip = tooltip();
    this.tip.create();

    if (this.state.offline) {
      this.state.countryMap ? 
        this.setState(
          state => {
            const unitedStatesCountyData = state.unitedStatesCountyData.concat(usCountiesTestData);
            return {unitedStatesCountyData}
          }
        ) :
        this.setState(
          state => {
            const unitedStatesData = state.unitedStatesData.concat(usTestData);
          }
        )
    }
    // get data for U.S. or U.S. Counties Map
    if (this.state.countyMap) {
      fetch("/covidUnitedStatesCounties").then(res => res.json())
      .then(data => {
        this.setState(
          state => {
            const unitedStatesCountyData = state.unitedStatesCountyData.concat(data);
            return {unitedStatesCountyData}
          }
        )
      })
      .catch(function(error) {
        return error;
      });
    }
    else {
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

    const { 
      unitedStatesData,
      unitedStatesCountyData, 
      countyMap, 
      statesMap,
    } = this.state;

    const {
      renderCasesHeatmap,
      renderCasualtiesHeatmap,
      renderCasualties,
      renderCasualtiesCount,
      renderConfirmed,
      renderConfirmedCount,
    } = this.props;

    const mapData = countyMap ? 
      unitedStatesCountyData : unitedStatesData

    const mapJson = countyMap ? 
      'counties-10m.json' : 'states-10m.json'
    
    if(mapData.length < 2) {
      return (<p>Data Pending...</p>)
    }

    if (renderCasualtiesHeatmap) {
      mapData.sort(function(a,b) {
        return a.death - b.death;
      }).reverse()
    }
    else if (renderCasesHeatmap) {
      mapData.sort(function(a,b) {
        return a.positive - b.positive;
      }).reverse()
    }

    return (
      <ComposableMap 
        projection="geoAlbersUsa"
        id="unitedStatesMap"
      >
        <Geographies 
          geography={mapJson}>
          {({ geographies }) => (
            <>
              {geographies.map((geo, i) => {
                // create state labels, annotations and U.S. state svg markers
                const centroid = geoCentroid(geo);
                // set current U.S. state
                console.log(geo)
                
                let locationData, currentState, currentLocation;

                if (statesMap) {
                  currentLocation = allStates.find(s => s.val === geo.id);
                  // match currentState with corresponding data 
                  locationData = mapData.find(s => s.state === currentState.id);
                } else {
                  // match the county to get the state name
                  currentLocation = allStates.find(s => s.name === geo.id)
                  locationData = mapData.find(s => s.province === currentLocation.state)
                  debugger;
                  /* geo has an id name and state such as:
                  {
                    "id": 25017,
                    "name": "Middlesex County, MA",
                    "state": "MA"
                  },
                  county data has
                  */
                
                  // const currentCounty = mapData.find(c => c.val === geo.id);
                  // const locationData = mapData.find(c => c.cal === c.state )
                  debugger;
                }

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
                  relativeIndex = relativeIndexScale('death', locationData.death, mapData)
                  stateColor   = geographyColorPalette(mapData, relativeIndex, 'death');
                } else if(renderCasesHeatmap) {
                  relativeIndex = relativeIndexScale('positive', locationData.positive, mapData)
                  stateColor   = geographyColorPalette(mapData, relativeIndex, 'positive')
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
                      {currentLocation &&
                          centroid[0] > -160 &&
                          centroid[0] < -67 &&
                         //  Render text marker or an annotation for each state

                          (Object.keys(offsets).indexOf(currentLocation.id) === -1 ? (
                            <USMapTextMarkers 
                              currentState={currentLocation}
                              locationData={locationData}
                              centroid={centroid}
                              renderCasualties={renderCasualties}
                              renderCasualtiesCount={renderCasualtiesCount}
                              renderConfirmed={renderConfirmed}
                              renderConfirmedCount={renderConfirmedCount}
                            />
                          ) : (
                            <USMapAnnotations 
                              currentState={currentLocation}
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