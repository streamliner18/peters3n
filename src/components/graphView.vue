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
      b-card(header='Node Label and Radius')
        table.table.rad-list
          tbody
            tr(v-for='i in 10')
              td
                b {{i}}
              td
                input.node-conf(v-model.number='radius[Number(i)-1]' @input='redraw')
              td
                input.node-conf(v-model.number='labels[Number(i)-1]' @input='redraw')
    b-modal(
      :title='"Edge Value "+(edgeModalNodes[0]+1)+" to "+(edgeModalNodes[1]+1)'
      v-model='showEdgeModal'
      @ok='setEdgeVal'
      )
      input.form-control(v-model='edgeModalVal')
    b-modal(
      :title='"Node Radius "+(radModalNodeNum+1)'
      v-model='showRadModal'
      @ok='setNodeVal'
    )
      input.form-control(v-model='radModalVal')
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
    radius: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    labels: defaultMap,
    showRadModal: false,
    showEdgeModal: false,
    radModalVal: 10,
    radModalIdx: 0,
    edgeModalVal: '',
    radModalNodeNum: 0,
    edgeModalNodes: [3, 5]
  }),
  methods: {
    initStar () {
      d3.select('svg').remove()
      let svg = d3.select('#target').append('svg').attr('width', '500px').attr('height', '500px')
    },
    drawStar () {
      let svg = d3.select('#target').select('svg')
      let nodeset = petersenRelPos(100, 200, 250, 250)
      let {res, colors} = edges(this.mat, this.$data.labels)
      this.$data.colors = Object.keys(colors).map(i => [i, colors[i]])
      let edgeset = res
      svg.selectAll('line')
        .data(edgeset)
        .enter().append('line')
        .classed('p-edge', true)
        .attr('x1', (d, i) => nodeset[d[0]].x)
        .attr('y1', (d, i) => nodeset[d[0]].y)
        .attr('x2', (d, i) => nodeset[d[1]].x)
        .attr('y2', (d, i) => nodeset[d[1]].y)
        .attr('stroke', (d, i) => d[2])
        .attr('stroke-width', '4')
        .attr('stroke-dasharray', (d, i) => d[3] ? '' : '8, 3')
        .on('click', (d, i) => {
          console.log('setEdge', this.$data.labels[d[0]], this.$data.labels[d[1]])
          this.$data.edgeModalNodes = [this.$data.labels[d[0]], this.$data.labels[d[1]]]
          this.$data.edgeModalVal = this.mat[this.$data.labels[d[0]]][this.$data.labels[d[1]]]
          this.$data.showEdgeModal = true
        })

      svg.selectAll('circle')
        .data(nodeset)
        .enter().append('circle')
        .classed('p-node', true)
        .attr('cx', (d, i) => d.x)
        .attr('cy', (d, i) => d.y)
        .attr('fill', (d, i) => this.$data.radius[this.$data.labels[i]] > 0 ? 'skyblue' : 'pink')
        .attr('r', (d, i) => Math.abs(this.$data.radius[this.$data.labels[i]]))
        .on('click', (d, i) => {
          console.log('setNode', this.$data.labels[i])
          this.$data.radModalNodeNum = this.$data.labels[i]
          this.$data.radModalIdx = i
          this.$data.radModalVal = this.$data.radius[this.$data.labels[i]]
          this.$data.showRadModal = true
        })

      svg.selectAll('text')
        .data(nodeset)
        .enter().append('text')
        .classed('p-node', true)
        .text((d, i) => this.$data.labels[i]+1)
        .attr('x', (d, i) => d.x)
        .attr('y', (d, i) => d.y+5)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .on('click', (d, i) => {
          console.log('setNode', this.$data.labels[i])
          this.$data.radModalNodeNum = this.$data.labels[i]
          this.$data.radModalIdx = i
          this.$data.radModalVal = this.$data.radius[this.$data.labels[i]]
          this.$data.showRadModal = true
        })
    },
    redraw () {
      this.initStar()
      this.drawStar()
    },
    setEdgeVal () {
      this.$emit('set', ...this.$data.edgeModalNodes, this.$data.edgeModalVal)
    },
    setNodeVal () {
      this.$data.radius[this.$data.radModalNodeNum] = this.$data.radModalVal
      this.redraw()
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
    },
    radius: {
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

.p-edge:hover
  opacity: 0.5

.p-node:hover
  opacity: 0.5
  border: 2px solid red

table.rad-list
  td
    vertical-align: middle
    padding: 10px 10px

input.node-conf
  width: 80px
</style>

