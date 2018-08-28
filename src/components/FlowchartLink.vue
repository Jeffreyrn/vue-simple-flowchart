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
    // start point position [x, y]
    start: {
      type: Array,
      default() {
        return [0, 0]
      }
    },
    // end point position [x, y]
    end: {
      type: Array,
      default() {
        return [0, 0]
      }
    }
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
    },
    dAttr() {
      let cx = this.start[0], cy = this.start[1], ex = this.end[0], ey = this.end[1];
      let x1 = cx, y1 = cy + 50, x2 = ex, y2 = ey - 50;
      return `M ${cx}, ${cy} C ${x1}, ${y1}, ${x2}, ${y2}, ${ex}, ${ey}`;
    }
  }
}
</script>

