import { Sprite as ThreeSprite, SpriteMaterial, Texture, Object3D } from 'three';
export interface ISpriteConfig {
    color?: string;
    opacity?: number,
    texture?: Texture
}

export default class Sprite {
    public node: Object3D;
    constructor(config: ISpriteConfig) {
        const params: {[key: string]: any} = {};
        config.texture && (params.map = config.texture);
        config.color && (params.color = config.color);
        config.opacity && (params.opacity = config.opacity);

        const material = new SpriteMaterial(params);
        this.node = new ThreeSprite(material);
        // const geo = this.node.geometry as BufferGeometry;
        // geo.boundingSphere = new Sphere(new Vector3(), 10)
        // console.log(())
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