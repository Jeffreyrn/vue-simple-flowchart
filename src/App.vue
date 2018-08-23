<template>
  <div id="app">
    <h1> simple flowchart</h1>
    <div class="tool-wrapper">
      <select v-model="newNodeType">
        <option v-for="(item, index) in nodeCategory" :key="index" :value="index">{{item}}</option>
      </select>
      <input type="text" v-model="newNodeLabel" placeholder="Input node label">
      <button @click="addNode">ADD</button>
    </div>
    
    <simple-flowchart :scene.sync="scene"/>
  </div>
</template>

<script>
import SimpleFlowchart from './components/SimpleFlowchart.vue'

export default {
  name: 'app',
  components: {
    SimpleFlowchart
  },
  data() {
    return {
      scene: {
        centerX: 1024,
        centerY: 140,
        scale: 1,
        nodes: [
          {
            id: 2,
            x: -700,
            y: -69,
            type: 'Action',
            label: 'test1',
          },
          {
            id: 4,
            x: -357,
            y: 80,
            type: 'Script',
            label: 'test2',
          },
          {
            id: 6,
            x: -557,
            y: 80,
            type: 'Rule',
            label: 'test3',
          }
        ],
        links: [
          {
            id: 3,
            from: 2, // node id the link start
            to: 4,  // node id the link end
          }
        ]
      },
      newNodeType: 0,
      newNodeLabel: '',
      nodeCategory:[
        '规则',
        '知识包',
        '动作',
        '脚本',
        '决策',
        '分支',
        '聚合',
      ],
    }
  },
  methods: {
    addNode() {
      let maxID = Math.max(0, ...this.scene.nodes.map((link) => {
        return link.id
      }))
      this.scene.nodes.push({
        id: maxID + 1,
        x: -400,
        y: 50,
        type: this.nodeCategory[this.newNodeType],
        label: this.newNodeLabel ? this.newNodeLabel: `test${maxID + 1}`,
      })
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
  .tool-wrapper {
    position: relative;
  }
}
</style>
