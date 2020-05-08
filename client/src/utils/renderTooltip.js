import format from './format';

const renderTooltip = (stateData) => {
  return (
    `
      <key=${ stateData.id }>
        <>State: ${ format(stateData.state)}</>
        commercialScore: ${ format(stateData.commercialScore)}
        death: ${ format(stateData.death)}
        fips: ${ format(stateData.fips)}
        Grade: ${ format(stateData.grade)} 
        Hospitalized: ${  format(stateData.hospitalized)}
        inIcuCumulative: ${  format(stateData.inIcuCumulative)}
        inIcuCurrently: ${  format(stateData.inIcuCurrently)}
        negative: ${  format(stateData.negative)}
        onVentilatorCumulative: ${  format(stateData.onVentilatorCumulative)}
        onVentilatorCurrently: ${  format(stateData.onVentilatorCurrently)}
        pending: ${  format(stateData.pending)}
        posNeg: ${  format(stateData.posNeg)}
        positive: ${  format(stateData.positive)}
        positiveScore: ${  format(stateData.positiveScore)}
        recovered: ${  format(stateData.recovered)}
        score: ${  format(stateData.score)}
        totalTestResults: ${ stateData.totalTestResults}
      </>
    `
  )
}

export default renderTooltip;