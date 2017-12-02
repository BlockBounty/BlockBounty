<template>
  <div id="app">
    <AddressComponent/>
  </div>
</template>

<script>
import AddressComponent from './components/AddressComponent';
import AddressService from './services/AddressService';

AddressService.getAddress().then(address => {
  console.log('got address', address);
});

export default {
  name: 'app',
  components: {
    AddressComponent
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
