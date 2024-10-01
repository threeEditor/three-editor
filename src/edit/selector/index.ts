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
      // @ts-ignore
      Raycaster.prototype.intersectSprite = function (sprite: Sprite, recursive) {
        const ray = new Ray();
        ray.copy(this.ray).applyMatrix4(sprite.matrixWorld);
        // const spriteMaterial = sprite.material as SpriteMaterial;
        // const spriteGeometry = sprite.geometry;
        // const radius = sprite.scale.x * spriteMaterial.map!.image.width / 2;
        const { x, y, z } = sprite.scale;
        // scale 设置大小 === width/height 然后再 x Scale TODO 后续待优化
        const radius = Math.sqrt(x **2 + y ** 2 + z ** 2) * sprite.scale.x;
        // 检查射线与精灵的包围球是否相交
        const spriteBoundingSphere = new Sphere(sprite.position, radius);
        if (!ray.intersectsSphere(spriteBoundingSphere)) {
          return [];
        }
        // 这里可以根据具体需求进行更复杂的相交测试逻辑
        return [{
          distance: ray.origin.distanceTo(sprite.position),
          point: sprite.position.clone(),
          object: sprite,
        }];
      };
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
        const spriteList: Sprite[] = [];
        SceneManager.cache.selectList.forEach(node => {
          if(node.type === 'Sprite') {
            spriteList.push(node as Sprite);
          } else {
            selectList.push(node);
          }
        })

        // Object3D
        const intersects = this.selectRaycaster.intersectObjects(selectList);
        const intersectedObject = intersects[0]?.object;        
        // 选中 Object3D
        if (intersectedObject) {
          if(cache.include(intersectedObject.uuid)) {
            // 选中的是场景中的物体
            this.select(intersectedObject);
          } else {
            // 1. 选中的是模型的子物体
            this.select(cache.getIncludeParent(intersectedObject));
          }
          return;
        }

        // Sprite
        let intersectedSprite: Sprite | null = null;
        for (const sprite of spriteList) {
          // @ts-ignore
          const spriteIntersects = this.selectRaycaster.intersectSprite(sprite);
          if (spriteIntersects.length > 0) {
            // 处理与 Sprite 的相交
            intersectedSprite = spriteIntersects[0].object as Sprite;
          }
        }

        // 选中 Sprite
        if(intersectedSprite) {
          this.selectSprite(intersectedSprite);
          return;
        }

        this.unSelect();
        this.unSelectSprite();
      };
}