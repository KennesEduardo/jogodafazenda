import { CONFIG } from "../../config"

export default class vaca extends Phaser.Physics.Arcade.Sprite {
    /**@type {Phaser.Type.Input.KeyBoard.CursorKeys} */
    clock;


    constructor(scene, x , y, touch) {
        super(scene, x, y, 'vaca');
        scene.add.existing(this); //criando a vaca(img) que o jogador vê
        scene.physics.add.existing(this); //criando o body da física 
        this.init();
    }

    init(){
        this.setFrame(0);
        this.speed = 6;
        this.frameRate = 8;
        this.direction = 'parada-direito';
       //arrumando o tamanho do vaca
        this.body.setSize(10,10);    
        this.initAnimations();
        //acosioando um evento da cena ao player
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        this.play('parada-direito');

        this.clock = this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
              this.autoDirect();
            },
            callbackScope: this, 
            loop: true
          })
    }   

    initAnimations() {

        this.anims.create({
            key: 'parada-direito',
            frames: this.anims.generateFrameNumbers('vaca', {
            start: 0, end:2 }),
            frameRate: 3,
            repeat: -1
        });

        this.anims.create({
            key: 'inclinando',
            frames: this.anims.generateFrameNames('vaca', {
              start: 41, end: 51
            }),
            frameRate: this.frameRate,
            repeat: -1,

        })

        // this.anims.create({
        //     key: 'alimentando',
        //     frames: this.anims.generateFrameNames('vaca', {
        //       start: 48, end: 51 
        //     }),
        //     frameRate: this.frameRate,
        //     repeat: -1

        // })
      
        this.anims.create({
            key: 'andando-direita',
            frames: this.anims.generateFrameNames('vaca', {
              start: 8, end: 14
            }),
            frameRate: this.frameRate,
            repeat: -1,
        })
      
        this.anims.create({
            key: 'andando-esquerda',
            frames: this.anims.generateFrameNames('vaca', {
              start: 8, end: 14
            }),
            frameRate: this.frameRate,
            repeat: -1,
        })
        

    }

    autoDirect() {
        var autoRun = Math.floor(Math.random() * 5);
        console.log(autoRun)
        switch (autoRun) {
          case 1:
            this.flipX = false;
            this.setVelocityX(0);
            this.play('parada-direito');
            break;

          case 2:
            this.flipX = false;
            this.setVelocityX(0);
            this.play('andando-direita')
            this.setVelocityX(8);
            break;

          case 3:
            this.setVelocityX(0);
            this.play('andando-esquerda');
            this.flipX = true;
            this.setVelocityX(-8);
            break;

          case 4:
            this.flipX = false;
            this.setVelocityX(0);
            this.play('inclinando');
            break;

          
        }
      }

}
