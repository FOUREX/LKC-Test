<script>
import Konva from 'konva';

export default {
  data() {
    return {
      stage: undefined,
      name: "LKC",
      stageConfig: {
        width: window.innerWidth,
        height: window.innerHeight,
        offsetX: -window.innerWidth / 2,
        offsetY: -window.innerHeight / 2,
        scaleX: 1,
        scaleY: 1,
      },
      layers: [],
      currentLayer: undefined,
      transformer: undefined,
      selectedNode: null
    }
  },

  mounted() {
    this.stage = this.$refs.stage.getStage()
    this.transformer = new Konva.Transformer()

    const layer = new Konva.Layer()

    layer.add(this.transformer)
    this.layers.push(layer)

    this.currentLayer = this.layers[0]

    this.stage.add(this.currentLayer)

    window.addEventListener("resize", this.onWindowResize)
    this.stage.on("wheel", this.onMouseScroll)
    this.stage.on('click tap', this.onClick);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.onWindowResize)
    this.stage.off("wheel", this.onMouseScroll)
  },

  methods: {
    serializeScene() {
      console.log(JSON.stringify(this.items))
      return JSON.stringify(this.items);
    },

    deserializeScene(data) {
      this.items = JSON.parse(data)
    },

    getContext() {
      return this.layers.flatMap(layer =>
        layer.getChildren()
          .filter(child => child instanceof Konva.Text)
          .map((child, index) => ({
            role: `Note ${index + 1}`,
            content: child.attrs.text
          }))
      )
    },

    onImageAdd() {
      console.log("onImageAdd")
    },

    addRectangle() {
      console.log("addRectangle")

      const rect = new Konva.Rect({
        x: 50,
        y: 60,
        width: 100,
        height: 100,
        fill: Konva.Util.getRandomColor(),
        draggable: true,
      })

      this.currentLayer.add(rect)
    },

    addNote() {
      const text = new Konva.Text({
        x: 20,
        y: 60,
        text: "Кря!",
        fontSize: 24,
        fontFamily: 'Calibri',
        fill: 'red',
        padding: 5,
        align: 'center',
        draggable: true,
      })

      this.currentLayer.add(text)
    },

    onMouseScroll(e) {
      this.getContext()

      e.evt.preventDefault();

      const stage = this.stage;
      const oldScale = stage.scaleX();

      const mousePointTo = {
        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
      };

      const delta = e.evt.deltaY;
      const newScale = oldScale + -delta / 1000;

      if (newScale <= 0.000001) {
        return
      }

      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
        y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
      };

      stage.position(newPos);
      stage.batchDraw();
    },

    onWindowResize() {
      this.stage.width(window.innerWidth)
      this.stage.height(window.innerHeight)
    },

    onClick(e) {
      if (e.target instanceof Konva.Stage) {
        this.transformer.nodes([]);
        this.selectedNode = null;
        return;
      }

      if (e.target.getParent()?.className === 'Transformer') {
        return;
      }

      this.selectedNode = e.target;
      this.transformer.nodes([e.target]);
      this.onNodeSelected()
    },

    onNodeSelected() {
      if (this.selectedNode instanceof Konva.Text) {
        const text = prompt("Text:")
        this.selectedNode.text(text)
      }
    },
  },
};
</script>

<template>
  <v-stage
      ref="stage"
      :config="stageConfig"
  />
</template>

<style scoped>

</style>