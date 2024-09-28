import { Object3D, Raycaster, Vector2 } from "three";
import SceneManager from "../sceneManager/sceneManager";

export class Selector {
    private selectPosition = new Vector2();
    private selectRaycaster = new Raycaster();
    private selectedObject: Object3D | null = null;

    private updateSelectPosition(event: MouseEvent) {
        const { sizes } = SceneManager;
        this.selectPosition.set(
            (event.clientX / sizes.width) * 2 - 1,
            -(event.clientY / sizes.height) * 2 + 1
        )
    }

    onSelect = (event: MouseEvent) => {
        const {cameraManager, scene } = SceneManager;
        this.updateSelectPosition(event);
        this.selectRaycaster.setFromCamera(this.selectPosition, cameraManager.instance);
        const intersects = this.selectRaycaster.intersectObjects(scene.children);
    
        if (intersects.length > 0) {
          // 处理相交的物体
          const intersectedObject = intersects[0].object;
          if (this.selectedObject === intersectedObject) {
            cameraManager.setOutline([]);
            this.selectedObject = null;
          } else {
            cameraManager.setOutline([intersectedObject]);
            this.selectedObject = intersectedObject;
          }
        } else {
            this.selectedObject = null;
            cameraManager.setOutline([]);
        }
      };
}