<template lang="pug">
b-col(cols=12)
  b-card(header='Adjacency Matrix')
    table.table
      thead
        tr
          th
          th(v-for='i in 10')
            b {{i}}
      tbody
        tr(v-for='row in 10')
          td.left-index
            b {{row}}
          td(v-for="col in 10")
            input(
              type="text"
              :class='row===col?"diag":""'
              :value="data[row-1][col-1]"
              :disabled='!isEditable(row, col)'
              @input='setField($event, row-1, col-1)'
              )
    .button-group
      b-button(variant='warning' @click='save("latex")') Save LaTeX
      b-button(variant='danger' @click='save("mathematica")') Save Mathematica
      b-button(variant='primary' @click='save("matlab")') Save MatLab
    b-modal(v-model='showModal' :title='savedFormat+" output"')
      pre(v-highlightjs='savedText')
        code(:class='savedFormat')
</template>

<script>
import {saveLatex, saveMathematica, saveMatlab} from './save-mat'
export default {
  name: 'matView',
  data: () => ({
    savedText: '',
    savedFormat: '',
    showModal: false
  }),
  methods: {
    setField(e, i, j) {
      this.$emit('set', i, j, e.target.value)
    },
    isEditable(i,j) {
      return i <= j
    },
    save(t) {
      switch(t) {
        case 'latex':
        this.$data.savedText = saveLatex(this.data)
        break
        case 'mathematica':
        this.$data.savedText = saveMathematica(this.data)
        break
        case 'matlab':
        this.$data.savedText = saveMatlab(this.data)
        break
        default:
        return
      }
      this.$data.savedFormat = t
      this.$data.showModal = true
    }
  },
  props: ['data']
}
</script>

<style lang="sass" scoped>
table
  // margin: 0px 5%
  // width: 90%

td.left-index
  border-right: 1px solid #ccc
td input
  width: 60px

input.diag
  border-color: red

.button-group
  text-align: right
  button.btn
    margin-left: 10px
</style>
