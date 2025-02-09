import { PrimitiveCamera, PrimitiveCameraType } from "../objects/primitiveCamera";
import { Vector3 } from "three";
import SceneManager from "./sceneManager";
import { PrimitiveMesh } from "../objects";
import { MaterialFactory } from "../material/materialFactory";
import { EventSystem } from "@/utils/event/EventSystem";
import { DisplayEvents } from "@/common/constant";
import { PrimitiveLight, PrimitiveLightType } from "../objects/primitiveLight";
import { cacheTreeNodes } from "./sceneCache";
import { SceneRuntime } from "./sceneRuntime";
import { ICamera, ILight, IObject, ISceneConfig } from "@/sceneConfig/interface";
import { defaultRotation, defaultPosition } from "@/mock/config";
// import { Particle } from "../objects/particle";

export class SceneLoader {
    static async loadScene(sceneConfig: ISceneConfig) {
      // TODO 后续需要走解析 sceneConfig， 目前没有默认设置
      SceneLoader.loadLights(sceneConfig.lights);
      // 加载相机
      SceneLoader.loadCameras(sceneConfig.cameras);
      // 加载物体
      await SceneLoader.loadObjects(sceneConfig.objects);

      // setTimeout(() => {
      //   const particle = new Particle();
      //   console.log(particle);
      // }, 100)
      
      // SceneManager._particleList.push(particle)
      
   
      EventSystem.broadcast(DisplayEvents.SetTreeNodes, cacheTreeNodes);
    }

    /** 加载灯光 */
    static loadLights(lights?: ILight[]) {
      if(!lights) return;
      // TODO 暂时先写死
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
    }

    /**
     * Loads cameras into the scene based on the provided camera configurations.
     * @param cameras - An array of camera configurations to be loaded.
     */
    static loadCameras(cameras?: ICamera[]) {
      if(!cameras) return;
      // Iterate over each camera configuration in the array
      cameras.forEach((cameraConfig) => {
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

    /**
     * Loads objects into the scene based on the provided object configurations.
     * @param objects - An array of object configurations to be loaded.
     */
    static async loadObjects(objects?: IObject[]) {
      if(!objects) return;
      // 
      objects.forEach(async (object) => {
        const { name, type, position = defaultPosition, rotation = defaultRotation, size, material } = object;
        let mat = material ? await MaterialFactory.initMaterial(material) : undefined;
        const baseObject = new PrimitiveMesh({
          name,
          type,
          size,
          material: mat,
        });
        baseObject.setRotation(rotation.x, rotation.y, rotation.z);
        baseObject.setPosition(position.x, position.y, position.z);
        SceneManager.add(baseObject);
      })
    }
}