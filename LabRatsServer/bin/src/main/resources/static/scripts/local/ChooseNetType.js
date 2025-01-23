class ChooseNetType extends Phaser.Scene {

    constructor() {
        super({key: "ChooseNetType"});
    }

    preload() {
        this.load.setPath('assets/');
        this.load.image('background', 'MenuBackground.png');
        this.load.image('local', 'Local.png')
        this.load.image('online', 'Online.png')
    }
    
    create(){
        this.add.image(400, 300, 'background');

        this.localBtn = this.add.image(380, 300, 'local').setScale(0.85).setInteractive();
        this.localBtn.on('pointerdown', () => {
            this.scene.stop('ChooseNetType');
            this.scene.start('MenuSceneLocal');
        });
        this.onlineBtn = this.add.image(380, 500, 'online').setScale(0.85).setInteractive();
        this.onlineBtn.on('pointerdown', () => {
            this.scene.stop('ChooseNetType');
            this.scene.start('UserScene');
        });
    }
    
}