import { Camera, CameraHelper, OrthographicCamera, PerspectiveCamera, SpriteMaterial, Vector3, Sprite as ThreeSprite, Color } from "three";
import { BaseObject } from "./baseObject";
import SceneManager from "../sceneManager/sceneManager";
import { LoaderResourceType } from "../loader";
import { SceneObjectType } from "../sceneManager/interface";

export enum PrimitiveCameraType {
    PerspectiveCamera = 'PerspectiveCamera',
    OrthographicCamera = 'OrthographicCamera',
}

export interface IPrimitiveCameraConfig {
    name?: string;
    type?: PrimitiveCameraType,
    up?: Vector3;
    target?: Vector3;
    near?: number;
    far?: number;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    zoom?: number;
    fov?: number;
    aspect?: number;
}

export class PrimitiveCamera extends BaseObject {
    get info() {
        return {
            ...this._info,
            isCamera: true,
        };
    }
    declare public node: Camera;
    private config: IPrimitiveCameraConfig;
    public target: Vector3;
    public up: Vector3;
    public cameraType: PrimitiveCameraType;
    public cameraHelper!: CameraHelper;
    public cameraSprite!: ThreeSprite;
   
    constructor(config: IPrimitiveCameraConfig) {
        super();
        const { target = new Vector3(), up = new Vector3(0, 1, 0), name, type = PrimitiveCameraType.PerspectiveCamera } = config;
        this.config = config;
        this.type = SceneObjectType.Camera;
        // this.type = SceneObjectType.LIGHT;
        this.cameraType = type;
        this.target = target;
        this.up = up;
        if(type === PrimitiveCameraType.PerspectiveCamera) {
            this.node = this.initPerspectiveCamera(name);
        } else {
            this.node = this.initOrthographicCamera(name);
        }
        this.initCameraSprite();
        this.connectObject();
    }
    initPerspectiveCamera(name = 'perspectiveCamera') {
        const { target, up }  = this;
        const node = new PerspectiveCamera(45, SceneManager.sizes.width / SceneManager.sizes.height, 0.1, 500);
        node.lookAt(target);
        node.up.set(up.x, up.y, up.z);
        node.name = name;

        this.cameraHelper = new CameraHelper(node);
        SceneManager.scene.add(this.cameraHelper);

        return node as PerspectiveCamera;
    }

    initOrthographicCamera(name = 'orthographicCamera') {
        const { target, up }  = this;
        const node = new OrthographicCamera(-10, 10, -10, 10, 0.1, 500);
        node.lookAt(target);
        node.up.set(up.x, up.y, up.z);
        node.name = name;

        this.cameraHelper = new CameraHelper(node);
        SceneManager.scene.add(this.cameraHelper);
        
        return node as OrthographicCamera;
    }

    async initCameraSprite() {
        const texture = await SceneManager.resources.loadAsset({
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/icon_newsletter_videocamera.png',
            type: LoaderResourceType.Texture2D,
        })
        const material = new SpriteMaterial({
            map: texture,
            color: new Color(0xffffff),
            depthWrite: false,
        });
        const cameraSprite = new ThreeSprite(material);  
        this.cameraSprite = cameraSprite;
        // 使用 onBeforeRender 事件 保证 Sprite 的大小
        cameraSprite.onBeforeRender = (renderer, scene, camera) => {
            const sceneCamera = camera as PerspectiveCamera;
            // 计算 Sprite 在屏幕上的大小
            const vFOV = sceneCamera.fov * Math.PI / 180;
            const height = 2 * Math.tan(vFOV / 2) * camera.position.distanceTo(this.node.position);
            // const scale = height * renderer.domElement.clientHeight / texture.image.height;
            const scale = height * renderer.domElement.clientHeight / 128 / 64;
            cameraSprite.scale.set(scale, scale, 1);
        };
       
        this.node.add(cameraSprite);
    }


    setPosition(x?: number, y?: number, z?: number) {
        x !== undefined && this.node.position.setX(x);
        y !== undefined && this.node.position.setY(y);
        z !== undefined && this.node.position.setZ(z);
        if(this.outline) { // for sprite outline renderpass
            x !== undefined && this.outline.position.setX(x);
            y !== undefined && this.outline.position.setY(y);
            z !== undefined && this.outline.position.setZ(z);
        }
        this.node.lookAt(this.target)
    }
}