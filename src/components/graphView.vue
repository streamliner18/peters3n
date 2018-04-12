<template lang="pug">
  b-row
    b-col(cols=8)
      b-card(header='Graph')
        div#target
        .color-group
          div(v-for='i in colors' :key='i[0]')
            span {{i[0]}}
            span.color-legend(:style='"background-color: "+i[1]') {{i[1]}}
    b-col(cols=4)
      b-card(header='Node Radius')
        table.table.rad-list
          tbody
            tr(v-for='i in 10')
              td
                b {{i}}
              td
                input(v-model.number='radius[Number(i)-1]' @input='redraw')
</template>

<script>
import * as d3 from 'd3'
import {petersenRelPos, edges, defaultMap} from './graph-util'
export default {
  name: 'graphView',
  props: ['mat'],
  data: () => ({
    matrix: this.mat,
    colors: [],
    radius: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
  }),
  methods: {
    initStar () {
      d3.select('svg').remove()
      let svg = d3.select('#target').append('svg').attr('width', '500px').attr('height', '500px')
    },
    drawStar () {
      let svg = d3.select('#target').select('svg')
      let nodeset = petersenRelPos(100, 200, 250, 250)
      let {res, colors} = edges(this.mat, defaultMap)
      this.$data.colors = Object.keys(colors).map(i => [i, colors[i]])
      let edgeset = res
      svg.selectAll('line')
        .data(edgeset)
        .enter().append('line')
        .attr('x1', (d, i) => nodeset[d[0]].x)
        .attr('y1', (d, i) => nodeset[d[0]].y)
        .attr('x2', (d, i) => nodeset[d[1]].x)
        .attr('y2', (d, i) => nodeset[d[1]].y)
        .attr('stroke', (d, i) => d[2])
        .attr('stroke-width', '2')

      svg.selectAll('circle')
        .data(nodeset)
        .enter().append('circle')
        .attr('cx', (d, i) => d.x)
        .attr('cy', (d, i) => d.y)
        .attr('fill', (d, i) => this.$data.radius[i] > 0 ? 'skyblue' : 'pink')
        .attr('r', (d, i) => Math.abs(this.$data.radius[i]))
    },
    redraw () {
      this.initStar()
      this.drawStar()
    }
  },
  mounted () {
    this.redraw()
  },
  watch: {
    $props: {
      handler () {
        this.initStar()
        this.drawStar()
      },
      deep: true
    }
  }
}
</script>

<style lang="sass">
#target
  text-align: center
span.color-legend
  color: white
  padding: 0 10px
  border-radius: 4px
.color-group
  display: flex
  &>div
    padding: 5px 10px
    border: 1px solid #eee
    border-radius: 3px
    margin: 0 5px
    .color-legend
      margin-left: 4px
table.rad-list
  td
    vertical-align: middle
    padding: 10px 10px
</style>

