// TODO rename this
const relativeIndexScale = (metricType, val, sortedMetric) => {
  // use the sorted metrics to find the index of our current value
  return sortedMetric.findIndex(x=>x[`${metricType}`] === val);
}

export default relativeIndexScale;