import React from 'react';
import { Button } from '@material-ui/core';

const MapControlButtons = (props) => {

  const {
    handleClick,
    handleHeatmap,
    renderCasualties,
    renderCasualtiesCount,
    renderConfirmed,
    renderConfirmedCount,
    renderCountryNames,
    renderCasesHeatmap,
    renderCasualtiesHeatmap,
  } = props;

  return (
    <ul className="navbar-nav mr-auto map-nav map-controls">
      <li>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          id="renderCasesHeatmap"
          className={`mapControlButton ${renderCasesHeatmap ? 'active' : ''}`}
          style={{ opacity: `${renderCasesHeatmap ? '.98' : '.7'}` }}
          onClick={e => handleHeatmap(e)}
        >
          Cases Heatmap
        </Button>
      </li>
      <li>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          id="renderCasualtiesHeatmap"
          className={`mapControlButton ${renderCasualtiesHeatmap ? 'active' : ''}`}
          style={{ opacity: `${renderCasualtiesHeatmap ? '.98' : '.7'}` }}
          onClick={e => handleHeatmap(e)}
        >
          Casualties Heatmap
        </Button>
      </li>
      <li>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          id="renderCasualtiesCount"
          className={`mapControlButton ${renderCasualtiesCount ? 'active' : ''}`}
          style={{ opacity: `${renderCasualtiesCount ? '.98' : '.7'}` }}
          onClick={e => handleClick(e)}
        >
          Casualty count over 5000
        </Button>
      </li>
      <li>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          id="renderCasualties"
          className={`mapControlButton ${renderCasualties ? 'active' : ''}`}
          style={{ opacity: `${renderCasualties ? '.98' : '.8'}` }}
          onClick={e => handleClick(e)}
        >
          Casualty Data Point
        </Button>
      </li>
      <li>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          id="renderConfirmed"
          className={`mapControlButton ${renderConfirmed ? 'active' : ''}`}
          style={{ opacity: `${renderConfirmed ? '.98' : '.8'}` }}
          onClick={e => handleClick(e)}
        >
          Cases Data Point
        </Button>
      </li>
      <li>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          id="renderConfirmedCount"
          className={`mapControlButton ${renderConfirmedCount ? "active" : ""}`}
          style={{ opacity: `${renderConfirmedCount ? '.98' : '.8'}` }}
          onClick={e => handleClick(e)}
        >
          Cases count over 50000
        </Button>
      </li>
      <li>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          id="renderCountryNames"
          className={`mapControlButton ${renderCountryNames ? 'active' : ''}`}
          style={{ opacity: `${renderCountryNames ? '.98' : '.8'}` }}
          onClick={e => handleClick(e)}
        >
          Locations over 50000 Cases
        </Button>
      </li>
      <li>
        <Button
          variant="contained"
          className="selectMap"
          color="secondary"
          type="submit"
          href="#worldMap"
        >
          World Map
        </Button>
      </li>
      <li>
        <Button
          variant="contained"
          color="secondary"
          className="selectMap"
          href="#unitedStatesMap"
        >
          United States
        </Button>
      </li>
    </ul>
  )
}

export default MapControlButtons;