import { ISceneConfig } from '@/sceneConfig/config';
import {
  Scene,
  AnimationMixer,
} from 'three';
import MaterialManager from '../materialManager';
import Renderer from '../renderer';
import CameraManager from '../cameraManager';
import Config from '../utils/config';
import Sizes from '../utils/sizes';
import Grid from '../grid';
import { Selector } from '../selector';
import { LoaderManager } from '../loader';
import { AllowedValues, SceneObjectType } from './interface';
import { cacheTreeNodes, SceneCache } from './sceneCache';
import { removeAllChild } from '../utils/dispose';
import { EventSystem } from '@/utils/event/EventSystem';
import GizmoManager from '../gizmo';
import { BaseObject } from '../objects/baseObject';
import { DisplayEvents, SceneSelectorEvents } from '@/common/constant';
import { Sky } from '../sky';
import { PrimitiveLight, PrimitiveLightType } from '../objects/primitiveLight';
interface IPropsType {
  wrap: HTMLElement;
  config: Config;
  sizes: Sizes;
}

export default class SceneManager {
  static scene: Scene = new Scene();
  static renderer: Renderer;
  static sizes: Sizes;
  static config: any;
  static wrap: HTMLElement;
  static loader = new LoaderManager();
  static cameraManager: CameraManager;
  static cache = new SceneCache();
  static selector = new Selector();
  static _modelAnimationMixer: AnimationMixer[] = [];
  static GizmoManager: GizmoManager;
  private static materialManager: MaterialManager = new MaterialManager();
  private static grid: Grid | null = null;
  private static inited = false;
  private static sky = new Sky();
  private static _children: BaseObject[] = []; 
  
  static get info() {
    return {
      color: SceneManager.scene.background,
    }
  }

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

    // 初始化gizmo
    SceneManager.GizmoManager = new GizmoManager();

    // 绑定场景事件
    SceneManager.wrap.addEventListener('click', SceneManager.selector.onSelect);
    // 在 display 面板的 tree 组件中选中对象
    EventSystem.subscribe(DisplayEvents.TreeSelectNode, (keys: string[]) => {
      const uuid = keys[0];
      SceneManager.selector.emitTreeSelect(uuid);
    });

    // 在场景中选中对象
    SceneManager.selector.on(SceneSelectorEvents.Select, (object: BaseObject) => {
      // TODO GizmoManager 选中对象需要判断场景的编辑状态
      SceneManager.GizmoManager.attachObject(object);
      EventSystem.broadcast(DisplayEvents.SelectTreeNode, [object.uuid]);
    });
    // 在场景中取消选中对象
    SceneManager.selector.on(SceneSelectorEvents.UnSelect, () => {
      SceneManager.GizmoManager.detachObject();
      EventSystem.broadcast(DisplayEvents.SelectTreeNode, []);
    });
    SceneManager.inited = true;
  }

  static setScene(sceneConfig: ISceneConfig) {
    // 清空场景中的对象
    SceneManager.loadScene(sceneConfig);
    // SceneManagerEvent.SCENELOAD
  }

  static loadScene(sceneConfig: ISceneConfig) {
    // TODO 后续需要走解析 sceneConfig， 目前没有默认设置
    console.log('sceneConfig12', sceneConfig);

    const directLight = new PrimitiveLight({ color: '#fff', intensity: 1, type: PrimitiveLightType.DirectLight});
    directLight.setPosition(1, 1, 0);

    const ambientLight = new PrimitiveLight({ color: '#fff', intensity: 0.5, type: PrimitiveLightType.AmbientLight });

    SceneManager.add(directLight);
    SceneManager.add(ambientLight);
    EventSystem.broadcast(DisplayEvents.SetTreeNodes, cacheTreeNodes);
  }

  // 在场景的根节点上添加
  static add(object: BaseObject) {
    if (!AllowedValues.includes(object.type as SceneObjectType)) {
      console.warn(`暂不支持添加该类型: ${object.type}`);
      return;
    }
    if (!object) {
      console.warn(`添加对象缺失，请检查：`, object);
      return;
    }
    SceneManager._children.push(object);
    const { node } = object;
    SceneManager.scene.add(node);
    SceneManager.updateConfig();
    SceneManager.cache.add(object.uuid, node, object.type as SceneObjectType);
    cacheTreeNodes.push({
      key: object.uuid,
      title: object.name,
    });
    
    EventSystem.broadcast(DisplayEvents.SetTreeNodes, cacheTreeNodes);
  }

  static get(uuid: string) {
    return SceneManager.cache.get(uuid);
  }

  static updateConfig() {
    // TODO 待完善
    // const config = [];
    const childInfos: any[] = []
    SceneManager._children.forEach(child => {
      // const { children } = child;
      // config.push(child.info);
      childInfos.push(child.info);
      // console.log('child.info', child.info)
    })
    SceneManager.config = {
      sceneInfo: SceneManager.info,
      childInfos,
    }
    // console.log(SceneManager.config)
  }

  static remove(object: BaseObject) {
    SceneManager._children = SceneManager._children.filter(child => child.uuid !== object.uuid);
    if (!SceneManager.cache.include(object.uuid)) {
      return false;
    } else {
      SceneManager.scene.remove(object.node);
      SceneManager.cache.remove(object.uuid);
      return true;
    }
  }

  static update() {
    if (!SceneManager.inited) return;
    if (SceneManager.cameraManager.outlinePassEnable) {
      SceneManager.cameraManager.update();
    } else {
      SceneManager.renderer.update(SceneManager.cameraManager.instance);
    }
    SceneManager._modelAnimationMixer.forEach((mixer) => {
      mixer.update(0.01);
    });
  }

  static resize() {
    if (!SceneManager.inited) return;
    SceneManager.renderer.resize();
    SceneManager.cameraManager.resize();
  }

  static destory() {
    console.log('SceneManager not inited!');
    if (!SceneManager.inited) return;
    const scene = SceneManager.scene;
    if (!scene) return;
    SceneManager.materialManager.destroy();
    removeAllChild(scene);

    SceneManager.renderer.destory();
    // SceneManager.grid?.destory();
    SceneManager.GizmoManager.destory();
    console.log('SceneManager destroy!');
  }
}
