import { Texture, TextureLoader } from "three";
import { IGLTFLoadResult, loadGLTF } from "./loaderGLTF";
import { GLTF } from "three/examples/jsm/Addons.js";
import { loadTexture } from "./loadTexture";

export enum LoaderResourceType {
    GLTF = 'gltf',
    Texture2D = 'texture2D',
};
const allowedValues: LoaderResourceType[] = [
    LoaderResourceType.GLTF, 
    LoaderResourceType.Texture2D, 
];

export interface ILoaderResource {
    type: LoaderResourceType,
    url: string;
}

export class LoaderManager {
    private textuerLoader: TextureLoader | null = null;

    isLoaderResourceType(value: string) {
        return allowedValues.includes(value as LoaderResourceType);
    }

    async load(resource: ILoaderResource): Promise<GLTF | Texture | null> {
        const { type, url } = resource;
        if(!this.isLoaderResourceType(type)) {
            console.warn(`暂不支持加载该类型: ${type}`);
            return null;
        }
        if(!url) {
            console.warn(`缺少资源地址: ${type}`);
            return null;
        }
        switch(type as LoaderResourceType) {
            case LoaderResourceType.GLTF:
                const { success, gltf = null } =  await loadGLTF(url) as IGLTFLoadResult;
                return success ? gltf : null;
            case LoaderResourceType.Texture2D:
                const texture =  await loadTexture(url);
                return texture;
        }
        return null;
    }
}