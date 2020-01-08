<template>
<div @mouseup="itemRelease" @mousemove="itemMove">
<div id="flowchart" class="flowchart"   @dragstart="onDragStart">
<div id="toolbar" class="flowchart-toolbar">
  <div class="flowchart-toolbar-item" @mousedown="(e) => itemClick(e, 'Rule')">
    <div class="square" />
    <span>Rule</span>
  </div>
   <div class="flowchart-toolbar-item" @mousedown="(e) => itemClick(e, 'Action')">
    <div class="square" />
    <span>Action</span>
  </div>
</div>
  <div class="flowchart-container" 
    @mousemove="handleMove" 
    @mouseup="handleUp"
    @mousedown="handleDown">
    <svg width="100%" :height="`${height}px`">
      <flowchart-link v-bind.sync="link" 
        v-for="(link, index) in lines" 
        :key="`link${index}`"
        @deleteLink="linkDelete(link.id)">
      </flowchart-link>
    </svg>
    <flowchart-node v-bind.sync="node" 
      v-for="(node, index) in scene.nodes" 
      :key="`node${index}`"
      :options="nodeOptions"
      @linkingStart="linkingStart(node.id)"
      @linkingStop="linkingStop(node.id)"
      @nodeSelected="nodeSelected(node.id, $event)">
    </flowchart-node>
  </div>
  <div class="dragging-node" v-if="moving" :style="{ top: `${draggingNodeTop}px`, left: `${draggingNodeLeft}px` }">
    <div class="dragging-node-title" />
    <div class="dragging-node-label" />
  </div>
</div>
</div>
</template>

<script>
import FlowchartLink from './FlowchartLink.vue';
import FlowchartNode from './FlowchartNode.vue';
import { getMousePosition } from '../assets/utilty/position';

export default {
  name: 'VueFlowchart',
  props: {
    scene: {
      type: Object,
      default() {
        return {
          centerX: 0,
          scale: 1,
          centerY: 0,
          nodes: [],
          links: [],
        }
      }
    },
    height: {
      type: Number,
      default: 400,
    },
    onDropNewNode: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      action: {
        linking: false,
        dragging: false,
        scrolling: false,
        selected: 0,
      },
      mouse: {
        x: 0,
        y: 0,
        lastX: 0,
        lastY: 0,
      },
      draggingLink: null,
      rootDivOffset: {
        top: 0,
        left: 0
      },
      moving: false,
      draggingNodeTop: 0,
      draggingNodeLeft: 0,
      actionType: ''
    };
  },
  components: {
    FlowchartLink,
    FlowchartNode,
  },
  computed: {
    nodeOptions() {
      return {
        centerY: this.scene.centerY,
        centerX: this.scene.centerX,
        scale: this.scene.scale,
        offsetTop: this.rootDivOffset.top,
        offsetLeft: this.rootDivOffset.left,
        selected: this.action.selected,
      }
    },
    lines() {
      const lines = this.scene.links.map((link) => {
        const fromNode = this.findNodeWithID(link.from)
        const toNode = this.findNodeWithID(link.to)
        let x, y, cy, cx, ex, ey;
        x = this.scene.centerX + (fromNode.centeredX || fromNode.x);
        y = this.scene.centerY + (fromNode.centeredY || fromNode.y);
        [cx, cy] = this.getPortPosition('right', x, y, fromNode.isStart);
        x = this.scene.centerX + (toNode.centeredX || toNode.x);
        y = this.scene.centerY + (toNode.centeredY || toNode.y);
        [ex, ey] = this.getPortPosition('left', x, y, fromNode.isStart);
        return { 
          start: [cx, cy], 
          end: [ex, ey],
          id: link.id,
        };
      })
      if (this.draggingLink) {
        let x, y, cy, cx;
        const fromNode = this.findNodeWithID(this.draggingLink.from)
        x = this.scene.centerX + (fromNode.centeredX || fromNode.x);
        y = this.scene.centerY + (fromNode.centeredY || fromNode.y);
        [cx, cy] = this.getPortPosition('bottom', x, y);
        // push temp dragging link, mouse cursor postion = link end postion 
        lines.push({ 
          start: [cx, cy], 
          end: [this.draggingLink.mx, this.draggingLink.my],
        })
      }
      return lines;
    }
  },
  mounted() {
    this.rootDivOffset.top = this.$el ? this.$el.offsetTop : 0;
    this.rootDivOffset.left = this.$el ? this.$el.offsetLeft : 0;
  },
  methods: {
    findNodeWithID(id) {
      return this.scene.nodes.find((item) => {
          return id === item.id
      })
    },
    getPortPosition(type, x, y, isStart) {
      if (type === 'right') {
        return [x + 250, isStart ? y + 100 : y + 70]
      }
      if (type === 'left') {
        return [x, y + 70]
      }
      if (type === 'top') {
        return [x + 40, y];
      }
      else if (type === 'bottom') {
        return [x + 40, y + 80];
      }
    },
    linkingStart(index) {
      this.action.linking = true;
      this.draggingLink = {
        from: index,
        mx: 0,
        my: 0,
      };
    },
    linkingStop(index) {
      // add new Link
      if (this.draggingLink && this.draggingLink.from !== index) {
        // check link existence
        const existed = this.scene.links.find((link) => {
          return link.from === this.draggingLink.from && link.to === index;
        })
        if (!existed) {
          let maxID = Math.max(0, ...this.scene.links.map((link) => {
            return link.id
          }))
          const newLink = {
            id: maxID + 1,
            from: this.draggingLink.from,
            to: index,
          };
          this.scene.links.push(newLink)
          this.$emit('linkAdded', newLink)
        }
      }
      this.draggingLink = null
    },
    linkDelete(id) {
      const deletedLink = this.scene.links.find((item) => {
          return item.id === id;
      });
      if (deletedLink) {
        this.scene.links = this.scene.links.filter((item) => {
            return item.id !== id;
        });
        this.$emit('linkBreak', deletedLink);
      }
    },
    nodeSelected(id, e) {
      this.action.dragging = id;
      this.action.selected = id;
      this.$emit('nodeClick', id);
      this.mouse.lastX = e.pageX || e.clientX + document.documentElement.scrollLeft
      this.mouse.lastY = e.pageY || e.clientY + document.documentElement.scrollTop
    },
    handleMove(e) {
      if (this.action.linking) {
        [this.mouse.x, this.mouse.y] = getMousePosition(this.$el, e);
        this.mouse.x = e.pageX || e.clientX + document.documentElement.scrollLeft;
        this.mouse.y = e.pageY || e.clientY + document.documentElement.scrollTop;

        const toolbarWidth = document.getElementById("toolbar").offsetWidth;
        const titleHeight = document.getElementById("title").offsetHeight + 15;

        [this.draggingLink.mx, this.draggingLink.my] = [this.mouse.x - toolbarWidth, this.mouse.y - titleHeight];
      }
      if (this.action.dragging) {
        this.mouse.x = e.pageX || e.clientX + document.documentElement.scrollLeft
        this.mouse.y = e.pageY || e.clientY + document.documentElement.scrollTop
        let diffX = this.mouse.x - this.mouse.lastX;
        let diffY = this.mouse.y - this.mouse.lastY;

        this.mouse.lastX = this.mouse.x;
        this.mouse.lastY = this.mouse.y;
        this.moveSelectedNode(diffX, diffY);
      }
      if (this.action.scrolling) {
        [this.mouse.x, this.mouse.y] = getMousePosition(this.$el, e);
        let diffX = this.mouse.x - this.mouse.lastX;
        let diffY = this.mouse.y - this.mouse.lastY;

        this.mouse.lastX = this.mouse.x;
        this.mouse.lastY = this.mouse.y;

        this.scene.centerX = diffX;
        this.scene.centerY = diffY;

        this.scene.nodes = this.scene.nodes.map((node) => ({
          ...node,
          centeredX: (node.centeredX || node.x) + diffX,
          centeredY: (node.centeredY || node.y) + diffY
        }))

        // this.hasDragged = true
      }
    },
    handleUp(e) {
      const target = e.target || e.srcElement;
      if (this.$el.contains(target)) {
        if (typeof target.className !== 'string' || target.className.indexOf('node-input') < 0) {
          this.draggingLink = null;
        }
        if (typeof target.className === 'string' && target.className.indexOf('node-delete') > -1) {
          // console.log('delete2', this.action.dragging);
          this.nodeDelete(this.action.dragging);
        }
      }
      this.action.linking = false;
      this.action.dragging = null;
      this.action.scrolling = false;
    },
    handleDown(e) {
      const target = e.target || e.srcElement;
      // console.log('for scroll', target, e.keyCode, e.which)
      if ((target === this.$el || target.matches('svg, svg *')) && e.which === 1) {
        this.action.scrolling = true;
        [this.mouse.lastX, this.mouse.lastY] = getMousePosition(this.$el, e);
        this.action.selected = null; // deselectAll
      }
      this.$emit('canvasClick', e);
    },
    moveSelectedNode(dx, dy) {
      let index = this.scene.nodes.findIndex((item) => {
        return item.id === this.action.dragging
      })
      let left = (this.scene.nodes[index].centeredX || this.scene.nodes[index].x) + dx / this.scene.scale;
      let top = (this.scene.nodes[index].centeredY || this.scene.nodes[index].y) + dy / this.scene.scale;
      this.$set(this.scene.nodes, index, Object.assign(this.scene.nodes[index], {
        x: left,
        y: top,
        centeredX: left,
        centeredY: top
      }));
    },
    nodeDelete(id) {
      this.scene.nodes = this.scene.nodes.filter((node) => {
        return node.id !== id;
      })
      this.scene.links = this.scene.links.filter((link) => {
        return link.from !== id && link.to !== id
      })
      this.$emit('nodeDelete', id)
    },
    onDragStart() {
      return false;
    },
    itemClick(e, action) {
      this.moving = true;
      this.actionType = action;
      this.draggingNodeTop = -100;
      this.draggingNodeLeft = -100;
      e.returnValue=false;
      return false;
    },
    itemMove(e) {
      if(this.moving) {
        [this.mouse.x, this.mouse.y] = getMousePosition(this.$el, e);

        this.mouse.x = e.pageX || e.clientX + document.documentElement.scrollLeft
        this.mouse.y = e.pageY || e.clientY + document.documentElement.scrollTop
        let diffX = this.mouse.x;
        let diffY = this.mouse.y;

        diffX = diffX / this.scene.scale
        diffY = diffY / this.scene.scale

        this.draggingNodeTop = diffY - 40 ;
        this.draggingNodeLeft = diffX - 40 ;

        return false;
      }
    },
    itemRelease(e) {
      if(this.moving) {
      this.moving = false;

      const toolbarWidth = document.getElementById("toolbar").clientWidth + 10;
      const titleHeight = document.getElementById("title").clientHeight;

      const y = this.draggingNodeTop - titleHeight;
      const x = this.draggingNodeLeft - toolbarWidth;

      this.$emit('onDropNewNode', { x, y, nodeType : this.actionType, label: 'New Rule' });
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.flowchart{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
}
.dragging-node{
  width: 80px;
  height: 80px;
  position: absolute;
  opacity: 0.9;
  .dragging-node-title{
    background: #ff8855;
    color: white;
    font-size: 13px;
    height: 30px;
    width: 80px;
  }
  .dragging-node-label{
    height: 50px;
    background: #FFF;
    width: 80px;
  }
}
.flowchart-toolbar{
  flex: 0.1;
  padding-top: 10px;
}
.flowchart-toolbar-item{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 20px;
}
.square {
  width: 30px;
  height: 30px;
  border: 1px solid black;
  margin-bottom: 10px;
}
.flowchart-container {
  flex: 0.9;
  margin: 0;
  background: #ddd;
  position: relative;
  overflow: hidden;
  svg {
    cursor: grab;
  }
}
</style>
