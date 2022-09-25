import React from 'react';
import PropTypes from 'prop-types';

const avgColor = nodes =>
  nodes.reduce((sum, node) => sum += node.color, 0) / nodes.length

const normalize = (e, maxEntropy, minEntropy) => (e - minEntropy)/(maxEntropy - minEntropy)

const EntropyGraph = ({width, height, relModel: {maxEntropy, minEntropy, entropyLog, nodes}}) =>
<svg id="entropy"
  width={width}
  height={height}
  xmlns="http://www.w3.org/2000/svg"
  xmlnsXlink="http://www.w3.org/1999/xlink">
    <polygon
      style={{fill:`hsl(${avgColor(nodes)}, 100%, 50%)`, strokeWidth:1}}
      x={0}
      y={20}
      points={'0,20 ' +
        entropyLog.slice(4).map((e, i) =>
          `${i * width / 200},${(height - 20) - normalize(e, maxEntropy, minEntropy) * (height - 20)}`
        ).join(' ') + ` ${(entropyLog.length - 5) * width / 200},20`} />
    <line
      key={`base`}
      style={{stroke:`lightgrey`, strokeWidth:1, fill:'none'}}
      x1={0}
      y1={20}
      x2={width - 5}
      y2={20} />
</svg>

const {func, shape, object, string, number, arrayOf} = PropTypes;

EntropyGraph.propTypes = {
  width: number,
  height: number,
  nodes: arrayOf(number)
};

export default EntropyGraph;
