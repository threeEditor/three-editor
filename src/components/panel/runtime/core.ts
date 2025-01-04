import SceneManager from "@/edit/sceneManager/sceneManager";
import TestComponentScript from './script.ts?raw';


// 绑定全局变量
// @ts-ignore
window.three_editor = {
    sceneManager: SceneManager,
};

export function executeScript() {
  // 定义要执行的脚本内容
  const scriptContent = TestComponentScript;

  // 使用 new Function 创建函数
  const dynamicFunction = new Function(scriptContent);

  // 执行函数
  try {
      dynamicFunction();
      // 检查全局变量是否更新
  } catch (error) {
      console.error('Error executing script:', error);
  }
}