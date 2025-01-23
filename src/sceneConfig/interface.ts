import { MaterialType } from "@/edit/material/interface";
import { PrimitiveMeshType } from "@/edit/objects";
import { MeshPhongMaterialParameters } from "three";

export interface ISky {

}

export interface ISceneConfig {
    name?: string;
    sky?: ISky;
    lights?: ILight[];
    helpers?: IHelper[];
    objects?: IObject[];
    models?: IModel[];
    cameras?: ICamera[];
}

export interface IScene {
    name: string;
    cameras: ICamera[];
    lights: ILight[];
    helpers: IHelper[];
    objects: IObject[];
}

export interface IVec3 {
    x: number;
    y: number;
    z: number;
}

export interface IBaseObject {
    name?: string;
    position?: IVec3;
    target?: IVec3;
    rotation?: IVec3;
    up?: IVec3;
}

export interface ICamera extends IBaseObject{
    isMain?: boolean;

}

type MaterialParameters = MeshPhongMaterialParameters;
export interface IMaterialParameters extends MaterialParameters {
    type?: MaterialType;
    texture?: string;
    repeatX?: number; // 纹理重复次数
    repeatY?: number;
};

export interface IObject extends IBaseObject {
    size?: number;
    type?: PrimitiveMeshType;
    material?: IMaterialParameters;
}

export interface ILight extends IBaseObject {
}
export interface IHelper extends IBaseObject {
}

export interface IModel extends IBaseObject {

}