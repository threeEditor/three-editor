import * as THREE from "three"; // 导入Three.js库
import { EventEmitter } from "eventemitter3"; // 导入事件发射器
import SceneManager from "./sceneManager"; // 导入场景管理器
import Time from "./utils/time"; // 导入时间管理器
import Camera from "./camera"; // 导入相机
import Config from "./utils/config"; // 导入配置管理器
import Sizes from "./utils/sizes"; // 导入尺寸管理器
import { defaultSceneConfig, ISceneConfig } from "@/sceneConfig/config";

export default class EditManager extends EventEmitter {
  static instance: EditManager; // 单例实例
  wrap: HTMLElement | null = null; // 包裹元素
  sceneManager!: SceneManager; // 场景管理器
  time!: Time; // 时间管理器
  camera!: Camera; // 相机
  config!: Config; // 配置管理器
  sizes!: Sizes; // 尺寸管理器
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

    this.sceneManager = new SceneManager(); // 创建场景管理器

    this.camera = new Camera({
      scene: this.sceneManager.scene,
    });
    this.sceneManager.setCamera(this.camera);
    this.sceneManager.setRender();

    // 监听窗口尺寸变化
    this.sizes.on("resize", () => {
      this.resize(); // 调整尺寸
    });
    this.render();
  }
  get currentScene() {
    return this.sceneManager.scene;
  }
  setUp(sceneConfig: ISceneConfig = defaultSceneConfig) {
    if (this.sceneManager) {
      this.sceneManager.setScene(sceneConfig);
    } else {
      console.warn("Missing sceneManager"); // 警告缺少场景管理器
    }
  }

  render() {
    if (this.camera) this.camera.update();
    if (this.sceneManager) this.sceneManager.update(); // 更新渲染器
    this.renderStamp = window.requestAnimationFrame(() => this.render()); // 循环渲染
  }

  resize() {
    if (this.config) this.config.resize(); // 调整配置
    if (this.sceneManager) this.sceneManager.resize(); // 调整渲染器
    if (this.camera) this.camera.resize(); // 调整相机
  }

  destroy() {
    if (this.sceneManager) this.sceneManager.destory(); // 销毁渲染器
    if (this.renderStamp) window.cancelAnimationFrame(this.renderStamp); // 取消动画帧
  }
}
