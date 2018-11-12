import Phaser from 'phaser'
import Wheel from './Wheel'

const WIDTH = 720;
const HEIGHT = 400;

export default class MainScene extends Phaser.Scene {
  preload () {
    this.load.image('backdrop', 'assets/backdrop.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('ticker_tape', 'assets/ticker_tape.png');
    this.load.image('wheel', 'assets/wheel.png');
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wheelVelocity = 0;

    this.backdrop= this.add.tileSprite(
      WIDTH / 2,
      HEIGHT / 2,
      WIDTH,
      HEIGHT,
      'backdrop'
    );
    this.wheel = new Wheel(this, WIDTH / 2, HEIGHT - 140);
    this.add.existing(this.wheel);

    this.ground = this.add.tileSprite(
      WIDTH / 2,
      HEIGHT - (25/2),
      WIDTH,
      25,
      'ground'
    )

    this.tickerTape = this.add.tileSprite(
      WIDTH / 2,
      30,
      WIDTH,
      48,
      'ticker_tape'
    );
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
  }

  update () {
    if (this.cursors.left.isDown) {
      this.wheelVelocity = Math.max(-10, this.wheelVelocity - 0.5);
    } else if (this.cursors.right.isDown) {
      this.wheelVelocity = Math.min(10, this.wheelVelocity + 0.5);
    } else {
      this.wheelVelocity *= 0.9;
      if (Math.abs(this.wheelVelocity) < 0.1) {
        this.wheelVelocity = 0;
      }
    }
    const r = 150;
    const c = 2 * Math.PI * r;
    const pxPerDeg = c / 360;
    this.wheel.angle += this.wheelVelocity / pxPerDeg;
    this.ground.tilePositionX += this.wheelVelocity;
  }
}
