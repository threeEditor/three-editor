import * as THREE from 'three';

export interface IBoxConfig {
    size?: number;
    color?: string;
    opacity?: number;
    texture?: string
}

export default function Box(config: IBoxConfig) {
    const { size = 1, color = '#fff', opacity = 1, texture } = config;
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshPhongMaterial({ 
        color, 
        transparent: opacity !== 1 ? true : false,
        opacity,
        map: texture ? new THREE.TextureLoader().load(texture) : null
    });
    return new THREE.Mesh(geometry, material);
}