import { IGLTFLoadResult, loadGLTF } from "./loaderGLTF";
import { GLTF } from "three/examples/jsm/Addons.js";

export enum LoaderResourceType {
    GLTF = 'gltf',
    SPRITE = 'sprite',
};
const allowedValues: LoaderResourceType[] = [
    LoaderResourceType.GLTF, 
    LoaderResourceType.SPRITE, 
];

export interface ILoaderResource {
    type: LoaderResourceType,
    url: string;
}

export class LoaderManager {
    isLoaderResourceType(value: string) {
        return allowedValues.includes(value as LoaderResourceType);
    }

    async load(resource: ILoaderResource): Promise<GLTF | null> {
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
            case LoaderResourceType.SPRITE:

        }
        return null;
    }
}