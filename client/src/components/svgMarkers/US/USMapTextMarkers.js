import React from "react";
import {
  Marker,
} from "react-simple-maps";
import PropTypes from 'prop-types';

function USMapTextMarkers (props) {

    const {
        currentState,
        locationData,
        centroid,
        renderCasualties,
        renderCasualtiesCount,
        renderConfirmed,
        renderConfirmedCount
    } = props;

    if (currentState.id === undefined)
        return <text>Data Unavailable</text>;

    return (
        <>
            <Marker coordinates={centroid}>
                <text 
                    y="2" 
                    fontSize={14} 
                    textAnchor="middle"
                    className="stateLabel">
                    {currentState.id}
                </text>
            </Marker>
            { renderCasualties &&
                <Marker
                    className="covidMarkers currentCovidMarker deaths"
                    coordinates={centroid}
                    key={`deaths-${`${currentState.id+locationData.death}-svg`}`}
                >
                    <circle
                      className="stateCircle"
                      coordinates={centroid}
                      fill="red"
                      fillOpacity=".5"
                      // set the radius of the svg circle data point to the total death count divided by 50 
                      // TODO: dynamic scaling based on window size (using the total count as radius makes them way too large)
                      r={locationData.death/1500}
                      strokeWidth="1.5"
                      stroke="goldenrod" 
                    />
                </Marker>
            }
            { renderCasualtiesCount && 
                <Marker 
                    className="deaths"
                coordinates={centroid}
                key={`deaths-${currentState.id+locationData.death}`}
                >
                <text 
                    coordinates={centroid}
                    y="20" 
                    fontSize={14} 
                    textAnchor="middle"
                    fill="#D32F2F"
                    stroke="#D32F2F"
                >
                    {locationData.death}
                </text>
                </Marker>
            }
            { renderConfirmed &&
                <Marker
                className="covidMarkers confirmed currentCovidMarker"
                coordinates={centroid}
                key={`confirmed-${`${currentState.id + locationData.positive  }-svg`}`}
                >
                <circle
                    coordinates={centroid}
                    r={locationData.positive/1500}
                    strokeWidth="1.5"
                    fill="#03A9F4"
                    fillOpacity=".3"
                    stroke="#40c4ff" 
                />
                </Marker>
            }
            { renderConfirmedCount &&
                <Marker
                className="confirmed covidMarkers currentCovidMarker"
                coordinates={centroid}
                key={`confirmed-${currentState.id + locationData.positive}`}
                >
                <text
                    className="confirmedCount text"
                    y={-15}
                    // x offset for rendering confirmed count to the left of casualties count
                    // only render cases count for countries with over 10 cases to avoid crowding data points
                    x={-20}>
                    { locationData.positive> 5000 ? locationData.positive : '' }
                </text>
                </Marker>
            }
        </>
    )
}

USMapTextMarkers.propTypes = {
    currentState: PropTypes.objectOf(PropTypes.string),
    locationData: PropTypes.objectOf(PropTypes.number),
    centroid: PropTypes.arrayOf(PropTypes.number).isRequired,
    renderCasualties: PropTypes.bool.isRequired,
    renderCasualtiesCount: PropTypes.bool.isRequired,
    renderConfirmed: PropTypes.bool.isRequired,
    renderConfirmedCount: PropTypes.bool.isRequired,
};

export default USMapTextMarkers;