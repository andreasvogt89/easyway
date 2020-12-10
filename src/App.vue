<template>
  <div id="app">
    <Nav></Nav>
    <Login v-if="!this.$store.getters.loginState" />
    <router-view v-if="this.$store.getters.loginState" />
  </div>
</template>
<script>
import Nav from "@/views/Nav.vue"
import Login from "@/views/Login.vue"

export default {
  name: 'App',

  components: {
    Nav,
    Login
  },
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body{
  background-color: rgb(24, 26, 31);
}
</style>
