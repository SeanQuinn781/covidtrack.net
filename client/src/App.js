import React from 'react';
import { geoCentroid } from "d3-geo";
import './App.css';
// styles from DarkReader
import './Dark.css';
import format from './Format';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";
import tooltip from "wsdm-tooltip"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Button } from '@material-ui/core';
import worldData from './exampleWorldCovidData.js' 
import UnitedStatesMap from './UnitedStatesMap';
import Logo from './covidLogoCircular.png';
import QuestionMark from './questionMark.png'

class App extends React.Component {

  constructor(props) {
    super(props);
    // set up the initial map state
    this.state = {
      // global covid locations data
      covidCountries: [],
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
      // offline mode for testing (offline mode only requires the front end to be running)
      offline: false,
      testData: worldData,
    }

     this.handleClick = this.handleClick.bind(this);
     this.handleMouseMove = this.handleMouseMove.bind(this);
     this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentDidMount() {
    const { state : { offline } } = this;

    this.tip = tooltip()
    this.tip.create()
    // render the initial covid data
    this.clearPreviousCovidData()
    if (!offline)
      fetch("/covid")
        .then(res => res.json())
        .then(data => {
          this.setState(
            state => {
              // store covidCountries in state
              const covidCountries = state.covidCountries.concat(data);
              return {covidCountries};
            }
          ) 
        })
      
    else {
      this.setState(
        state => {
          // store covidCountries in state
          const covidCountries = state.covidCountries.concat(this.state.testData);
          return {covidCountries};
        }
      ) 
    }
  }

  // Based on click, toggle corresponding metric in App state so its applied to the map
  handleClick = (event) => {

    const { state } = this;
    // get the metric currently clicked by button ID
    const { currentTarget: { id } } = event;
    // return a bool representing the metric (id) current state
    const isMetricActive =  state[`${id}`];
    // toggle the metrics active or inactive
    const newMetricState = !isMetricActive
    // save the toggled metric state
    this.setState({ [id]: newMetricState })
  }

  // renders data in tooltip
  handleMouseMove(evt, countryData) {
    
    // TODO rm this workaround
    if (countryData === undefined) {
      countryData = {};
    }

    this.tip.position({ pageX: evt.pageX, pageY: evt.pageY })

    // TODO refactor
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

  handleMouseLeave() {
    this.tip.hide()
  }

  clearPreviousCovidData() {
    this.setState({ covidCountries: [] })
  }

  render() {
    const {
      covidCountries,
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
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-toggle="collapse" 
            data-target="#navbarSupportedContent" 
            aria-controls="navbarSupportedContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
            style={{color:'#fff !important'}}
          >
            <span className="navbar-toggler-icon"> 
              <i className="fas fa-bars fa-1x" />
            </span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                id="renderCasualtiesCount"
                className={`mapControlButton ${renderCasualtiesCount ? 'active' : ''}`}
                style={{ opacity: `${  renderCasualtiesCount ? '.9' : '.7'}`}}
                onClick={e => this.handleClick(e)}
              >
                Casualty count over 1000
              </Button>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                id="renderConfirmedCount"
                className={`mapControlButton ${ renderConfirmedCount ? "active" : ""}`}
                style={{ opacity: `${  renderConfirmedCount ? '.9' : '.8'}`}}
                onClick={e => this.handleClick(e)}
              >
                Cases count over 50000
              </Button>

              <Button 
                variant="contained"
                color="primary"
                type="submit"
                id="renderCasualties"
                className={`mapControlButton ${renderCasualties ? 'active' : ''}`}
                style={{ opacity: `${  renderCasualties ? '.9' : '.8'}`}}
                onClick={e => this.handleClick(e)}
              >
                Casualty Data Point
              </Button>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                id="renderConfirmed"
                className={` mapControlButton ${renderConfirmed ? 'active' : ''}`}
                style={{ opacity: `${  renderConfirmed ? '.9' : '.8'}`}}
                onClick={e => this.handleClick(e)}
              >
                Cases Data Point
              </Button>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                id="renderCountryNames"
                className={`mapControlButton ${renderCountryNames ? 'active' : ''}`}
                style={{ opacity: `${  renderCountryNames ? '.9' : '.8'}`}}
                onClick={e => this.handleClick(e)}
              >
                Countries over with over 50000 Cases
              </Button>

              <Button
                className="selectMap"
                type="submit"
                href="#worldMap"
              >
                World Map
              </Button>

              <Button
                className="selectMap"
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
              <Geographies 
                geography="world-110m.json">
                  {({ geographies }) => (
                    <>
                      {
                        geographies.map((geo, i) => {
                        const centroid = geoCentroid(geo);
                        // find the corresponding covid data for each geographic location while iterating over all geographies
                        // match on country name, or abbreviated name (found in geo.properties['Alpha-2'])
                        const curLocationData = covidCountries.find(c => c.country === geo.properties.name) ? 
                          covidCountries.find(c => c.country === geo.properties.name) : 
                          covidCountries.find(c => c.country === geo.properties['Alpha-2'])
                       
                        if(!curLocationData)
                          return(<Geography
                            key={geo.rsmKey}
                            onMouseMove={(e,props) => this.handleMouseMove(e,curLocationData)}
                            onMouseLeave={this.handleMouseLeave}
                            style={{
                              hover: { fill: "#DDD", outline: "none" },
                              pressed: { fill: "#AAA", outline: "none" },
                            }}
                            geography={geo}
                          />)

                        return(
                          <>
                            <Geography
                              key={geo.rsmKey}
                              onMouseMove={(e,props) => this.handleMouseMove(e,curLocationData)}
                              onMouseLeave={this.handleMouseLeave}
                              style={{
                                hover: { fill: "#DDD", outline: "red" },
                                pressed: { fill: "#AAA", outline: "none" },
                              }}
                              fill="#e0deda"
                              stroke="#ccc"
                              geography={geo}
                            />
                            <g key={`${geo.rsmKey  }-name`}>
                              <Marker coordinates={centroid}>
                                <text y="2" fontSize={14} textAnchor="middle" />
                              </Marker>
                            </g>

                            { renderCasualties &&
                                <Marker
                                  key={`deaths-${curLocationData.country}-svg`}
                                  className="covidMarkers currentCovidMarker deaths"
                                  // NOTE: France seems to return the incorrect long/lat.  This is a temporary fix ) 
                                  coordinates={ curLocationData.country === "France" ? [ 2.3 , 48 ] : [ curLocationData.longitude, curLocationData.latitude ]}
                                >
                                <svg xmlns="http://www.w3.org/2000/svg"
                                  xmlnsXlink="http://www.w3.org/1999/xlink">
                                  <defs>
                                    <radialGradient id="redGradient">
                                      <stop offset="10%" stopColor="darkred" />
                                      <stop offset="95%" stopColor="red" />
                                    </radialGradient>
                                  </defs>
                                  <circle
                                    // set the radius of the svg circle data point to the total death count divided by 50 
                                    // TODO: dynamic scaling based on window size (using the total count as radius makes them way too large)
                                    r={curLocationData.deaths/2300}
                                    strokeWidth="1.5"
                                    fill="url('#redGradient')"
                                    fillOpacity=".5"
                                    stroke="#d3212d"/>
                                  </svg>
                              </Marker>
                            }
                            { renderCountryNames &&
                              <Marker
                                key={`countryName-${curLocationData.country}`}
                                className="countryNames covidMarkers currentCovidMarker countryNameMarker"
                                coordinates={ curLocationData.country === "France" ? [ 2.3 , 48 ] : [ curLocationData.longitude, curLocationData.latitude ]}
                              >
                                <text
                                  className="countryName"
                                  fill="rgb(231, 191, 91)"
                                  color="#ffc107"
                                  stroke="#000"
                                  strokeWidth=".4px"
                                  x={-26}
                                  y={-10}>
                                  { curLocationData.confirmed > 50000 ? curLocationData.country : '' }
                                </text>
                              </Marker>
                            }
                            { renderCasualtiesCount && 
                                <Marker
                                  key={`deathsCount-${curLocationData.country}`}
                                  className="covidMarkers deaths currentCovidMarker"
                                  // NOTE: France seems to return the incorrect long/lat.  This is a temporary fix ) 
                                  coordinates={ curLocationData.country === "France" ? [ 2.3 , 48 ] : [ curLocationData.longitude, curLocationData.latitude ]}
                                >
                                  <text
                                    className="casualtyCount"
                                    fill="rgb(55, 133, 230)"
                                    stroke="rgb(55, 133, 230)"
                                  >
                                      { curLocationData.deaths > 1000 ? curLocationData.deaths : '' }
                                  </text>
                                </Marker>
                            }
                            { renderConfirmed &&
                                <Marker
                                  key={`confirmed-${curLocationData.country}`}
                                  className="confirmed covidMarkers currentCovidMarker"
                                  coordinates={ curLocationData.country === "France" ? [ 2.3 , 48 ] : [ curLocationData.longitude, curLocationData.latitude ]}
                                >
                                  <circle
                                    r={curLocationData.confirmed/2300}
                                    strokeWidth="1.5"
                                    fill="#03A9F4"
                                    fillOpacity=".3"
                                    stroke="#40c4ff" />
                                </Marker>
                            }
                            { renderConfirmedCount &&
                               <Marker
                                 key={`confirmedCount-${curLocationData.country}`}
                                 className="confirmed covidMarkers currentCovidMarker"
                                 coordinates={ curLocationData.country === "France" ? [ 2.3 , 48 ] : [ curLocationData.longitude, curLocationData.latitude ]}
                               >
                                 <text
                                   className="confirmedCount text"
                                   y={20}
                                   // x offset for rendering confirmed count to the left of casualties count
                                   // only render cases count for countries with over 10 cases to avoid crowding data points
                                   x={-20}>
                                   { curLocationData.confirmed > 50000 ? curLocationData.confirmed : '' }
                                 </text>
                               </Marker>
                            }
                          </>
                        )
                      })
                    }
                    </>  
                  )}
                  
                </Geographies>
              
              </ComposableMap>

          <div className="instructions">
            <div className="helpWrap">
              <img id="helpIcon" alt="helpIcon" src={QuestionMark} />
              <h5>Usage</h5>
            </div>
            <p>Hover over Countries or U.S. States to view Covid Data by location</p>
            <p>Click Navigation Buttons to Add/Remove Data from the Map</p>
            <p>Scroll Down to view the United States Map</p>
          </div>

          <div className="appInfo">
            <p className="dataSource">World Data from Johns Hopkins via <a href="https://pypi.org/project/covid/"> Covid SDK </a>
             U.S. data from <a href="https://covidtracking.com">covidtracking.com/api/states</a></p>
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
          <a name="unitedStatesMap" content="unitedStatesMap" alt="unitedStatesMap" href="https://covidtrack.net#unitedStatesMap" />
        </div>
      </>
    )
  }
}

export default App;
