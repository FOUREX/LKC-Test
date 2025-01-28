<script>
export default {
  props: {
    onImageAdd: Function,
    onRectAdd: Function,
    onBoardSave: Function,
    onBoardLoad: Function
  }
}
</script>

<template>
  <div class="absolute inset-0 w-full h-full z-50 pointer-events-none">
    <div class="flex justify-between">
      <div class="flex flex-col flex-grow h-min gap-1 p-1 max-w-12 bg-white rounded-[10px] m-3 pointer-events-auto">
        <div class="menu-item" @click="onImageAdd"><img src="../assets/image-plus.svg" alt></div>
        <div class="menu-item" @click="onRectAdd"><img src="../assets/rectangle-plus.svg" alt></div>
        <div class="menu-item"><img src="../assets/image-plus.svg" alt></div>
        <div class="menu-item"><img src="../assets/image-plus.svg" alt></div>
      </div>

      <div class="flex flex-col flex-grow h-min gap-1 p-1 max-w-12 bg-white rounded-[10px] m-3 pointer-events-auto">
        <div class="menu-item" @click="onBoardSave"><img src="../assets/image-plus.svg" alt="Save"></div>
        <div class="menu-item" @click="onBoardLoad"><img src="../assets/image-plus.svg" alt="Load"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-item {
  border-radius: 6px;
  padding: 2px;
  user-select: none;
}

.menu-item:hover {
  background-color: #eee;
  cursor: pointer;
}

.menu-item:active {
  background-color: #ccc;
  cursor: pointer;
  transform: scale(90%);
  transition: transform .2s;
}
</style>