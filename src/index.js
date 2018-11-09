import Phaser from 'phaser';

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 412,
    height: 732,
    scene: { preload, create, update },
};

var game = new Phaser.Game(config);
var t = 0;

function preload() {}

function create() {

}

function update() {
    t = t + 1;
    const r = game.renderer.width / 2;
    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xff0000 } });
    graphics.strokeEllipseShape(new Phaser.Geom.Ellipse(r, r, 2 * r, 2 * r));
    graphics.beginPath();

    graphics.moveTo(r + -r * Math.cos(t), r + -r * Math.sin(t));
    graphics.lineTo(r + r * Math.cos(t), r + r * Math.sin(t));

    graphics.moveTo(r + -r * Math.cos(t + Math.PI / 3), r + -r * Math.sin(t + Math.PI / 3));
    graphics.lineTo(r + r * Math.cos(t + Math.PI / 3), r + r * Math.sin(t + Math.PI / 3));

    graphics.moveTo(r + -r * Math.cos(t + 2 * Math.PI / 3), r + -r * Math.sin(t + 2 * Math.PI / 3));
    graphics.lineTo(r + r * Math.cos(t + 2 * Math.PI / 3), r + r * Math.sin(t + 2 * Math.PI / 3));

    graphics.closePath();
    graphics.strokePath();
}
