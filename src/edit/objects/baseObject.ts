import { Object3D } from "three";
import { SceneObjectType } from "../sceneManager/interface";
import { EventSystem } from "@/utils/event/EventSystem";
import { SceneEvents, TreeEvents } from "@/common/constant";
import SceneManager from "../sceneManager/sceneManager";
import { IGizmoMode } from "../gizmo";
export class BaseObject {
    public parent: BaseObject | null = null;
    public children: BaseObject[] = [];
    public node!: Object3D;
    public type!: SceneObjectType;
    public outline!: Object3D;
    get name() {
        return this.node.name;
    }
    get uuid() {
        return this.node.uuid;
    };
    get position() {
        return this.node.position;
    }

    get rotation() {
        return this.node.rotation;
    }

    get scale() {
        return this.node.scale;
    }

    protected get _info() {
        const { position, rotation, scale } = this;
        return {
            name: this.node.name,
            uuid: this.uuid,
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

    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        EventSystem.subscribe(TreeEvents.ObjectRename, ({newName, key}: {key: string, newName: string}) => {
            if(key !== this.uuid) return;
            this.node.name = newName;
            SceneManager.updateConfig();
        })
        EventSystem.subscribe(SceneEvents.PropertyTransform, ({ uuid, type, value }: any) => {
            if(uuid !== this.uuid) return;
            switch(type) {
                case 'position':
                    this.setPosition(value[0], value[1], value[2]);
                    break;
                case 'rotation':
                    this.setRotation(value[0], value[1], value[2]);
                    break;
                case 'target':
                    // @ts-ignore PrimitiveCamera 自己实现的 target
                    this.setTarget && this.setTarget(value[0], value[1], value[2]);
                    break;
                case 'up':
                    // @ts-ignore PrimitiveCamera 自己实现的 up
                    this.setUp && this.setUp(value[0], value[1], value[2]);
                    break;
                case 'scale':
                    // TODO 待优化
                    // this.setScale(value[0], value[1], value[2]);
                    this.setScale(value[0]);
                    break;
            }
        })
    }

    add(child: BaseObject) {
        SceneManager.cache.add(child.uuid, child.node, child.type);
        child.parent = this;
        this.children.push(child);
        this.node.add(child.node);
    }
    
    connectObject() {
        this.node.userData.connectObject = this;
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
    gizmoUpdateEnd(): void {};
    gizmoUpdate(mode: IGizmoMode): void {};
}