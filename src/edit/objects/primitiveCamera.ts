import { Camera, CameraHelper, OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import { BaseObject } from "./baseObject";
import { SceneObjectType } from "../sceneManager/interface";
import SceneManager from "../sceneManager/sceneManager";

export enum PrimitiveCameraType {
    PerspectiveCamera = 'PerspectiveCamera',
    OrthographicCamera = 'OrthographicCamera',
}

export interface IPrimitiveCameraConfig {
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
    public cameraHelper!: CameraHelper;
   
    constructor(config: IPrimitiveCameraConfig) {
        super();
        this.config = config;
        const { target = new Vector3(), up = new Vector3(0, 1, 0) } = this.config;
        this.type = SceneObjectType.LIGHT;
        this.target = target;
        this.up = up;
        this.node = this.initPerspectiveCamera();
        this.connectObject();
    }
    initPerspectiveCamera() {
        const { target, up }  = this;
        const node = new PerspectiveCamera(45, SceneManager.sizes.width / SceneManager.sizes.height, 0.1, 500);
        node.lookAt(target);
        node.up.set(up.x, up.y, up.z);
        node.name = 'perspectiveCamera';

        this.cameraHelper = new CameraHelper(node);
        SceneManager.scene.add(this.cameraHelper);

        return node as PerspectiveCamera;
    }

    initOrthographicCamera() {
        const { target, up }  = this;
        const node = new OrthographicCamera(-10, 10, -10, 10, 0.1, 500);
        node.lookAt(target);
        node.up.set(up.x, up.y, up.z);
        node.name = 'orthographicCamera';

        this.cameraHelper = new CameraHelper(node);
        SceneManager.scene.add(this.cameraHelper);
        
        return node as OrthographicCamera;
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