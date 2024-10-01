import { GLTFLoader, GLTF } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { AnimationMixer } from "three";

let gltfLoader: null | GLTFLoader = null;
let dracoLoader: null | DRACOLoader = null;

export interface IGLTFLoadResult {
  success: boolean;
  gltf?: GLTF;
  error?: Error;
}

export function loadGLTF(url: string) {
  return new Promise((resolve, reject) => {
    if (!gltfLoader) {
      gltfLoader = new GLTFLoader();
      //Set DracoLoader
      dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("draco/");
      dracoLoader.setDecoderConfig({ type: "js" });
      gltfLoader.setDRACOLoader(dracoLoader);
    }
    try {
      gltfLoader.load(url, (gltf) => {
        resolve({
          success: true,
          gltf,
        })
      }
        
      );
    } catch (error) {
      reject({
        success: false,
        error: error as Error,
      });
    }
  })
}
