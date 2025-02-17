import { MeshPhongMaterial, RepeatWrapping, TextureLoader } from "three";
import { MaterialType } from "./interface";
import { IMaterialParameters } from "@/sceneConfig/interface";

const textureLoader = new TextureLoader();
export class MaterialFactory {
    static async initMaterial(materialProps: IMaterialParameters) {
        const { type, texture, repeatX = 1, repeatY = 1 } = materialProps;
        // const texture = 'https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/unnamed.png'
        const map = texture ? await textureLoader.loadAsync(texture) : null;
        if(texture && repeatX > 1 && map) {
            map.wrapS = RepeatWrapping;
            map.repeat.setX(repeatX)
        }
        if(texture && repeatY > 1 && map) {
            map.wrapT = RepeatWrapping;
            map.repeat.setY(repeatY)
        }
        switch(type) {
            case MaterialType.Default:
            case MaterialType.Phong:
                return this.initMeshPhongMaterial(materialProps);
            default:
                return this.initMeshPhongMaterial({
                    ...materialProps,
                    map,
                });
        }
    }

    static initDefaultMaterial(materialProps: IMaterialParameters) {
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
        const params: Record<string, any> = {
            color: materialProps.color || 0xffffff,
        };
        if(materialProps.map) {
            params.map = materialProps.map;
        }
        return new MeshPhongMaterial(params);
    }
}