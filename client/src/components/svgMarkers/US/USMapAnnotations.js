import React from "react";
import {
  Marker,
  Annotation
} from "react-simple-maps";
import { offsets } from '../../../utils/Constants'

function USMapAnnotations(props) {

  const {
    currentState,
    locationData,
    centroid,
    renderCasualties,
    renderCasualtiesCount,
    renderConfirmed,
    renderConfirmedCount
  } = props;

  console.log('loc data ', locationData)
  return (
    <>
      <Annotation
        subject={centroid}
        dx={offsets[currentState.id][0]}
        dy={offsets[currentState.id][1]}
      >
        <text
          x={4}
          fontSize={14}
          alignmentBaseline="middle">
          {currentState.id}
        </text>
      </Annotation>
      { renderCasualties &&
        <Marker
          className="covidMarkers currentCovidMarker deaths"
          coordinates={centroid}
          key={`deaths-${`${currentState.id + locationData.death}-svg`}`}
        >
          <circle
            className="stateConfirmedSvg"
            coordinates={centroid}
            // set the radius of the svg circle data point to the total death count divided by 1500 
            // TODO: dynamic scaling based on window size (using the total count as radius makes them way too large)
            r={locationData.death / 1500}
            strokeWidth="1.5"
            fill="red"
            fillOpacity=".5"
            stroke="goldenrod" />
        </Marker>
      }
      { renderCasualtiesCount &&
        <Marker
          className="covidMarkers currentCovidMarker deathsCount"
          coordinates={centroid}
          key={`deaths-${currentState.id + locationData.death}`}
        >
          <text
            fontSize={14}
            textAnchor="middle"
            fill="#D32F2F"
            stroke="#D32F2F"
          >
            {locationData.death}
          </text>
        </Marker>
        // End render State Annotations Labels
      }
      {
        renderConfirmed &&
        <Marker
          className="confirmed covidMarkers currentCovidMarker"
          coordinates={centroid}
          key={`confirmed-${`${currentState.id + locationData.totalTestResults}-svg`}`}
        >
          <circle
            coordinates={centroid}
            fill="#03A9F4"
            fillOpacity=".3"
            r={locationData.positive / 15000}
            strokeWidth="1.5"
            stroke="#40c4ff"
          />
        </Marker>
      }
      {
        renderConfirmedCount &&
        <Marker
          key={`confirmed-${currentState.id + locationData.totalTestResults}`}
          className="confirmed covidMarkers currentCovidMarker"
          coordinates={centroid}
        >
          <text
            className="confirmedCount text"
            // x offset for rendering confirmed count to the left of casualties count
            // only render cases count for countries with over 10 cases to avoid crowding data points
            x={-20}>
            {locationData.totalTestResults > 5000 ? locationData.totalTestResults : ''}
          </text>
        </Marker>
      }
    </>
  )
}

export default USMapAnnotations;