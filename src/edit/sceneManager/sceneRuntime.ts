
import { compressNormals } from "three/examples/jsm/utils/GeometryCompressionUtils.js";
import { PrimitiveCamera } from "../objects/primitiveCamera";
import SceneManager from "./sceneManager";
import { IVec3 } from "@/sceneConfig/config";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let RuntimeCameraOriginInfo: {
    target: IVec3;
    position: IVec3;
    up: IVec3;
};

export class SceneRuntime {
    static control: OrbitControls | null;
    static cameraList: PrimitiveCamera[] = [];
    static get runtimeCamera() {
        return this.cameraList[0];
    }
    static update() {
        const runtimeCamera = SceneRuntime.runtimeCamera;
        if(runtimeCamera) {
            SceneManager.renderer.update(runtimeCamera.node);
        } else {
            SceneManager.renderer.update(SceneManager.cameraManager.instance);
        }
    }

    static triggerOff() {
        const runtimeCamera = SceneRuntime.runtimeCamera;
        if(!runtimeCamera) return;
        runtimeCamera.setCameraHelper(true);
        if(SceneRuntime.control) {
            const { target, position, up } = RuntimeCameraOriginInfo;
            runtimeCamera.target.set(target.x, target.y, target.z);
            runtimeCamera.position.set(position.x, position.y, position.z);
            runtimeCamera.up.set(up.x, up.y, up.z);
            SceneRuntime.control.update();
            SceneRuntime.control.enabled = false;
        }
    }

    static triggerIn() {
        const runtimeCamera = SceneRuntime.runtimeCamera;
        if(!runtimeCamera) return;
        RuntimeCameraOriginInfo = runtimeCamera.info;
        runtimeCamera.setCameraHelper(false);
        !SceneRuntime.control && SceneRuntime.initControl(runtimeCamera);
        if(SceneRuntime.control) {
            // 在切换编辑常见的时候 同步更新
            SceneRuntime.control.target.copy(runtimeCamera.target)
            SceneRuntime.control.zoom0 = 1;
            SceneRuntime.control.update();
            SceneRuntime.control.enabled = true;
        }
    }

    private static initControl(runtimeCamera: PrimitiveCamera) {
        SceneRuntime.control = runtimeCamera.initController();
    }
}