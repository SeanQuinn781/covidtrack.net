import { pastelColors } from './Constants';

function randomGeographyColor() {
  const randomNum = Math.floor(Math.random() * (pastelColors.length));
  return pastelColors[randomNum];
}

export default randomGeographyColor;