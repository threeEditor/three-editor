import { Object3D, Ray, Raycaster, Sphere, Sprite, Vector2 } from "three";
import SceneManager from "../sceneManager/sceneManager";
import EventEmitter from "eventemitter3";

export class Selector extends EventEmitter {
    private selectPosition = new Vector2();
    private selectRaycaster = new Raycaster();
    private selectedObject: Object3D | null = null;
    private selectedSprite: Sprite | null = null;

    constructor() {
      super();
      // 扩展 Raycaster 的相交测试方法
    }

    private updateSelectPosition(event: MouseEvent) {
        const { sizes, wrap } = SceneManager;
        const { top, left } = wrap.getBoundingClientRect();
        this.selectPosition.set(
            ((event.clientX - left) / sizes.width) * 2 - 1,
            -((event.clientY - top) / sizes.height) * 2 + 1
        )
    }

    select(node: Object3D | null) {
      const { cameraManager } = SceneManager;
      if(!node) {
        this.unSelect();
        return;
      }
      this.selectedSprite && this.unSelectSprite();
      // select self
      if (this.selectedObject === node) {
        return this.unSelect();
      }

      // unselect other node
      if(this.selectedObject) {
        this.unSelect();
      }

      // select current
      cameraManager.setOutline([node]);
      this.selectedObject = node;
      // console.log('select')
      this.emit('select', node.userData.connectObject);
    }

    selectSprite(node: Sprite) {
      this.selectedObject && this.unSelect();

      // select self
      if (this.selectedSprite === node) {
        return this.unSelectSprite();
      }
      // unselect other sprite
      if(this.selectedSprite) {
        this.unSelectSprite();
      }
      // select current sprite
      node.userData.outline.visible = true;
      this.selectedSprite = node;
      // console.log('selectSprite')
      this.emit('select', node.userData.connectObject);
    }

    unSelectSprite() {
      if(!this.selectedSprite) return;
      this.emit('unselect', this.selectedSprite.userData.connectObject);
      this.selectedSprite.userData.outline.visible = false;
      this.selectedSprite = null;
      // console.log('unSelectSprite')
      
    }

    unSelect() {
      if(!this.selectedObject) return;
      this.emit('unselect', this.selectedObject.userData.connectObject);
      const { cameraManager } = SceneManager;
      this.selectedObject = null;
      cameraManager.setOutline([]);
      // console.log('unSelect')
    }

    onSelect = (event: MouseEvent) => {
        const {cameraManager, cache } = SceneManager;
        this.updateSelectPosition(event);
        this.selectRaycaster.setFromCamera(this.selectPosition, cameraManager.instance);
        const selectList: Object3D[] = [];
        SceneManager.cache.selectList.forEach(node => {
          if(node.type === 'Sprite') {
            selectList.push(node.userData.outline);
          } else {
            selectList.push(node);
          }
        })

        // Object3D
        const intersects = this.selectRaycaster.intersectObjects(selectList);

        const intersectedObject = intersects[0]?.object;        
        // 选中 Object3D
        if (intersectedObject) {

          if(intersectedObject?.parent?.type === 'Sprite') {
            this.selectSprite(intersectedObject.parent as Sprite);
            return;
          }

          if(cache.include(intersectedObject.uuid)) {
            // 选中的是场景中的物体
            this.select(intersectedObject);
          } else {
            // 1. 选中的是模型的子物体
            this.select(cache.getIncludeParent(intersectedObject));
          }
          return;
        }

        this.unSelect();
        this.unSelectSprite();
      };
}