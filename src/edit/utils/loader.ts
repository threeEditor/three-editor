import * as THREE from "three";
import { GLTFLoader, GLTF } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

let gltfLoader: null | GLTFLoader = null;
let dracoLoader: null | DRACOLoader = null;

export interface ILoadResult {
  success: boolean;
  gltf?: GLTF;
  error?: any;
  texture?: THREE.Texture;
}

export function loadGLTF(url: string, callback: (result: ILoadResult) => void) {
  if (!gltfLoader) {
    gltfLoader = new GLTFLoader();
    //Set DracoLoader
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("draco/");
    dracoLoader.setDecoderConfig({ type: "js" });
    gltfLoader.setDRACOLoader(dracoLoader);
  }
  try {
    gltfLoader.load(url, (gltf) =>
      callback({
        success: true,
        gltf: gltf,
      })
    );
  } catch (error) {
    callback({
      success: false,
    });
  }
}
