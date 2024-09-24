import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

let gltfLoader: null | GLTFLoader = null;

export interface ILoadResult {
    success: boolean;
    gltf?: GLTF;
    error?: any;
}

export function loadGLTF(url: string, callback: (result: ILoadResult) => void) {
    if(!gltfLoader) {
        gltfLoader =  new GLTFLoader();
    }
    try {
        gltfLoader.load(url, gltf => callback({
            success: true,
            gltf: gltf,
        }));
    } catch (error) {
        callback({
            success: false,
        })
    }
}