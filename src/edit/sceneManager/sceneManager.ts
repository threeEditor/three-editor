import { ISceneConfig } from '@/sceneConfig/config';
import {
  Scene,
  AnimationMixer,
} from 'three';
import MaterialManager from '../material/materialManager';
import Renderer from '../renderer';
import CameraManager from '../cameraManager';
import Sizes from '../utils/sizes';
import Grid from '../grid';
import { Selector } from '../selector';
import { LoaderManager } from '../loader';
import { AllowedValues, ISceneManagerProps, SceneObjectType } from './interface';
import { cacheTreeNodes, SceneCache } from './sceneCache';
import { removeAllChild } from '../utils/dispose';
import { EventSystem } from '@/utils/event/EventSystem';
import GizmoManager from '../gizmo';
import { BaseObject } from '../objects/baseObject';
import { DisplayEvents, SceneSelectorEvents, SceneType } from '@/common/constant';
import { Sky } from '../sky';
import assets from '@/assets/assets';
import Resources from '../resources';
import { PrimitiveCamera } from '../objects/primitiveCamera';
import { SceneLoader } from './sceneLoader';
import { SceneEditor } from './sceneEditor';
import { SceneRuntime } from './sceneRuntime';

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
  static resources: Resources;
  static sky = new Sky();
  static grid: Grid | null = null;

  private static materialManager: MaterialManager = new MaterialManager();
  private static inited = false;
  private static _children: BaseObject[] = [];
  private static _sceneType = SceneType.Edit;
  

  static get info() {
    return {
      color: SceneManager.scene.background,
    };
  }

  static async init(options: ISceneManagerProps) {
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
    SceneManager.cameraManager.setPosition(0, 10, 30);

    // 初始化资源
    SceneManager.resources = new Resources();
    // 加载资源
    SceneManager.resources.loadAssets(assets);

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
    SceneManager.selector.on(
      SceneSelectorEvents.Select,
      (object: BaseObject) => {
        // TODO GizmoManager 选中对象需要判断场景的编辑状态
        SceneManager.GizmoManager.attachObject(object);
        EventSystem.broadcast(DisplayEvents.SelectTreeNode, [object.uuid]);
      }
    );
    // 在场景中取消选中对象
    SceneManager.selector.on(SceneSelectorEvents.UnSelect, () => {
      SceneManager.GizmoManager.detachObject();
      EventSystem.broadcast(DisplayEvents.SelectTreeNode, []);
    });
    SceneManager.inited = true;
  }

  static setScene(sceneConfig: ISceneConfig) {
    // 清空场景中的对象
    SceneLoader.loadScene(sceneConfig);
    // SceneManagerEvent.SCENELOAD
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
    SceneManager.updateConfig();

    const { node } = object;
    SceneManager.scene.add(node);
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
    const childInfos: any[] = [];
    const cameraInfos: any[] = [];
    SceneManager._children.forEach((child) => {
      // const { children } = child;
      // config.push(child.info);
      switch(child.type) {
        case SceneObjectType.Camera:
          cameraInfos.push(child.info);
          break;
        case SceneObjectType.LIGHT:
        default:
          childInfos.push(child.info);
      }
    });
    SceneManager.config = {
      sceneInfo: SceneManager.info,
      cameraInfos,
      childInfos,
    };
  }

  // 切换场景类型 编辑模式/预览模式
  static switchSceneMode(type: SceneType) {
    if(SceneManager._sceneType === type) return;
    SceneManager._sceneType = type;
    if(type === SceneType.Edit) {
      SceneEditor.triggerIn();
      SceneRuntime.triggerOff();
    } else {
      SceneEditor.triggerOff();
      SceneRuntime.triggerIn();
    }
  }

  static remove(object: BaseObject) {
    SceneManager._children = SceneManager._children.filter(
      (child) => child.uuid !== object.uuid
    );
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
    if(SceneManager._sceneType === SceneType.Edit) {
      SceneEditor.update();
    } else {
      SceneRuntime.update();
    }
    // model 动画 update
    SceneManager._modelAnimationMixer.forEach((mixer) => {
      mixer.update(0.01);
    });
  }

  static resize() {
    if (!SceneManager.inited) return;
    SceneManager.renderer.resize();
    SceneManager.cameraManager.resize();
    SceneRuntime.runtimeCamera?.resize();
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
