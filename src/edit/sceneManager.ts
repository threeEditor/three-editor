import { ISceneConfig } from "@/sceneConfig/config";
import {
  Scene,
  DirectionalLight,
  AmbientLight,
} from "three";
import MaterialManager from "./materialManager";
import { loadGLTF } from "./utils/loader";
import Renderer from "./renderer";
import CameraManager from "./cameraManager";
import Config from "./utils/config";
import Sizes from "./utils/sizes";
import Grid from "./grid";
import { Selector } from "./selector";
interface IPropsType {
  wrap: HTMLElement;
  config: Config;
  sizes: Sizes;
}

export default class SceneManager {
  static materialManager: MaterialManager = new MaterialManager();
  static scene: Scene = new Scene();
  static cameraManager: CameraManager;
  static renderer: Renderer;
  static grid: Grid | null = null;
  static sizes: Sizes;
  static config: Config;
  static wrap: HTMLElement;
  private static selector = new Selector();
  private static inited = false;

  static init(options: IPropsType) {
    const { sizes, config, wrap } = options;
    SceneManager.config = config;
    SceneManager.wrap = wrap;
    SceneManager.sizes = sizes;

    // 初始化网格系统
    SceneManager.grid = new Grid({
      size: 200,
      divisions: 50,
    });

    // 初始化渲染器
    SceneManager.renderer = new Renderer();
    SceneManager.wrap.appendChild(SceneManager.renderer.instance.domElement); // 添加渲染器DOM元素到包裹元素

    // 初始化场景相机
    SceneManager.cameraManager = new CameraManager();
    SceneManager.cameraManager.setPosition(20, 20, 20);

    // 绑定场景事件
    SceneManager.wrap.addEventListener("click", SceneManager.selector.onSelect);

    SceneManager.inited = true;
  }

  static setScene(sceneConfig: ISceneConfig) {
    // 清空场景中的对象
    SceneManager.clearScene();
    SceneManager.loadScene(sceneConfig);

    // SceneManagerEvent.SCENELOAD
  }

  // 清空场景中的对象
  static clearScene() {
    SceneManager.materialManager.destroy();
  }

  static loadScene(sceneConfig: ISceneConfig) {
    console.log('sceneConfig', sceneConfig)
    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 0);
    SceneManager.scene.add(directionalLight);

    const ambientLight = new AmbientLight(0xffffff, 0.5);
    SceneManager.scene.add(ambientLight);
  }

  static add(option: any) {
    switch (option.type) {
      case "model":
        SceneManager.addModel(option.model, option.callback);
        break;
      case "mesh":
        SceneManager.scene.add(option.object);
        break;
      default:
        console.warn("暂不支持该类型");
    }
  }

  static addModel(modelInfo: any, callback?: (result: any) => void) {
    switch (modelInfo.type) {
      case "gltf":
        loadGLTF(modelInfo.url, (result) => {
          const { success, gltf } = result;
          if (success && gltf) {
            const model = gltf.scene;
            callback && callback(model);
            SceneManager.scene.add(gltf.scene);
          }
        });
        break;
      default:
        console.warn("暂不支持该模型类型");
        break;
    }
  }

  static update() {
    if(!SceneManager.inited) return;
    if (SceneManager.cameraManager.outlinePassEnable) {
      SceneManager.cameraManager.update();
    } else {
      SceneManager.renderer.update(SceneManager.cameraManager.instance);
    }
  }

  static resize() {
    if(!SceneManager.inited) return;
    SceneManager.renderer.resize();
    SceneManager.cameraManager.resize();
  }

  static destory() {
    if(!SceneManager.inited) return;
    SceneManager.renderer.destory();
    SceneManager.clearScene();
    SceneManager.grid?.destory();
  }
}
