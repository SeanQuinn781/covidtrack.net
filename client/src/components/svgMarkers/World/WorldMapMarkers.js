import React from 'react';
import {
  Marker
} from "react-simple-maps";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import PropTypes from 'prop-types';

function WorldMapMarkers (props) {

    const {
        locationData,
        renderCasualties,
        renderCasualtiesCount,
        renderConfirmed,
        renderConfirmedCount,
        renderCountryNames,
        onClick,
        onMouseEnter,
    } = props;

    // TODO export marker components
    return(
        <>
            { renderCasualties &&
                <Marker
                    className="covidMarkers currentCovidMarker deaths"
                    // NOTE: France seems to return the incorrect long/lat.  This is a temporary fix ) 
                    coordinates={ locationData.country === "France" ? [ 2.3 , 48 ] : [ locationData.longitude, locationData.latitude ]}
                    key={`deaths-${locationData.country}-svg`}
                    onClick={e => onClick(e)}
                    onMouseEnter={e => onMouseEnter(e)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                        <defs>
                            <radialGradient id="redGradient">
                            <stop offset="10%" stopColor="tangerine" />
                            <stop offset="95%" stopColor="red" />
                            </radialGradient>
                        </defs>
                        <circle
                            // set the radius of the svg circle data point to the total death count divided by 50 
                            // TODO: dynamic scaling based on window size (using the total count as radius makes them way too large)
                            r={locationData.deaths/3500}
                            strokeWidth="1.5"
                            fill="url('#redGradient')"
                            fillOpacity=".5"
                            stroke="#d03847"/>
                    </svg>
                </Marker>
            }
            { renderCasualtiesCount && 
                <Marker
                    key={`deathsCount-${locationData.country}`}
                    className="covidMarkers deaths currentCovidMarker"
                    // NOTE: France seems to return the incorrect long/lat.  This is a temporary fix ) 
                    coordinates={ locationData.country === "France" ? [ 2.3 , 48 ] : [ locationData.longitude, locationData.latitude ]}
                >
                    <text
                        fontSize={14} 
                        textAnchor="middle"
                        fill="#D32F2F"
                        stroke="#D32F2F"
                    >
                        { locationData.deaths > 2500 ? locationData.deaths : '' }
                    </text>
                </Marker>
            }
            { renderCountryNames &&
                <Marker
                    key={`countryName-${locationData.country}`}
                    className="countryNames covidMarkers currentCovidMarker countryNameMarker"
                    coordinates={ locationData.country === "France" ? [ 2.3 , 48 ] : [ locationData.longitude, locationData.latitude ]}
                >
                    <text
                        className="countryName"
                        fill="rgb(231, 191, 91)"
                        color="#ffc107"
                        stroke="#000"
                        strokeWidth=".4px"
                        x={-26}
                        y={-10}>
                        { locationData.confirmed > 50000 ? locationData.country : '' }
                    </text>
                </Marker>
            }

            { renderConfirmed &&
                <Marker
                    key={`confirmed-${locationData.country}`}
                    className="confirmed covidMarkers currentCovidMarker"
                    coordinates={ locationData.country === "France" ? [ 2.3 , 48 ] : [ locationData.longitude, locationData.latitude ]}
                >
                    <circle
                        r={locationData.confirmed/3500}
                        strokeWidth="1.5"
                        fill="#03A9F4"
                        fillOpacity=".3"
                        stroke="#40c4ff" 
                    />
                </Marker>
            }
            { renderConfirmedCount &&
                <Marker
                    key={`confirmedCount-${locationData.country}`}
                    className="confirmed covidMarkers currentCovidMarker"
                    coordinates={ locationData.country === "France" ? [ 2.3 , 48 ] : [ locationData.longitude, locationData.latitude ]}
                >
                    <text
                        className="confirmedCount text"
                        y={20}
                        // x offset for rendering confirmed count to the left of casualties count
                        // only render cases count for countries with over 10 cases to avoid crowding data points
                        x={-20}>
                        { locationData.confirmed > 50000 ? locationData.confirmed : '' }
                    </text>
                </Marker>
            }
        </>
    )
}

WorldMapMarkers.propTypes = {
    locationData: PropTypes.shape({
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