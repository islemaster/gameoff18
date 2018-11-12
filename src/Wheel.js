import {GameObjects} from 'phaser';
const {Sprite} = GameObjects;

export default class Wheel extends Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.setTexture('wheel');
    this.setPosition(x, y);
  }
}
