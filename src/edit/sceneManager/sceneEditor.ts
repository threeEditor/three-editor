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
        // model 动画 update 后续优化是否实时更新
        SceneManager._modelAnimationMixer.forEach((mixer) => {
            mixer.update(0.01);
        });
        // 更新粒子
        // SceneManager._particleList.forEach((particle) => {
        //     particle.update();
        // })
        if (SceneManager.cameraManager.outlinePassEnable) {
            // console.log('&&&')
            SceneManager.cameraManager.update();
          } else {
            // const currentCamera = SceneManager._sceneType
            SceneManager.renderer.update(SceneManager.cameraManager.instance);
          }
    }
}