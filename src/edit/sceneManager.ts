import { ISceneConfig } from "@/sceneConfig/config";
import {
  Scene,
  Object3D,
  Raycaster,
  Vector2,
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
interface IPropsType {
  wrap: HTMLElement;
  config: Config;
  sizes: Sizes;
}

export default class SceneManager {
  static materialManager: MaterialManager;
  static scene: Scene = new Scene();
  static cameraManager: CameraManager;
  static renderer: Renderer;
  static grid: Grid | null = null;
  static sizes: Sizes;
  static config: Config;
  static wrap: HTMLElement;
  static selectedObject: Object3D | null = null;

  private static inited = false;

  static init(options: IPropsType) {
    const { sizes, config, wrap } = options;
    SceneManager.config = config;
    SceneManager.wrap = wrap;
    SceneManager.sizes = sizes;
    SceneManager.materialManager = new MaterialManager();
    SceneManager.grid = new Grid({
      size: 200,
      divisions: 50,
      scene: SceneManager.scene,
    });

    SceneManager.renderer = new Renderer({
      scene: SceneManager.scene,
      config: SceneManager.config,
    });

    SceneManager.cameraManager = new CameraManager({
      scene: SceneManager.scene,
      config: SceneManager.config,
      wrap: SceneManager.wrap,
      sizes: SceneManager.sizes,
      renderer: SceneManager.renderer.instance,
    });
    SceneManager.cameraManager.setPosition(20, 20, 20);

    // 初始化渲染器

    SceneManager.wrap.appendChild(SceneManager.renderer.instance.domElement); // 添加渲染器DOM元素到包裹元素
    SceneManager.wrap.addEventListener("click", SceneManager.onSelect);

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

  static onSelect = (event: MouseEvent) => {
    const mouse = new Vector2();
    mouse.x = (event.clientX / SceneManager.sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / SceneManager.sizes.height) * 2 + 1;
    const raycaster = new Raycaster();
    raycaster.setFromCamera(mouse, SceneManager.cameraManager.instance);
    const intersects = raycaster.intersectObjects(SceneManager.scene.children);

    if (intersects.length > 0) {
      // 处理相交的物体
      const intersectedObject = intersects[0].object;
      if (SceneManager.selectedObject === intersectedObject) {
        SceneManager.cameraManager.setOutline([]);
        SceneManager.selectedObject = null;
      } else {
        SceneManager.cameraManager.setOutline([intersectedObject]);
        SceneManager.selectedObject = intersectedObject;
      }
    } else {
      SceneManager.selectedObject = null;
      SceneManager.cameraManager.setOutline([]);
    }
  };

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
