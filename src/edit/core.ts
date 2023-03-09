import { EventEmitter } from 'eventemitter3';
import * as THREE from 'three';
import SceneManager from './sceneManager';
import { ISceneConfig, defaultSceneConfig } from '@/sceneConfig/config';
export default class EditManager extends EventEmitter {
    sceneManager: SceneManager;
    scene: THREE.Scene | null = null;
    renderer: THREE.WebGLRenderer | null = null;
    wrap: HTMLElement | null = null;
    constructor(wrap: HTMLElement) {
        super();
        this.wrap = wrap;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
         });
        this.renderer.setSize( wrap.clientWidth, wrap.clientHeight );
        wrap.appendChild( this.renderer.domElement );
        
        this.sceneManager = new SceneManager(this.scene, this.renderer);
        this.bindEvents();            
    }



    bindEvents() {
        window.addEventListener('resize', this.onWindowResize)
        this.on('add', (e) => {
            console.log(e);
            console.log('scene add ...')
        })
    }

    onWindowResize() {
        if(this.renderer && this.wrap) {
            const { clientWidth, clientHeight } = this.wrap;
            this.sceneManager.resize(clientWidth, clientHeight);
            this.renderer.setSize( clientWidth, clientHeight );
        }
    }

    setUp(sceneConfig: ISceneConfig = defaultSceneConfig) {
        this.sceneManager.setScene(sceneConfig);
    }

    updateConfig(sceneConfig: ISceneConfig) {
        this.sceneManager.setScene(sceneConfig);
    }

    destroy() {
        this.sceneManager.destroy();
        
    }
}