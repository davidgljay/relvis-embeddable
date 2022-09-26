import React, {Component} from 'react'
import RelModel from '../relmodel'
import ProbabilityGraph from './ProbabilityGraph'
import RelVisualization from './RelVisualization'
import EntropyGraph from './EntropyGraph'
import RelationalityGraph from './RelationalityGraph'
import IconButton from '@material-ui/core/IconButton'
import ReplayIcon from '@material-ui/icons/Replay'

class RelDefinition extends Component {

  constructor(props) {
    super(props)

    this.state = {
      relModel: new RelModel(props.numNodes),
      relIndex: 0,
      stepTimer: null,
      bitTimer: null,
      relTimer: null,
      bits: [],
      entropy: []
    }

    this.getPosition = (n) => {
        const {height, width, numNodes} = this.props
        const center = {
          x: width/2,
          y: height/2
        }

        if (n === numNodes/4) {
          return {
            x: width/3,
            y: height/2
          }
        } else if (n === 3 * numNodes/4) {
          return {
            x: 2 * width/3,
            y: height/2
          }
        }

        return {
          x: Math.sin( 2 * Math.PI * n/numNodes ) * width + center.x,
          y: Math.cos( 2 * Math.PI * n/numNodes) * width + center.y
        }
    }

    this.runStep = () => {
      const {numNodes, width} = this.props
      const {relModel, relIndex} = this.state
      relModel.step(numNodes/4)
      relModel.step(3 * numNodes/4)
    }

    this.runBits = props.runBits ? props.runBits.bind(this) : () => {
      const {relModel} = this.state
      relModel.bitStep()
      this.setState({bits: relModel.bits})
    }

    this.updateRelationality = () => {
      const {relModel} = this.state
        const numNodes = relModel.nodes.length
        relModel.entropy = relModel.nodes[numNodes/4].entropy + relModel.nodes[3 * numNodes/4].entropy
        relModel.entropyLog = relModel.entropyLog.concat(relModel.entropy)
          .slice(relModel.entropyLog.length - 399)
    }

    this.restart = () => {
        const {runStep, runBits} = this
        const {numNodes} = this.props
        clearInterval(this.state.stepTimer)
        clearInterval(this.state.bitTimer)
        clearInterval(this.state.relTimer)
        const stepTimer = setInterval(runStep, 500)
        const bitTimer = setInterval(runBits, 40)
        const relModel = new RelModel(numNodes)
        relModel.maxEntropy = Math.log1p(1/numNodes) * numNodes * 2
        relModel.minEntropy = Math.log1p(1) * 2
        const relTimer = setInterval(this.updateRelationality, 400)
        this.setState({
          relModel,
          stepTimer,
          bitTimer,
          relModel,
          relIndex: 0,
          bits: []})
    }
  }

  componentDidMount() {
    const {numNodes} = this.props
    this.restart(this.props.numNodes)
  }

  componentWillUnmount() {
    const {stepTimer, bitTimer, relTimer} = this.state
    clearInterval(stepTimer)
    clearInterval(bitTimer)
    clearInterval(relTimer)
  }

  render() {
    const {height, width, showProbabilities, numNodes} = this.props
    const {relModel, bits, entropy} = this.state
    const displayRelModel = {
      ...relModel,
      nodes: [relModel.nodes[numNodes/4], relModel.nodes[3 * numNodes/4]]
    }
    return <div style={styles.container}>
      <RelVisualization
        width={width}
        height={height}
        relModel={relModel}
        bits={bits}
        getPosition={this.getPosition}
        entropy={entropy} />
        <IconButton aria-label="Restart" onClick={this.restart}>
          <ReplayIcon fontSize="medium" />
        </IconButton>
      {
        showProbabilities &&
        <div style={styles.container}>
          <ProbabilityGraph
            width={width}
            height={110}
            nodes={[relModel.nodes[numNodes/4], relModel.nodes[3 * numNodes/4]]} />
          <div style={styles.text}>
            Probability Distribution
          </div>
          <EntropyGraph
            width={width}
            height={40}
            relModel={displayRelModel} />
          <div style={styles.text}>
            Entropy
          </div>
        </div>
      }
    </div>
  }

}

export default RelDefinition

const styles = {
  container: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  text: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 10,
    textAlign: 'center',
    color: '#333',
    fontStyle: 'italic'
  },
  bigNumber: {
    margin: 10,
    fontSize: 16
  }

}
