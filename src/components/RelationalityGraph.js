import React from 'react';
import PropTypes from 'prop-types';

const avgColor = nodes =>
  nodes.reduce((sum, node) => sum += node.color, 0) / nodes.length

const RelationalityGraph = ({width, height, relModel: {nodes, relationalityLog}}) => <svg id="probabilities"
  width={width}
  height={height}
  xmlns="http://www.w3.org/2000/svg"
  xmlnsXlink="http://www.w3.org/1999/xlink">
    <polyline
      style={{stroke:`hsl(${avgColor(nodes)}, 100%, 50%)`, strokeWidth:1, fill:'none'}}
      x={0}
      y={20}
      points={relationalityLog.slice(4).map((d, j) => `${j * width / 200},${d * 500 + 30}`).join(' ')} />
    <line
      key={`base`}
      style={{stroke:`lightgrey`, strokeWidth:1, fill:'none'}}
      x1={0}
      y1={30}
      x2={width - 5}
      y2={30} />
</svg>

const {func, shape, object, string, number, arrayOf} = PropTypes;

RelationalityGraph.propTypes = {
  width: number,
  height: number,
  nodes: arrayOf(object)
};

export default RelationalityGraph;
