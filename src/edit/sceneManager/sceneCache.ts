import { Object3D } from "three";
import { SceneObjectType } from "./interface";

export class SceneCache {
    private map = new Map<string, Object3D>();
    private selectMap = new Map<string, Object3D>();
    get selectList() {
        return [...this.selectMap.values()];
    }

    include(uuid: string) {
        return this.map.has(uuid);
    }

    getIncludeParent(node: Object3D | null): Object3D | null {
        if(!node) return null;
        if(this.include(node.uuid)) {
            return node;
        } else {
            return this.getIncludeParent(node.parent);
        }
    }

    add(uuid: string, node: Object3D, type: SceneObjectType) {
        switch(type) {
            case SceneObjectType.MESH:
                this.selectMap.set(node.uuid, node)
                break;
            case SceneObjectType.SPRITE:
                this.selectMap.set(node.uuid, node)
                break;
            case SceneObjectType.GLTF:
                this.selectMap.set(node.uuid, node)
                break;
        }
        this.map.set(uuid, node);
    }

    remove(uuid: string) {
        this.map.delete(uuid);
        this.selectMap.delete(uuid);
    }
}