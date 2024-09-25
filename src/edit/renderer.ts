import * as THREE from "three";
import EditManager from "./core";
interface IRendererPropsType {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
}
export default class Renderer {
  editManager: EditManager;
  instance: THREE.WebGLRenderer | null = null;
  clearColor: string = "#010101";
  context: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  scene: THREE.Scene | null = null;
  camera: THREE.PerspectiveCamera;

  constructor({ scene, camera }: IRendererPropsType) {
    this.editManager = new EditManager();
    this.scene = scene;
    this.camera = camera;
    this.setInstance();
  }
  get currentConfig() {
    return this.editManager.config;
  }
  setInstance() {
    // this.clearColor = "#010101";
    this.instance = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.instance.domElement.style.position = "absolute";
    this.instance.domElement.style.top = "0";
    this.instance.domElement.style.left = "0";
    this.instance.domElement.style.width = "100%";
    this.instance.domElement.style.height = "100%";
    // this.instance.setClearColor(this.clearColor);
    this.instance.setPixelRatio(this.currentConfig!.pixelRatio!);
    this.instance.setSize(
      this.currentConfig!.width!,
      this.currentConfig!.height!
    );

    //Encode
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
    this.instance.toneMapping = THREE.NoToneMapping;
    this.instance.toneMappingExposure = 1;

    this.context = this.instance.getContext();
  }

  resize() {
    this.instance!.setSize(
      this.currentConfig!.width!,
      this.currentConfig!.height!
    );
    this.instance?.setPixelRatio(this.currentConfig!.pixelRatio!);
  }

  update() {
    if (this.scene && this.camera) {
      this.instance?.render(this.scene, this.camera);
    }
  }

  destory() {
    this.instance?.renderLists.dispose();
    this.instance?.dispose();
  }
}
