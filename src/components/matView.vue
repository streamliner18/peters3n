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
              :value="data[row-1][col-1]"
              :disabled='!isEditable(row, col)'
              @input='setField($event, row-1, col-1)'
              )
</template>

<script>
export default {
  name: 'matView',
  data: () => ({
  }),
  methods: {
    setField(e, i, j) {
      this.$emit('set', i, j, e.target.value)
    },
    isEditable(i,j) {
      return i <= j
    },
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
</style>
