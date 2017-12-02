<template>
  <div id="app">
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import Background from './components/Background';

export default {
  name: 'app',
  components: {
    HelloWorld
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
