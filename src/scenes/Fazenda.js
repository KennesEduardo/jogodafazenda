import { Scene } from "phaser";
import { CONFIG } from "../config";
import Player from "./entities/Player";

export default class Fazenda extends Scene {
    /** @type {Phaser.Tilemaps.Tilemap} */
    map;

    /**@type {Player} */
    player;
    touch;

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
    }

    create() {
        this.createMap();
        this.createLayers();
        // this.createLayersManual();
        this.createPlayer();
        this.createCamera();
        this.createColliders();
        
    }

    update() {

    }

    createPlayer() {

        // this.touch = new Touch(this, 50, 50);

        this.player = new Player(this, 16*9, 16*9, this.touch) //(scene, x,y)
        this.player.setDepth (2);
        
        
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
                console.log(name)

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
            }
        }
        
    }


    createLayersManual() {
        
        //pegando os tilesets (usar os nome dados no tile)
        const tilesGeral = this.map.getTileset('geral');

        //inserido os layers manualmente
        //createLayers(nome da camada, vetor de tiles usado pra monta e posição x da cama, y da camada)
        this.map.createLayer('camadaUm', [tilesGeral], 0, 0); //0,0 é a posição x e y
        this.map.createLayer('camadaDoisCollision', [tilesGeral], 0, 0);
        this.map.createLayer('camadaTresCollision', [tilesGeral], 0, 0);
        this.map.createLayer('camadaQuatro', [tilesGeral], 0, 0);
        
        
    }

    createCamera() {
        const mapWidth = this.map.width * CONFIG.TILE_SIZE;
        const mapHeight = this.map.height * CONFIG.TILE_SIZE;

        this.cameras.main.setBounds(0,0, mapWidth, mapHeight);
        this.cameras.main.startFollow(this.player);
    }

}