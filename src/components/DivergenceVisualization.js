import React from 'react';
import PropTypes from 'prop-types';

const DivergenceVisualization = ({divergence, max, name1, name2, width, height}) =>  <svg id="divergence"
  width={width}
  height={height}
  xmlns="http://www.w3.org/2000/svg"
  xmlnsXlink="http://www.w3.org/1999/xlink">
  <circle style={{fill:`green`, zIndex: 10}} cx={width/2 - divergence/max * width/2} cy={height/2} r="5"/>
  <text x={width/2 - divergence/max * width/2 - 25} y={height/2 + 22}>{name1}</text>
  <circle style={{fill:`blue`, zIndex: 10}} cx={width/2 + divergence/max * width/2} cy={height/2} r="5"/>
  <text x={width/2 + divergence/max * width/2 - 25} y={height/2 + 22}>{name2}</text>
</svg>


export default DivergenceVisualization;

const styles = {

};
