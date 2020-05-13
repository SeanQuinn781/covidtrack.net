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
import statesAndCounties from './statesAndCounties.json';
// component markers
import USCountyTextMarkers from './components/svgMarkers/US/USCountyTextMarkers';
// utils
import format from './utils/format';
import { offsets } from './utils/Constants';
import randomGeographyColor from './utils/randomGeographyColor';
import geographyColorPalette from './utils/geographyColorPalette';
import relativeIndexScale from './utils/relativeIndexScale';

class UnitedStatesCountyMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      unitedStatesCountyData: [],
      offline: true,
      testData: usCountiesTestData,
      allStates: allStates,
    }

    this.handleMouseMove   = this.handleMouseMove.bind(this);
    this.handleMouseLeave  = this.handleMouseLeave.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {

    this.tip = tooltip();
    this.tip.create();

    if (this.state.offline) {
        this.setState(
          state => {
            const unitedStatesCountyData = state.unitedStatesCountyData.concat(usCountiesTestData);
            return {unitedStatesCountyData}
          }
        )
    }
    else {
      // get data for U.S. or U.S. Counties Map
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
  }
  defaultGeography (geo,centroid) {
    return (
      <Geography
        key={geo.rsmKey+centroid[0]}
        onMouseMove={(e,props) => this.handleMouseMove(e,'l',geo.properties.name)}
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
  // renders data in tooltip 
  handleMouseMove(evt, stateData) {

    this.tip.position({ pageX: evt.pageX, pageY: evt.pageY })

    if (typeof stateData.county !== "string") {
      this.tip.show('Data Unavailable')
    }
    else {
      // TODO refactor
      this.tip.show(
        `
        <key=${ stateData.county }>
          Province: ${ format(stateData.province)}
          County: ${ format(stateData.county)}
          Confirmed: ${ format(stateData.stats.confirmed)}
          Deaths: ${ format(stateData.stats.deaths)}
          Recovered: ${ format(stateData.stats.recovered)}
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
      unitedStatesCountyData,
      allStates,
    } = this.state;

    const {
      renderCasesHeatmap,
      renderCasualtiesHeatmap,
      renderCasualties,
      renderCasualtiesCount,
      renderConfirmed,
      renderConfirmedCount,
    } = this.props;

    // TODO reuse code for US map
    if(unitedStatesCountyData.length < 2) {
      return (<p>Data Pending...</p>)
    }

    if (renderCasualtiesHeatmap) {
      unitedStatesCountyData.sort(function(a,b) {
        return a.stats.deaths - b.stats.deaths;
      }).reverse()
    }
    else if (renderCasesHeatmap) {
      unitedStatesCountyData.sort(function(a,b) {
        return a.stats.confirmed - b.stats.confirmed;
      }).reverse()
    }

    return (
      <ComposableMap 
        projection="geoAlbersUsa"
        id="unitedStatesMap"
      >
        <Geographies 
          geography="counties-10m.json">
          {({ geographies }) => (
            <>
              {geographies.map((geo, i) => {

                // create state labels, annotations and U.S. state svg markers
                const centroid = geoCentroid(geo);
                // the geo id is the same ID used to ID U.S. counties, but the county data doesn't contain this id
                // first,  map ids to county name
                const county = statesAndCounties.find(s => s.id === geo.id);
                if(!county) {
                  console.log('no county data found')
                  return this.defaultGeography(geo,centroid);
                } 
                const countyName = county.name;
                const countyStateInitials = county.state;
                // second, map state initials to state name
                const countyState = allStates.find(s => s.id === countyStateInitials);
                const stateName = countyState.name;
                // third, use state name to find all county data within that state
                const countiesInState = usCountiesTestData.filter(s => s.province === stateName);
                // forth, iterate countiesInState array to match with
                // the current geo
                let locationData = [];
                countiesInState.forEach((c)=> {
                  // includes to match string is necessary due to the dynamic naming of the counties (Mojave versus Mojave County)
                  if (countyName.includes(c.county))
                    locationData.push(c);
                });

                if(locationData.length === 0 ) {
                  console.log('no location data found')
                  return this.defaultGeography(geo,centroid);
                }
                for (let i =0; i < locationData.length; i++) {
                  let relativeIndex; 
                  let stateColor;
                  // assign the state a color based on the value of total cases or deaths heatmap
                  if (renderCasualtiesHeatmap) {
                    relativeIndex = relativeIndexScale('death', locationData[i].stats.deaths, unitedStatesCountyData)
                    stateColor   = geographyColorPalette(unitedStatesCountyData, relativeIndex, 'deaths');
                  } else if(renderCasesHeatmap) {
                    relativeIndex = relativeIndexScale('positive', locationData[i].stats.confirmed, unitedStatesCountyData)
                    stateColor   = geographyColorPalette(unitedStatesCountyData, relativeIndex, 'confirmed')
                  } else {
                    stateColor = randomGeographyColor();
                  }

                  return (
                    <>
                      <Geography
                        className="locationData"
                        key={geo.rsmKey + locationData.state}
                        onMouseMove={(e,props) => this.handleMouseMove(e,locationData[i])}
                        onMouseLeave={this.handleMouseLeave}
                        style={{
                          hover: { fill: "darkgray" },
                          pressed: { fill: "#aaa", outline: "none" },
                        }}
                        fill={stateColor}
                        stroke="#fff"
                        geography={geo}
                      />
                      <g key={`${geo.rsmKey  + locationData[i].id}-name`}>
                        
                      </g>
                    </>
                  );
                }
              })}
            </>
          )} 
        </Geographies>
      </ComposableMap>
    )
  }
};

export default UnitedStatesCountyMap;