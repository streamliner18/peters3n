<template lang="pug">
  b-container
    graph-view(:mat='mat' @set='setField' @bulk='bulkSet')
    br
    b-row
      mat-view(:data='mat' @set='setField')
</template>

<script>
import MatView from './matView'
import GraphView from './graphView'
import {createMatrix, getIterator, setMember} from './graph-util'
export default {
  name: 'PetersonApp',
  components: {MatView, GraphView},
  data: () => ({
    mat: createMatrix(10)
  }),
  methods: {
    setField (i, j, v) {
      this.$data.mat[i][j] = v
      this.$data.mat[j][i] = v
      this.$data.mat = Array(...this.$data.mat)
    },
    bulkSet (data) {
      this.$data.mat = data
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass">

</style>
