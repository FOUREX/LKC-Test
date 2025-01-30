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

    onAddNote() {
      this.board.addNote()
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
    :board="this.board"
    :on-add-rect="onAddRectangle"
    :on-add-note="onAddNote"
    :on-save-board="onBoardSave"
    :on-load-board="onBoardLoad"
  />

  <Board ref="board" />
</template>

<style scoped>
</style>
