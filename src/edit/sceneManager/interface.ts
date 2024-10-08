import { BaseObject } from "../objects/baseObject";


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
    name?: string;
    type: string;
    object: BaseObject;
}