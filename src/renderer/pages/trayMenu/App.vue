<template>
  <div ref="menuRef" class="tray-menu">右键菜单</div>
</template>

<script setup lang="ts">
import { useDomResize } from "@renderer/hooks";
import { debounce } from "lodash";
import { ref } from "vue";

const menuRef = ref<HTMLElement | null>(null);

const onResizeTrayWindow = debounce(() => {
  const { scrollWidth, scrollHeight } = menuRef.value!;
  window.electronAPI.trayMenuResize(scrollWidth, scrollHeight);
}, 300);

useDomResize(() => menuRef.value, onResizeTrayWindow);
</script>

<style lang="scss">
.tray-menu {
  background-color: #fff;
  width: 100px;
  height: 200px;
}
</style>
