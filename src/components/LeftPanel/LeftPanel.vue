<template>
  <div class="LeftPanel">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="基本形状" name="1"></el-collapse-item>
      <el-collapse-item title="灯光" name="2"> </el-collapse-item>
      <el-collapse-item title="相机" name="3"></el-collapse-item>
    </el-collapse>
  </div>
</template>
<script setup lang="ts">
import { ref, Ref } from "vue";
let activeNames: Ref<string> = ref("1");
const handleChange = () => {};
</script>
<style lang="scss">
.LeftPanel {
  width: 200px;
  height: 100%;
  background-color: #fff;
  border-right: 1px solid #888;
}
</style>
