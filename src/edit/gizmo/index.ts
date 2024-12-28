import {
  TransformControls,
  TransformControlsMode,
} from 'three/addons/controls/TransformControls.js';
import { Camera, Scene, Renderer } from 'three';
import SceneManager from '../sceneManager/sceneManager';
import { SceneObjectType } from '../sceneManager/interface';
import { BaseObject } from '../objects/baseObject';
import EventEmitter from 'eventemitter3';
import { SceneEvents } from '@/common/constant';
import { throttle } from '../utils/func';
class GizmoManager extends EventEmitter {
  private controls: TransformControls;
  public draggedDelay: boolean = false;
  private scene: Scene;
  private camera: Camera;
  private renderer: Renderer;
  private selectedObject: BaseObject | null = null;
  get mode() {
    return this.controls.mode;
  }
  constructor() {
    super();
    this.scene = SceneManager.scene;
    this.camera = SceneManager.cameraManager.instance;
    this.renderer = SceneManager.renderer.instance;

    // 初始化 TransformControls
    this.controls = new TransformControls(
      this.camera,
      this.renderer.domElement
    );

    this.controls.setSize(0.5);
    this.scene.add(this.controls);

    // 设置事件监听器
    this.initOnDraggingChanged();

    // 设置键盘监听器
    this.initKeyboardControls();
  }

  // 绑定需要操作的对象
  attachObject(object: BaseObject) {
    this.selectedObject = object;
    this.controls.attach(object.node);
  }

  // 从场景中移除 gizmo 控件
  detachObject() {
    this.selectedObject = null;
    this.controls.detach();
    SceneManager.cameraManager.setControlEnable(true);
  }

  // 当开始/停止拖拽时，控制相机
  private initOnDraggingChanged() {
    this.controls.addEventListener('dragging-changed', (event) => {
      SceneManager.cameraManager.setControlEnable(!event.value);
      //拖拽结束时
      if (!event.value) {
        setTimeout(() => {
          this.draggedDelay = false;
        }, 1);
      } else {
        this.draggedDelay = true;
      }
    });

    const throttleEmit = throttle(() => {
      this.emit(SceneEvents.GizmoTransform, this.selectedObject);
    })
    
    this.controls.addEventListener('objectChange', () => {
      if (!this.selectedObject) return;
      if (this.selectedObject.type == SceneObjectType.SPRITE) {
        this.selectedObject?.outline?.userData?.update();
      }
      console.log('objectChange')
      throttleEmit();
    });
  }
  // 键盘切换操作模式 (平移、旋转、缩放)
  private initKeyboardControls() {
    document.addEventListener('keydown', (event) => {
      if (!this.selectedObject) return;
      const currentMode = this.controls.getMode();

      switch (event.key) {
        case 'g': // Translate mode
          if (currentMode != 'translate') {
            this.setControlsMode('translate');
          } else {
            this.toggleSpace();
          }
          break;
        case 'r': // Rotate mode
          if (currentMode != 'rotate') {
            this.setControlsMode('rotate');
          } else {
            this.toggleSpace();
          }
          break;
        case 's': // Scale mode
          if (currentMode != 'scale') {
            this.setControlsMode('scale');
          } else {
            this.toggleSpace();
          }
          break;
      }
    });
  }
  public setControlsMode(mode: TransformControlsMode) {
    if (!this.selectedObject) return;
    this.controls.setMode(mode);
    this.emit(SceneEvents.GizmoModeChange, mode);
  }
  private toggleSpace() {
    if (this.controls.space === 'local') {
      this.controls.setSpace('world');
    } else {
      this.controls.setSpace('local');
    }
  }
  // 销毁 gizmo 控件
  public destory() {
    document.removeEventListener('keydown', this.initKeyboardControls);
    this.controls.removeEventListener(
      'dragging-changed',
      this.initOnDraggingChanged
    );
    SceneManager.scene.remove(this.controls);
  }
}

export default GizmoManager;
