import { MeshPhongMaterial } from "three";
import { MaterialType } from "./interface";
import { IMaterialParameters } from "@/sceneConfig/interface";

export class MaterialFactory {
    static initMaterial(materialProps: IMaterialParameters) {
        const { type } = materialProps;
        switch(type) {
            case MaterialType.Default:
            case MaterialType.Phong:
                return this.initMeshPhongMaterial(materialProps);
            default:
                return this.initMeshPhongMaterial(materialProps);
        }
    }

    private static initMeshPhongMaterial(materialProps: IMaterialParameters) {
        return new MeshPhongMaterial({
            color: materialProps.color || 0xffffff,
        });
    }
}