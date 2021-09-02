import React from 'react';
import {
  Geography,
}
  from "react-simple-maps";

const DefaultGeography = (props) => {

  const {
    onMouseLeave,
    onMouseMove,
    geo,
    locationData
  } = props;
  return(
    <Geography
      key={geo.rsmKey + geo.properties.name}
      onMouseMove={(e,props) => onMouseMove(e,locationData,geo.properties.name)}
      onMouseLeave={onMouseLeave}
      style={{
        hover: { fill: "#DDD", outline: "none" },
        pressed: { fill: "#AAA", outline: "none" },
      }}
      fill="darkgray"
      geography={geo}
    />
  )
}

export default DefaultGeography;