  import React from 'react';
  import tooltip from "wsdm-tooltip"
  import format from './format';

  // renders data in tooltip
  const CreateTooltip = (props) => {

    const {
      evt, 
      tooltip,
      countryData,
      name,
    } = props;

    debugger;
    tooltip.position({ pageX: evt.pageX, pageY: evt.pageY })

    if (countryData === undefined) {
      tooltip.show(`Data for <span>${name},</span> is unavailable`)
    }
    else {
      tooltip.show(
        `
        Country: ${format(countryData.country)}
        Active: ${format(countryData.active)}
        Confirmed: ${format(countryData.confirmed)}
        Deaths: ${format(countryData.deaths)}
        Recovered: ${format(countryData.recovered)}
        `
      )
    }
  }

  const handleMouseLeave = () => {
    tooltip.hide()
  }

  export { CreateTooltip, handleMouseLeave  };