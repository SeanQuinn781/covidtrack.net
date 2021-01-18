import React from "react";
import { geoCentroid } from "d3-geo";
import './UnitedStatesMap.css';
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import tooltip from "wsdm-tooltip";
import usCountiesTestData from '../utils/testData/usCountiesTestData';
// utils
import format from '../utils/format';
import randomGeographyColor from '../utils/randomGeographyColor';
import countyColorPalette from '../utils/countyColorPalette';

class UnitedStatesCountyMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      unitedStatesCountyData: [],
      offline: false,
      testData: usCountiesTestData,
    }

    this.handleMouseMove   = this.handleMouseMove.bind(this);
    this.handleMouseLeave  = this.handleMouseLeave.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {

    const {
      state: {
        offline,
        renderCasualtiesHeatmap,
        renderCasesHeatmap,
      },
      state,
    } = this;

    this.tip = tooltip();
    this.tip.create();

    if (offline) {
      // TODO refactor state update
      this.setState(
        state => {
          const unitedStatesCountyData = state.unitedStatesCountyData.concat(usCountiesTestData);
          return {unitedStatesCountyData}
        }
      )
    }
    else {
      // get data for U.S. or U.S. Counties Map
      fetch("/locations/uscounties").then(res => res.json())
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
    } = this.state;

    const {
      renderCasesHeatmap,
      renderCasualtiesHeatmap,
    } = this.props;

    if(unitedStatesCountyData.length < 2) {
      return (
        <div 
          id="unitedStatesCountyMap" 
          style={{textAlign: 'center'}}
        >
          <h3 id="dataPending">Data Pending...</h3>
        </div>
      )
    }

    if (renderCasualtiesHeatmap) {
      unitedStatesCountyData.sort(function(a,b) {
        return a.stats.deaths - b.stats.deaths;
      }).reverse()
    }

    else if (renderCasesHeatmap) {
      unitedStatesCountyData.sort(function(a,b) {
        return a.confirmed - b.confirmed;
      }).reverse()
    } 


    return (
      <div>
        <h3 id="countyMapInstructions">For the best experience view this map on a desktop and hover over states/counties to view local Covid19 statistics</h3>
        <ComposableMap
          projection="geoAlbersUsa"
          id="unitedStatesCountyMap"
        >
          <Geographies
            geography="counties-10m.json">
            {({ geographies }) => (
              <>
                {geographies.map((geo, i) => {

                  let countyData;
                  let relativeIndex;

                  // There is no single field in the covid county data that can be used to match it with
                  // the geography currently being iterated over. This is a workaround/hack to match geo and data
                  // using name first (many counties share names regardless of what state they're in) and coordinates
                  const centroid = geoCentroid(geo);
                  const geoLat = Math.round(centroid[1]);
                  const geoLong = Math.round(centroid[0]);

                  // iterate all data to find current geography
                  unitedStatesCountyData.forEach((c,index) => {
                    // match on county name
                    if(c.county === geo.properties.name) {
                      // due to many counties with the same name, also match on long/lat
                      if(Math.round(c.coordinates.longitude) ===  Math.round(geoLong))
                        if (Math.round(c.coordinates.latitude)  ===  Math.round(geoLat))
                          countyData = c;
                      relativeIndex = index;
                    }
                  })

                  if(countyData === undefined ) {
                    console.log('no matching location data found for ')
                    return this.defaultGeography(geo,centroid);
                  }

                  let stateColor;
                  // assign the state a color based on the value of total cases or deaths heatmap
                  if (renderCasualtiesHeatmap) {
                    stateColor  = countyColorPalette(unitedStatesCountyData, relativeIndex, 'deaths');
                  } else if(renderCasesHeatmap) {
                    stateColor  = countyColorPalette(unitedStatesCountyData, relativeIndex, 'confirmed')
                  } else {
                    stateColor = randomGeographyColor();
                  }

                  return (
                    <>
                      <Geography
                        className="locationData"
                        key={geo.rsmKey}
                        onMouseMove={(e,props) => this.handleMouseMove(e, countyData)}
                        onMouseLeave={this.handleMouseLeave}
                        style={{
                          hover: { fill: "darkgray" },
                          pressed: { fill: "#aaa", outline: "none" },
                        }}
                        fill={stateColor}
                        stroke="#fff"
                        geography={geo}
                      />
                      <g key={`${geo.rsmKey}-name`} />
                    </>
                  );
                })}
              </>
            )}
          </Geographies>
        </ComposableMap>
      </div>
    )
  }
};

export default UnitedStatesCountyMap;