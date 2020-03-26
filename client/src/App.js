import React from 'react';
import './App.css';
// styles from DarkReader
import './Dark.css';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Container, Navbar, Nav, MenuItem } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import {jQuery} from 'jquery';
import UnitedStatesMap from './UnitedStatesMap';
import Logo from './covidLogoCircular.png';
import QuestionMark from './questionMark.png'

class App extends React.Component {

  constructor(props) {
    super(props);
    // set up the initial map state
    this.state = {
      // global covid locations data
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
      // state for selected map in bootstrap nav
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
    // setInterval(
      // continue to call the api for covid data every 1000 seconds
    //  () => this.buildcovidData(), 1000000
    // )
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

  // TODO refactor click handlers
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
    const {
      covidLocations,
      renderCasualties,
      renderCasualtiesCount,
      renderConfirmed,
      renderConfirmedCount,
      renderCountryNames,
    } = this.state;

    return (
      <>
     <nav className="navbar navbar-expand-lg navbar-fixed-top">
        <a className="navbar-brand navbar-right" href="/">
        <div id="logoContainer">
          <div id="logoWrap">
            <img id="logoImg" alt="covidTrack.net Logo" width="9%" height="9%" src={Logo} />
            <h5>CovidTrack.net</h5>
          </div>
        </div>
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <Button
              variant="contained"
              className="confirmedCount" 
              color="primary"
              type="submit"
              className={`mapControlButton ${renderCasualtiesCount ? 'active' : ''}`}
              style={{ opacity: `${  renderCasualtiesCount ? '.9' : '.7'}`}}
              onClick={this.renderCasualtiesCount}
            >
              Casualties over 1000
            </Button>

            <Button
              variant="contained"
              className="confirmedCount" 
              color="primary"
              type="submit"
              className={`mapControlButton ${ renderConfirmedCount ? "active" : ""}`}
              style={{ opacity: `${  renderConfirmedCount ? '.9' : '.8'}`}}
              onClick={this.renderConfirmedCount}
            >
              Cases over 20000
            </Button>

            <Button 
              variant="contained"
              className="confirmedCount" 
              color="primary"
              type="submit"
              className={`mapControlButton ${renderCasualties ? 'active' : ''}`}
              style={{ opacity: `${  renderCasualties ? '.9' : '.8'}`}}
              onClick={this.renderCasualties}
            >
              Casualties SVG
            </Button>

            <Button
              variant="contained"
              className="confirmedCount" 
              color="primary"
              type="submit"
              className={`mapControlButton ${renderConfirmed ? 'active' : ''}`}
              style={{ opacity: `${  renderConfirmed ? '.9' : '.8'}`}}
              onClick={this.renderConfirmed}
            >
              Cases SVG
            </Button>

            <Button
              variant="contained"
              className="confirmedCount" 
              color="primary"
              type="submit"
              className={`countryNameButton ${renderCountryNames ? 'active' : ''}`}
              style={{ opacity: `${  renderCountryNames ? '.9' : '.8'}`}}
              onClick={this.renderCountryNames}
            >
              Countries over with over 20000 Cases
            </Button>

            <Button
              className="selectMap"
              eventKey="#worldMap" 
              type="submit"
              href="#worldMap"
            >
              World Map
            </Button>

            <Button
              className="selectMap"
              eventKey="#unitedStatesMap" 
              href="#unitedStatesMap"
            >
              United States
            </Button>
          </ul>
        </div>
      </nav>
      
      <div className="fluid-container" id="main">
        
        <a name="worldMap" alt="worldMap" href="https://covidtrack.net#worldMap" />
        <ComposableMap id="worldMap">
        <Geographies geography="world-110m.json">
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
          covidLocations.map((location) => {
              const markers = [];
            
              if (renderCasualties) {
                markers.push(
                <Marker
                  key={`deaths-${location.country}-svg`}
                  className="covidMarkers currentCovidMarker deaths"
                  // NOTE: France seems to return the incorrect long/lat.  This is a temporary fix ) 
                  coordinates={ location.country === "France" ? [ 2.3 , 48 ] : [ location.longitude, location.latitude ]}
                >
                  <svg xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink">
                    <defs>
                      <radialGradient id="myGradient">
                        <stop offset="10%" stopColor="red" />
                        <stop offset="95%" stopColor="#fd7e14" />
                      </radialGradient>
                    </defs>
                    <circle
                      // set the radius of the svg circle data point to the total death count divided by 50 
                      // TODO: dynamic scaling based on window size (using the total count as radius makes them way too large)
                      r={location.deaths/300}
                      strokeWidth="1.5"
                      fill="url('#myGradient')"
                      fillOpacity=".5"
                      stroke="#d62b2b"/>
                    </svg>
                </Marker>
                )
              }
              if(renderCountryNames) {
                markers.push(
                  <Marker
                    key={`countryName-${location.country}`}
                    className="countryNames covidMarkers currentCovidMarker countryNameMarker"
                    coordinates={ location.country === "France" ? [ 2.3 , 48 ] : [ location.longitude, location.latitude ]}
                  >
                    <text
                      className="countryName"
                      fill="rgb(231, 191, 91)"
                      color="#ffc107"
                      stroke="#000"
                      strokeWidth=".4px"
                      x={-26}
                      y={-10}>
                      { location.confirmed > 20000 ? location.country : '' }
                    </text>
                  </Marker>
                )
              }
              if (renderCasualtiesCount) {
                markers.push(
                  <Marker
                    key={`deathsCount-${location.country}`}
                    className="covidMarkers deaths currentCovidMarker"
                    // NOTE: France seems to return the incorrect long/lat.  This is a temporary fix ) 
                    coordinates={ location.country === "France" ? [ 2.3 , 48 ] : [ location.longitude, location.latitude ]}
                  >
                    <text
                      className="casualtyCount"
                      fill="rgb(55, 133, 230)"
                      stroke="rgb(55, 133, 230)"
                    >
                        { location.deaths > 1000 ? location.deaths : '' }
                    </text>
                  </Marker>
                )
              }
              if (renderConfirmed) {
                markers.push(
                  <Marker
                    key={`confirmed-${location.country}`}
                    className="confirmed covidMarkers currentCovidMarker"
                    coordinates={ location.country === "France" ? [ 2.3 , 48 ] : [ location.longitude, location.latitude ]}
                  >
                    <circle
                      r={location.confirmed/2000}
                      strokeWidth="1.5"
                      fill="#03A9F4"
                      fillOpacity=".3"
                      stroke="#40c4ff" />
                  </Marker>
                )
              }
              if (renderConfirmedCount) {
                markers.push(
                  <Marker
                    key={`confirmedCount-${location.country}`}
                    className="confirmed covidMarkers currentCovidMarker"
                    coordinates={ location.country === "France" ? [ 2.3 , 48 ] : [ location.longitude, location.latitude ]}
                  >
                    <text
                      className="confirmedCount"
                      y={20}
                      // x offset for rendering confirmed count to the left of casualties count
                      // only render cases count for countries with over 10 cases to avoid crowding data points
                      x={-20}>
                      { location.confirmed > 20000 ? location.confirmed : '' }
                    </text>
                  </Marker>
                )
              }
              return(markers)
            })
        }
      </ComposableMap>
      <div className="instructions">
        <div className="helpWrap">
          <img id="helpIcon" alt="helpIcon" src={QuestionMark} />
          <h5>Usage</h5>
        </div>
        <p>Click Navigation Buttons to Add/Remove Data from the Map</p>
      </div>
      <div className="appInfo">
        <p className="dataSource">World Data from Johns Hopkins via <a href="https://pypi.org/project/covid/"> Covid SDK</a></p>
	      <p className="dataSource">U.S. data from <a href="https://covidtracking.com">covidtracking.com/api/states</a></p>
        <a href="https://github.com/seanquinn781/react-maps-flask-covid">
          <img alt="githubLink" className="github" width="50px" height="50px" src="/GitHub-Mark.png" />
        </a>
      </div>
      <UnitedStatesMap
        renderCasualties={renderCasualties}
        renderCasualtiesCount={renderCasualtiesCount}
        renderConfirmed={renderConfirmed}
        renderConfirmedCount={renderConfirmedCount}
      />
      <a name="unitedStatesMap" alt="unitedStatesMap" href="https://covidtrack.net#unitedStatesMap" />
    </div>
    </>
    )
  }
}

export default App;
