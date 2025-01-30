<script>
// @ts-nocheck Йоу, дякую вью, що мені це доводиться робити

import Message from "./Message.vue";
import {Chat} from "../api/index.js";

// Можливо знадобиться повністю перезавантажити сторінку при зміні чогось тут :\
export default {
  components: {Message},
  props: {
    board: {
      type: Object
    }
  },
  data() {
    return {
      visible: true,
      waitingForResponse: false,
      messageBox: "",
      messages: []
    }
  },

  mounted() {
    this.messageBox = this.$refs.messageBox
    this.messageBox.value = ""
  },

  updated() {
    this.scrollToBottom()
  },

  methods: {
    show() {
      this.visible = true;
    },

    hide() {
      this.visible = false;
    },

    switch() {
      this.visible = !this.visible;
    },

    scrollToBottom() {
      const container = this.$refs.messageContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },

    sendMessage() {
      const context = this.board.getContext()

      const message = this.messageBox.value.trim();
      this.messageBox.value = ""

      if (message === "") { return }

      this.waitingForResponse = true;

      this.messages.push({
        role: "user",
        content: message,
      })

      Chat.generate([...context, ...this.messages])
        .then(this.onMessageReceived)
        .catch(this.onSendMessageError)
        .finally(() => {
          this.waitingForResponse = false
        })
    },

    onMessageReceived(res) {
      this.messages.push(res.data.message)
    },

    onSendMessageError(err) {
      this.messages.push({
        role: "assistant",
        content: err.message,
        error: true,
      })
    }
  }
}
</script>

<template>
  <div
      class="flex flex-col gap-3 inset-0 w-[300px] h-[500px] p-[5px] bg-[#212121] pointer-events-auto rounded-[10px]"
      v-show="visible"
  >
    <div class="flex justify-center w-full bg-[#171717] rounded-[5px]">
      Not Chat GPT
    </div>

    <div ref="messageContainer" class="flex flex-col gap-2 w-full overflow-y-auto grow">
      <Message
          :role="message.role"
          :content="message.content"
          :error="message.error"
          v-for="message in messages"
      />
    </div>

    <div class="flex justify-center gap-2 w-full">
      <input
          ref="messageBox"
          class="w-full bg-[#2f2f2f] rounded-[5px] min-w-0 px-2 py-[2px]"
          placeholder=Запит
          type="text"
          @keyup.enter="sendMessage"
      >

      <button
          :disabled="waitingForResponse"
          class="send-message-button text-black rounded-[5px] p-1 w-auto h-auto"
          type="submit"
          @click="sendMessage"
      >
        <img class="h-full" src="../assets/arrow-up.svg" alt />
      </button>
    </div>
  </div>
</template>

<style scoped>
.send-message-button {
  background: #fff;
}

.send-message-button:not(:disabled):hover {
  background: #eee;
  cursor: pointer;
}

.send-message-button:disabled {
  background: #aaa;
}
</style>