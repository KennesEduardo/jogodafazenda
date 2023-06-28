import { CONFIG } from "../../config"

export default class vaca extends Phaser.Physics.Arcade.Sprite {
    /**@type {Phaser.Type.Input.KeyBoard.CursorKeys} */


    constructor(scene, x , y, touch) {
        super(scene, x, y, 'vaca');

        this.touch = touch;

        scene.add.existing(this); //criando a vaca(img) que o jogador vê
        scene.physics.add.existing(this); //criando o body da física 

        this.init();
    }

    init(){
        this.setFrame(3);
        this.speed = 120;
        this.frameRate = 8;
        this.direction = 'right';
       //arrumando o tamanho do vaca
        this.body.setSize(10,10);
        this.body.setOffset(1,22);
        
        this.initAnimations();
        //acosioando um evento da cena ao player
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
        
        this.play('idle-right');
    }   

    initAnimations() {

        this.anims.create({
            key: 'idle-right',
            frames: this.anims.generateFrameNumbers('vaca', {
            start: 0, end:2 }),
            frameRate: this.frameRate,
            repeat: 1
        });
        this.setVelocityX(-2)
    }

}
