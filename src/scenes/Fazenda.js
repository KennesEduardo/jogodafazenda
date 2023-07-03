import { Scene } from "phaser";
import { CONFIG } from "../config";
import Player from "./entities/Player";
import Vaca from "./entities/Vaca";
import Touch from "./entities/Touch";
import Casa from "./Casa"

export default class Fazenda extends Scene {
    /** @type {Phaser.Tilemaps.Tilemap} */
    map;

    /**@type {Player} */
    player;
    touch;
    /**@type {Vaca} */
    vaca;

    groupObjects;

    //variaveis da sementes
    sementeCenoura = false;
    cenouraNivel = 1;

    sementeNabo = false;
    naboNivel = 2;

    sementeBeringela = false;
    beringelaNivel = 1;

    
    

    regador = false;

    isTouching = false;

    layers = {};
    constructor() {
        super('Fazenda');//salvando o nome desta Cena
    }

    preload() {
        //Carregando os dados do mapa
        this.load.tilemapTiledJSON('tilemap-fazenda', 'mapas/fazenda.json');

        //caregando os tilessets do mapa IMAGENS
        this.load.image('tiles-geral', 'mapas/tiles/geral.png');

        //importando um spritesheet
        this.load.spritesheet('player', 'mapas/tiles/player.png', {
            frameWidth: 48,
            frameHeight: 48
        });

        this.load.spritesheet('vaca', 'mapas/tiles/vacas_anim.png', {
            frameWidth: CONFIG.TILE_SIZE * 2,
            frameHeight: CONFIG.TILE_SIZE *2
        });
        this.load.spritesheet('spritGeral', 'mapas/tiles/geral.png', {
            frameWidth: CONFIG.TILE_SIZE,
            frameHeight: CONFIG.TILE_SIZE
        });

    }

    create() {
        this.createMap();
        this.createLayers();
        this.createPlayer();
        this.createCamera();
        this.createVaca();
        this.createVacaDois();
        this.createObjects();
        this.createColliders();
                
    }

    update() {

    }

    createPlayer() {
        this.touch = new Touch(this, 50, 50);
        this.player = new Player(this, 16*9, 16*9, this.touch) //(scene, x,y)
        this.player.setDepth (2);
                
    }

    createVaca() {
        this.vaca = new Vaca(this, 16*25, 16*16)
        this.vaca.setDepth(2);
    }
    createVacaDois() {
        this.vacaDois = new Vaca(this, 16*25, 16*21)
        this.vacaDois.setDepth(2);
    }

    createMap(){
        this.map = this.make.tilemap({
            key:'tilemap-fazenda', //dados json 
            tileWidth: CONFIG.TILE_SIZE,
            tileHeight: CONFIG.TILE_SIZE
        });

        //fazendo a correspondencia ente as imagens usada no Tiled e as carrregadas peli phaser
        // addTilesetImage(nome da imagem no Tiled, nome da imagem carregado no Phaser)
        this.map.addTilesetImage('geral', 'tiles-geral');
    }

    createObjects(){

        this.groupObjects = this.physics.add.group();

        const objects = this.map.createFromObjects('semente',{
            nome: 'regador', nome: 'cenoura', nome: 'terrenoCenoura', 
        
        });
        
        this.physics.world.enable(objects);

        for ( let i = 0; i <objects.length; i++){
            const obj = objects[i]

            const prop = this.map.objects[0].objects[i]
            
            obj.setDepth(this.layers.length+1);
            obj.setVisible(false);
            obj.prop = this.map.objects[0].objects[i].properties;
            this.groupObjects.add(obj);

        }

    }


    createLayers() {
        //pegando os tilessets (usar os nomes )
        const tilesGeral = this.map.getTileset('geral');

        const layerNames = this.map.getTileLayerNames();
        for (let i = 0; i < layerNames.length; i++) {
            const name = layerNames[i];
            

            // this.map.createLayer(name, [tilesGeral], 0, 0);           
            this.layers[name] = this.map.createLayer(name, [tilesGeral], 0, 0);
            //definindo a profundidade de cada camada
            this.layers[name].setDepth(i);

            //verifica se o layers possui uma colisão

            if(name.endsWith('Collision') ) {
                this.layers[name].setCollisionByProperty({collide: true});

                if ( CONFIG.DEBUG_COLLISION ) {
                    const debugGraphics = this.add.graphics().setAlpha(0.75).setDepth(i);
                    this.layers[name].renderDebug(debugGraphics, {
                        tileColor: null, // Color of non-colliding tiles
                        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
                    });
                }
            }

        }
    }

    createColliders() {
        //criando colisão entre o Player e as camadas de colisão do Tiled
        const layerNames = this.map.getTileLayerNames();
        for (let i = 0; i < layerNames.length; i++) {
            const name = layerNames[i];

            if(name.endsWith('Collision') ) {
                this.physics.add.collider(this.player, this.layers[name]);
                this.physics.add.collider(this.vaca, this.layers[name]);
                this.physics.add.collider(this.vacaDois, this.layers[name]);
            }
        }
        //ativando bordinhas
        this.physics.add.overlap(this.touch, this.groupObjects, this.handleTouch, undefined, this);

        
    }


    createCamera() {
        const mapWidth = this.map.width * CONFIG.TILE_SIZE;
        const mapHeight = this.map.height * CONFIG.TILE_SIZE;

        this.cameras.main.setBounds(0,0, mapWidth, mapHeight);
        this.cameras.main.startFollow(this.player);
    }

    handleTouch(touch, objects){ 
        
        if (this.isTouching && this.player.isAction) {
            return;
        }
        if (this.isTouching && !this.player.isAction) {
            this.isTouching = false;
            return;
        }

            //Mudando a cena para CASA
        if (this.player.isAction) {
            if (objects.name === 'porta') {
                console.log("mudarei de cena");
            this.scene.switch('Casa')
            }
        }

        //colocando semente da cenoura na mão
        if(this.player.isAction){
            this.isTouching = true;
            //pegando sementes
            if(objects.name === 'cenoura' && this.sementeCenoura == false){
                this.sementeCenoura = true;
                console.log("peguei a semente de cenoura")
            }
            if(objects.name === 'nabo' && this.sementeNabo == false){
                this.sementeNabo = true;
                console.log("peguei a semente de nabo")
            }
            if(objects.name === 'beringela' && this.sementeNabo == false){
                this.sementeBeringela = true;
                console.log("peguei a semente de beringela")
            }
            //plantado a sementes
            if(objects.name === 'terrenoCenoura' && this.sementeCenoura == true ){
                const pegaPosicao = this.physics.add.sprite(objects.x, objects.y,'spritGeral')
                .setDepth(0)
                pegaPosicao.setFrame(585)
                this.sementeCenoura = false;
                this.cenouraNivel = 2;
            }
            if(objects.name === 'terrenoNabo' && this.sementeNabo == true ){
                const pegaPosicao = this.physics.add.sprite(objects.x, objects.y,'spritGeral')
                .setDepth(0)
                pegaPosicao.setFrame(609)
                this.sementeNabo = false;
                this.naboNivel = 2;
            }
            if(objects.name === 'terrenoberingela' && this.sementeBeringela == true ){
                const pegaPosicao = this.physics.add.sprite(objects.x, objects.y,'spritGeral')
                .setDepth(0)
                pegaPosicao.setFrame(657)
                this.sementeBeringela = false;
                this.beringelaNivel = 2;
            }
            //regando a determinada planta
            if(objects.name === 'regador' && this.regador == false) {
                this.regador = true;
            }
            // fases da cenoura
            if(objects.name === 'terrenoCenoura' && this.regador == true && this.cenouraNivel == 2) {
                setTimeout(() => {
                    const pegaPosicao = this.physics.add.sprite(objects.x, objects.y,'spritGeral')
                    .setDepth(0)
                    pegaPosicao.setFrame(586)

                }, 300);
                this.cenouraNivel = 3
                this.regador = false;                      
                
            }
            if(objects.name === 'terrenoCenoura' && this.regador == true && this.cenouraNivel == 3) {
                console.log("entrei no nivel 3")
                setTimeout(() => {
                    const pegaPosicao = this.physics.add.sprite(objects.x, objects.y,'spritGeral')
                    .setDepth(0)
                    pegaPosicao.setFrame(587)
                }, 300);
                this.regador = false;
            }

            //fase do nabo

            if(objects.name === 'terrenoNabo' && this.regador == true && this.naboNivel == 2) {
                setTimeout(() => {
                    const pegaPosicao = this.physics.add.sprite(objects.x, objects.y,'spritGeral')
                    .setDepth(0)
                    pegaPosicao.setFrame(610)

                }, 300);
                this.naboNivel = 3
                this.regador = false;                      
                
            }
            if(objects.name === 'terrenoNabo' && this.regador == true && this.naboNivel == 3) {
                console.log("entrei no nivel 3")
                setTimeout(() => {
                    const pegaPosicao = this.physics.add.sprite(objects.x, objects.y,'spritGeral')
                    .setDepth(0)
                    pegaPosicao.setFrame(611)
                }, 300);
                this.regador = false;
                this.naboNivel = 1;
            }

            //fase da beringela

            if(objects.name === 'terrenoBeringela' && this.regador == true && this.beringelaNivel == 2) {
                setTimeout(() => {
                    const pegaPosicao = this.physics.add.sprite(objects.x, objects.y,'spritGeral')
                    .setDepth(0)
                    pegaPosicao.setFrame(658)

                }, 300);
                this.beringelaNivel = 3
                this.regador = false;                      
                
            }
            if(objects.name === 'terrenoberingela' && this.regador == true && this.beringelaNivel == 3) {
                console.log("entrei no nivel 3")
                setTimeout(() => {
                    const pegaPosicao = this.physics.add.sprite(objects.x, objects.y,'spritGeral')
                    .setDepth(0)
                    pegaPosicao.setFrame(659)
                }, 300);
                this.regador = false;
                this.beringelaNivel = 1
            }
        }

    }

}