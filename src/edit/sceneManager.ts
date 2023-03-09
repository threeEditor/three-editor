import { ISceneConfig } from '@/sceneConfig/config';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import MaterialManager from './materialManager';

export default class SceneManager {
    public materialManager: MaterialManager;
    public loopStamp: number| null = null;
    public scene: THREE.Scene;
    public renderer: THREE.WebGLRenderer;
    public defaultCamera: THREE.PerspectiveCamera | null = null;
   
    constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
        this.scene = scene;
        this.renderer = renderer;
        this.materialManager = new MaterialManager();
    }

    setScene(sceneConfig: ISceneConfig) {
        // 清空场景中的对象
        this.clearScene();

        this.loadScene(sceneConfig);

        if(this.loopStamp) {
            cancelAnimationFrame(this.loopStamp);
            this.loopStamp = null;
        }
        this.loop();
    }

    // 清空场景中的对象
    clearScene() {
        this.materialManager.destroy();
    }

    loadScene(sceneConfig: ISceneConfig) {
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        camera.position.set(10, 10, 10);
        camera.lookAt(0, 0, 0);

        new OrbitControls(camera, this.renderer.domElement);
        this.defaultCamera = camera;

        // TODO 加载场景
        const boxGeometry = new THREE.BoxGeometry(4, 4, 4);
        // const boxMaterial = this.materialManager.getMaterial('basic', { color: 0xff0000 });
        const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        this.scene.add(boxMesh);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 0);
        this.scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
    }

    loop() {
        this.loopStamp = requestAnimationFrame(this.loop.bind(this));
        if(this.renderer && this.scene && this.defaultCamera) {
            this.renderer.render(this.scene, this.defaultCamera);
        }
    }

    resize(width: number, height: number) {
        if(this.defaultCamera) {
            this.defaultCamera.aspect = width / height;
            this.defaultCamera.updateProjectionMatrix();
        }
    }

    destroy() {
        // 销毁循环
        if (this.loopStamp) {
            cancelAnimationFrame(this.loopStamp);
        }

        this.clearScene();
    }
}