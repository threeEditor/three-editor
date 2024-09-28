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

    select(node: Object3D | null) {
      const { cameraManager } = SceneManager;
      if(!node) {
        this.unSelect();
        return;
      }
      if (this.selectedObject === node) {
        cameraManager.setOutline([]);
        this.selectedObject = null;
      } else {
        cameraManager.setOutline([node]);
        this.selectedObject = node;
      }
    }

    unSelect() {
      const { cameraManager } = SceneManager;
      this.selectedObject = null;
      cameraManager.setOutline([]);
    }

    onSelect = (event: MouseEvent) => {
        const {cameraManager, cache } = SceneManager;
        this.updateSelectPosition(event);
        this.selectRaycaster.setFromCamera(this.selectPosition, cameraManager.instance);
        const intersects = this.selectRaycaster.intersectObjects(SceneManager.cache.selectList);
        const intersectedObject = intersects[0]?.object;
        // 处理相交的物体
        if (intersectedObject) {
          if(cache.include(intersectedObject.uuid)) {
            // 选中的是场景中的物体
            this.select(intersectedObject);
          } else {
            // 1. 选中的是模型的子物体
            this.select(cache.getIncludeParent(intersectedObject));
          }
        } else {
            this.unSelect();
        }
      };
}