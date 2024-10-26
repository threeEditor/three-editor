import { AnimationAction, AnimationClip, AnimationMixer, Object3D } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import { BaseObject } from "./baseObject";
import { SceneObjectType } from "../sceneManager/interface";
import SceneManager from "../sceneManager/sceneManager";
import { EventSystem } from "@/utils/event/EventSystem";
import { ModelAniUpdate } from "@/common/constant";

export enum PrimitiveMeshType {
    BOX = 'BOX',
}

export interface IGLTFConfig {
    name?: string;
    gltf: GLTF;
}

export class GLTFObject extends BaseObject {
    get info() {
        return {
            ...this._info,
            animationSpeed: this.speed,
            animations: this.animations.map(animationClip => animationClip.name),
            isModel: true,
        };
    }
    get animations() {
        return this._animations;
    }

    get speed() {
        return this._timeScale;
    }

    set speed(s: number) {
        this._timeScale = s;
        if(this._currentAction) {
            this._currentAction.timeScale = s;
        }
    }

    public node: Object3D;
    private config: IGLTFConfig;
    private _animations: AnimationClip[];
    private _currentAction: AnimationAction | null = null;
    private _mixer: AnimationMixer | null = null;
    private _timeScale = 1; // ani speed
    constructor(config: IGLTFConfig) {
        super();
        this.config = config;
        this.type = SceneObjectType.GLTF;
        const { scene, animations } = config.gltf;
        this.node = scene;
        if(config.name) {
            this.node.name = config.name;
        }
        
        this._animations = animations;
        this.connectObject();

        if(animations.length > 0) {
            this._mixer = new AnimationMixer(scene);
            this._mixer.uncacheRoot(scene);
            SceneManager._modelAnimationMixer.push(this._mixer);
        }
        const defaultAni = animations[0];
        this.play(defaultAni.name);
        this.bindEvents()
    }

    bindEvents() {
        EventSystem.subscribe(ModelAniUpdate.UpdateAni, ({ uuid, ani }: any) => {
            if(uuid !== this.uuid) return;
            if(!this.hasAni(ani)) return;
            this.play(ani);
        })
        EventSystem.subscribe(ModelAniUpdate.UpdateAniSpeed, ({ uuid, animationSpeed = 1 }: any) => {
            if(uuid !== this.uuid) return;
            console.log('update speed', animationSpeed)
            this.speed = animationSpeed;
        })
    }

    play(ani: string) {
        if(!this.hasAni(ani)) return;
        if(!this._mixer) return;
      
        const clip = this.getClip(ani);
        const action = this._mixer.clipAction(clip);
        action.play();

        if(this._currentAction) {
            this._currentAction.crossFadeTo(action, 0.2, true);
        }
        this._currentAction = action;
    }

    pause() {

    }

    stop() {
        
    }

    private getClip(ani: string): AnimationClip {
        return this._animations.filter(clip => clip.name === ani)[0];
    }

    private hasAni(ani: string) {
        return this._animations.filter(clip => clip.name === ani).length > 0;
    }

    private destroy() {
        EventSystem.unsubscribe(ModelAniUpdate.UpdateAni);
    }
}