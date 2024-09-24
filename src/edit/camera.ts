import * as THREE from "three";
import EditManager from "./core";
import Sizes from "./sizes";
import Config from "./config";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
export default class Camera {
  editManager: EditManager;
  instance: THREE.PerspectiveCamera | null = null;
  sizes: Sizes | null;
  scene: THREE.Scene | null;
  wrap: HTMLElement | null;
  control: OrbitControls | null = null;
  config: Config | null;
  constructor() {
    this.editManager = new EditManager();
    this.wrap = this.editManager.wrap;
    this.scene = this.editManager.scene;
    this.config = this.editManager.config;
    this.sizes = this.editManager.sizes;

    this.setInstance();
    this.setOrbitControl();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      60,
      this.sizes?.width! / this.sizes?.height!,
      0.1,
      1500
    );
    this.instance.position.set(0, 5, 5);
    if (this.scene) {
      this.scene.add(this.instance);
    }
  }
  setOrbitControl() {
    this.control = new OrbitControls(this.instance!, this.wrap);
    this.control.update();
  }

  resize() {
    if (this.instance && this.config) {
      this.instance.aspect = this.config.width! / this.config.height!;
      this.instance.updateMatrixWorld();
    }
  }

  update() {
    this.control?.update();
  }
}
