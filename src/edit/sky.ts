import { Color, CubeTextureLoader } from "three"
import SceneManager from "./sceneManager/sceneManager"
import { EventSystem } from "@/utils/event/EventSystem";
import { SceneSkyModeUpdate } from "@/common/constant";
import { SkyMode } from "@/components/panel/display/skyCard";

// TODO 待完善

// 参考代码
// https://github.com/puxiao/threejs-tutorial/blob/main/25%20Three.js%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%E4%B9%8B%E6%B7%BB%E5%8A%A0%E8%83%8C%E6%99%AF%E5%92%8C%E5%A4%A9%E7%A9%BA%E7%9B%92.md
export class Sky {
    private currentMode: SkyMode|null = null;
    constructor() {
        this.bindEvents();
    }
    
    bindEvents() {
        EventSystem.subscribe(SceneSkyModeUpdate, (mode: SkyMode) => {
            if(this.currentMode === mode) return;
            this.currentMode = mode;
            switch(mode) {
                case SkyMode.Pure:
                    this.setPure();
                    break;
                case SkyMode.CubeMap:
                    this.setCubeMap();
                    break;
                default:
                    this.setPure();
            }
        })
    }

    setPure() {
        SceneManager.scene.background = new Color('#CCC');
    }
    
    setCubeMap() {
        const cubeTextureLoader = new CubeTextureLoader()
        cubeTextureLoader.load([
            'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-x.jpg',
            'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-x.jpg',
            'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-y.jpg',
            'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-y.jpg',
            'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-z.jpg',
            'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-z.jpg'
        ], (texture) => {
            SceneManager.scene.background = texture
        })
    }
}