import { Object3D } from "three";


export enum SceneObjectType {
    GLTF = 'gltf',
    MESH = 'mesh',
    SPRITE = 'sprite',
    LIGHT = 'light',
};

export const AllowedValues: SceneObjectType[] = [
    SceneObjectType.GLTF, 
    SceneObjectType.MESH, 
    SceneObjectType.SPRITE, 
    SceneObjectType.LIGHT,
];

export interface ISceneObject {
    type: string;
    node: Object3D;
}