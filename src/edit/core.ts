import { EventEmitter } from 'eventemitter3';
import * as THREE from 'three';
import SceneManager from './sceneManager';
import { ISceneConfig, defaultSceneConfig } from '../sceneConfig/config';
export default class EditManager extends EventEmitter {
    sceneManager: SceneManager;
    scene: THREE.Scene | null = null;
    renderer: THREE.WebGLRenderer | null = null;
    public viewWidth: number;
    public viewHeight: number;
    private wrap: HTMLElement | null = null;

    constructor(wrap: HTMLElement) {
        super();
        this.wrap = wrap;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
         });
         const { clientHeight, clientWidth } = wrap;
         this.viewWidth = clientWidth;
         this.viewHeight = clientHeight;
        this.renderer.setSize( clientWidth, clientHeight );
        wrap.appendChild( this.renderer.domElement );
        
        // const camera = new THREE.PerspectiveCamera(
        // 75,
        // window.innerWidth / window.innerHeight,
        // 0.1,
        // 1000
        // );
        // camera.position.set(10, 10, 10);
        // camera.lookAt(0, 0, 0);


        // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        // directionalLight.position.set(1, 1, 0);
        // this.scene.add(directionalLight);
    
        // this.scene.background = new THREE.Color('#ff0')

        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        // this.scene.add(ambientLight);

        //  const boxGeometry = new THREE.BoxGeometry(4, 4, 4);
        // const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        // const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        // this.scene.add(boxMesh);

        // this.renderer.render(this.scene, camera)
          
        this.sceneManager = new SceneManager({
            scene: this.scene, 
            renderer: this.renderer,
            width: clientWidth,
            height: clientHeight,
        });
        this.bindEvents();   
    }

    get currentScene() {
        return this.sceneManager.currentScene;
    }

    bindEvents() {
        window.addEventListener('resize', this.onWindowResize)
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