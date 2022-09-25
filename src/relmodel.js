export default class RelModel {

  constructor (length, colorCoefficient = .5, numDice = 1, bitStrength = .5, colorShiftStrength = 2) {
    this.nodes = []
    this.bits = []
    this.dice = []
    this.diceIndex = 0
    this.maxEntropy = Math.log1p(1/length) * length ** 2
    this.minEntropy = Math.log1p(1) * length
    this.entropy = 0
    this.entropyLog = []
    this.relationalityLog = []

    for (var i = 0; i < length; i++) {
      this.nodes[i] = {
        stability: 0,
        color: Math.random() * 360,
        targets: Array.from({length}, () => 1/length),
        sum: .1 * length,
        max: .1,
        entropyLog: [0],
        entropyDeltas: [0],
        entropy: Math.log1p(1/length) * length
      }
    }

    for (var j=0; j < numDice; j++) {
      this.dice[j] = Math.random()
    }

    this.normalize = (node) => {
      let sum = 0
      node.max = 0
      let entropy = 0
      node.targets.forEach(t => sum += t)
      for (var i = 0; i < length; i++) {
        node.targets[i] = node.targets[i]/sum
        if (node.targets[i] > node.max) {
          node.max = node.targets[i]
        }
      }
    }

    this.updateRelationality = () => {
      this.lastEntropy = this.entropy.valueOf()
      this.entropy = this.nodes.reduce((sum, node) => sum + node.entropy, 0)
      this.relationalityLog = this.relationalityLog
        .concat(this.entropy - this.lastEntropy)
        .slice(this.relationalityLog.length - 399)
      this.entropyLog = this.entropyLog.concat(this.entropy)
        .slice(this.entropyLog.length - 399)
    }

    this.calculateEntropy = (node) => {
      node.entropy = node.targets.reduce((entropy, target) => entropy + Math.log1p(target), 0)
      // node.entropyLog = node.entropyLog.concat(node.entropy)
      //   .slice(node.entropyLog.length - 199)
      // node.entropyDeltas = node.entropyLog.map(
      //   (e, i) => e - node.entropyLog[i-4] || 0
      // ).slice(4, 200)
    }

    this.step = (i) => {
      const node = this.nodes[i]
      if (!node) {
        console.error('Node not found');
      }

      const diceRoll = this.diceIndex >= this.dice.length ? Math.random() : this.dice[this.diceIndex]
      this.diceIndex++
      var j
      var counter = 0
      for (j = 0; j < length - 1; j++) {
        counter += node.targets[j]
        if (counter > diceRoll && i !== j) {
          break;
        }
      }
      if (i===j) {
        j = 0
      }
      this.bits.push({
        source: i,
        target: j,
        color: node.color,
        complete: 0
      })

      this.normalize(this.nodes[i])
    }

    this.bitStep = () => {
      this.bits = this.bits.filter(bit => bit.complete < 100)
      for (var i = 0; i < this.bits.length; i++) {
        const bit = this.bits[i]
        bit.complete += 2
        if (bit.complete === 100) {
          const bitColor = bit.color
          const nodeColor = this.nodes[bit.target].color
          const similarity = (360 - Math.abs(bitColor - nodeColor)) * colorCoefficient
          this.nodes[bit.target].targets[bit.source] += similarity/700 * bitStrength
          this.normalize(this.nodes[bit.target])
          this.calculateEntropy(this.nodes[bit.target])

          const colorDelta = ((Math.abs(bitColor - nodeColor) + 360) % 360)/2
          const colorSign = bitColor > nodeColor ? 1 : -1

          const colorShift = colorDelta * colorSign / 30
          this.nodes[bit.target].color = (this.nodes[bit.target].color + colorShift * colorShiftStrength) % 360
        }
      }
    }
  }
}
