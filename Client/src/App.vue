<template>
  <div id="app">
    <div class="logo-container">
      <div class="bb-logo border-radius">
        <div>B</div>
        <div>B</div>
      </div>
      <div class="name">Block Bounty</div>
    </div>
    <ConfigComponent/>
    <ProgressComponent/>
  </div>
</template>

<script>
import ConfigComponent from './components/ConfigComponent';
import ProgressComponent from './components/ProgressComponent';
import ConfigService from './services/ConfigService';
import ComputeService from './services/ComputeService';

ConfigService.getConfig().then(config => {
  ComputeService.start(config);
});

export default {
  name: 'app',
  components: {
    ConfigComponent,
    ProgressComponent
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
  color: #222f54;
}

.logo-container {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  width: calc(100vw - 2rem);
  height: 6rem;
}

.bb-logo {
  position: relative;
  height: 4.75rem;
  width: 5rem;
  background: rgba(63, 79, 128, .8);
  margin-right: 1rem;
}

.bb-logo div {
  font-size: 4rem;
  font-weight: 100;
}

.bb-logo div:first-child {
  position: absolute;
  left: 1.65rem;
}

.bb-logo div:last-child {
  position: absolute;
  right: 1.65rem;
  transform: rotate3d(0, 1, 0, 180deg);
}

.name {
  font-size: 4rem;
  color: #d8d8e4;
}
</style>
