import * as THREE from "three";
import EditManager from "./core";
import Config from "./utils/config";
interface IRendererPropsType {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  config: Config;
}
export default class Renderer {
  editManager: EditManager;
  instance: THREE.WebGLRenderer | null = null;
  clearColor: string = "#010101";
  context: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  scene: THREE.Scene | null = null;
  camera: THREE.PerspectiveCamera;
  config: Config;

  constructor(_options: IRendererPropsType) {
    this.editManager = new EditManager();
    this.scene = _options.scene;
    this.camera = _options.camera;
    this.config = _options.config;
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
    if (this.scene && this.camera) {
      this.instance?.render(this.scene, this.camera);
    }
  }

  destory() {
    if(!this.instance) return;
    this.instance.renderLists.dispose();
    this.instance.dispose();
    this.instance.domElement.parentNode?.removeChild(this.instance.domElement);
  }
}
