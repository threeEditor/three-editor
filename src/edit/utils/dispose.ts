import { Material, Mesh, Object3D } from "three";

export function removeAllChild(node: Object3D) {
    if(!node.children) {
      if(node.parent) {
        node.parent.remove(node);
        if(node instanceof Mesh) {
          node.geometry.dispose();
          if(node.material instanceof Material) {
            node.material.dispose();
          } else if(Array.isArray(node.material)) {
            node.material.forEach((material) => material.dispose());
          }
        }
      }
    } else {
      node.children.forEach(child => {
        removeAllChild(child);
      })
    }
  }