# TODO try this here in python instead of front end
"""
def countryColorPallete(sortedMetric, relativeIndex, dataPoint):
	metricMax = sortedMetric.length -1;

	def linearRemap(index, oldMin, oldMax, newMin, newMax):

		newScale = newMax - newMin
		const valueAsPct = (index - oldMin) / (oldMax - oldMin);
		const scaledValue = valueAsPct * newScale;
		const shiftedAndScaledValue = scaledValue + newMin;
		return shiftedAndScaledValue;

	indexToColor = linearRemap(relativeIndex, 0, metricMax, darkest, lightest)

	if dataPoint == 'confirmed':
		chosenColor = redFill(indexToColor)
	else if dataPoint == 'positive'
		chosenColor = blueFill(indexToColor)

	return chosenColor
"""