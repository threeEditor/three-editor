import { Object3D } from "three";
import { SceneObjectType } from "./interface";
import { TreeDataNode } from "antd";

export const cacheTreeNodes: TreeDataNode[] = [];
// SceneCache 暂时用做 select 使用
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
        // cache selectable Objects
        switch(type) {
            case SceneObjectType.MESH:
                this.selectMap.set(node.uuid, node);
                break;
            case SceneObjectType.SPRITE:
                this.selectMap.set(node.uuid, node);
                break;
            case SceneObjectType.GLTF:
                this.selectMap.set(node.uuid, node);
                break;
            // Tip: light 也可以被选中，通过 Display Panel Tree Component 列表项 or Sprite Icon
            case SceneObjectType.Camera:
            case SceneObjectType.LIGHT:
                this.selectMap.set(node.uuid, node);
                break;
        }
        // cache all Objects
        this.map.set(uuid, node);
    }

    get(uuid: string) {
        return this.map.get(uuid);
    }

    remove(uuid: string) {
        this.map.delete(uuid);
        this.selectMap.delete(uuid);
    }
}