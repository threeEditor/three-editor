import SceneManager from "./sceneManager/sceneManager"; // 导入场景管理器
import Time from "./utils/time"; // 导入时间管理器
import Config from "./utils/config"; // 导入配置管理器
import Sizes from "./utils/sizes"; // 导入尺寸管理器
import { defaultSceneConfig, ISceneConfig } from "@/sceneConfig/config";

export default class EditManager {
  private wrap: HTMLElement | null = null; // 包裹元素
  private time!: Time; // 时间管理器
  private config!: Config; // 配置管理器
  private sizes!: Sizes; // 尺寸管理器
  private renderStamp?: number; // 渲染时间戳

  constructor(wrap: HTMLElement | null = null) {
    this.wrap = wrap; // 设置包裹元素
    if (!this.wrap) {
      console.warn("Missing wrap"); // 警告缺少包裹元素
      return;
    }
    this.config = new Config(wrap!); // 初始化配置管理器
    this.sizes = new Sizes(wrap as HTMLDivElement); // 初始化尺寸管理器
    this.time = new Time(); // 初始化时间管理器

    SceneManager.init({ // 初始化场景管理器
      wrap: this.wrap,
      config: this.config,
      sizes: this.sizes,
    })
    

    // 监听窗口尺寸变化
    this.sizes.on("resize", () => {
      this.resize(); // 调整尺寸
    });
    this.render();
  }

  setUp(sceneConfig: ISceneConfig = defaultSceneConfig) {
    SceneManager.setScene(sceneConfig);
  }

  render() {
    SceneManager.update(); // 更新渲染器
    this.renderStamp = requestAnimationFrame(() => this.render()); // 循环渲染
  }

  resize() {
    if (this.config) this.config.resize(); // 调整配置
    SceneManager.resize(); // 调整渲染器
    
  }

  destroy() {
    SceneManager.destory(); // 销毁渲染器
    if (this.renderStamp) cancelAnimationFrame(this.renderStamp); // 取消动画帧
  }
}
