import { AmbientLight, DirectionalLight, Vector3 } from "three";
import { BaseObject } from "./baseObject";
import { SceneObjectType } from "../sceneManager/interface";

export enum PrimitiveLightType {
    PointLight = 'Point',
    DirectLight = 'DirectLight',
    AmbientLight = 'AmbientLight',
}

export interface IPrimitiveLightConfig {
    type?: PrimitiveLightType,
    color?: string;
    intensity?: number;
    target?: Vector3;
}

export class PrimitiveLight extends BaseObject {
    private config: IPrimitiveLightConfig;
    private color: string;
    private intensity: number;
    constructor(config: IPrimitiveLightConfig) {
        super();
        this.config = config;
        const { color = '#fff', intensity = 1 } = config;
        this.color = color;
        this.intensity = intensity;
        this.type = SceneObjectType.LIGHT;
       
        switch(config.type) {
            case PrimitiveLightType.AmbientLight:
                this.node = this.initAmbientLight();
                break;
            case PrimitiveLightType.DirectLight:
                this.node = this.initDirectLight();
                break;
            default:
                this.node = this.initAmbientLight();
        }
        this.connectObject();
    }

    initAmbientLight() {
        const { color, intensity } = this.config;
        const node = new AmbientLight(color, intensity);
        node.name = 'AmbientLight';
        return node;
    }

    initPointLight() {
        
    }

    initDirectLight() {
        const { color, intensity } = this.config;
        const node = new DirectionalLight(color, intensity);
        node.name = 'DirectionalLight';
        return node;
    }
}