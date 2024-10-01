import { Object3D } from "three";

export class BaseObject {
    public node!: Object3D;

    connectObject() {
        this.node.userData.connectObject = this;
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