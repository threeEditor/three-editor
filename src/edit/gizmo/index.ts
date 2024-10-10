import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { Camera, Scene, Renderer } from 'three';
import SceneManager from '../sceneManager/sceneManager';
import { BaseObject } from '../objects/baseObject';
class GizmoManager {
  private controls: TransformControls;
  public draggedDelay: boolean = false;
  private scene: Scene;
  private camera: Camera;
  private renderer: Renderer;
  private selectedObject: BaseObject | null = null;
  constructor() {
    this.scene = SceneManager.scene;
    this.camera = SceneManager.cameraManager.instance;
    this.renderer = SceneManager.renderer.instance;

    // 初始化 TransformControls
    this.controls = new TransformControls(
      this.camera,
      this.renderer.domElement
    );
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

  // // 当开始/停止拖拽时，控制相机
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
  }
  // 键盘切换操作模式 (平移、旋转、缩放)
  private initKeyboardControls() {
    document.addEventListener('keydown', (event) => {
      if (!this.selectedObject) return;
      switch (event.key) {
        case 'g': // Translate mode
          this.controls.setMode('translate');
          break;
        case 'r': // Rotate mode
          this.controls.setMode('rotate');
          break;
        case 's': // Scale mode
          this.controls.setMode('scale');
          break;
      }
    });
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
