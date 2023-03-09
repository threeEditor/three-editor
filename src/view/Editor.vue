<template>
  <Top />
  <el-row type="flex" style="width: 100%; height: calc(100% - 50px)">
    <LeftPanel />
    <MyCanvas />
    <RightPanel />
  </el-row>
</template>
<script setup lang="ts">
import Top from "@/components/Top/Top.vue";
import LeftPanel from "@/components/LeftPanel/LeftPanel.vue";
import RightPanel from "@/components/RightPanel/RightPanel.vue";
import MyCanvas from "@/components/MyCanvas/MyCanvas.vue";

import { getCurrentInstance } from 'vue';
import EditManager from "@/edit/core";
import { SceneManagerEvent } from "@/edit/event";
import { Cube } from "../factory";

let editManager: EditManager | null = null;


setTimeout(() => {
  if(editManager) {
    // mock: 模拟外侧添加
    const sceneManager = editManager.sceneManager;
    sceneManager.addModel({
      type: 'gltf',
      url: 'https://gw.alipayobjects.com/os/bmw-prod/5e3c1e4e-496e-45f8-8e05-f89f2bd5e4a4.glb'
    }, model => {
      // Tip test
      model.scale.set(5, 5, 5)
    })
    const cube = Cube({ size: 5, color: '#ff0' });
    sceneManager.add({
      type: 'mesh',
      object: cube
    })
    
  }
}, 1000);

MyCanvas.mounted = () => {
  const instance = getCurrentInstance()
  if(instance === null) {
    console.warn('canvas is null');
    return;
  }
  const wrap = instance.refs.MyCanvasWrap as HTMLElement;
  editManager = new EditManager(wrap);
  
  // 监听场景加载完成
  editManager.sceneManager.on(SceneManagerEvent.SCENELOAD, (sceneConfig) => {
    console.log('sceneConfig loaded', sceneConfig)
  })

  // 初始化设置场景
  editManager.setUp();
}

MyCanvas.beforeUnmount = () => {
  if(editManager) {
    editManager.destroy();
  }
}
</script>
<style lang="scss"></style>
