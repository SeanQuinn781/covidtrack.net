function sortLocation(location,metric) {
  return location.sort(
    (a,b) => (a[{metric}] > b[{metric}] ? 1 : -1)
  )
}

export default sortLocation;