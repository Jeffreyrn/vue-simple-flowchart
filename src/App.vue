<template>
  <div id="app">
    <div id="title">
      <h1> simple flowchart</h1>
      <div class="tool-wrapper">
        <select v-model="newNodeType">
          <option v-for="(item, index) in nodeCategory" :key="index" :value="index">{{item}}</option>
        </select>
        <input type="text" v-model="newNodeLabel" placeholder="Input node label">
        <button @click="addNode">ADD</button>
      </div>
      <button @click="isPanelShow = !isPanelShow">{{!isPanelShow ? 'Show Panel' : 'Hide Panel'}}</button>
      <button v-if="isPanelShow" @click="isRawScene = !isRawScene">{{!isRawScene ? 'Show Raw' : 'Show Pretty'}}</button>
      <div v-if="isPanelShow" class="panel-area">
        <div v-html="isRawScene ? rawScene : prettyScene" class="extraction-panel" />
      </div>
    </div>
    
    <simple-flowchart :scene.sync="scene" 
      @nodeClick="nodeClick"
      @nodeDelete="nodeDelete"
      @linkBreak="linkBreak"
      @linkAdded="linkAdded"
      @canvasClick="canvasClick"
      @onDropNewNode="onCreateNode"
      :height="800"/>
  </div>
</template>

<script>
/* eslint-disable */
import SimpleFlowchart from './components/SimpleFlowchart.vue'

export default {
  name: 'app',
  components: {
    SimpleFlowchart
  },
  data() {
    return {
      isRawScene: false,
      isPanelShow: false,
      scene: {
        centerX: 0,
        centerY: 0,
        scale: 1,
        nodes: [
          {
            id: 1,
            x: 10,
            y: 10,
            type: 'Action',
            label: 'Hello, This is KR dev bot! How can I help you?',
            isStart: true
          },
          {
            id: 2,
            x: 300,
            y: 100,
            type: 'Script',
            label: 'Do you have any symptoms described below such as cough, fever, etc?',
            buttons: [{
              id: 1,
              text: 'Yes'
            }, {
              id: 2,
              text: 'No'
            }, {
              id: 3,
              text: "I don't know"
            }]
          },
          {
            id: 3,
            x: 600,
            y: 100,
            type: 'Rule',
            label: 'test3',
          },
          {
            id: 4,
            x: 900,
            y: 400,
            type: 'Rule',
            label: 'test4',
          }
        ],
        links: [
          {
            id: 5,
            from: 1, // node id the link start
            button: undefined,
            to: 2,  // node id the link end
          },
          {
            id: 6,
            from: 2, // node id the link start
            button: 1,
            to: 3,  // node id the link end
          },
          {
            id: 7,
            from: 2, // node id the link start
            button: 2,
            to: 3,  // node id the link end
          },
          {
            id: 8,
            from: 3, // node id the link start
            button: undefined,
            to: 4,  // node id the link end
          },
          {
            id: 9,
            from: 4, // node id the link start
            button: undefined,
            to: 1,  // node id the link end
          },
        ]
      },
      newNodeType: 0,
      newNodeLabel: '',
      nodeCategory:[
        'rule',
        'action',
        'script',
        'decision',
        'fork',
        'join',
      ],
    }
  },
  computed: {
    prettyScene() {
      return JSON.stringify(this.scene, null, '\t').replace(/\n/gi, '<br />').replace(/\t/gi, '&nbsp;&nbsp;')
    },
    rawScene() {
      return JSON.stringify(this.scene);
    }
  },
  methods: {
    canvasClick(e) {
      console.log('canvas Click, event:', e)
    },
    addNode() {
      let maxID = Math.max(0, ...this.scene.nodes.map((link) => {
        return link.id
      }))
      this.scene.nodes.push({
        id: maxID + 1,
        x: 0,
        y: 50,
        type: this.nodeCategory[this.newNodeType],
        label: this.newNodeLabel ? this.newNodeLabel: `test${maxID + 1}`,
      })
    },
    onCreateNode({x, y, nodeType, label}) {

      let maxID = Math.max(0, ...this.scene.nodes.map((link) => {
        return link.id
      }))
      this.scene.nodes.push({
        id: maxID + 1,
        x: x,
        y,
        type: nodeType,
        label: label,
      })
    },
    nodeClick(id) {
      console.log('node click', id);
    },
    nodeDelete(id) {
      console.log('node delete', id);
    },
    linkBreak(id) {
      console.log('link break', id);
    },
    linkAdded(link) {
      console.log('new link added:', link);
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  overflow: hidden;
  height: 1280px;
  .tool-wrapper {
    position: relative;
  }
  .panel-area {
    display: flex;
    flex-grow: 1;
    justify-content: center; 
  }
  .extraction-panel {
    text-align: left;
    width: 60%;
    max-height: 300px;
    border-width: 3px;
    border-style: solid;
    padding: 10px;
    border-color: grey;
    border-radius: 10px;
    overflow: scroll;
  }
}
</style>
