import { Material } from "three";

export enum MaterialType {
    Phong = 'phong',
    Blinn = 'Blinn,'
}
export default class MaterialManager {
    private static map = new Map<string, Material>();

    static getMaterial(uuid: string, clone = false) {
      
    }

    private static initMaterial(type: MaterialType) {

    }

    destroy() {

    }
}