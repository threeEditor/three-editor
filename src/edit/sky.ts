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
    private pureColor: Color | null = null;
    private pureColorString: string | null = null;
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

    setPure(color: string = '#000') {
        if(!SceneManager.scene) return;
        this.currentMode = SkyMode.Pure;   
        if(!this.pureColor) {
            this.pureColor = new Color();
            this.pureColorString = color;
            this.pureColor.setStyle(color);
            SceneManager.scene.background = this.pureColor;
        } else {
            this.pureColorString = color;
            this.pureColor.setStyle(color);
        }
      
    }
    
    setCubeMap() {
        if(!SceneManager.scene) return;
        this.currentMode = SkyMode.CubeMap;
        const cubeTextureLoader = new CubeTextureLoader()
        cubeTextureLoader.load([
            'https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/cube_01/pos-x.jpg',
            'https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/cube_01/neg-x.jpg',
            'https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/cube_01/pos-y.jpg',
            'https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/cube_01/neg-y.jpg',
            'https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/cube_01/pos-z.jpg',
            'https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/cube_01/neg-z.jpg'
        ], (texture) => {
            SceneManager.scene.background = texture
        })
    }
}