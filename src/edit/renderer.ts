import * as THREE from "three";
import EditManager from "./core";
import Config from "./config";
import Camera from "./camera";
export default class Renderer {
  editManager: EditManager;
  instance: THREE.WebGLRenderer | null = null;
  clearColor: string = "#010101";
  context: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  config: Config | null = null;
  scene: THREE.Scene | null;
  camera: Camera | null;
  constructor() {
    this.editManager = new EditManager();
    this.config = this.editManager.config;
    this.scene = this.editManager.scene;
    this.camera = this.editManager.camera;
    this.setInstance();
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
    this.instance.setPixelRatio(this.config!.pixelRatio!);
    this.instance.setSize(this.config!.width!, this.config!.height!);

    //Encode
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
    this.instance.toneMapping = THREE.NoToneMapping;
    this.instance.toneMappingExposure = 1;

    this.context = this.instance.getContext();
  }

  resize() {
    this.instance!.setSize(this.config!.width!, this.config!.height!);
    this.instance?.setPixelRatio(this.config!.pixelRatio!);
  }

  update() {
    this.instance?.render(this.scene!, this.camera?.instance!);
  }

  destory() {
    this.instance?.renderLists.dispose();
    this.instance?.dispose();
  }
}
