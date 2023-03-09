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

let editManager: EditManager | null = null;

MyCanvas.mounted = () => {
  const instance = getCurrentInstance()
  if(instance === null) {
    console.warn('canvas is null1')
    return;
  }
  const wrap = instance.refs.MyCanvasWrap as HTMLElement;
  editManager = new EditManager(wrap);
  editManager.setUp();
}

MyCanvas.beforeUnmount = () => {
  
}
</script>
<style lang="scss"></style>
