import { PrimitiveMeshType } from "@/edit/objects";


export const defaultPosition = {
    x: 0,
    y: 0,
    z: 0,
}

export const defaultRotation = {
    x: 0,
    y: 0,
    z: 0,
}

// https://www.yuque.com/yiqianyao/vcv10s/uahoo3iq1trz4zyn
export const defaultSceneConfig = {
    name: 'scene1',
    cameras: [ // SceneObjectType.CAMERA
        {
            name: 'MainCamera',
            position: {
                x: 10,
                y: 10,
                z: 10,
            },
            target: {
                x: 0,
                y: 0,
                z: 0,
            },
            up: {
                x: 0,
                y: 1,
                z: 0,
            }
        }
    ],
    lights: [], // SceneObjectType.LIGHT
    helpers: [], // SceneObjectType.HELPER
    objects: [ // SceneObjectType.MESH
        {
            name: 'GrayBox',
            type: PrimitiveMeshType.BOX,
            position: {
                x: -2.5, 
                y: 2.5,
                z: -5,
            },
            size: 5,
        },
        {
            name: 'Ground',
            type: PrimitiveMeshType.PLANE,
            rotation: {
                x: -Math.PI / 2,
                y: 0,
                z: 0,
            },
            size: 100,
            material: {
                color: 0xddaa00,
            }
        }
    ],
}

interface ISky {

}

export interface ISceneConfig {
    name?: string;
    sky?: ISky;
    lights?: ILight[];
    helpers?: IHelper[];
    objects?: IObject[];
    cameras?: ICamera[];
}

export interface IScene {
    name: string;
    cameras: ICamera[];
    lights: ILight[];
    helpers: IHelper[];
    objects: IObject[];
}

export interface IMaterial {}

export interface IVec3 {
    x: number;
    y: number;
    z: number;
}

export interface IBaseObject {
    name?: string;
    position?: IVec3;
    target?: IVec3;
    up?: IVec3;
}

export interface ICamera extends IBaseObject{
    isMain?: boolean;
    
}

export interface IObject extends IBaseObject {
    size?: number;
    type?: PrimitiveMeshType;
    material?: IMaterial;
}

export interface ILight extends IBaseObject {
}
export interface IHelper extends IBaseObject {
}