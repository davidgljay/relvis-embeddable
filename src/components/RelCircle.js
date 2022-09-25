import React, {Component} from 'react'
import RelModel from '../relmodel'
import RelVisualization from './RelVisualization'
import ProbabilityGraph from './ProbabilityGraph'
import EntropyGraph from './EntropyGraph'
import RelationalityGraph from './RelationalityGraph'

class RelCircle extends Component {

  constructor(props) {
    super(props);

    this.state = {
      relModel: new RelModel(props.numNodes),
      relIndex: 0,
      stepTimer: null,
      bitTimer: null,
      restartTimer: null,
      bits: []
    }

    this.getPosition = props.getPosition ? props.getPosition.bind(this) : (n) => {
      const {height, width, radius, numNodes} = this.props
      const center = {
        x: width/2,
        y: height/2
      }
      return {
        x: Math.sin( 2 * Math.PI * n/numNodes ) * radius + center.x,
        y: Math.cos( 2 * Math.PI * n/numNodes) * radius + center.y
      }
    }

    this.runStep = () => {
      const {numNodes} = this.props
      const {relModel, relIndex} = this.state
      relModel.step(relIndex)
      this.setState({relIndex: (relIndex + 1) % numNodes})
    }

    this.runBits = () => {
      const {relModel} = this.state
      relModel.bitStep()
      this.setState({bits: relModel.bits})
    }

    this.restart = (numNodes) => {
      const {runStep, runBits} = this
      clearInterval(this.state.stepTimer)
      clearInterval(this.state.bitTimer)
      const stepTimer = setInterval(runStep, 40)
      const bitTimer = setInterval(runBits, 20)
      this.setState({
        relModel: new RelModel(this.props.numNodes),
        stepTimer,
        bitTimer,
        relIndex: 0,
        bits: []})
    }
  }

  componentDidMount() {
    const {numNodes, restartInterval} = this.props
    this.restart(this.props.numNodes)
    if (restartInterval) {
      const restartTimer = setInterval(() => this.restart(numNodes), restartInterval)
      this.setState({restartTimer})
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.numNodes !== this.props.numNodes) {
      this.restart(this.props.numNodes)
    }
  }

  componentWillUnmount() {
    const {stepTimer, bitTimer, restartTimer} = this.state
    clearInterval(stepTimer)
    clearInterval(bitTimer)
    clearInterval(restartTimer)
  }

  render () {
    const {height, width, numNodes, showGraphs} = this.props
    const {relModel, bits} = this.state
    return <div style={styles.container}>
      <RelVisualization
        width={width}
        height={height}
        relModel={relModel}
        bits={bits}
        getPosition={this.getPosition} />
        {
          showGraphs &&
            <ProbabilityGraph
              width={width}
              height={numNodes * 55}
              nodes={relModel.nodes} />
        }
        {
          showGraphs &&
          <EntropyGraph
            width={width}
            height={numNodes * 25}
            nodes={relModel.nodes} />
        }
        {
          showGraphs &&
          <RelationalityGraph
            width={width}
            height={numNodes * 25}
            nodes={relModel.nodes}
            numNodes={numNodes} />
        }
      </div>
  }
}

export default RelCircle;

const styles = {
  container: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}
