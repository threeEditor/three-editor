import { Sprite as ThreeSprite, SpriteMaterial, Texture, Object3D, LessDepth, MeshBasicMaterial, PlaneGeometry, Mesh } from 'three';
import { BaseObject } from './baseObject';
import { SceneObjectType } from '../sceneManager/interface';
import SceneManager from '../sceneManager/sceneManager';
export interface ISpriteConfig {
    color?: string;
    opacity?: number,
    texture?: Texture
}

export class Sprite extends BaseObject {
    public node: Object3D;
    public config: ISpriteConfig;
    constructor(config: ISpriteConfig) {
        super();
        this.config = config;
        this.type = SceneObjectType.SPRITE;
        
        const params: {[key: string]: any} = {};
        config.texture && (params.map = config.texture);
        config.color && (params.color = config.color);
        config.opacity && (params.opacity = config.opacity);

        const material = new SpriteMaterial({
            ...params,
        });
        this.node = new ThreeSprite(material);        
    
        // TODO 后续待完善
        const lineMaterial = new SpriteMaterial({
            color: '#f00',
            // 处理透明模式 不会覆盖
            depthFunc: LessDepth,
        })
        const lineSprite = new ThreeSprite(lineMaterial);
        lineSprite.scale.set(1.04, 1.04, 1.04);
        lineSprite.renderOrder = 2; // 后渲染
        lineSprite.visible = false;
        this.node.add(lineSprite);
        this.node.userData.outline = lineSprite;

        const mesh = this.initHelperMesh();

        this.node.userData.outline = mesh;
        this.connectObject();
    }

    initHelperMesh() {
        const material = new MeshBasicMaterial({
            color: '#f00',
            depthFunc: LessDepth,
            transparent: true,
        });
        const geometry = new PlaneGeometry(1.04, 1.04);
        const mesh = new Mesh(geometry, material);       
        mesh.visible = false;
        // mesh.renderOrder = 2;
        mesh.onBeforeRender = () => {
            this.node.rotation.copy(SceneManager.cameraManager.instance.rotation);
        }
        this.node.add(mesh);
        return mesh;
    }
}