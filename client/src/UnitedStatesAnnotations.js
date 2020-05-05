import React from "react";
import {
  Marker,
  Annotation
} from "react-simple-maps";
import PropTypes from 'prop-types';
import offsets from './Constants'

function UnitedStatesAnnotations (props) {

    const {
        currentState,
        curStateData,
        centroid,
        renderCasualties,
        renderCasualtiesCount,
        renderConfirmed,
        renderConfirmedCount
    } = props;

    if (currentState.id === undefined)
        return <text className="dataUnavailable">Data Unavailable</text>;

    return(
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
                key={`deaths-${`${currentState.id+curStateData.death}-svg`}`}
                >
                <circle
                    className="stateConfirmedSvg"
                    coordinates={centroid}
                    // set the radius of the svg circle data point to the total death count divided by 50 
                    // TODO: dynamic scaling based on window size (using the total count as radius makes them way too large)
                    r={curStateData.death/1500}
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
                key={`deaths-${currentState.id+curStateData.death}`}
                >
                <text 
                    fontSize={14} 
                    textAnchor="middle"
                    fill="#D32F2F"
                    stroke="#D32F2F"
                >
                    {curStateData.death}
                </text>
                </Marker>
            // End render State Annotations Labels
            }
            { 
            renderConfirmed &&
                <Marker
                className="confirmed covidMarkers currentCovidMarker"
                coordinates={centroid}
                key={`confirmed-${`${currentState.id + curStateData.totalTestResults  }-svg`}`}
                >
                <circle
                    coordinates={centroid}
                    fill="#03A9F4"
                    fillOpacity=".3"
                    r={curStateData.totalTestResults/1500}
                    strokeWidth="1.5"
                    stroke="#40c4ff" 
                />
                </Marker>
            }
            { 
            renderConfirmedCount &&
                <Marker
                key={`confirmed-${currentState.id + curStateData.totalTestResults}`}
                className="confirmed covidMarkers currentCovidMarker"
                coordinates={centroid}
                >
                <text
                className="confirmedCount text"
                // x offset for rendering confirmed count to the left of casualties count
                // only render cases count for countries with over 10 cases to avoid crowding data points
                x={-20}>
                { curStateData.totalTestResults > 5000 ? curStateData.totalTestResults : '' }
                </text>
                </Marker>
            }
        </>
    )
}

UnitedStatesAnnotations.propTypes = {
    currentState: PropTypes.objectOf(PropTypes.string).isRequired,
    // curStateData: PropTypes.objectOf(PropTypes.string).isRequired,
    curStateData: PropTypes.shape({
        positive: PropTypes.number,
        death: PropTypes.number,
        totalTestResults: PropTypes.number
    }).isRequired,
    centroid: PropTypes.arrayOf(PropTypes.number).isRequired,
    renderCasualties: PropTypes.bool.isRequired,
    renderCasualtiesCount: PropTypes.bool.isRequired,
    renderConfirmed: PropTypes.bool.isRequired,
    renderConfirmedCount: PropTypes.bool.isRequired,
};

export default UnitedStatesAnnotations;