<template lang="pug">
  div
    div#target
    mat-view
</template>

<script>
import MatView from './matView'
import Matrix from './graph-util'
export default {
  name: 'PetersonApp',
  components: {MatView},
  data: () => ({
    mat: new Matrix(10)
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass">

</style>
