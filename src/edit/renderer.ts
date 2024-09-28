import * as THREE from "three";
import Config from "./utils/config";
import SceneManager from "./sceneManager/sceneManager";
export default class Renderer {
  public instance!: THREE.WebGLRenderer;
  private scene: THREE.Scene | null = null;
  private config: Config;
  private context: WebGLRenderingContext | WebGL2RenderingContext | null = null;

  constructor() {
    this.scene = SceneManager.scene;
    this.config = SceneManager.config;
    this.setInstance();
  }
  
  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.instance.domElement.style.position = "absolute";
    this.instance.domElement.style.top = "0";
    this.instance.domElement.style.left = "0";
    this.instance.domElement.style.width = "100%";
    this.instance.domElement.style.height = "100%";
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

  update(camera: THREE.Camera) {
    if (this.scene) {
      this.instance?.render(this.scene, camera);
    }
    
  }

  destory() {
    if(!this.instance) return;
    this.instance.renderLists.dispose();
    this.instance.dispose();
    this.instance.domElement.parentNode?.removeChild(this.instance.domElement);
  }
}
