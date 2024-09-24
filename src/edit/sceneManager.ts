import { ISceneConfig } from "@/sceneConfig/config";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import MaterialManager from "./materialManager";
import { loadGLTF } from "./loader";
import { EventEmitter } from "eventemitter3";
import { SceneManagerEvent } from "./event";
import EditManager from "./core";

export default class SceneManager extends EventEmitter {
  public materialManager: MaterialManager;
  public scene: THREE.Scene;
  editManager: EditManager;
  get currentScene() {
    return this.scene;
  }

  constructor() {
    super();
    this.editManager = new EditManager();
    this.scene = this.editManager.scene;
    this.materialManager = new MaterialManager();
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

  destroy() {
    this.clearScene();
  }
}
