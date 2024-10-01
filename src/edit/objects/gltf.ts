import { AnimationClip, Object3D } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import { BaseObject } from "./baseObject";

export enum PrimitiveMeshType {
    BOX = 'BOX',
}

export interface IGLTFConfig {
    gltf: GLTF;
}

export class GLTFObject extends BaseObject {
    private config: IGLTFConfig;
    public node: Object3D;
    public animations: AnimationClip[];
    constructor(config: IGLTFConfig) {
        super();
        this.config = config;
        const { scene, animations } = config.gltf;
        this.node = scene;
        this.animations = animations;
        this.connectObject();
    }
}