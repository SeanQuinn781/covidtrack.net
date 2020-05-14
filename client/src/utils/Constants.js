const offsets = {
  VT: [50, -8],
  NH: [34, 2],
  MA: [30, -1],
  RI: [28, 2],
  CT: [35, 10],
  NJ: [34, 1],
  DE: [33, 0],
  MD: [47, 10],
  DC: [49, 21]
};

const pastelColors=[
  "#67686c",
  "#b3aaa1",
  "#5467c6",
  "#bec7cf",
  "#e7ede9",
  "#77b9c8",
  "#c4d7d1",
  "#347c64",
  "#cedac4",
  "#99bd66",
  "#daefa2",
  "#f3782a",
  "#f7d1ac",
  "#f2d2bb",
  "#b7235d",
  "#a35b42",
  "#efc6a6",
  "#c4725a",
  "#f9d8b5",
  "#d7b89b",
  "#ac9480",
  "#cc2d06",
  "#fea4b8",
  "#282127",
  "#35a374",
  "#453639",
  "#f7c179",
  "#86b0d6",
  "#f3cc93",
  "#e35821",
  "#656870",
  "#ffffff",
];

// hsla color range used for states /countries (dozens of states, hundreds of countries)
const darkest = 22;
const lightest = 90;

// hsla color range used for counties (there are thousands of counties )
// const countyDarkest = 16;
// const countyLightest = 96;
// countyDarkest, countyLightest,
export { offsets, pastelColors, darkest, lightest };