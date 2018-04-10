<template lang="pug">
table.table
  thead
    tr
      th
      th(v-for='i in getIter()')
        b {{i}}
  tbody
    tr(v-for='row in getIter()')
      td.left-index
        b {{row}}
      td(v-for="col in getIter()")
        input(type="text" :value="getItem(row, col)" :disabled='!isEditable(row, col)')
        //- span(v-else) {{getItem(row, col)}}
</template>

<script>
import Matrix from './graph-util'
export default {
  name: 'matView',
  data: () => ({
    mat: new Matrix(10)
  }),
  methods: {
    getIter() {
      return this.$data.mat.getIterator()
    },
    getItem(i, j) {
      return this.$data.mat.getMatrixMember(i, j)
    },
    isEditable(i,j) {
      return this.$data.mat.isEditableMember(i,j)
    }
  },
  props: ['data']
}
</script>

<style lang="sass" scoped>
table
  margin: 0px 5%
  width: 90%

td.left-index
  border-right: 1px solid #ccc
td input
  width: 60px
</style>
