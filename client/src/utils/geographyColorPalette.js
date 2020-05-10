import redFill from './redFill';
import blueFill from './blueFill';
import { darkest, lightest } from './Constants';

const geographyColorPalette = (sortedMetric, relativeIndex, dataPoint) => {

  /* linearRemap converts the relativeIndex value to a % and
     remaps % of the old range (0-locations.length) to a % in
     the hsla color range (22-90) the range for red/blue colors */
 
  const metricMax = sortedMetric.length -1;
  const isRankedLast = relativeIndex === 0
  const isRankedFirst = relativeIndex === metricMax

  function linearRemap(index, oldMin, oldMax, newMin, newMax) {
    const newScale = newMax - newMin;
    const valueAsPct = (index - oldMin) / (oldMax - oldMin);
    const scaledValue = valueAsPct * newScale;
    const shiftedAndScaledValue = scaledValue + newMin;
    return shiftedAndScaledValue;
  }

  const indexToColor = linearRemap(relativeIndex, 0, metricMax, darkest, lightest);
  // highlight first and last ranked locations by
  // making them the darkest / lightest on the map

  // make sure the first and last are set to a unique color
  // outside the typical color range
  if (isRankedFirst)
    // chrome displays hsl 0 100 20 as a light color. To workaround
    // use rgb 102 0 0 which is equivalent to hsl 0 100 20
    return `rgb(102, 0, 0)`;
  if(isRankedLast)
    return `hsl(0, 100%, 18%)`;
  
  const chosenColor = dataPoint === 'confirmed' || dataPoint === 'positive' ?
    blueFill(indexToColor) :
    redFill(indexToColor)

  return chosenColor;
}

export default geographyColorPalette;