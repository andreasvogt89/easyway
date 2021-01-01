<template>
  <v-app id="app">
    <v-overlay
        :value="reLoginActive"
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
      color="secondary"
      :fixed="this.$route.name === 'About' ? true : false"
    >
    <v-row

    >
    <v-col
      cols="4"
      class="text-left"
    >
        Angemeldet als: <strong>{{this.$store.getters.getUsername}}</strong><br>
        Gruppe: <strong>{{this.$store.getters.getUserRole}}</strong><br>
      </v-col>
      <v-col
      cols="4"
      >
      Session expires in <strong>{{timeLeft}}</strong> 
      </v-col>
      <v-col
      cols="4"
      >
        <div
        class="text-right"
        >
        <img class="footerImage" src="https://icons.andreas-vogt.ch/wolf.png">
        </div>
      </v-col>
    </v-row>
    </v-footer> 
  </v-app>
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
        reLoginActive : false,
        timeLeft:"😑"
      }
    },
  async mounted(){
      this.reLoginActive = true;
            if(localStorage.getItem('user') !== null){ 
              let user = JSON.parse(localStorage.getItem('user'));
              await this.$store.dispatch('reLogin', user);
              await this.$store.dispatch('fetchEvents');
              await this.$store.dispatch('fetchPersons');
              this.reLoginActive = false;
              this.tokenExpiresIn();
              await this.$router.replace('/');

              } else{
                localStorage.removeItem('user');
                await this.$router.replace({name: 'Login'});
                this.reLoginActive = false;
              }
  },
  methods:{
    tokenExpiresIn(){
      setInterval(() => {
      let distance = new Date(this.$store.getters.getTokenExpiresAt).getTime() -
                    new Date().getTime();
                let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((distance % (1000 * 60)) / 1000);
                this.timeLeft = hours + 'h : ' + minutes + 'min : ' + seconds + 's'
      }, 1000);
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
}
body{
  background-color: #181A1F;
}
.footerImage{
  height: 40px;
  width: 40px;
}
</style>
