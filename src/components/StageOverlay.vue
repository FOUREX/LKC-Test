<script>
import Chat from "./Chat.vue";

export default {
  components: {Chat},
  props: {
    board: Object,
    onAddImage: Function,
    onAddRect: Function,
    onAddNote: Function,
    onSaveBoard: Function,
    onLoadBoard: Function
  },

  data() {
    return  {
      chat: undefined
    }
  },

  mounted() {
    this.chat = this.$refs.chat
  },

  methods: {
    toggleChat() {
      this.chat.switch()
    },
  },
}
</script>

<template>
  <div class="absolute inset-0 w-full h-full z-50 pointer-events-none">
    <div class="flex justify-between">
      <div class="flex flex-col flex-grow h-min gap-1 p-1 max-w-12 bg-white rounded-[10px] m-3 pointer-events-auto">
        <div class="menu-item" @click="onAddImage"><img src="../assets/image-plus.svg" alt></div>
        <div class="menu-item" @click="onAddRect"><img src="../assets/rectangle-plus.svg" alt></div>
        <div class="menu-item" @click="onAddNote"><img src="../assets/note-plus.svg" alt></div>
        <div class="menu-item"><img src="../assets/image-plus.svg" alt></div>
      </div>

      <div class="flex flex-grow justify-end gap-3 m-3">
        <Chat ref="chat" :board="this.board" />

        <div class="flex flex-col flex-grow h-min gap-1 p-1 max-w-12 bg-white rounded-[10px] pointer-events-auto">
          <div class="menu-item" @click="toggleChat"><img src="../assets/starts.svg" alt="Chat"></div>
          <div class="menu-item" @click="onLoadBoard"><img src="../assets/image-plus.svg" alt="Load"></div>
          <div class="menu-item" @click="onLoadBoard"><img src="../assets/image-plus.svg" alt="Load"></div>
        </div>
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