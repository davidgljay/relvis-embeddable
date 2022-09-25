import React, {Component} from 'react'
import RelModel from '../relmodel'
import RelVisualization from './RelVisualization'
import IconButton from '@material-ui/core/IconButton'
import ReplayIcon from '@material-ui/icons/Replay'

class RelColor extends Component {

  constructor(props) {
    super(props);

    this.state = {
      relModel: new RelModel(4, 1),
      relIndex: 0,
      stepTimer: null,
      bitTimer: null,
      restartTimer: null,
      bits: []
    }

    this.getPosition = (n) => {
      const {height, width, radius} = this.props
      const center = {
        x: width/2,
        y: height/2
      }
      return {
        x: Math.sin( 2 * Math.PI * n/4 ) * radius + center.x,
        y: Math.cos( 2 * Math.PI * n/4) * radius + center.y
      }
    }

    this.runStep = () => {
      const {relModel, relIndex} = this.state
      relModel.step(relIndex)
      this.setState({relIndex: (relIndex + 1) % 4})
    }

    this.runBits = () => {
      const {relModel} = this.state
      relModel.bitStep()
      this.setState({bits: relModel.bits})
    }

    this.restart = () => {
      const {runStep, runBits} = this
      clearInterval(this.state.stepTimer)
      clearInterval(this.state.bitTimer)
      const stepTimer = setInterval(runStep, 100)
      const bitTimer = setInterval(runBits, 20)
      this.setState(() => {
        const relModel = new RelModel(4, .1, 1, 1, .1)
        relModel.nodes[0].color = 100
        relModel.nodes[1].color = 100
        relModel.nodes[2].color = 300
        relModel.nodes[3].color = 300
        return {
          relModel,
          stepTimer,
          bitTimer,
          relIndex: 0,
          bits: []
        }
      })
    }
  }

  componentDidMount() {
    const {restartInterval} = this.props
    this.restart()
    if (restartInterval) {
      const restartTimer = setInterval(() => this.restart(), restartInterval)
      this.setState({restartTimer})
    }
  }

  componentWillUnmount() {
    const {stepTimer, bitTimer, restartTimer} = this.state
    clearInterval(stepTimer)
    clearInterval(bitTimer)
    clearInterval(restartTimer)
  }

  render () {
    const {height, width} = this.props
    const {relModel, bits} = this.state
    return <div style={styles.container}>
      <RelVisualization
        width={width}
        height={height}
        relModel={relModel}
        bits={bits}
        getPosition={this.getPosition} />
        <IconButton aria-label="Restart" onClick={this.restart}>
          <ReplayIcon fontSize="medium" />
        </IconButton>
    </div>
  }
}

export default RelColor;

const styles = {
  container: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}
