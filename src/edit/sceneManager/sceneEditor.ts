import SceneManager from "./sceneManager";

export class SceneEditor {

    static triggerOff() {
        SceneManager.cameraManager.setEnabled(false);
        SceneManager.grid?.setEnabled(false);
        SceneManager.selector.unSelect();
        SceneManager.selector.unSelectSprite();
        SceneManager.selector.setEnabled(false);
    }

    static triggerIn() {
        SceneManager.cameraManager.setEnabled(true);
        SceneManager.grid?.setEnabled(true);
        SceneManager.selector.setEnabled(true);
    }
    
    static update() {
        if (SceneManager.cameraManager.outlinePassEnable) {
            // console.log('&&&')
            SceneManager.cameraManager.update();
          } else {
            // const currentCamera = SceneManager._sceneType
            SceneManager.renderer.update(SceneManager.cameraManager.instance);
          }
    }
}