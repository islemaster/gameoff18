import Phaser from 'phaser'
import Wheel from './Wheel'
import debug from './debug'

const WIDTH = 720;
const HEIGHT = 400;

export default class MainScene extends Phaser.Scene {
  constructor(...args) {
    super(...args);

    this.focused = null;
    this.neglected = null;
  }

  preload () {
    this.load.image('backdrop', 'assets/backdrop.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('ticker_tape', 'assets/ticker_tape.png');
    this.load.image('wheel', 'assets/wheel.png');
    this.load.image('meter_0', 'assets/meter_0.png');
    this.load.image('meter_1', 'assets/meter_1.png');
    this.load.image('meter_2', 'assets/meter_2.png');
    this.load.image('meter_3', 'assets/meter_3.png');
    this.load.image('meter_4', 'assets/meter_4.png');
    this.load.image('meter_5', 'assets/meter_5.png');
  }

  addMeter(angle, radialOffset = 0) {
    // Origin is right at the center of the wheel
    const meter = this.add.sprite(WIDTH / 2, HEIGHT - 140, 'meter_5');
    meter.setDisplayOrigin(meter.width / 2, 100 + radialOffset);
    meter.angle = angle;
    return {
      value: 0,
      baseAngle: angle,
      sprite: meter,
    };
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

    this.meters = {};
    this.meters['kids'] = this.addMeter(22.5 - 180, 5);
    this.meters['family'] = this.addMeter(22.5 - 138);
    this.meters['health'] = this.addMeter(22.5 - 90);
    this.meters['her-career'] = this.addMeter(22.5 - 45, -5);
    this.meters['pets'] = this.addMeter(22.5 + 0);
    this.meters['friends'] = this.addMeter(22.5 + 48);
    this.meters['hobbies'] = this.addMeter(22.5 + 93);
    this.meters['his-career'] = this.addMeter(22.5 + 135, -5);

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
    for (const meter of Object.values(this.meters)) {
      meter.sprite.angle = this.wheel.angle + meter.baseAngle;
    }
    this.ground.tilePositionX += this.wheelVelocity;

    // Check for and update the 'focused' and 'neglected' categories.
    const {focused, neglected} = mapWheelAngle(this.wheel.angle);
    if (this.focused !== focused) {
      this.focused = focused;
      this.neglected = neglected;
      debug(`Focused: ${focused}; Neglected: ${neglected}`);
    } else {
      // debug(this.wheel.angle);
    }

    // Update meters
    for (const meterKey in this.meters) {
      const meter = this.meters[meterKey];
      if (meterKey == this.focused) {
        meter.value = Math.min(1, meter.value + 0.020);
      } else if (meterKey === this.neglected) {
        meter.value = Math.max(0, meter.value - 0.005);
      } else {
        meter.value = Math.max(0, meter.value - (0.001 + Math.random() * 0.001));
      }
      // Update graphics
      meter.sprite.setTexture(`meter_${Math.round(5*meter.value)}`);
    }
  }
}

function mapWheelAngle(a) {
  if (a < -135) {
    return {focused: 'his-career', neglected: 'her-career'};
  } else if (a < -90) {
    return {focused: 'hobbies', neglected: 'health'};
  } else if (a < -45) {
    return {focused: 'friends', neglected: 'family'};
  } else if (a < 0) {
    return {focused: 'pets', neglected: 'kids'};
  } else if (a < 45) {
    return {focused: 'her-career', neglected: 'his-career'};
  } else if (a < 90) {
    return {focused: 'health', neglected: 'hobbies'};
  } else if (a < 135) {
    return {focused: 'family', neglected: 'friends'};
  } else {
    return {focused: 'kids', neglected: 'pets'};
  }
}
