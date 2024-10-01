import { Object3D } from "three";
import { SceneObjectType } from "../sceneManager/interface";
export class BaseObject {
    public node!: Object3D;
    public type!: SceneObjectType;
    public name!: string;

    get position() {
        return this.node.position;
    }

    get rotation() {
        return this.node.rotation;
    }

    get scale() {
        return this.node.scale;
    }
    
    connectObject() {
        this.node.userData.connectObject = this;
        this.name = this.node.name || this.type;
    }

    setPosition(x?: number, y?: number, z?: number) {
        x !== undefined && this.node.position.setX(x);
        y !== undefined && this.node.position.setX(y);
        z !== undefined && this.node.position.setX(z);
    }

    setScale(scale: number): void;
    setScale(x: number, y?: number, z?: number) {
        if(y !== undefined && z !== undefined) {
            this.node.scale.set(x, y, z);
        } else {
            this.node.scale.set(x, x, x);
        }
    }
}