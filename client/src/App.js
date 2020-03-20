import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactTooltip from "react-tooltip";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      covidLocations: [],
      // render casualty SVG marker
      renderCasualties: true,
      // render number of casualties
      renderCasualtiesCount: true,
      // render confirmed SVG marker
      renderConfirmed: false,
      // render number of confirmed cases 
      renderConfirmedCount: false,
      // render country names
      renderCountryNames: false,
    }

     // This binding is necessary to make `this` work in the callback
     this.renderCasualties =      this.renderCasualties.bind(this);
     this.renderCasualtiesCount = this.renderCasualtiesCount.bind(this);

     this.renderConfirmed =       this.renderConfirmed.bind(this);
     this.renderConfirmedCount =  this.renderConfirmedCount.bind(this);

     this.renderCountryNames = this.renderCountryNames.bind(this);

  }

  componentDidMount() {
    // render the initial covid data
    this.buildcovidData();
    setInterval(
      // continue to call the api for covid data every 10 seconds
      () => this.buildcovidData(), 10000000
    )
  }

  setCovidLocations(covidDataPoint) {

    this.setState(
      state => {
        // store covidLocations in state
        const covidLocations = state.covidLocations.concat(covidDataPoint);
        return {covidLocations};

      }
    ) 
  }

  clearPreviousCovidData() {
    this.setState({ covidLocations: [] })
  }

  buildcovidData() {
    this.clearPreviousCovidData()
    fetch("/covid").then(res => res.json())
    .then(data => {
      this.setCovidLocations(data)
    })
  }

  renderCasualties() {
    // toggle total casualties (circle svg markers)
    this.state.renderCasualties ? 
      this.setState({ renderCasualties: false }) : 
      this.setState({ renderCasualties: true })
  }

  renderCasualtiesCount() {
    // toggle casualties count (numbers) on the map
    this.state.renderCasualtiesCount ? 
    this.setState({ renderCasualtiesCount: false }) : 
    this.setState({ renderCasualtiesCount: true })

  }

  renderConfirmed() {
      // toggle confirmed cases
      this.state.renderConfirmed ? 
        this.setState({ renderConfirmed: false }) : 
        this.setState({ renderConfirmed: true })

  }

  renderConfirmedCount() {
    // toggle confirmed cases
    this.state.renderConfirmedCount ? 
      this.setState({ renderConfirmedCount: false }) : 
      this.setState({ renderConfirmedCount: true })
  }

  renderCountryNames() {
    // toggle country names
    this.state.renderCountryNames ?
      this.setState({ renderCountryNames: false }) :
      this.setState({ renderCountryNames: true })
  }

  render() {
    // render the map of covid locations
    return (
      <div className="container maxW" id="main">
        <div id="mapKey">

            <button 
              className="renderCasualtiesButton"
              onClick={this.renderCasualties}
            >
              Render Casualties
            </button>

            <button 
              className="renderCasualtiesCountButton"
              onClick={this.renderCasualtiesCount}
            >
              Render Casualties Count
            </button>

            <button 
              className="renderConfirmedButton"
              onClick={this.renderConfirmed}
            >
              Render Confirmed Cases
            </button>
            
            <button 
              className="renderConfirmedCountButton"
              onClick={this.renderConfirmedCount}
            >
              Render Confirmed Cases Count
            </button>

            <button 
              className="renderCountryNamesButton"
              onClick={this.renderCountryNames}
            >
              Render Country Names
            </button>
          <p>
            To view different metrics on the map click the corresponding buttons  
          </p>
       </div>
        <ComposableMap>
        <Geographies geography="/world-110m.json">
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#DDD"
                stroke="#FFF"
              />
            ))
          }
        </Geographies>
        { 
          this.state.covidLocations.map((location) => {
              let markers = [];
              if (this.state.renderCasualties) {
                markers.push(
                <Marker
                  className="deaths"
                  className="covidMarkers currentCovidMarker"
                  // NOTE: France seems to return the incorrect long/lat.  This is a temporary fix ) 
                  coordinates={ location.country == "France" ? [ 2.3 , 48 ] : [ location.longitude, location.latitude ]}
                >
                  <circle
                    // set the radius of the svg circle data point to the total death count divided by 50 
                    // (using the total count makes them way too large)
                    r={location.deaths/50}
                    stroke="red"
                    strokeWidth="1.5"
                    fill="red"
                    fillOpacity=".5"
                    stroke="goldenrod" />
                </Marker>
                )
              }
              if (this.state.renderCasualtiesCount) {
                markers.push(
                  <Marker
                    className="deaths"
                    className="covidMarkers currentCovidMarker"
                    // NOTE: France seems to return the incorrect long/lat.  This is a temporary fix ) 
                    coordinates={ location.country == "France" ? [ 2.3 , 48 ] : [ location.longitude, location.latitude ]}
                  >
                    <text
                      className="confirmedNumbers"
                      fill="#D32F2F"
                      stroke="#D32F2F"
                      y={20}
                      x={-10}>
                        { location.deaths > 0 ? location.deaths : '' }
                    </text>
                  </Marker>
                )
              }
              if (this.state.renderConfirmed) {
                markers.push(
                  <Marker
                    className="confirmed"
                    className="covidMarkers currentCovidMarker"
                    // NOTE: France seems to return the incorrect long/lat.  This is a temporary fix ) 
                    coordinates={ location.country == "France" ? [ 2.3 , 48 ] : [ location.longitude, location.latitude ]}
                  >
                    <circle
                      // set the radius of the svg circle data point to the total death count divided by 50 
                      // (using the total count makes them way too large)
                      r={location.confirmed/50}
                      stroke="#03A9F4"
                      strokeWidth="1.5"
                      fill="#03A9F4"
                      fillOpacity=".3"
                      stroke="goldenrod" />
                  </Marker>
                )
              }
              if (this.state.renderConfirmedCount) {
                markers.push(
                  <Marker
                    className="confirmed"
                    className="covidMarkers currentCovidMarker"
                    // NOTE: France seems to return the incorrect long/lat.  This is a temporary fix ) 
                    coordinates={ location.country == "France" ? [ 2.3 , 48 ] : [ location.longitude, location.latitude ]}
                  >
                    <text
                      className="confirmedCount"
                      y={20}
                      fill="blue"
                      stroke="blue"
                      // x offset for rendering confirmed count to the left of casualties count
                      x={-40}>
                      { location.confirmed > 0 ? location.confirmed : '' }
                    </text>
                  </Marker>
                )
              }
              if(this.state.renderCountryNames) {
                markers.push(
                  <Marker
                    className="confirmed"
                    className="covidMarkers currentCovidMarker"
                    // NOTE: France seems to return the incorrect long/lat.  This is a temporary fix ) 
                    coordinates={ location.country == "France" ? [ 2.3 , 48 ] : [ location.longitude, location.latitude ]}
                  >
                    <text
                      className="countryName"
                      fill="goldenrod"
                      stroke="#000"
                      strokeWidth=".5px"
                      x={-10}>
                      { location.confirmed > 0 ? location.country : '' }
                    </text>
                  </Marker>
                )
              }
              return(markers)
            })
        }
      </ComposableMap>
      </div>
    )
  }
}

export default App;