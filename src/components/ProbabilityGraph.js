import React from 'react';
import PropTypes from 'prop-types';

const ProbabilityGraph = ({width, height, nodes}) => <svg id="probabilities"
  width={width}
  height={height}
  xmlns="http://www.w3.org/2000/svg"
  xmlnsXlink="http://www.w3.org/1999/xlink">
  {
    nodes.map(({color, targets}, i) => {
      const l = targets.length
      return targets.map((val, j) =>
        <rect
          key={`${i}-${j}`}
          style={{fill:`hsl(${color}, 100%, 50%)`}}
          x={j * width/l + 10}
          y={50 * i + 55 - val * 50}
          width={width / (3*l) - 2}
          height={val * 50}
          />
      )
    })
  }
</svg>

const {func, shape, object, string, number, arrayOf} = PropTypes;

ProbabilityGraph.propTypes = {
  width: number,
  height: number,
  bits: arrayOf(object),
  relModel: object,
  getPosition: func
};

export default ProbabilityGraph;
