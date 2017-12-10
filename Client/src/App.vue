<template>
  <div id="app">
    <ConfigComponent/>
  </div>
</template>

<script>
import ConfigComponent from './components/ConfigComponent';
import ConfigService from './services/ConfigService';
import ComputeService from './services/ComputeService';

ConfigService.getConfig().then(config => {
  ComputeService.start(config);
});

export default {
  name: 'app',
  components: {
    ConfigComponent
  }
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #7467dc, #222a4f);
  overflow: hidden;
}
</style>
