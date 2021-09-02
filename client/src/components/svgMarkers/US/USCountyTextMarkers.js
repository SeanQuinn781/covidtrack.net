import React from "react";
import {
  Marker,
} from "react-simple-maps";

function USCountyTextMarkers (props) {

  const {
    currentCounty,
    locationData,
    centroid,
    renderCasualties,
    renderCasualtiesCount,
    renderConfirmed,
    renderConfirmedCount
  } = props;

  if (currentCounty.id === undefined)
    return <text>Data Unavailable</text>;

  return (
    <>
      { renderCasualties &&
                <Marker
                  className="covidMarkers currentCovidMarker deaths"
                  coordinates={centroid}
                  key={`deaths-${`${currentCounty.id+locationData.deaths}-svg`}`}
                >
                  <circle
                    className="stateCircle"
                    coordinates={centroid}
                    fill="red"
                    fillOpacity=".5"
                    // set the radius of the svg circle data point to the total death count divided by 50 
                    // TODO: dynamic scaling based on window size (using the total count as radius makes them way too large)
                    r={locationData.deaths/1500}
                    strokeWidth="1.5"
                    stroke="goldenrod" 
                  />
                </Marker>
      }
      { renderCasualtiesCount && 
                <Marker 
                  className="deaths"
                  coordinates={centroid}
                  key={`deaths-${currentCounty.id+locationData.stats.deaths}`}
                >
                  <text 
                    coordinates={centroid}
                    y="20" 
                    fontSize={14} 
                    textAnchor="middle"
                    fill="#D32F2F"
                    stroke="#D32F2F"
                  >
                    {locationData.stats.deaths}
                  </text>
                </Marker>
      }
      { renderConfirmed &&
                <Marker
                  className="covidMarkers confirmed currentCovidMarker"
                  coordinates={centroid}
                  key={`confirmed-${`${currentCounty.id + locationData.stats.confirmed  }-svg`}`}
                >
                  <circle
                    coordinates={centroid}
                    r={locationData.stats.confirmed/1500}
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
                  key={`confirmed-${currentCounty.id + locationData.stats.confirmed}`}
                >
                  <text
                    className="confirmedCount text"
                    y={-15}
                    // x offset for rendering confirmed count to the left of casualties count
                    // only render cases count for countries with over 10 cases to avoid crowding data points
                    x={-20}>
                    { locationData.stats.confirmed > 5000 ? locationData.stats.confirmed : '' }
                  </text>
                </Marker>
      }
    </>
  )
}

export default USCountyTextMarkers;