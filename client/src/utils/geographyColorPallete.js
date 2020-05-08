import redFill from './redFill';
import blueFill from './blueFill';

const geographyColorPalette = (sortedMetric, relativeIndex, dataPoint) => {
  let chosenColor;

  // hsla color range
  const darkest = 22;
  const lightest = 90;

  const oldMin = 0;
  const oldMax = sortedMetric.length;

  /* relativeIndex is a data point relative to others
     on the same map. linearRemap converts the value to a %.
     The hsla color range is then used to convert the % to a color,
     but since the hsla color range is restricted to percentages between 
     22-90, use linearRemap to remap the % of the old range (0-locations.length)  
     to a % in the hsla color range (22-90) is the chosen range for red/blue colors
  */

  function linearRemap(relativeIndex, oldMin, oldMax, newMin, newMax) {
    const newScale = newMax - newMin;
    const valueAsPct = (relativeIndex - oldMin) / (oldMax - oldMin);
    const scaledValue = valueAsPct * newScale;
    const shiftedAndScaledValue = scaledValue + newMin;
    return shiftedAndScaledValue;
  }
  const indexToColor = linearRemap(relativeIndex, oldMin, oldMax, darkest, lightest);

  chosenColor = dataPoint === 'confirmed' || dataPoint === 'positive' ? 
    blueFill(indexToColor) :
    redFill(indexToColor)

  return chosenColor;
}

export default geographyColorPalette;