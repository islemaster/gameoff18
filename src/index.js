import Phaser from 'phaser';
import MainScene from './MainScene';

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 412,
    height: 732,
    pixelArt: false,
    scene: MainScene,
};

var game = new Phaser.Game(config);
