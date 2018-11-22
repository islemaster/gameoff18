import { GameObjects } from 'phaser'

const {Sprite} = GameObjects

const BASE_ANGLE = 22.5

export default class Meter extends Sprite {
  static assetList = {
    meter_0: 'assets/meter_0.png',
    meter_1: 'assets/meter_1.png',
    meter_2: 'assets/meter_2.png',
    meter_3: 'assets/meter_3.png',
    meter_4: 'assets/meter_4.png',
    meter_5: 'assets/meter_5.png',
  }

  value = 0

  /**
   * @param {phaser.Scene} scene
   * @param {{x:number,y:number}} wheelCenter
   * @param {number} angularOffset in degrees
   * @param {number} [radialOffset] in pixels
   */
  constructor (scene, wheelCenter, name, angularOffset, radialOffset = 0) {
    super(scene, wheelCenter.x, wheelCenter.y, 'meter_0')

    // Render away from the center of the wheel
    this.setDisplayOrigin(this.width / 2, 100 + radialOffset)

    // Set position on the wheel
    this.angularOffset = BASE_ANGLE + angularOffset
    this.angle = this.angularOffset

    /**
     * @type {string} Key representing this meter
     */
    this.name = name

    /**
     * @type {number} How full this meter is, 0..1 range
     */
    this.value = 0
  }

  update (wheelAngle) {
    this.angle = this.angularOffset + wheelAngle
    const {focused, neglected} = Meter.mapWheelAngle(wheelAngle)
    if (this.name == focused) {
      this.value = Math.min(1, this.value + 0.020)
    } else if (this.name === neglected) {
      this.value = Math.max(0, this.value - 0.005)
    } else {
      this.value = Math.max(0, this.value - (0.001 + Math.random() * 0.001))
    }
    // Update graphics
    this.setTexture(`meter_${Math.round(5 * this.value)}`)
  }

  static mapWheelAngle (a) {
    if (a < -135) {
      return {focused: 'his-career', neglected: 'her-career'}
    } else if (a < -90) {
      return {focused: 'hobbies', neglected: 'health'}
    } else if (a < -45) {
      return {focused: 'friends', neglected: 'family'}
    } else if (a < 0) {
      return {focused: 'pets', neglected: 'kids'}
    } else if (a < 45) {
      return {focused: 'her-career', neglected: 'his-career'}
    } else if (a < 90) {
      return {focused: 'health', neglected: 'hobbies'}
    } else if (a < 135) {
      return {focused: 'family', neglected: 'friends'}
    } else {
      return {focused: 'kids', neglected: 'pets'}
    }
  }
}
