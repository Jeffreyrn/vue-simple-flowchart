<template>
  <div class="flowchart-node" :style="nodeStyle" 
    @mousedown="handleMousedown"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
    v-bind:class="{selected: options.selected === id}">
    <div class="node-port node-input" :class="{ 'node-port-start': isStart }"
       @mousedown="inputMouseDown"
       @mouseup="inputMouseUp">
    </div>
    <div :id="'node-main_' + id" class="node-main">
       <div v-if="isStart" class="node-start">
        <span>Conversation Start</span>
      </div>
      <div ref="nodeType" :id="'node-type_' + id" v-text="type" class="node-type"></div>
      <div class="node-label" :id="'label_' + id">
        <div ref="labelTitle" class="node-label-title" :id="'label-title_' + id" v-text="label" />
        <div v-if="buttons.length > 0" class="node-buttons">
         <div v-for="(button, index) in buttons" :key="index" :id="'button_' + id + '_' + index" class="node-label-button">
           <span>{{button.text}}</span>
           <div class="node-port node-output" :id="'port_' + id + '_' + index" :class="{ 'node-port-start': isStart }" 
            :style="buttonPortStyle(index)"
            @mousedown="outputMouseDown"
            @mousemove="outputMouseMove"
            @mouseleave="outputMouseUp"></div>
         </div>
      </div>
      </div>
    </div>
    <div v-if="buttons.length === 0" :id="'node-output_' + id" class="node-port node-output" :class="{ 'node-port-start': isStart }"
      @mousedown="outputMouseDown"
      @mousemove="outputMouseMove"
      @mouseleave="outputMouseUp">
    </div>
    <div v-show="show.delete" class="node-delete">&times;</div>
  </div>
</template>

<script>
export default {
  name: 'FlowchartNode',
  props: {
    id: {
      type: Number,
      default: 1000,
      validator(val) {
        return typeof val === 'number'
      }
    },
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
    centeredX: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === 'number'
      }
    },    
    centeredY: {
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
    },
    isStart: {
      type: Boolean,
      default() {
        return false;
      }
    },
    buttons: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      show: {
        delete: false,
      },
      linkingStart: false
    }
  },
  mounted() {
  },
  computed: {
    nodeStyle() {
      return {
        top: ((this.centeredY || this.y)  * this.options.scale) + 'px', // remove: this.options.offsetTop + 
        left: ((this.centeredX || this.x) * this.options.scale) + 'px', // remove: this.options.offsetLeft + 
        transform: `scale(${this.options.scale})`,
      }
    }
  },
  methods: {
     buttonPortStyle(index) {
      const nodeTypeElement = this.$refs.nodeType;
      if (!nodeTypeElement) { return; }

      const labelTitleElement = this.$refs.labelTitle;
      if (!labelTitleElement) { return; }

      const nodeTypeHeight = nodeTypeElement.clientHeight;
      const labelTitleHeight = labelTitleElement.clientHeight + 16;

      let buttonHeight = labelTitleHeight + nodeTypeHeight;
      for (let i = index; i >= 0; i--) {
        const element = document.getElementById('button_' + this.id + '_' + i);
        if(!element) { continue; }
        if(i === index) {
          buttonHeight += element.clientHeight/1.5;
        } else {
          buttonHeight += element.clientHeight;
        }
      }

      return {
        top: buttonHeight + 'px',
        right: '10px'
      }
    },
    handleMousedown(e) {
      const target = e.target || e.srcElement;
      // console.log(target);
      if (target.className.indexOf('node-input') < 0 && target.className.indexOf('node-output') < 0) {
        this.$emit('nodeSelected', e);
      }
      e.preventDefault();
    },
    handleMouseOver() {
      this.show.delete = true;
    },
    handleMouseLeave() {
      this.show.delete = false;
    },
    outputMouseDown(e) {
      this.linkingStart = true;
      e.preventDefault();
    },
    outputMouseMove(e) {
      if(this.linkingStart) {
       this.$emit('linkingStart')
      }
    },
    outputMouseUp(e) {
      this.linkingStart = false;
      e.preventDefault();
    },
    inputMouseDown(e) {
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
$themeColor: rgb(255, 136, 85);
$portSize: 16;

.flowchart-node {
  margin: 0;
  width: 250px;
  position: absolute;
  box-sizing: border-box;
  border: none;
  z-index: 1;
  opacity: .9;
  cursor: move;
  transform-origin: top left;
  .node-main {
    text-align: center;
    .node-start{
      margin: 0 auto;
      background: #e4392b;
      padding: 6px;
      width: 200px;
      border-radius: 4px;
      position: relative;
      span{
        color: #FFF;
        font-size: 14px;
        font-weight: 600;
      }
    }
    .node-type {
      background: #fff7e2;
      border: 2px solid #fee196;
      border-radius: 6px;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
      color: black;
      font-size: 16px;
      font-weight: 600;
      padding: 6px;
    }
    .node-label {
      font-size: 14px;
      padding: 16px;
      background: #FFF;
      border: 2px solid #e0e6ed;

      .node-label-title{
        border-radius: 4px;
        background: #DFDFDF;
        padding: 10px;
      }
      .node-label-button{
        border: 1px solid #dfdfdf;
        border-radius: 4px;
        background: #EFEFEF;
        color: #0084ff;
        padding: 10px;
        font-weight: 600;
      }
    }
  }
  .node-port {
    position: absolute;
    width: #{$portSize}px;
    height: #{$portSize}px;
    top: 50%;
    transform: translateY(-50%);
    border: 1px solid #ccc;
    border-radius: 100px;
    background: #8492a6;
    opacity: 0.8;
    &:hover {
      background: $themeColor;
      border: 1px solid $themeColor;
    }
    &.node-port-start {
      margin-top: 30px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .node-input {
    left: #{-2+$portSize/-3}px;
  }
  .node-output {
    right: #{-2+$portSize/-3}px;
  }
  .node-delete {
    position: absolute;
    right: -6px;
    top: -6px;
    font-size: 12px;
    width: 12px;
    height: 12px;
    color: $themeColor;
    cursor: pointer;
    background: white;
    border: 1px solid $themeColor;
    border-radius: 100px;
    text-align: center;
    &:hover{
      background: $themeColor;
      color: white;
    }
  }
}
.selected {
  box-shadow: 0 0 0 2px $themeColor;
}
</style>
