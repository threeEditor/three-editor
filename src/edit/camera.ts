import * as THREE from "three";
import Sizes from "./utils/sizes";
import Config from "./utils/config";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
interface ICamera {
  scene: THREE.Scene;
  wrap: HTMLElement;
  config: Config;
  sizes: Sizes;
}
export default class Camera {
  public instance: THREE.PerspectiveCamera;
  control: OrbitControls | null = null;
  config: Config;
  constructor(_options: ICamera) {
    this.config = _options.config;
    this.instance = new THREE.PerspectiveCamera(
      60,
      _options.sizes?.width! / _options.sizes?.height!,
      0.1,
      1500
    );
    this.instance.position.set(20, 20, 20);
    if (_options.scene) {
      _options.scene.add(this.instance);
    }

    this.control = new OrbitControls(this.instance!, _options.wrap);
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
