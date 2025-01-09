import { Sprite as ThreeSprite, SpriteMaterial, Texture, Object3D, MeshBasicMaterial, PlaneGeometry, Mesh } from 'three';
import { BaseObject } from './baseObject';
import { SceneObjectType } from '../sceneManager/interface';
import SceneManager from '../sceneManager/sceneManager';
import MaterialManager from '../material/materialManager';
export interface ISpriteConfig {
    color?: string;
    opacity?: number,
    texture?: Texture
    name?: string;
}

const SpriteOutlineMaterial = 'SpriteOutlineMaterial';

export class Sprite extends BaseObject {
    public node: Object3D;
    public config: ISpriteConfig;
    constructor(config: ISpriteConfig) {
        super();
        this.config = config;
        this.type = SceneObjectType.SPRITE;
        const { name = 'Sprite' } = config;
        const params: {[key: string]: any} = {};
        config.texture && (params.map = config.texture);
        config.color && (params.color = config.color);
        config.opacity && (params.opacity = config.opacity);

        const material = new SpriteMaterial({
            ...params,
            depthTest: false,
        });
        this.node = new ThreeSprite(material);        
        this.node.name = name;
        this.initOutlineMesh();
        this.connectObject();
    }

    initOutlineMesh() {
        if(!MaterialManager.hasMaterial(SpriteOutlineMaterial)) {
            MaterialManager.setMaterial(SpriteOutlineMaterial, new MeshBasicMaterial({
                opacity: 0,
                transparent: true,
                depthWrite: false,
                depthTest: false,
            }))
        }
        const scale = 1.02;
        const geometry = new PlaneGeometry(scale, scale);
        const outline = new Mesh(geometry, MaterialManager.getMaterial(SpriteOutlineMaterial));   
        this.outline = outline; 
        outline.onBeforeRender = () => {
            outline.rotation.copy(SceneManager.cameraManager.instance.rotation);
        }
        outline.userData.type = 'outline';
        outline.userData.connectObject = this.node;
        // Gizmo 更新的同步
        outline.userData.update = ()=>{
            outline.position.copy(this.node.position);
            outline.rotation.copy(this.node.rotation);
            outline.scale.copy(this.node.scale);
        }
        // Tip: add to scene to keep outline renderpass work
        SceneManager.scene.add(outline);
        this.node.userData.outline = outline;
    }
}