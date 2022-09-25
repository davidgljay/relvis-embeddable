import React, {Component} from 'react'
import RelModel from '../relmodel'
import RelVisualization from './RelVisualization'
import ProbabilityGraph from './ProbabilityGraph'
import EntropyGraph from './EntropyGraph'
import RelationalityGraph from './RelationalityGraph'
import DivergenceVisualization from './DivergenceVisualization'
import IconButton from '@material-ui/core/IconButton'
import ReplayIcon from '@material-ui/icons/Replay'


class LimitsToPrediction extends Component {

  constructor(props) {
    super(props);

    this.state = {
      relModel1: new RelModel(props.numNodes),
      relModel2: new RelModel(props.numNodes),
      relIndex1: 0,
      relIndex2: 0,
      stepTimer: null,
      bitTimer: null,
      restartTimer: null,
      bits1: [],
      bits2: [],
      divergence: 0
    }

    this.getPosition = (n) => {
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

    this.getDivergence = () => {
      const {numNodes} = this.props
      const {relModel1, relModel2} = this.state
      var divergence = 0
      for (var i = 0; i < numNodes; i++) {
        for (var j = 0; j < numNodes; j++) {
          if (relModel1.nodes[i].targets[j] !== relModel2.nodes[i].targets[j]) {
            divergence += Math.abs(relModel1.nodes[i].targets[j] - relModel2.nodes[i].targets[j])
          }
        }
      }
      return divergence
    }

    this.runStep = () => {
      const {numNodes} = this.props
      const {relModel1, relModel2, relIndex1, relIndex2} = this.state
      relModel1.step(relIndex1)
      relModel2.step(relIndex2)
      this.setState({
        relIndex1: (relIndex1 + 1) % numNodes,
        relIndex2: (relIndex2 + 1) % numNodes,
        divergence: this.getDivergence()
      })
    }

    this.runBits = () => {
      const {relModel1, relModel2} = this.state
      relModel1.bitStep()
      relModel2.bitStep()
      this.setState({bits1: relModel1.bits, bits2: relModel2.bits})
    }

    this.restart = (numNodes) => {
      const {runStep, runBits} = this
      clearInterval(this.state.stepTimer)
      clearInterval(this.state.bitTimer)
      const stepTimer = setInterval(runStep, 40)
      const bitTimer = setInterval(runBits, 20)
      const relModel1 = new RelModel(this.props.numNodes, .1, 1000000)
      const relModel2 = new RelModel(this.props.numNodes)
      relModel2.dice = relModel1.dice.slice(0)
      relModel2.nodes = JSON.parse(JSON.stringify(relModel1.nodes))
      relModel2.nodes[0].targets[1] = relModel2.nodes[0].targets[1] * 3
      this.setState({
        relModel1,
        relModel2,
        stepTimer,
        bitTimer,
        relIndex: 0,
        bits1: [],
        bits2: []
      })
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
    const {relModel1, relModel2, bits1, bits2, divergence} = this.state
    return <div style={styles.container}>
      <DivergenceVisualization
        divergence={divergence}
        max={30}
        width={width}
        height={50}
        name1={'Reality'}
        name2={'Prediction'} />
        <div style={styles.visWrapper}>
          <div style={styles.vis}>
          <RelVisualization
            width={width}
            height={height}
            relModel={relModel1}
            bits={bits1}
            getPosition={this.getPosition} />
            Reality
          </div>
          <div style={styles.vis}>
          <RelVisualization
            width={width}
            height={height}
            relModel={relModel2}
            bits={bits2}
            getPosition={this.getPosition} />
            Prediction
          </div>
        </div>
        <IconButton aria-label="Restart" onClick={this.restart}>
          <ReplayIcon fontSize="medium" />
        </IconButton>
      </div>
  }
}

export default LimitsToPrediction;

const styles = {
  container: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  visWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  vis: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}
