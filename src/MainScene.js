import Phaser from 'phaser'
import Meter from './Meter'
import Wheel from './Wheel'
import debug from './debug'

const WIDTH = 720
const HEIGHT = 400

const METERS_CONFIG = {
  'kids': {angularOffset: -180, radialOffset: 5},
  'family': {angularOffset: -138},
  'health': {angularOffset: -90},
  'her-career': {angularOffset: -45, radialOffset: -5},
  'pets': {angularOffset: 0},
  'friends': {angularOffset: 48},
  'hobbies': {angularOffset: 93},
  'his-career': {angularOffset: 135, radialOffset: -5},
}

export default class MainScene extends Phaser.Scene {
  constructor (...args) {
    super(...args)

    this.focused = null
    this.neglected = null
  }

  preload () {
    this.load.image('backdrop', 'assets/backdrop.png')
    this.load.image('ground', 'assets/ground.png')
    this.load.image('ticker_tape', 'assets/ticker_tape.png')
    this.load.image('wheel', 'assets/wheel.png')
    for (const key of Object.keys(Meter.assetList)) {
      this.load.image(key, Meter.assetList[key])
    }
  }

  addMeter (angle, radialOffset = 0) {
    // Origin is right at the center of the wheel
    const meter = this.add.sprite(WIDTH / 2, HEIGHT - 140, 'meter_5')
    meter.setDisplayOrigin(meter.width / 2, 100 + radialOffset)
    meter.angle = angle
    return {
      value: 0,
      baseAngle: angle,
      sprite: meter,
    }
  }

  create () {
    const wheelCenter = {x: WIDTH / 2, y: HEIGHT - 140}

    this.cursors = this.input.keyboard.createCursorKeys()
    this.wheelVelocity = 0

    this.backdrop = this.createBackdrop()
    this.wheel = this.createWheel(wheelCenter)
    this.meters = this.createMeters(wheelCenter)
    this.ground = this.createGround()
    this.tickerTape = this.createTickerTape()
  }

  createBackdrop () {
    return this.add.tileSprite(
      WIDTH / 2,
      HEIGHT / 2,
      WIDTH,
      HEIGHT,
      'backdrop'
    )
  }

  createWheel (wheelCenter) {
    const wheel = new Wheel(this, wheelCenter.x, wheelCenter.y)
    this.add.existing(wheel)
    return wheel
  }

  createMeters (wheelCenter) {
    return Object.keys(METERS_CONFIG).reduce((meters, key) => {
      const config = METERS_CONFIG[key]
      meters[key] = new Meter(this, wheelCenter, key, config.angularOffset, config.radialOffset)
      this.add.existing(meters[key])
      return meters
    }, {})
  }

  createGround () {
    return this.add.tileSprite(
      WIDTH / 2,
      HEIGHT - (25 / 2),
      WIDTH,
      25,
      'ground'
    )
  }

  createTickerTape () {
    const tape = this.add.tileSprite(
      WIDTH / 2,
      30,
      WIDTH,
      48,
      'ticker_tape'
    )
    this.add
      .text(
        WIDTH / 2,
        30,
        `year 2`,
        {
          font: '20px monospace',
          color: '#454545'
        }
      )
      .setOrigin(0.5, 0.5)
    return tape
  }

  update () {
    if (this.cursors.left.isDown) {
      this.wheelVelocity = Math.max(-10, this.wheelVelocity - 0.5)
    } else if (this.cursors.right.isDown) {
      this.wheelVelocity = Math.min(10, this.wheelVelocity + 0.5)
    } else {
      this.wheelVelocity *= 0.9
      if (Math.abs(this.wheelVelocity) < 0.1) {
        this.wheelVelocity = 0
      }
    }
    const r = 150
    const c = 2 * Math.PI * r
    const pxPerDeg = c / 360
    this.wheel.angle += this.wheelVelocity / pxPerDeg
    this.ground.tilePositionX += this.wheelVelocity

    for (const meter of Object.values(this.meters)) {
      meter.update(this.wheel.angle)
    }

    // Check for and update the 'focused' and 'neglected' categories.
    const {focused, neglected} = Meter.mapWheelAngle(this.wheel.angle)
    if (this.focused !== focused) {
      this.focused = focused
      this.neglected = neglected
      debug(`Focused: ${focused}; Neglected: ${neglected}`)
    }
  }
}
