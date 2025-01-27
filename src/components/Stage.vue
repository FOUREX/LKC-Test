<template>
  <div class="relative overflow-hidden">
    <div class="absolute inset-0 w-screen h-screen z-50 pointer-events-none">
      <div class="flex justify-between">
        <div class="flex flex-col flex-grow h-min gap-1 p-1 max-w-12 bg-white rounded-[10px] m-3 pointer-events-auto">
          <div class="menu-item" @click="onImageAdd"><img src="../assets/image-plus.svg" alt></div>
          <div class="menu-item" @click="onRectAdd"><img src="../assets/rectangle-plus.svg" alt></div>
          <div class="menu-item"><img src="../assets/image-plus.svg" alt></div>
          <div class="menu-item"><img src="../assets/image-plus.svg" alt></div>
        </div>

        <div class="flex flex-col flex-grow h-min gap-1 p-1 max-w-12 bg-white rounded-[10px] m-3 pointer-events-auto">
          <div class="menu-item"><img src="../assets/image-plus.svg" alt></div>
        </div>
      </div>
    </div>
    <v-stage
        ref="stage"
        :config="stageSize"
        @mousedown="handleStageMouseDown"
        @touchstart="handleStageMouseDown"
    >
      <v-layer ref="layer">
        <v-rect
            v-for="item in items"
            :key="item.id"
            :config="item"
            @transformend="handleTransformEnd"
        >Pizdsdddddddddddddddec
        </v-rect>
        <v-transformer ref="transformer"/>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import Konva from 'konva';
const width = window.innerWidth;
const height = window.innerHeight;

export default {
  data() {
    return {
      stage: undefined,
      stageSize: {
        width: width,
        height: height,
        offsetX: -width / 2,
        offsetY: -height / 2,
      },
      items: [
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
      selectedShapeName: '',
      scale: 1
    };
  },
  mounted() {
    this.stage = this.$refs.stage.getStage();

    this.stage.on("wheel", this.onMouseScroll)
    window.addEventListener("resize", this.onWindowResize)
  },
  beforeUnmount() {

  },
  methods: {
    onImageAdd() {
      console.log("onImageAdd")
    },
    onRectAdd() {
      const newId = this.items.length + 1;
      this.items.push({
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
      // shape is transformed, let us save new attrs back to the node
      // find element in our state
      const rect = this.items.find(
          (r) => r.name === this.selectedShapeName
      );
      // update the state
      rect.x = e.target.x();
      rect.y = e.target.y();
      rect.rotation = e.target.rotation();
      rect.scaleX = e.target.scaleX();
      rect.scaleY = e.target.scaleY();

      // change fill
      rect.fill = Konva.Util.getRandomColor();
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
      const rect = this.items.find((r) => r.name === name);
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
