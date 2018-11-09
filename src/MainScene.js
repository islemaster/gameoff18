import Phaser from 'phaser';

var t = 0;

export default class MainScene extends Phaser.Scene {
    preload() {

    }

    create() {
        this.add
            .text(
                this.game.renderer.width / 2,
                this.game.renderer.height * 3 / 4,
                `Here's a\ntemplate string.`, {
                    font: "40px monospace",
                    color: "white"
                })
            .setOrigin(0.5, 0.5)
            .setShadow(3, 3, "#5588EE", 0, true, true);
    }

    update() {
        t = t + 1;
        const r = this.game.renderer.width / 2;
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
}
