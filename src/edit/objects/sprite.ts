import { Sprite as ThreeSprite, SpriteMaterial, Texture, Object3D, LessDepth } from 'three';
export interface ISpriteConfig {
    color?: string;
    opacity?: number,
    texture?: Texture
}

export class Sprite {
    public node: Object3D;
    constructor(config: ISpriteConfig) {
        const params: {[key: string]: any} = {};
        config.texture && (params.map = config.texture);
        config.color && (params.color = config.color);
        config.opacity && (params.opacity = config.opacity);

        const material = new SpriteMaterial(params);
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