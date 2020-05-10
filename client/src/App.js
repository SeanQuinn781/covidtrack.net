import React from 'react';
import { geoCentroid } from "d3-geo";
import './Dark.css'
import './App.css';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";
import tooltip from "wsdm-tooltip"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import exampleWorldData from './utils/testData/exampleWorldData';
import UnitedStatesMap from './UnitedStatesMap';
// components
import Instructions from './components/Instructions';
import DefaultGeography from './components/DefaultGeography';
import NavToggle from './components/NavToggle';
import MapControlButtons from './components/MapControlButtons';
//  component markers
import WorldMapMarkers from './components/svgMarkers/World/WorldMapMarkers';
import Logo from './covidLogoCircular.png';
// utils
import format from './utils/format';
import randomGeographyColor from './utils/randomGeographyColor';
import geographyColorPalette from './utils/geographyColorPalette';
import sortLocation from './utils/sortLocation';
import relativeIndexScale from './utils/relativeIndexScale';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSortedByMetric: null,
      offline: false,
      renderCasualties: true,
      renderCasualtiesCount: true,
      renderConfirmed: false,
      renderCasesHeatmap: false,
      renderCasualtiesHeatmap: true,
      renderConfirmedCount: false,
      renderCountryNames: false,
      testData: exampleWorldData,
      worldData: [],

    }

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentDidMount() {
    const { state : { offline, testData } } = this;
    this.tip = tooltip()
    this.tip.create()
    this.clearPreviousCovidData()
    // call the covid api and store data, or store testData in state
    if (offline) {
      this.setState(
        state => {
          const worldData = state.worldData.concat(testData);
          return {worldData};
        }
      ) 
    }
    else {
      fetch("/covid")
        .then(res => res.json())
        .then(data => {
          this.setState(
            state => {
              const worldData = state.worldData.concat(data);
              return {worldData};
            }
          ) 
        })
    }
  }

  handleClick = (event) => {
    const { state } = this;
    // get the metric currently clicked by button ID
    const { currentTarget: { id } } = event;
    const isMetricActive =  state[`${id}`];
    // Toggle the metrics active or inactive      
    const newMetricState = !isMetricActive;
    // save the toggled metric state
    this.setState({ [id]: newMetricState })
  }

  handleHeatmap = (event) => {
    const { state } = this;
    const { currentTarget: { id } } = event;
    const isMetricActive =  state[`${id}`];
    const newMetricState = !isMetricActive;

    if (id === 'renderCasesHeatmap') {
      this.setState({ renderCasualtiesHeatmap : false  })
    } else {
      this.setState({ renderCasesHeatmap : false  })
    }
    this.setState({ [id]: newMetricState });
  }

  handleMouseMove(evt, countryData,name) {
    
    this.tip.position({ pageX: evt.pageX, pageY: evt.pageY })

    if (countryData === undefined) {
      this.tip.show(`Data for <span>${name},</span> is unavailable`)
    }
    else {
      this.tip.show(
        `
        Country: ${format(countryData.country)}
        Active: ${format(countryData.active)}
        Confirmed: ${format(countryData.confirmed)}
        Deaths: ${format(countryData.deaths)}
        Recovered: ${format(countryData.recovered)}
        `
      )
    }
  }

  handleMouseLeave() {
    this.tip.hide()
  }

  clearPreviousCovidData() {
    this.setState({ worldData: [] })
  }

  render() {
    const {
      renderCasesHeatmap,
      renderCasualtiesHeatmap,
      renderCasualties,
      renderCasualtiesCount,
      renderConfirmed,
      renderConfirmedCount,
      renderCountryNames,
      worldData,
    } = this.state;

    return (
      <>
        <nav className="navbar navbar-expand-lg navbar-fixed-top">
          <a className="navbar-brand navbar-left" href="/">
            <div id="logoContainer">
              <div id="logoWrap">
                <img id="logoImg" alt="covidTrack.net Logo" width="9%" height="9%" src={Logo} />
                <h5>CovidTrack.net</h5>
              </div>
            </div>
          </a>

          <NavToggle />
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <MapControlButtons 
              handleClick={this.handleClick}
              handleHeatmap={this.handleHeatmap}
              mouseOver={this.handleClick}
              renderCasesHeatmap={renderCasesHeatmap}
              renderCasualtiesHeatmap={renderCasualtiesHeatmap}
              renderCasualties={renderCasualties}
              renderCasualtiesCount={renderCasualtiesCount}
              renderConfirmed={renderConfirmed}
              renderConfirmedCount={renderConfirmedCount}
              renderCountryNames={renderCountryNames}
            />
          </div>
        </nav>
        
        <div className="fluid-container" id="main">
          <a name="worldMap" alt="worldMap" href="https://covidtrack.net#worldMap" />
          <ComposableMap id="worldMap">
            <Geographies 
              geography="world-110m.json">
              {({ geographies }) => (
                <>
                  {
                    geographies.map((geo, i) => {
                      const centroid = geoCentroid(geo);
                      // match covid data for each country with svg for that country
                      // matches on country name, or abbreviated name (found in geo.properties['Alpha-2'])
                      const locationData = worldData.find(c => c.country === geo.properties.name) ? 
                        worldData.find(c => c.country === geo.properties.name) : 
                        worldData.find(c => c.country === geo.properties['Alpha-2'])
                    
                      if(!locationData) {
                      // render the country without svg markers
                        return (
                          <DefaultGeography 
                            onMouseMove={this.handleMouseMove}
                            onMouseLeave={this.handleMouseLeave}
                            geo={geo}
                            locationData={locationData}
                          />
                        )
                      }

                      let relativeIndex; 
                      let countryColor;
                      let dataSorted;
                      // assign a geography color based on a location's metric rank relative to the rest
                      if (renderCasualtiesHeatmap) {
                        dataSorted = sortLocation(worldData, 'deaths');
                        relativeIndex = relativeIndexScale('deaths', locationData.deaths, dataSorted);
                        countryColor   = geographyColorPalette(dataSorted, relativeIndex,'deaths');
                      } 

                      else if (renderCasesHeatmap) {
                        dataSorted = sortLocation(worldData, 'confirmed');
                        relativeIndex = relativeIndexScale('confirmed', locationData.confirmed, dataSorted);
                        countryColor   = geographyColorPalette(dataSorted, relativeIndex,'confirmed');
                      }

                      else {
                        countryColor = randomGeographyColor();
                      }

                      return(
                        <>
                          <Geography
                            className="locationData"
                            key={geo.rsmKey + locationData.country}
                            onMouseMove={(e,props) => this.handleMouseMove(e,locationData, geo.properties.name)}
                            onMouseLeave={this.handleMouseLeave}
                            fill={countryColor}
                            stroke="#fff"
                            geography={geo}
                          />
                          <g key={`${geo.rsmKey}-name`}>
                            <Marker coordinates={centroid}>
                              <text y="2" fontSize={14} textAnchor="middle" />
                            </Marker>
                          </g>
                          <WorldMapMarkers
                            locationData={locationData}
                            onClick={this.handleClick}
                            onMouseEnter={this.handleClick}
                            renderCasualties={renderCasualties}
                            renderCasualtiesCount={renderCasualtiesCount}
                            renderConfirmed={renderConfirmed}
                            renderConfirmedCount={renderConfirmedCount}
                            renderCountryNames={renderCountryNames}
                          />
                        </>
                      )
                    })
                  }
                </>  
              )}
            </Geographies>
          </ComposableMap>
          <Instructions />
          <UnitedStatesMap
            renderCasesHeatmap={renderCasesHeatmap}
            renderCasualtiesHeatmap={renderCasualtiesHeatmap}
            renderCasualties={renderCasualties}
            renderCasualtiesCount={renderCasualtiesCount}
            renderConfirmed={renderConfirmed}
            renderConfirmedCount={renderConfirmedCount}
          />
          <a name="unitedStatesMap" content="unitedStatesMap" alt="unitedStatesMap" href="https://covidtrack.net#unitedStatesMap" />
        </div>
      </>
    )
  }
}
export default App;
