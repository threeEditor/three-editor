import { Object3D } from "three";
import { SceneObjectType } from "../sceneManager/interface";
export class BaseObject {
    get uuid() {
        return this.node.uuid;
    };
    public node!: Object3D;
    public type!: SceneObjectType;
    public name!: string;
    protected outline!: Object3D;

    get position() {
        return this.node.position;
    }

    get rotation() {
        return this.node.rotation;
    }

    get scale() {
        return this.node.scale;
    }

    get _info() {
        const { position, rotation, scale } = this;
        return {
            name: this.node.name,
            type: this.node.type,
            position: { 
                x: position.x,
                y: position.y, 
                z: position.z,
            },
            rotation: {
                x: rotation.x,
                y: rotation.y, 
                z: rotation.z,
            },
            scale: {
                x: scale.x,
                y: scale.y, 
                z: scale.z,
            }
        }
    }

    get info() {
        return this._info;
    }
    
    connectObject() {
        this.node.userData.connectObject = this;
        this.name = this.node.name || this.type;
    }

    setPosition(x?: number, y?: number, z?: number) {
        x !== undefined && this.node.position.setX(x);
        y !== undefined && this.node.position.setY(y);
        z !== undefined && this.node.position.setZ(z);
        if(this.outline) { // for sprite outline renderpass
            x !== undefined && this.outline.position.setX(x);
            y !== undefined && this.outline.position.setY(y);
            z !== undefined && this.outline.position.setZ(z);
        }
    }

    setRotation(x?: number, y?: number, z?: number) {
        if(x !== undefined) { this.node.rotation.x = x };
        if(y !== undefined) { this.node.rotation.y = y };
        if(z !== undefined) { this.node.rotation.z = z };
        if(this.outline) { // for sprite outline renderpass
            if(x !== undefined) { this.outline.rotation.x = x };
            if(y !== undefined) { this.outline.rotation.y = y };
            if(z !== undefined) { this.outline.rotation.z = z };
        }
    }

    setScale(scale: number): void;
    setScale(x: number, y?: number, z?: number) {
        if(y !== undefined && z !== undefined) {
            this.node.scale.set(x, y, z);
            this.outline?.scale.set(x, y, z);
        } else {
            this.node.scale.set(x, x, x);
            this.outline?.scale.set(x, x, x);
        }
    }
}