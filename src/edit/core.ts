import * as THREE from "three"; // 导入Three.js库
import { EventEmitter } from "eventemitter3"; // 导入事件发射器
import SceneManager from "./sceneManager"; // 导入场景管理器
import Time from "./time"; // 导入时间管理器
import Camera from "./camera"; // 导入相机
import Config from "./config"; // 导入配置管理器
import Renderer from "./renderer"; // 导入渲染器
import Sizes from "./sizes"; // 导入尺寸管理器

export default class EditManager extends EventEmitter {
  static instance: EditManager; // 单例实例
  wrap: HTMLElement | null = null; // 包裹元素
  sceneManager?: SceneManager; // 场景管理器
  time: Time | null = null; // 时间管理器
  camera: Camera | null = null; // 相机
  config: Config | null = null; // 配置管理器
  sizes: Sizes | null = null; // 尺寸管理器
  renderer: Renderer | null = null; // 渲染器
  scene: THREE.Scene = new THREE.Scene(); // Three.js场景
  renderStamp?: number; // 渲染时间戳

  constructor(wrap: HTMLElement | null = null) {
    super(); // 调用父类构造函数
    if (EditManager.instance) {
      return EditManager.instance; // 确保单例模式
    }
    EditManager.instance = this; // 设置实例
    this.wrap = wrap; // 设置包裹元素
    if (!this.wrap) {
      console.warn("Missing wrap"); // 警告缺少包裹元素
      return;
    }
    this.config = new Config(wrap!); // 初始化配置管理器
    this.sizes = new Sizes(); // 初始化尺寸管理器
    this.time = new Time(); // 初始化时间管理器
    this.camera = new Camera(); // 创建相机
    this.setRender(); // 设置渲染器

    // TEST 创建立方体并添加到场景中
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene?.add(cube);

    // 监听窗口尺寸变化
    this.sizes.on("resize", () => {
      this.resize(); // 调整尺寸
    });

    this.render(); // 开始渲染
  }

  setRender() {
    this.renderer = new Renderer(); // 初始化渲染器
    if (this.renderer && this.renderer.instance) {
      this.wrap?.appendChild(this.renderer.instance.domElement); // 添加渲染器DOM元素到包裹元素
    } else {
      console.log("setRender error"); // 渲染器设置错误
    }
  }

  render() {
    if (this.renderer) this.renderer.update(); // 更新渲染器

    this.renderStamp = window.requestAnimationFrame(() => this.render()); // 循环渲染
  }

  resize() {
    if (this.config) this.config.resize(); // 调整配置
    if (this.renderer) this.renderer.resize(); // 调整渲染器
    if (this.camera) this.camera.resize(); // 调整相机
  }

  destroy() {
    if (this.renderer) this.renderer.destory(); // 销毁渲染器
    if (this.renderStamp) window.cancelAnimationFrame(this.renderStamp); // 取消动画帧
  }
}
