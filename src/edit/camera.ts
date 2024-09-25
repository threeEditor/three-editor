import * as THREE from "three";
import EditManager from "./core";
import Sizes from "./utils/sizes";
import Config from "./utils/config";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
interface ICamera {
  scene: THREE.Scene;
}
export default class Camera {
  editManager: EditManager;
  instance: THREE.PerspectiveCamera;
  sizes: Sizes | null;
  scene: THREE.Scene | null;
  wrap: HTMLElement | null;
  control: OrbitControls | null = null;
  config: Config | null;
  constructor(
    _options: ICamera = {
      scene: new THREE.Scene(),
    }
  ) {
    this.scene = _options.scene;

    this.editManager = new EditManager();
    this.wrap = this.editManager.wrap;
    this.config = this.editManager.config;
    this.sizes = this.editManager.sizes;
    this.instance = new THREE.PerspectiveCamera(
      60,
      this.sizes?.width! / this.sizes?.height!,
      0.1,
      1500
    );
    this.instance.position.set(20, 20, 20);
    if (this.scene) {
      this.scene.add(this.instance);
    }

    this.control = new OrbitControls(this.instance!, this.wrap);
    this.control.update();
  }

  resize() {
    if (this.instance && this.config) {
      this.instance.aspect = this.config.width! / this.config.height!;
      this.instance.updateProjectionMatrix();
    }
  }

  update() {
    this.control?.update();
  }
}
