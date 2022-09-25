import React, {Component} from 'react'
import RelModel from '../relmodel'
import RelVisualization from './RelVisualization'

class RelTemperature extends Component {

  constructor(props) {
    super(props)

    this.state = {
      temperature: .25,
      relModel: new RelModel(props.numNodes),
      relIndex: 0,
      stepTimer: null,
      bitTimer: null,
      restartTimer: null,
      bits: []
    }


    this.getPosition = n => {
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
      const {numNodes} = this.props
      const {relModel, relIndex, temperature} = this.state
      if (Math.random() < temperature || relIndex === numNodes/4 || relIndex === 3 * numNodes/4) {
          relModel.step(relIndex)
          for (var i = 0; i < relModel.nodes.length; i++) {
            if (i !== numNodes/4 && i !== 3 * numNodes/4) {
              relModel.nodes[i].targets = Array(numNodes).fill(1/numNodes)
              relModel.nodes[i].targets[numNodes/4]=3/numNodes
              relModel.nodes[i].targets[3 * numNodes/4]=3/numNodes
              relModel.normalize(relModel.nodes[i])
              relModel.nodes[i].color = Math.random() * 360
            }
          }
      }
      this.setState({relIndex: (relIndex + 1) % numNodes})
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
        const stepTimer = setInterval(runStep, 30)
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
    const {numNodes} = this.props
    this.restart(numNodes)
  }

  componentDidUpdate(prevProps, prevState) {
    const {temperature, stepTimer} = this.state
    if (prevState.temperature !== temperature) {
      clearInterval(this.state.stepTimer)
      const stepTimer = setInterval(this.runStep, 30)
      this.setState({stepTimer})
    }

  }

  componentWillUnmount() {
    const {stepTimer, bitTimer, restartTimer} = this.state
    clearInterval(stepTimer)
    clearInterval(bitTimer)
  }

  render() {
    const {width, height} = this.props
    const {temperature, bits, relModel} = this.state
    return <div>
        <RelVisualization
          width={width}
          height={height}
          relModel={relModel}
          bits={bits}
          getPosition={this.getPosition} />
    </div>
  }

}

export default RelTemperature
