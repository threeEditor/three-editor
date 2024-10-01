import { BoxGeometry, Material, Mesh, Object3D } from "three";
import MaterialManager from "../materialManager";
import { BaseObject } from "./baseObject";

export enum PrimitiveMeshType {
    BOX = 'BOX',
}

export interface IPrimitiveMeshConfig {
    type?: PrimitiveMeshType,
    material?: Material;
    width?: number;
    height?: number;
    depth?: number;
    size?: number;
}

export class PrimitiveMesh extends BaseObject {
    private config: IPrimitiveMeshConfig;
    public node: Object3D;
    public size: number;
    constructor(config: IPrimitiveMeshConfig) {
        super();
        this.config = config;
        this.size = config.size || 1;
        switch(config.type) {
            case PrimitiveMeshType.BOX:
                this.node = this.initBox();
                break;
            default:
                this.node = this.initBox();
        }
        this.connectObject();
    }

    initBox() {        
        const { width = this.size, height = this.size, depth = this.size, material = MaterialManager.defaultMaterial } = this.config;
        const geometry = new BoxGeometry(width, height, depth);
        const box = new Mesh(geometry, material);
        this.node = box;
        return box;
    }
}