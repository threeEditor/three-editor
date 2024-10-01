import { AnimationClip, AnimationMixer, Object3D } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import { BaseObject } from "./baseObject";
import { SceneObjectType } from "../sceneManager/interface";
import SceneManager from "../sceneManager/sceneManager";

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
    private mixer: AnimationMixer | null = null;
    constructor(config: IGLTFConfig) {
        super();
        this.config = config;
        this.type = SceneObjectType.GLTF;
        const { scene, animations } = config.gltf;
        this.node = scene;
        this.animations = animations;
        this.connectObject();

        if(animations.length > 0) {
            this.mixer = new AnimationMixer(scene);
            SceneManager._modelAnimationMixer.push(this.mixer);
        }
       

        this.play();
    }

    play() {
        if(!this.mixer) return;
        const action = this.mixer.clipAction(this.animations[0]);
        action.play();
        console.log('play', action)
    }

    pause() {

    }

    stop() {
        
    }
}