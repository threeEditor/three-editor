import { Scene, PerspectiveCamera, Vector2, WebGLRenderer, Object3D } from "three";
import Sizes from "./utils/sizes";
import Config from "./utils/config";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import SceneManager from "./sceneManager/sceneManager";
import ViewHelper from "./viewHelper";

export default class CameraManager {
  public instance!: PerspectiveCamera;
  public outlinePassEnable = true;
  private control: OrbitControls | null = null;
  private config: Config;
  private wrap: HTMLElement;
  private sizes: Sizes;
  private scene: Scene;
  private renderer: WebGLRenderer;
  private renderPass!: RenderPass;
  private composer!: EffectComposer;
  private outlinePass!: OutlinePass;
  private viewrHelper: ViewHelper;
  constructor() {
    this.config = SceneManager.config;
    this.wrap = SceneManager.wrap;
    this.sizes = SceneManager.sizes;
    this.scene = SceneManager.scene;
    this.renderer = SceneManager.renderer.instance;
    this.init();
  }

  setPosition(x: number, y: number, z: number) {
    this.instance.position.set(x, y, z);
  }

  init() {
    const { sizes, scene, renderer, wrap } = this;
    const camera = new PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 1500);
    scene.add(camera);

    
    this.control = new OrbitControls(camera, wrap);
    this.control.update();
    
    this.viewrHelper = new ViewHelper(camera);
    // 处理后处理 gammer 导致的变暗问题
    // https://blog.csdn.net/qq_23447231/article/details/117995349
    const composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    this.renderPass = renderPass;
    composer.addPass(renderPass);

    const gammaCorrectionShader = new ShaderPass(GammaCorrectionShader);
    composer.addPass(gammaCorrectionShader);

    const outlinePass = new OutlinePass(new Vector2(sizes.width, sizes.height), scene, camera);
    outlinePass.visibleEdgeColor.set(0xff0000); // 设置轮廓颜色为红色
    outlinePass.hiddenEdgeColor.set(0x000000); // 设置隐藏边缘颜色为黑色
    outlinePass.edgeStrength = 5; // 设置轮廓强度
    outlinePass.edgeGlow = 0; // 设置轮廓发光强度
    composer.addPass(outlinePass);
    this.composer = composer;
    this.outlinePass = outlinePass;
    this.instance = camera;
  }

  setOutline(objects: Object3D[]) {
    this.outlinePass.selectedObjects = objects;
  }
  // 设置是否开启OrbitControls
  setControlEnable(enable: boolean) {
    if (this.control) {
      this.control.enabled = enable;
    }
  }

  resize() {
    if (this.instance && this.config) {
      this.instance.aspect = this.config.width! / this.config.height!;
      this.instance.updateProjectionMatrix();
    }
  }

  setEnabled(enable: boolean) {
    this.setControlEnable(enable);
  }

  update() {
    this.control?.update();
    this.composer.render();

    if(this.viewrHelper){
      this.viewrHelper.update();
    }
  }
}
