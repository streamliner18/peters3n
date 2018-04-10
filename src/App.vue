<template>
  <div id="app">
    <PetersonApp/>
  </div>
</template>

<script>
import PetersonApp from './components/peterson'

export default {
  name: 'App',
  components: {
    PetersonApp
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
