import React from 'react';
import './App.css';
// styles from DarkReader
import './Dark.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";

import Nav from 'react-bootstrap/Nav';
import UnitedStatesMap from './UnitedStatesMap';

const geoUrl = "/world-100m.json";

class App extends React.Component {

  constructor(props) {
    super(props);
    // set up the initial map state
    this.state = {
      // global covid locations data
      covidLocations: [],
      // United States covid locations data
      unitedStatesData: [],
      // render casualty SVG marker
      renderCasualties: true,
      // render number of casualties
      renderCasualtiesCount: true,
      // render confirmed SVG marker
      renderConfirmed: false,
      // render number of confirmed cases 
      renderConfirmedCount: false,
      // render country names
      renderCountryNames: true,
      // state for selected map in bootstrap nav
      mapSelected: '#worldMap',
    }

     // This binding is necessary to make `this` work in the callback
     this.renderCasualties =      this.renderCasualties.bind(this);
     this.renderCasualtiesCount = this.renderCasualtiesCount.bind(this);

     this.renderConfirmed =       this.renderConfirmed.bind(this);
     this.renderConfirmedCount =  this.renderConfirmedCount.bind(this);

     this.renderCountryNames = this.renderCountryNames.bind(this);

     this.onSelect = this.onSelect.bind(this);

  }

  componentDidMount() {
    // render the initial covid data
    this.buildcovidData();
    // setInterval(
      // continue to call the api for covid data every 1000 seconds
    //  () => this.buildcovidData(), 1000000
    //)
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

  onSelect() {
    this.setState({ mapSelected : arguments[0]})
  }

  render() {
    return (
      <>
      <Nav
        className="navbar-right"
        activeKey={this.state.mapSelected}
        onSelect={this.onSelect}
      >
        <Nav.Item>
        <Nav.Link 
            eventKey="#worldMap" 
            href="#worldMap"
            className="mapNavLink"
          >
            World Map
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link 
            eventKey="#unitedStatesMap" 
            href="#unitedStatesMap"
            className="mapNavLink"
          >
            United States
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="fluid-container" id="main">
        <div id="logoContainer">
          <div id="logoWrap">
            <img id="logoImg" alt="covidLogo" width="5%" height="5%" src="/covidLogoCircular.png" />
            <h5>CovidTrack.net</h5>
          </div>
        </div>

        <div id="mapControls">

            <button
              type="renderCasualties"
              className={`${this.state.renderCasualties ? 'active' : ''}`}
              onClick={this.renderCasualties}
            >
              Casualties
            </button>

            <button
              type="renderCasualtiesCount"
              className={`${this.state.renderCasualtiesCount ? 'active' : ''}`}
              onClick={this.renderCasualtiesCount}
            >
              Casualties Count
            </button>

            <button
              type="renderConfirmed"
              className={`${this.state.renderConfirmed ? 'active' : ''}`}
              onClick={this.renderConfirmed}
            >
              Confirmed Cases
            </button>

            <button
              type="renderCountryNames"
              className={`${this.state.renderCountryNames ? 'active' : ''}`}
              onClick={this.renderCountryNames}
            >
              Countries over with over 5000 Cases
            </button>

            <button
              type="renderConfirmedCount"
              className={`${this.state.renderConfirmedCount ? 'active' : ''}`}
              onClick={this.renderConfirmedCount}
            >
              Confirmed Cases over 100
            </button>
       </div>
        <a name="worldMap"></a>
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
          this.state.covidLocations.map((location) => {
              const markers = [];
              if (this.state.renderCasualties) {
                const markerKey = `${location.country  }-deaths`;
                markers.push(
                <Marker
                  key={`deaths-${location.country}`}
                  className="deaths"
                  className="covidMarkers currentCovidMarker"
                  // NOTE: France seems to return the incorrect long/lat.  This is a temporary fix ) 
                  coordinates={ location.country === "France" ? [ 2.3 , 48 ] : [ location.longitude, location.latitude ]}
                >
                  <circle
                    // set the radius of the svg circle data point to the total death count divided by 50 
                    // TODO: dynamic scaling based on window size (using the total count as radius makes them way too large)
                    r={location.deaths/300}
                    stroke="red"
                    strokeWidth="1.5"
                    fill="red"
                    fillOpacity=".5"
                    stroke="goldenrod" />
                </Marker>
                )
              }
              if(this.state.renderCountryNames) {
                markers.push(
                  <Marker
                    key={`countryName-${location.country}`}
                    className="countryNames"
                    className="covidMarkers currentCovidMarker countryNameMarker"
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
                      { location.confirmed > 5000 ? location.country : '' }
                    </text>
                  </Marker>
                )
              }
              if (this.state.renderCasualtiesCount) {
                markers.push(
                  <Marker
                    key={`deathsCount-${location.country}`}
                    className="deaths"
                    className="covidMarkers currentCovidMarker"
                    // NOTE: France seems to return the incorrect long/lat.  This is a temporary fix ) 
                    coordinates={ location.country === "France" ? [ 2.3 , 48 ] : [ location.longitude, location.latitude ]}
                  >
                    <text
                      x={6}
                      y={-10}
                      className="casualtyNumbers"
                      fill="rgb(55, 133, 230)"
                      stroke="rgb(55, 133, 230)"
                    >
                        { location.deaths > 0 ? location.deaths : '' }
                    </text>
                  </Marker>
                )
              }
              if (this.state.renderConfirmed) {
                markers.push(
                  <Marker
                    key={`confirmed-${location.country}`}
                    className="confirmed"
                    className="covidMarkers currentCovidMarker"
                    coordinates={ location.country === "France" ? [ 2.3 , 48 ] : [ location.longitude, location.latitude ]}
                  >
                    <circle
                      r={location.confirmed/300}
                      stroke="#03A9F4"
                      strokeWidth="1.5"
                      fill="#03A9F4"
                      fillOpacity=".3"
                      stroke="#40c4ff" />
                  </Marker>
                )
              }
              if (this.state.renderConfirmedCount) {
                markers.push(
                  <Marker
                    key={`confirmedCount-${location.country}`}
                    className="confirmed"
                    className="covidMarkers currentCovidMarker"
                    coordinates={ location.country === "France" ? [ 2.3 , 48 ] : [ location.longitude, location.latitude ]}
                  >
                    <text
                      className="confirmedCount"
                      y={20}
                      // x offset for rendering confirmed count to the left of casualties count
                      // only render cases count for countries with over 10 cases to avoid crowding data points
                      x={-20}>
                      { location.confirmed > 100 ? location.confirmed : '' }
                    </text>
                  </Marker>
                )
              }
              return(markers)
            })
        }
      </ComposableMap>
      <div className="appInfo">
        <p id="dataSource">Data from Johns Hopkins via <a href="https://pypi.org/project/covid/"> Covid SDK</a></p>
        <a href="https://github.com/seanquinn781/react-maps-flask-covid">
          <img className="github" width="50px" height="50px" src="/GitHub-Mark.png" />
        </a>
      </div>
      <UnitedStatesMap
        renderCasualties={this.state.renderCasualties}
        renderCasualtiesCount={this.state.renderCasualtiesCount}
        renderConfirmed={this.state.renderConfirmed}
        renderConfirmedCount={this.state.renderConfirmedCount}
      />
      <a name="unitedStatesMap"></a>
    </div>
    </>
    )
  }
}

export default App;