import React, {Component} from 'react';
import PropTypes from 'prop-types';

class RelVisualization extends Component {

  constructor(props) {
    super(props)
    this.myRef = React.createRef()
    this.state={
      hide: false
    }

    this.handleScroll = () => {
      if (this.myRef.current.getBoundingClientRect().top < -200 || this.myRef.current.getBoundingClientRect().top > 1500) {
        this.setState({hide: true})
      } else {
        this.setState({hide: false})
      }
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll)
  }

  render() {
    const {width, height, bits, relModel, getPosition, entropy = []} = this.props
    const {hide} = this.state
    return <div ref={this.myRef}>
    {
      hide
      ? <div style={{width, height}} />
      : <svg id="visualization"
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink">
          {
            bits.map((bit, i) => {
              const source = getPosition(bit.source)
              const target = getPosition(bit.target)
              const bitPlacement = {
                x: source.x + (target.x - source.x) * bit.complete/100,
                y: source.y + (target.y - source.y) * bit.complete/100
              }
              return <circle key={'bit' + i} style={{fill:`hsl(${bit.color}, 100%, 50%)`}} cx={bitPlacement.x} cy={bitPlacement.y} r="2"/>
            })
          }
          {
            relModel.nodes.map(({color, max}, i) => {
              const {x,y} = getPosition(i)
              return <circle key={i} style={{fill:`hsl(${color}, 100%, 50%)`, zIndex: 10}} cx={x} cy={y} r="10"/>
            })
          }
        </svg>
      }
    </div>
  }
}

const {func, shape, object, string, number, arrayOf} = PropTypes;

RelVisualization.propTypes = {
  width: number,
  height: number,
  bits: arrayOf(object),
  relModel: object,
  getPosition: func
};

export default RelVisualization;
