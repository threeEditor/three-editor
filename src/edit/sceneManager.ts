import { ISceneConfig } from "@/sceneConfig/config";
import * as THREE from "three";

import MaterialManager from "./materialManager";
import { loadGLTF } from "./utils/loader";
import { EventEmitter } from "eventemitter3";
import { SceneManagerEvent } from "./event";
import EditManager from "./core";
import Renderer from "./renderer";
import Camera from "./camera";

export default class SceneManager extends EventEmitter {
  public materialManager: MaterialManager;
  public scene: THREE.Scene = new THREE.Scene();
  editManager: EditManager;
  renderer!: Renderer;
  currentCamera: THREE.PerspectiveCamera | null = null;
  get currentScene() {
    return this.scene;
  }
  get currentWrap() {
    return this.editManager.wrap;
  }
  get defaultCamera() {
    return this.editManager.camera;
  }
  constructor() {
    super();
    this.editManager = new EditManager();
    this.materialManager = new MaterialManager();
  }
  setCamera(camera: Camera) {
    this.currentCamera = camera.instance;
  }
  setRender() {
    if (this.currentCamera) {
      this.renderer = new Renderer({
        scene: this.scene,
        camera: this.currentCamera,
      }); // 初始化渲染器
      if (this.renderer && this.renderer.instance) {
        this.currentWrap?.appendChild(this.renderer.instance.domElement); // 添加渲染器DOM元素到包裹元素
      } else {
        console.warn("setRender error"); // 渲染器设置错误
      }
    } else {
      console.warn("setRender error");
    }
  }
  setScene(sceneConfig: ISceneConfig) {
    // 清空场景中的对象
    this.clearScene();

    this.loadScene(sceneConfig);
  }

  // 清空场景中的对象
  clearScene() {
    this.materialManager.destroy();
  }

  loadScene = (sceneConfig: ISceneConfig) => {
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
  update() {
    if (this.renderer) {
      this.renderer.update();
    }
  }
  resize() {
    if (this.renderer) this.renderer.resize();
  }
  destory() {
    if (this.renderer) {
      this.renderer.destory();
    }
    this.clearScene();
  }
}
