<template>
  <div>
    主窗口
    <el-button @click="handleClick">I am ElButton</el-button>
  </div>
</template>

<script setup lang="ts">
// todo
import { logger } from "@renderer/utils";

const handleClick = () => {
  logger.info("I am ElButton");
};
</script>

<style lang="scss">
// todo
</style>
