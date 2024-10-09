import { ISceneConfig } from "@/sceneConfig/config";
import {
  Scene,
  DirectionalLight,
  AmbientLight,
  AnimationMixer,
} from "three";
import MaterialManager from "../materialManager";
import Renderer from "../renderer";
import CameraManager from "../cameraManager";
import Config from "../utils/config";
import Sizes from "../utils/sizes";
import Grid from "../grid";
import { Selector } from "../selector";
import { LoaderManager } from "../loader";
import { AllowedValues, ISceneObject, SceneObjectType } from "./interface";
import { cacheTreeNodes, SceneCache } from "./sceneCache";
import { removeAllChild } from "../utils/dispose";
import { EventSystem } from "@/utils/event/EventSystem";
interface IPropsType {
  wrap: HTMLElement;
  config: Config;
  sizes: Sizes;
}

export default class SceneManager {
  static scene: Scene = new Scene();
  static renderer: Renderer;
  static sizes: Sizes;
  static config: Config;
  static wrap: HTMLElement;
  static loader = new LoaderManager();
  static cameraManager: CameraManager;
  static cache = new SceneCache();
  static selector = new Selector();
  static _modelAnimationMixer: AnimationMixer[] = [];
  private static materialManager: MaterialManager = new MaterialManager();
  private static grid: Grid | null = null;
  private static inited = false;

  static init(options: IPropsType) {
    const { sizes, config, wrap } = options;
    SceneManager.config = config;
    SceneManager.wrap = wrap;
    SceneManager.sizes = sizes;

    // 初始化网格系统
    SceneManager.grid = new Grid();

    // 初始化渲染器
    SceneManager.renderer = new Renderer();
    SceneManager.wrap.appendChild(SceneManager.renderer.instance.domElement); // 添加渲染器DOM元素到包裹元素

    // 初始化场景相机
    SceneManager.cameraManager = new CameraManager();
    SceneManager.cameraManager.setPosition(20, 20, 20);

    // 绑定场景事件
    SceneManager.wrap.addEventListener("click", SceneManager.selector.onSelect);
    EventSystem.subscribe('TreeSelectNode', (keys: string[]) => {
      const uuid = keys[0];
      SceneManager.selector.emitTreeSelect(uuid);
    })
    SceneManager.inited = true;
  }

  static setScene(sceneConfig: ISceneConfig) {
    // 清空场景中的对象
    SceneManager.loadScene(sceneConfig);
    // SceneManagerEvent.SCENELOAD
  }

  static loadScene(sceneConfig: ISceneConfig) {
    console.log('sceneConfig12', sceneConfig)
    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 0);
    SceneManager.scene.add(directionalLight);

    const ambientLight = new AmbientLight(0xffffff, 0.5);
    SceneManager.scene.add(ambientLight);
  }

  static add(sceneObject: ISceneObject) {
    const { type, object } = sceneObject;
    if(!AllowedValues.includes(type as SceneObjectType)) {
      console.warn(`暂不支持添加该类型: ${type}`);
      return;
    }
    if(!object) {
      console.warn(`添加对象缺失，请检查：`, sceneObject);
      return;
    }
    const { node } = object;
    SceneManager.scene.add(node);
    SceneManager.cache.add(node.uuid, node, type as SceneObjectType);
    cacheTreeNodes.push({      
      key: node.uuid, 
      title: sceneObject.name || object.name,
    })
    EventSystem.broadcast('SetTreeNodes', cacheTreeNodes)
  }

  static remove(sceneObject: ISceneObject) {
    const { object } = sceneObject;
    if(!SceneManager.cache.include(object.node.uuid)) {
      return false;
    } else {
      SceneManager.scene.remove(object.node);
      SceneManager.cache.remove(object.node.uuid);
      return true;
    }
  }

  static update() {
    if(!SceneManager.inited) return;
    if (SceneManager.cameraManager.outlinePassEnable) {
      SceneManager.cameraManager.update();
    } else {
      SceneManager.renderer.update(SceneManager.cameraManager.instance);
    }
    SceneManager._modelAnimationMixer.forEach(mixer => {
      mixer.update(0.01);
    })
    // console.log('6')
  }

  static resize() {
    if(!SceneManager.inited) return;
    SceneManager.renderer.resize();
    SceneManager.cameraManager.resize();
  }

  static destory() {
    console.log('SceneManager not inited!')
    if(!SceneManager.inited) return;
    const scene = SceneManager.scene;
    if(!scene) return;
    SceneManager.materialManager.destroy();
    removeAllChild(scene);
    
    SceneManager.renderer.destory();
    // SceneManager.grid?.destory();
    console.log('SceneManager destroy!')
  }
}
