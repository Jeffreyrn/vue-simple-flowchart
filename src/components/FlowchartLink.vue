<template>
  <g>
    <path :d="dAttr" :style="pathStyle"></path>
    <path d="M -1 -1 L 0 1 L 1 -1 z"
      :style="pathStyle"
      :transform="arrowTransform"></path>
  </g>
</template>

<script>
export default {
  name: 'FlowchartLink',
  props: {
    dAttr: String,
  },
  computed: {
    pathStyle() {
      return {
        stroke: 'rgb(255, 136, 85)',
        strokeWidth: 2.73205,
        fill: 'none',
      }
    },
    arrowTransform() {
      return 'translate(1, 1) rotate(0)'
    }
  }
}
</script>

