import { Camera, CameraHelper, OrthographicCamera, PerspectiveCamera, SpriteMaterial, Vector3, Sprite as ThreeSprite, Color } from "three";
import { BaseObject } from "./baseObject";
import SceneManager from "../sceneManager/sceneManager";
import { LoaderResourceType } from "../loader";
import { SceneObjectType } from "../sceneManager/interface";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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

export enum CameraControl {
    Orbit = 'Orbit',
    None = 'None',
}

export class PrimitiveCamera extends BaseObject {
    get info() {
        return {
            ...this._info,
            isCamera: true,
            cameraType: this.cameraType,
            target: { 
                x: this.target.x,
                y: this.target.y, 
                z: this.target.z,
            },
            up: { 
                x: this.up.x,
                y: this.up.y, 
                z: this.up.z,
            },
            far: this.far,
        };
    }
    declare public node: Camera;
    private config: IPrimitiveCameraConfig;
    public target: Vector3;
    public up: Vector3;
    public far: number;
    public near: number;
    public fov: number;
    public cameraType: PrimitiveCameraType;
    public cameraHelper!: CameraHelper;
    public cameraSprite!: ThreeSprite;
    public controlType = CameraControl.Orbit; // 相机默认设置为 orbit
    public controller!: OrbitControls;
   
    constructor(config: IPrimitiveCameraConfig) {
        super();
        const { 
            name, 
            target = new Vector3(), 
            up = new Vector3(0, 1, 0), 
            type = PrimitiveCameraType.PerspectiveCamera,
            fov = 45,
            far = 500,
            near = 0.1,
         } = config;
        this.config = config;
        this.type = SceneObjectType.Camera;
        this.cameraType = type;
        this.target = target;
        this.up = up;
        this.fov = fov;
        this.far = far;
        this.near = near;
        if(type === PrimitiveCameraType.PerspectiveCamera) {
            this.node = this.initPerspectiveCamera(name);
        } else {
            this.node = this.initOrthographicCamera(name);
        }
        this.initCameraSprite();
        this.connectObject();
    }

    initController() {
        switch(this.controlType) {
            case CameraControl.Orbit:
                this.controller = new OrbitControls(this.node, SceneManager.wrap);
                return this.controller;
            default:
                return null;
        }
    }
    initPerspectiveCamera(name = 'perspectiveCamera') {
        const { target, up, fov, far, near }  = this;
        const node = new PerspectiveCamera(fov, SceneManager.sizes.width / SceneManager.sizes.height, near, far);
        node.lookAt(target);
        node.up.set(up.x, up.y, up.z);
        node.name = name;

        this.cameraHelper = new CameraHelper(node);
        SceneManager.scene.add(this.cameraHelper);

        return node as PerspectiveCamera;
    }

    initOrthographicCamera(name = 'orthographicCamera') {
        const { target, up, far, near }  = this;
        const node = new OrthographicCamera(-10, 10, -10, 10, near, far);
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

    setCameraHelper(enabled: boolean) {
        if(this.cameraHelper) {
            this.cameraHelper.visible = enabled;
        }
    }

    setTarget(x?: number, y?: number, z?: number) {
        if(!this.node) return;
        if(x) this.target.x = x;
        if(y) this.target.y = y;
        if(z) this.target.z = z;
        this.node.lookAt(this.target);
    }

    setUp(x?: number, y?: number, z?: number) {
        if(!this.node) return;
        if(x) this.up.x = x;
        if(y) this.up.y = y;
        if(z) this.up.z = z;
        this.node.up.copy(this.up);
    }

    resize() {
        const { sizes } = SceneManager;
        if(this.cameraType === PrimitiveCameraType.PerspectiveCamera) {
            (this.node as PerspectiveCamera).aspect = sizes.width / sizes.height;
            (this.node as PerspectiveCamera).updateProjectionMatrix();
        } else {
            // (this.node as OrthographicCamera).left = -sizes.width / 2;
            // (this.node as OrthographicCamera).right = sizes.width / 2;
            // (this.node as OrthographicCamera).top = sizes.height / 2;
            // (this.node as OrthographicCamera).bottom = -sizes.height / 2;
            // (this.node as OrthographicCamera).updateProjectionMatrix();
        }
    }
}