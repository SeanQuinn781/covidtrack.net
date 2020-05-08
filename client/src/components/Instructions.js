import React from "react";
import QuestionMark from './questionMark.png'

function Instructions () {
  return (
    <>
      <div className="instructions">
        <div className="helpWrap">
          <img id="helpIcon" alt="helpIcon" src={QuestionMark} />
          <h5>Usage</h5>
        </div>
        <p>Hover over Countries or U.S. States to view Covid Data by location</p>
        <p>Click Navigation Buttons to Add/Remove Data from the Map</p>
        <p>Scroll Down to view the United States Map</p>
      </div>

      <div className="appInfo">
        <p className="dataSource">World Data from Johns Hopkins via <a href="https://pypi.org/project/covid/"> Covid SDK </a>
          U.S. data from <a href="https://covidtracking.com">covidtracking.com/api/states</a></p>
        <a href="https://github.com/seanquinn781/react-maps-flask-covid">
          <img alt="githubLink" className="github" width="50px" height="50px" src="/GitHub-Mark.png" />
        </a>
      </div>
    </>
  )
}

export default Instructions;