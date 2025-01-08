import { defaultPosition, defaultRotation, ICamera, ISceneConfig } from "@/sceneConfig/config";
import { PrimitiveCamera, PrimitiveCameraType } from "../objects/primitiveCamera";
import { Vector3 } from "three";
import SceneManager from "./sceneManager";
import { PrimitiveMesh } from "../objects";
import { MaterialFactory } from "../material/materialFactory";
import { EventSystem } from "@/utils/event/EventSystem";
import { DisplayEvents } from "@/common/constant";
import { PrimitiveLight, PrimitiveLightType } from "../objects/primitiveLight";
import { cacheTreeNodes } from "./sceneCache";
import { SceneEditor } from "./sceneEditor";
import { SceneRuntime } from "./sceneRuntime";

export class SceneLoader {
    static loadScene(sceneConfig: ISceneConfig) {
      // TODO 后续需要走解析 sceneConfig， 目前没有默认设置
       const directLight = new PrimitiveLight({
        color: '#fff',
        intensity: 1,
        type: PrimitiveLightType.DirectLight,
      });
      directLight.setPosition(1, 1, 0);
  
      const ambientLight = new PrimitiveLight({
        color: '#fff',
        intensity: 0.5,
        type: PrimitiveLightType.AmbientLight,
      });
  
      SceneManager.add(directLight);
      SceneManager.add(ambientLight);
  
  
      // 加载相机
      sceneConfig.cameras && SceneLoader.loadCameras(sceneConfig.cameras);
  
      sceneConfig.objects && SceneLoader.loadObjects(sceneConfig.objects);
   
      EventSystem.broadcast(DisplayEvents.SetTreeNodes, cacheTreeNodes);
    }
    /**
     * Loads cameras into the scene based on the provided camera configurations.
     * @param cameras - An array of camera configurations to be loaded.
     */
    static loadCameras(cameras: ICamera[]) {
        // Iterate over each camera configuration in the array
        cameras?.forEach((cameraConfig) => {
        // Destructure the camera configuration object to get default values if not provided
        const { position = { x: 10, y: 10, z: 10 }, target = { x: 0, y: 0, z: 0 }, up = { x: 0, y: 1, z: 0 }, name } = cameraConfig;
        // Create a new primitive camera with the specified type and orientation
        const primitiveCamera = new PrimitiveCamera({
            name,
            type: PrimitiveCameraType.PerspectiveCamera,
            up: new Vector3(up.x, up.y, up.z),
            target: new Vector3(target.x, target.y, target.z),
        })
        // Set the position of the primitive camera
        primitiveCamera.setPosition(position.x, position.y, position.z);
        // Add the primitive camera to the scene
        SceneManager.add(primitiveCamera);
        // 暂时用第一个相机作为 display 相机
        SceneRuntime.cameraList.push(primitiveCamera);
      })
    }

    static loadObjects(objects: any[]) {
      objects.forEach((object) => {
        const { name, type, position = defaultPosition, rotation = defaultRotation, size, material, } = object;
        const baseObject = new PrimitiveMesh({
          name,
          type,
          size,
          material: material ? MaterialFactory.initMaterial(material) : undefined,
        });
        baseObject.setRotation(rotation.x, rotation.y, rotation.z);
        baseObject.setPosition(position.x, position.y, position.z);
        SceneManager.add(baseObject);
      })
    }
}