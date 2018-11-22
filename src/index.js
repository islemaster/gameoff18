import Phaser from 'phaser';
import MainScene from './MainScene';

var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 720,
  height: 400,
  pixelArt: true,
  scene: MainScene,
};

var game = new Phaser.Game(config);
