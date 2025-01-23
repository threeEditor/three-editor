import { Material } from "three";
import { MaterialType } from "./interface";
import { MaterialFactory } from "./materialFactory";


export default class MaterialManager {
    private static map = new Map<string, Material>();

    static get defaultMaterial() {
        if(MaterialManager.map.has(MaterialType.Default)) {
            return MaterialManager.map.get(MaterialType.Default) as Material;
        } else {
            const material = MaterialFactory.initDefaultMaterial({ type: MaterialType.Default });
            MaterialManager.map.set(MaterialType.Default, material);
            return material;
        }
    }
    
    static setMaterial(uuid: string, mateiral: Material) {
        MaterialManager.map.set(uuid, mateiral);
    }

    static getMaterial(uuid: string) {
      return MaterialManager.map.get(uuid);
    }

    static hasMaterial(uuid: string) {
        return MaterialManager.map.has(uuid);
    }

    static disposeMaterial(key: string) {
        if(!MaterialManager.map.has(key)) return false;
        MaterialManager.map.get(key)?.dispose();
        MaterialManager.map.delete(key);
        return true;
    }

    destroy() {
        const materials = [...MaterialManager.map.values()];
        // materials.forEach(m => m.dispose());
        MaterialManager.map.clear();
    }
}