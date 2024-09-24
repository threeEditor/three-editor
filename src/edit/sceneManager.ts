import { ISceneConfig } from "@/sceneConfig/config";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import MaterialManager from "./materialManager";
import { loadGLTF } from "./loader";
import { EventEmitter } from "eventemitter3";
import { SceneManagerEvent } from "./event";

interface ISceneManager {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  width: number;
  height: number;
}
export default class SceneManager extends EventEmitter {
  public materialManager: MaterialManager;
  public loopStamp: number | null = null;
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public defaultCamera: THREE.PerspectiveCamera | null = null;
  private sceneWidth: number;
  private sceneHeight: number;
  get currentScene() {
    return this.scene;
  }

  constructor({ scene, renderer, width, height }: ISceneManager) {
    super();
    this.scene = scene;
    this.renderer = renderer;
    this.sceneWidth = width;
    this.sceneHeight = height;
    this.materialManager = new MaterialManager();
  }

  setScene(sceneConfig: ISceneConfig) {
    // 清空场景中的对象
    this.clearScene();

    this.loadScene(sceneConfig);
    if (this.loopStamp) {
      cancelAnimationFrame(this.loopStamp);
      this.loopStamp = null;
    }
    this.loop();
  }

  // 清空场景中的对象
  clearScene() {
    this.materialManager.destroy();
  }

  loadScene = (sceneConfig: ISceneConfig) => {
    const { sceneWidth, sceneHeight } = this;
    const camera = new THREE.PerspectiveCamera(
      75,
      sceneWidth / sceneHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    new OrbitControls(camera, this.renderer.domElement);
    this.defaultCamera = camera;

    // // // // TODO 加载场景
    // const boxGeometry = new THREE.BoxGeometry(4, 4, 4);
    // // const boxMaterial = this.materialManager.getMaterial('basic', { color: 0xff0000 });
    // const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    // const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    // this.scene.add(boxMesh);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 0);
    this.scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    this.emit(SceneManagerEvent.SCENELOAD, { sceneConfig });
  };

  add(option: any, callback?: (result: any) => void) {
    switch (option.type) {
      case "model":
        this.addModel(option.model, option.callback);
        break;
      case "mesh":
        this.scene.add(option.object);
        break;
      default:
        console.warn("暂不支持该类型");
    }
  }

  addModel(modelInfo: any, callback?: (result: any) => void) {
    switch (modelInfo.type) {
      case "gltf":
        loadGLTF(modelInfo.url, (result) => {
          const { success, gltf } = result;
          if (success && gltf) {
            const model = gltf.scene;
            callback && callback(model);
            this.scene.add(gltf.scene);
          }
        });
        break;
      default:
        console.warn("暂不支持该模型类型");
        break;
    }
  }

  loop() {
    this.loopStamp = requestAnimationFrame(this.loop.bind(this));
    if (this.renderer && this.scene && this.defaultCamera) {
      // console.log('loop')
      this.renderer.render(this.scene, this.defaultCamera);
    }
  }

  resize(width: number, height: number) {
    if (this.defaultCamera) {
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
