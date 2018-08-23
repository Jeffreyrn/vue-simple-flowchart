<template>
  <div class="flowchart-node" :style="nodeStyle" @mousedown="handleNodeSelected">
    <div class="node-port node-input"
       @mousedown="inputMouseDown"
       @mouseup="inputMouseUp"></div>
    <div class="node-main">
      <div v-text="type"></div>
      <div v-text="label"></div>
    </div>
    <div class="node-port node-output" 
      @mousedown="outputMouseDown"></div>
  </div>
</template>

<script>
export default {
  name: 'FlowchartNode',
  props: {
    x: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === 'number'
      }
    },    
    y: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === 'number'
      }
    },
    type: {
      type: String,
      default: 'Default'
    },
    label: {
      type: String,
      default: 'input name'
    },
    options: {
      type: Object,
      default() {
        return {
          centerX: 1024,
          scale: 1,
          centerY: 140,
        }
      }
    }
  },
  mounted() {
  },
  computed: {
    nodeStyle() {
      return {
        top: this.options.offsetTop + this.options.centerY + this.y * this.options.scale + 'px',
        left: this.options.offsetLeft + this.options.centerX + this.x * this.options.scale + 'px',
        transform: 'scale(' + (this.options.scale + '') + ')',
      }
    }
  },
  methods: {
    handleNodeSelected(e) {
      const target = e.target || e.srcElement;
      console.log(target)
      if (target.className.indexOf('node-input') < 0 && target.className.indexOf('node-output') < 0) {
        this.$emit('nodeSelected', e);
      }
      e.preventDefault();
    },
    outputMouseDown(e) {
      this.$emit('linkingStart')
      e.preventDefault();
    },
    inputMouseDown(e) {
      this.$emit('linkingBreak')
      e.preventDefault();
    },
    inputMouseUp(e) {
      this.$emit('linkingStop')
      e.preventDefault();
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.flowchart-node {
  margin: 0;
  width: 80px;
  height: 80px;
  position: absolute;
  box-sizing: border-box;
  border: none;
  background: #ccc;
  z-index: 1;
  opacity: .9;
  cursor: move;
  transform-origin: top left;
  .node-main {
    margin-top: 10px;
  }
  .node-port {
    position: absolute;
    width: 10px;
    height: 10px;
    left: 50%;
    transform: translate(-50%);
    border: 1px solid #ccc;
    border-radius: 100px;
    background: white;
    &:hover {
      background: rgb(255, 136, 85);
      border: 1px solid rgb(255, 136, 85);
    }
  }
  .node-input {
    top: -5px;
  }
  .node-output {
    bottom: -5px;
  }
}
</style>
