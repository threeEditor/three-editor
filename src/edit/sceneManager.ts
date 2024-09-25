import { ISceneConfig } from "@/sceneConfig/config";
import * as THREE from "three";

import MaterialManager from "./materialManager";
import { loadGLTF } from "./utils/loader";
import { EventEmitter } from "eventemitter3";
import { SceneManagerEvent } from "./event";
import Renderer from "./renderer";
import Camera from "./camera";
import Config from "./utils/config";
import Sizes from "./utils/sizes";
interface IPropsType {
  wrap: HTMLElement;
  config: Config;
  sizes: Sizes;
}

export default class SceneManager extends EventEmitter {
  public materialManager: MaterialManager;
  public scene: THREE.Scene = new THREE.Scene();
  public cameraManager!: Camera;
  public renderer!: Renderer;
  private sizes: Sizes;
  private config: Config;
  private wrap: HTMLElement;
  get currentScene() {
    return this.scene;
  }
  constructor(options: IPropsType) {
    super();
    const { sizes, config, wrap } = options;
    this.config = config;
    this.wrap = wrap;
    this.sizes = sizes;
    this.materialManager = new MaterialManager();
    this.init();
  }

  init() {
    this.cameraManager = new Camera({
      scene: this.scene,
      config: this.config,
      wrap: this.wrap,
      sizes: this.sizes,
    });

    this.renderer = new Renderer({
      scene: this.scene,
      cameraManager: this.cameraManager,
      config: this.config,
    }); // 初始化渲染器

    this.wrap.appendChild(this.renderer.instance.domElement); // 添加渲染器DOM元素到包裹元素
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

  loadScene(sceneConfig: ISceneConfig) {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 0);
    this.scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    this.emit(SceneManagerEvent.SCENELOAD, { sceneConfig });
  };

  add(option: any) {
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
    this.renderer.update();
  }

  resize() {
    this.renderer.resize();
  }

  destory() {
    this.renderer.destory();
    this.clearScene();
  }
}
