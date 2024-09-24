import * as THREE from "three";
import { EventEmitter } from "eventemitter3";
import SceneManager from "./sceneManager";
import Time from "./time";
import Camera from "./camera";
import Config from "./config";
import Renderer from "./renderer";
import Sizes from "./sizes";
export default class EditManager extends EventEmitter {
  static instance: EditManager;
  wrap: HTMLElement | null = null;
  sceneManager?: SceneManager;
  time: Time | null = null;
  camera: Camera | null = null;
  config: Config | null = null;
  sizes: Sizes | null = null;
  renderer: Renderer | null = null;
  scene: THREE.Scene | null = null;
  renderStamp?: number;
  constructor(wrap: HTMLElement | null = null) {
    super();
    if (EditManager.instance) {
      return EditManager.instance;
    }
    EditManager.instance = this;
    this.wrap = wrap;
    if (!this.wrap) {
      console.warn("Missing wrap");
      return;
    }
    this.config = new Config(wrap!);
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.setRender();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene?.add(cube);
    this.sizes.on("resize", () => {
      this.resize();
    });
    this.render();
  }
  setRender() {
    this.renderer = new Renderer();
    if (this.renderer && this.renderer.instance) {
      this.wrap?.appendChild(this.renderer.instance.domElement);
    } else {
      console.log("setRender error");
    }
  }
  render() {
    if (this.renderer) this.renderer.update();

    this.renderStamp = window.requestAnimationFrame(() => this.render());
  }
  resize() {
    if (this.config) this.config.resize();
    if (this.renderer) this.renderer.resize();
    if (this.camera) this.camera.resize();
  }
  destroy() {
    if (this.renderer) this.renderer.destory();
    if (this.renderStamp) window.cancelAnimationFrame(this.renderStamp);
  }
}
