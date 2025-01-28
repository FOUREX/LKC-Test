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
      items: {
        rectangles: [
          {
            rotation: 0,
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            scaleX: 1,
            scaleY: 1,
            fill: 'red',
            name: 'rect1',
            draggable: true,
          },
          {
            rotation: 0,
            x: 150,
            y: 150,
            width: 100,
            height: 100,
            scaleX: 1,
            scaleY: 1,
            fill: 'green',
            name: 'rect2',
            draggable: true,
          },
        ],
        images: [

        ]
      },

      selectedShapeName: ''
    };
  },

  mounted() {
    this.stage = this.$refs.stage.getStage()

    window.addEventListener("resize", this.onWindowResize)
    this.stage.on("wheel", this.onMouseScroll)
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.onWindowResize)
    this.stage.off("wheel", this.onMouseScroll)
  },

  methods: {
    serializeScene() {
      console.log(JSON.stringify(this.items))
      return JSON.stringify(this.items)
    },

    deserializeScene(data) {
      const newItems = JSON.parse(data)
      console.log(data)
      console.log(this.serializeScene())

      // VUE не бачить коли this.items оновлюється цілком
      this.items = newItems
    },

    onImageAdd() {
      console.log("onImageAdd")
    },

    addRectangle() {
      const newId = this.items.rectangles.length + 1;
      this.items.rectangles.push({
        rotation: 0,
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        scaleX: 1,
        scaleY: 1,
        fill: Konva.Util.getRandomColor(),
        name: `rect${newId}`,
        draggable: true,
      });
    },

    onMouseScroll(e) {
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
      this.stage.width(window.innerWidth);
      this.stage.height(window.innerHeight);
    },

    handleTransformEnd(e) {
      // Находим индекс прямоугольника в массиве
      const rectIndex = this.items.rectangles.findIndex(
          (r) => r.name === this.selectedShapeName
      );

      if (rectIndex !== -1) {
        // Создаем новый массив прямоугольников с обновленным элементом
        const updatedRectangles = [...this.items.rectangles];
        updatedRectangles[rectIndex] = {
          ...updatedRectangles[rectIndex],
          x: e.target.x(),
          y: e.target.y(),
          rotation: e.target.rotation(),
          scaleX: e.target.scaleX(),
          scaleY: e.target.scaleY(),
          fill: Konva.Util.getRandomColor()
        };

        // Обновляем состояние реактивно
        this.items = {
          ...this.items,
          rectangles: updatedRectangles
        };
      }
    },
    handleStageMouseDown(e) {
      // clicked on stage - clear selection
      if (e.target === e.target.getStage()) {
        this.selectedShapeName = '';
        this.updateTransformer();
        return;
      }

      // clicked on transformer - do nothing
      const clickedOnTransformer =
          e.target.getParent().className === 'Transformer';
      if (clickedOnTransformer) {
        return;
      }

      // find clicked rect by its name
      const name = e.target.name();
      const rect = this.items.rectangles.find((r) => r.name === name);
      if (rect) {
        this.selectedShapeName = name;
      } else {
        this.selectedShapeName = '';
      }
      this.updateTransformer();
    },
    updateTransformer() {
      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getNode();
      const stage = transformerNode.getStage();
      const { selectedShapeName } = this;

      const selectedNode = stage.findOne('.' + selectedShapeName);
      // do nothing if selected node is already attached
      if (selectedNode === transformerNode.node()) {
        return;
      }

      if (selectedNode) {
        // attach to another node
        transformerNode.nodes([selectedNode]);
      } else {
        // remove transformer
        transformerNode.nodes([]);
      }
    },
  },
};
</script>

<template>
  <v-stage
      ref="stage"
      :config="stageConfig"
      @mousedown="handleStageMouseDown"
      @touchstart="handleStageMouseDown"
  >
    <v-layer ref="layer">
      <v-rect
          v-for="item in items.rectangles"
          :key="item.id"
          :config="item"
          @transformend="handleTransformEnd"
      >Pizdsdddddddddddddddec
      </v-rect>
      <v-transformer ref="transformer"/>
    </v-layer>
  </v-stage>
</template>

<style scoped>

</style>