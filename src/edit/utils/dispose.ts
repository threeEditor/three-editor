import { Material, Mesh, Object3D } from 'three';

export function removeAllChild(node: Object3D) {
  const children = node?.children;
  if (children?.length > 0) {
    // 递归删除子节点
    children.forEach((child) => {
      removeAllChild(child);
    });
  } else {
    // 删除当前节点（从叶子节点到根节点）
    if (node.parent) {
        // 先删除当前节点
      node.parent.remove(node);
      console.debug('删除当前节点', node);
      // 释放 geometry 和 material 资源
      if (node instanceof Mesh) {
        node.geometry.dispose();

        if (node.material instanceof Material) {
          node.material.dispose();
        } else if (Array.isArray(node.material)) {
          node.material.forEach((material) => material.dispose());
        }
      }
    }
  }
}
