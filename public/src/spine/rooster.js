
// Inicializar Phaser
var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.DOM.CONTAIN,
        width: 800,
        height: 600
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
        }
    },
    backgroundColor: '#cdcdcd',
    scene: {
        preload: preload,
        create: create,
        update: update,
        pack: {
            files: [
                { type: 'scenePlugin', key: 'SpineWebGLPlugin', url: 'SpineWebGLPlugin.js', sceneKey: 'spine' }
            ]
        }
    }
};
var rooster;
var game = new Phaser.Game(config);
var animating = false;
var idle = true;
function preload() {

    this.load.spine('rooster', 'Rooster_Ani.json', 'Rooster_Ani.atlas');
}

function create() {

    rooster = this.add.spine(400, 200, 'rooster', 'rooster_idle_anim', true);
    rooster.drawDebug = true;
    rooster.setMix("rooster_idle_anim", "rooster_run_anim", 0.1);
    rooster.setMix("rooster_run_anim", "rooster_idle_anim", 0.1);
    console.log(rooster);

    rooster.setScale(0.5);
    cursors = this.input.keyboard.createCursorKeys();

    this.input.on('pointermove', function (pointer) {
        var cursor = pointer;
        var angle = Phaser.Math.Angle.BetweenY(rooster.x, rooster.y, cursor.x + this.cameras.main.scrollX, cursor.y + this.cameras.main.scrollY);
        angle =  Phaser.Math.RadToDeg(-angle);
        angle =  Phaser.Math.Clamp(angle,70,180);
        var neck = rooster.skeleton.findBone("neck_bone_01");
        console.log(angle);
        neck.rotation = angle;
        rooster.skeleton.updateWorldTransform();

  }, this);

}

function update() {
    if (cursors.left.isDown) {
        rooster.x -= 5;
        rooster.flipX = false;
        if (!animating) {
            rooster.play('rooster_run_anim', true);
            animating = true;
            idle = false;
        }
    }
    else if (cursors.right.isDown) {
        rooster.x += 5;
        rooster.flipX = true;
        if (!animating) {
            rooster.play('rooster_run_anim', true);
            animating = true;
            idle = false;
        }
    } else {
        animating = false;
        if (!idle) {
            rooster.play('rooster_idle_anim', true);
            idle = true;
        }
    }
}