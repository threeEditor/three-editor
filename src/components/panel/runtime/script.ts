/**
 * 测试脚本
 * 脚本中的变量只能通过
 */

// @ts-ignore
const SceneManager = window.three_editor.sceneManager;

class Component {
    log() {
        console.log('*** Component log ***');
    }
};
const component = new Component()
component.log();
SceneManager.sky.setPure('#f00');
console.log('*** executeScript ***')