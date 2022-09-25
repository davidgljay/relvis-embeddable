import React, {Component} from 'react'
import RelModel from '../relmodel'
import RelVisualization from './RelVisualization'
import IconButton from '@material-ui/core/IconButton'
import ReplayIcon from '@material-ui/icons/Replay'


class RelStructure extends Component {

  constructor(props) {
    super(props);

    this.state = {
      relModelA: new RelModel(props.numNodes),
      relModelB1: new RelModel(props.numNodes/4),
      relModelB2: new RelModel(props.numNodes/4),
      relModelB3: new RelModel(props.numNodes/4),
      relModelB4: new RelModel(props.numNodes/4),
      relIndex1: 0,
      relIndex2: 0,
      stepTimer: null,
      bitTimer: null,
      restartTimer: null,
      bitsA: [],
      bitsB1: [],
      bitsB2: [],
      bitsB3: [],
      bitsB4: []
    }

    this.getPositionA = (n) => {
      const {height, width, radius, numNodes} = this.props
      const center = {
        x: width/4,
        y: (height-40)/2
      }
      return {
        x: Math.sin( 2 * Math.PI * n/numNodes ) * radius + center.x,
        y: Math.cos( 2 * Math.PI * n/numNodes) * radius + center.y
      }
    }

    this.getPositionB = (n) => {
      const {height, width, radius, numNodes} = this.props
      const center = {
        x: width/8,
        y: (height-40)/4
      }
      return {
        x: Math.sin( 2 * Math.PI * 4*n/numNodes ) * radius/3 + center.x,
        y: Math.cos( 2 * Math.PI * 4*n/numNodes) * radius/3 + center.y
      }
    }

    this.runStep = () => {
      const {numNodes} = this.props
      const {relModelA, relModelB1, relModelB2, relModelB3, relModelB4, relIndex1, relIndex2} = this.state
      relModelA.step(relIndex1)
      relModelB1.step(relIndex2)
      relModelB2.step(relIndex2)
      relModelB3.step(relIndex2)
      relModelB4.step(relIndex2)
      this.setState({
        relIndex1: (relIndex1 + 1) % numNodes,
        relIndex2: (relIndex2 + 1) % (numNodes/4)
      })
    }

    this.runBits = () => {
      const {relModelA, relModelB1, relModelB2, relModelB3, relModelB4} = this.state
      relModelA.bitStep()
      relModelB1.bitStep()
      relModelB2.bitStep()
      relModelB3.bitStep()
      relModelB4.bitStep()
      this.setState({
        bitsA: relModelA.bits,
        bitsB1: relModelB1.bits,
        bitsB2: relModelB2.bits,
        bitsB3: relModelB3.bits,
        bitsB4: relModelB4.bits,
      })
    }

    this.restart = (numNodes) => {
      const {runStep, runBits} = this
      clearInterval(this.state.stepTimer)
      clearInterval(this.state.bitTimer)
      const stepTimer = setInterval(runStep, 40)
      const bitTimer = setInterval(runBits, 20)
      const relModelA = new RelModel(this.props.numNodes)
      const relModelB1 = new RelModel(this.props.numNodes/4)
      const relModelB2 = new RelModel(this.props.numNodes/4)
      const relModelB3 = new RelModel(this.props.numNodes/4)
      const relModelB4 = new RelModel(this.props.numNodes/4)
      this.setState({
        relModelA,
        relModelB1,
        relModelB2,
        relModelB3,
        relModelB4,
        stepTimer,
        bitTimer,
        relIndex: 0,
        bitsA: [],
        bitsB1: [],
        bitsB2: [],
        bitsB3: [],
        bitsB4: [],
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
    const {relModelA, relModelB1, relModelB2, relModelB3, relModelB4, bitsA, bitsB1, bitsB2, bitsB3, bitsB4} = this.state
    return <div style={styles.container}>
        <div style={styles.visWrapper}>
          <div style={Object.assign({}, styles.visQuadrants, {width: width/2})}>
            <div>
              <RelVisualization
                width={width/4}
                height={(height-90)/2}
                relModel={relModelB1}
                bits={bitsB1}
                getPosition={this.getPositionB} />
            </div>
            <div>
              <RelVisualization
                width={width/4}
                height={(height-90)/2}
                relModel={relModelB2}
                bits={bitsB2}
                getPosition={this.getPositionB} />
            </div>
            <div>
              <RelVisualization
                width={width/4}
                height={(height-90)/2}
                relModel={relModelB3}
                bits={bitsB3}
                getPosition={this.getPositionB} />
            </div>
            <div>
              <RelVisualization
                width={width/4}
                height={(height-90)/2}
                relModel={relModelB4}
                bits={bitsB4}
                getPosition={this.getPositionB} />
            </div>
          </div>
          <div style={styles.vis}>
            <RelVisualization
              width={width/2}
              height={height-90}
              relModel={relModelA}
              bits={bitsA}
              getPosition={this.getPositionA} />
          </div>
        </div>
        <IconButton aria-label="Restart" onClick={this.restart}>
          <ReplayIcon fontSize="medium" />
        </IconButton>
      </div>
  }
}

export default RelStructure;

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
    alignItems: 'center',
  },
  visQuadrants: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  }
}
