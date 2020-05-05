import React from 'react';
import './App.css';
// styles from DarkReader
import './Dark.css';
import {
  Marker
} from "react-simple-maps";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import PropTypes from 'prop-types';

function WorldMapMarkers (props) {

    const {
        curLocationData,
        renderCasualties,
        renderCasualtiesCount,
        renderConfirmed,
        renderConfirmedCount,
        renderCountryNames
    } = props;

    // console.log('conf count ', renderConfirmedCount)

    return(
        <>
            { renderCasualties &&
                <Marker
                    key={`deaths-${curLocationData.country}-svg`}
                    className="covidMarkers currentCovidMarker deaths"
                    // NOTE: France seems to return the incorrect long/lat.  This is a temporary fix ) 
                    coordinates={ curLocationData.country === "France" ? [ 2.3 , 48 ] : [ curLocationData.longitude, curLocationData.latitude ]}
                >
                    <svg xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                        <defs>
                            <radialGradient id="redGradient">
                            <stop offset="10%" stopColor="darkred" />
                            <stop offset="95%" stopColor="red" />
                            </radialGradient>
                        </defs>
                        <circle
                            // set the radius of the svg circle data point to the total death count divided by 50 
                            // TODO: dynamic scaling based on window size (using the total count as radius makes them way too large)
                            r={curLocationData.deaths/3500}
                            strokeWidth="1.5"
                            fill="url('#redGradient')"
                            fillOpacity=".5"
                            stroke="#d3212d"/>
                    </svg>
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
                        { curLocationData.deaths > 2500 ? curLocationData.deaths : '' }
                    </text>
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

            { renderConfirmed &&
                <Marker
                    key={`confirmed-${curLocationData.country}`}
                    className="confirmed covidMarkers currentCovidMarker"
                    coordinates={ curLocationData.country === "France" ? [ 2.3 , 48 ] : [ curLocationData.longitude, curLocationData.latitude ]}
                >
                    <circle
                        r={curLocationData.confirmed/3500}
                        strokeWidth="1.5"
                        fill="#03A9F4"
                        fillOpacity=".3"
                        stroke="#40c4ff" 
                    />
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
}

WorldMapMarkers.propTypes = {
    curLocationData: PropTypes.shape({
        country: PropTypes.string,
        longitude: PropTypes.number,
        latitude: PropTypes.number,
        deaths: PropTypes.number,
        confirmed: PropTypes.number
    }).isRequired,
    renderCasualties: PropTypes.bool.isRequired,
    renderCasualtiesCount: PropTypes.bool.isRequired,
    renderConfirmed: PropTypes.bool.isRequired,
    renderConfirmedCount: PropTypes.bool.isRequired,
    renderCountryNames: PropTypes.bool.isRequired
}
export default WorldMapMarkers;