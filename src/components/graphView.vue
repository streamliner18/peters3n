<template lang="pug">
  b-row
    b-col(cols=12)
      b-navbar(variant='light')
        b-navbar-brand Peters3n
        b-navbar-nav
          b-form-file(placeholder='Choose a file to load...' v-model='uploadFile')
        b-navbar-nav
          b-button(variant='primary' @click='uploadJSON') Load
        b-navbar-nav
          b-button(@click='downloadJSON') Save
        b-navbar-nav
          span (c) 2018 streamliner18, qianxiaoyu
      br
      b-alert(variant='warning' :show='loadWarningAlert' dismissible @dismissed='loadWarningAlert=false')
        | Oops. Did you select the correct file? It should end with .json.
      b-alert(variant='success' :show='loadSuccessAlert' dismissible @dismissed='loadSuccessAlert=true')
        | Hooray, it just finished loading.
    b-col(cols=8)
      b-card(header='Graph')
        template(slot='header')
        div#target
        .color-group
          div(v-for='i in colors' :key='i[0]')
            span.color-legend(:style='"background-color: "+i[1]')
            span {{i[0]}}
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
      @shown='autoFocus("eFocus")'
      ref='eForm' id='eForm'
      )
      input.form-control(v-model='edgeModalVal' ref='eFocus' @keyup='eSubmit')
    b-modal(
      :title='"Node Radius "+(radModalNodeNum+1)'
      v-model='showRadModal'
      @ok='setNodeVal'
      @shown='autoFocus("rFocus")'
      ref='rForm' id='rForm'
    )
      input.form-control(v-model='radModalVal' ref='rFocus' @keyup='rSubmit')
</template>

<script>
import * as d3 from 'd3'
import {petersenRelPos, edges, defaultMap} from './graph-util'
import { TSExternalModuleReference } from 'babel-types';
export default {
  name: 'graphView',
  props: ['mat'],
  data: () => ({
    matrix: this.mat,
    colors: [],
    uploadFile: '',
    radius: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
    labels: defaultMap,
    showRadModal: false,
    showEdgeModal: false,
    radModalVal: 10,
    radModalIdx: 0,
    edgeModalVal: '',
    radModalNodeNum: 0,
    edgeModalNodes: [3, 5],
    loadWarningAlert: false,
    loadSuccessAlert: false
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
          console.log('setEdge', this.$data.labels[d[0]]-1, this.$data.labels[d[1]]-1)
          this.$data.edgeModalNodes = [this.$data.labels[d[0]]-1, this.$data.labels[d[1]]-1]
          this.$data.edgeModalVal = this.mat[this.$data.labels[d[0]]-1][this.$data.labels[d[1]]-1]
          this.$data.showEdgeModal = true
        })

      svg.selectAll('circle')
        .data(nodeset)
        .enter().append('circle')
        .classed('p-node', true)
        .attr('cx', (d, i) => d.x)
        .attr('cy', (d, i) => d.y)
        .attr('fill', (d, i) => this.$data.radius[this.$data.labels[i]-1] > 0 ? 'skyblue' : 'pink')
        .attr('r', (d, i) => Math.abs(this.$data.radius[this.$data.labels[i]-1]))
        .on('click', (d, i) => {
          console.log('setNode', this.$data.labels[i]-1)
          this.$data.radModalNodeNum = this.$data.labels[i]-1
          this.$data.radModalIdx = i
          this.$data.radModalVal = this.$data.radius[this.$data.labels[i]-1]
          this.$data.showRadModal = true
        })

      svg.selectAll('text')
        .data(nodeset)
        .enter().append('text')
        .classed('p-node', true)
        .text((d, i) => this.$data.labels[i])
        .attr('x', (d, i) => d.x)
        .attr('y', (d, i) => d.y+5)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .on('click', (d, i) => {
          console.log('setNode', this.$data.labels[i])
          this.$data.radModalNodeNum = this.$data.labels[i]-1
          this.$data.radModalIdx = i
          this.$data.radModalVal = this.$data.radius[this.$data.labels[i]-1]
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
    },
    autoFocus (el) {
      this.$refs[el].focus()
    },
    eSubmit (e) {
      if (e.keyCode === 13) {
        this.$root.$emit('bv::hide::modal', 'eForm')
        this.setEdgeVal()
      }
    },
    rSubmit (e) {
      if (e.keyCode === 13) {
        this.$root.$emit('bv::hide::modal', 'rForm')
        this.setNodeVal()
      }
    },
    downloadJSON (e) {
      let data = {
        matrix: this.mat,
        labels: this.$data.labels,
        radius: this.$data.radius
      }
      let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
      let downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr)
      downloadAnchorNode.setAttribute('download', "peters3n_data.json")
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    },
    uploadJSON (e) {
      let file = this.$data.uploadFile
      if (!file) {
        this.$data.loadWarningAlert = true
        return
      }
      let reader = new FileReader()
      reader.onload = e => {
        this.loadJSON(reader.result)
      }
      try {
        reader.readAsText(file)
      } catch(e) {
        this.$data.loadWarningAlert = true
      }
    },
    loadJSON (text) {
      if (!text) {
        this.$data.loadWarningAlert = true
        return
      }
      let {labels, matrix, radius} = JSON.parse(text)
      this.$data.radius = radius
      this.$data.labels = labels
      this.$emit('bulk', matrix)
      this.$data.loadSuccessAlert = true
      console.log(this.$data)
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
  display: inline-block

span.color-legend
  color: white
  display: inline-block
  width: 16px
  height: 16px
  vertical-align: middle
  margin-right: 10px
  border-radius: 50%

.color-group
  display: inline-block
  vertical-align: top
  padding-top: 20px
  &>div
    padding: 0px 10px
    display: block
    border: 1px solid #eee
    border-radius: 3px
    margin: 0 5px
    margin-top: 10px
    font-size: 28px
    font-weight: bold
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

