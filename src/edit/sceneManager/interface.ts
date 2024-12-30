import Config from "../utils/config";
import Sizes from "../utils/sizes";

export interface ISceneManagerProps {
    wrap: HTMLElement;
    config: Config;
    sizes: Sizes;
}


export enum SceneObjectType {
    GLTF = 'gltf', // GLTF 模型
    MESH = 'mesh', // 普通 Mesh
    SPRITE = 'sprite', // 精灵
    LIGHT = 'light', // 灯光
    Camera = 'Camera', // 相机
}

export const AllowedValues: SceneObjectType[] = [
    SceneObjectType.GLTF, 
    SceneObjectType.MESH, 
    SceneObjectType.SPRITE, 
    SceneObjectType.LIGHT,
    SceneObjectType.Camera,
];