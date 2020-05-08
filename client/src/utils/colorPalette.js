function colorPalette(relativeIndex, sortedMetric) {

  /*
     relativeIndex:
     index of the metric in relation to the range of sorted metrics 
     use this number to get a % from the range 
  */
  let chosenColor;

  const getHsla = (brightness) => {
    return `hsla(0,100%,${Math.round(brightness)}%,1)`
  }

  const darkest = 22;
  const lightest = 90;
  const hslaColorRange = [darkest,lightest];
  let metricRange;
  let colorPercent;
  let indexToPercent;

  // convert percentage of metric range to percentage of hsla color range
  function convertRange( value, r1, r2 ) { 
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
  }

  metricRange = [0, sortedMetric.length];
  indexToPercent = Math.floor(relativeIndex/sortedMetric.length*sortedMetric.length);
  colorPercent = convertRange( indexToPercent, metricRange, hslaColorRange );
  chosenColor = getHsla(colorPercent);
  return chosenColor;

}

export default colorPalette;