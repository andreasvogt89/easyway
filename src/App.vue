<template>
  <div id="app">
    <v-overlay
        :value="loginActive"
    >
      <v-progress-circular
          size="200"
          indeterminate
      > Wart hurti..

      </v-progress-circular>
    </v-overlay>
    <Login v-if="!this.$store.getters.loginState" />
    <Nav v-if="this.$store.getters.loginState" />
    <router-view v-if="this.$store.getters.loginState" />
    <v-footer
      v-if="this.$store.getters.loginState"
      color="#2c3e50"
    >
    <v-row

    >
    <v-col
      cols="4"
    >
      <p
      class="footerText">
      Angemeldet als: <strong>{{this.$store.getters.getUsername}}</strong>
      </p>
      <p
      class="footerText"> 
        Gruppe: <strong>{{this.$store.getters.getUserRole}}</strong>
      </p>
      <p
      class="footerText"> 
        Version: <strong>0.0.1</strong>
      </p>
      </v-col>
      <v-col
      cols="6"
      >
      </v-col>
      <v-col
      cols="2"
      >
        <div>
        <img class="footerImage" src="https://icons.andreas-vogt.ch/wolf.png">
        </div>
      </v-col>
    </v-row>
    </v-footer> 
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
  data () {
      return {
        loginActive : false,
      }
    },
  async created(){
       this.loginActive = true;
       if(localStorage.getItem('user') !== null){ 
        let user = JSON.parse(localStorage.getItem('user'));
        await this.$store.dispatch('reLogin', user.user[0]);
        await this.$store.dispatch('fetchEvents');
        if(this.$store.getters.loginState){
          this.loginActive = false;
        } else {
          localStorage.removeItem('user');
          await this.$router.replace({name: 'Login'});
          this.loginActive = false;
        }
        } else{
          localStorage.removeItem('user');
          await this.$router.replace({name: 'Login'});
          this.loginActive = false;
        }

  }
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
  background-color: #181A1F;

}
.footerImage{
  height: 50px;
  width: 50px;
}

.footerText{
  text-align: start;
  padding-left: 1em;
}
</style>
