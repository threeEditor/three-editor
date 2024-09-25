import { ISceneConfig } from "@/sceneConfig/config";
import { Scene, Object3D, Raycaster, Vector2, DirectionalLight, AmbientLight } from "three";
import MaterialManager from "./materialManager";
import { loadGLTF } from "./utils/loader";
import { EventEmitter } from "eventemitter3";
import { SceneManagerEvent } from "./event";
import Renderer from "./renderer";
import CameraManager from "./cameraManager";
import Config from "./utils/config";
import Sizes from "./utils/sizes";
interface IPropsType {
  wrap: HTMLElement;
  config: Config;
  sizes: Sizes;
}

export default class SceneManager extends EventEmitter {
  public materialManager: MaterialManager;
  public scene: Scene = new Scene();
  public cameraManager!: CameraManager;
  public renderer!: Renderer;
  private sizes: Sizes;
  private config: Config;
  private wrap: HTMLElement;
  private selectedObject: Object3D | null = null;
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
    this.renderer = new Renderer({
      scene: this.scene,
      config: this.config,
    }); 

    this.cameraManager = new CameraManager({
      scene: this.scene,
      config: this.config,
      wrap: this.wrap,
      sizes: this.sizes,
      renderer: this.renderer.instance,
    });
    this.cameraManager.setPosition(20, 20, 20);

    // 初始化渲染器

    this.wrap.appendChild(this.renderer.instance.domElement); // 添加渲染器DOM元素到包裹元素
    this.wrap.addEventListener('click', this.onSelect);
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
    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 0);
    this.scene.add(directionalLight);

    const ambientLight = new AmbientLight(0xffffff, 0.5);
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

  onSelect = (event: MouseEvent) => {
    const mouse = new Vector2();
    mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;
    const raycaster = new Raycaster();
    raycaster.setFromCamera(mouse, this.cameraManager.instance);
    const intersects = raycaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) { // 处理相交的物体
      const intersectedObject = intersects[0].object;
      if(this.selectedObject === intersectedObject) {
        this.cameraManager.setOutline([])
        this.selectedObject = null;
      } else {
        this.cameraManager.setOutline([intersectedObject])
        this.selectedObject = intersectedObject;
      }
    } else {
      this.selectedObject = null;
      this.cameraManager.setOutline([])
    }
  }

  update() {
    if(this.cameraManager.outlinePassEnable) {
      this.cameraManager.update();
    } else {
      this.renderer.update(this.cameraManager.instance);
    }
  }

  resize() {
    this.renderer.resize();
    this.cameraManager.resize();
  }

  destory() {
    this.renderer.destory();
    this.clearScene();
  }
}
