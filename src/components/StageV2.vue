<script>
import StageOverlay from "./StageOverlay.vue";
import Board from "./Board.vue";

export default {
  components: {
    StageOverlay,
    Board
  },

  data() {
    return {
      board: null
    };
  },

  mounted() {
    this.board = this.$refs.board
  },

  methods: {
    onAddRectangle() {
      this.board.addRectangle()
    },

    onBoardSave() {
      localStorage.setItem("board", this.board.serializeScene())
    },

    onBoardLoad() {
      this.board.deserializeScene(localStorage.getItem("board"))
    }
  }
};
</script>

<template>
  <StageOverlay
      :on-rect-add="onAddRectangle"
      :on-board-save="onBoardSave"
      :on-board-load="onBoardLoad"
  />

  <Board ref="board" />
</template>

<style scoped>
</style>
