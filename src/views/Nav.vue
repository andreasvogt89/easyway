<template>
    <v-card>
      <v-overlay
      :value="alertLogout"
      :opacity="1"
    >
    <v-container> 
    <v-card>
    <v-card-title 
    class="ma-5px"
    >Willst du dich verpissen 😱?</v-card-title>
    <v-card-text>
      <v-btn
        class="logoutButton"
        @click="logout"
        elevation="2"
      >
      <v-icon large>mdi-check</v-icon>
      </v-btn>
      <v-btn
        class="logoutButton"
        @click="alertLogout = false"
        elevation="2"
      >
      <v-icon large>mdi-close</v-icon>
      </v-btn>
      </v-card-text>
    </v-card>
    </v-container>
      </v-overlay>
        <v-app-bar
        dark
        fluid
        prominent>
        <v-toolbar-title>
        EASY WAY
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-alert
        class="ma-2"
        text      
        >{{dadJoke}}</v-alert>
        <v-spacer></v-spacer>
        <v-btn icon
        @click="alertLogout = true"
        >
             <v-icon>mdi-export</v-icon>
        </v-btn>
        <template v-slot:extension >
            <v-tabs 
            align-with-title color="accent">
            <v-tab :to="{name: 'Dashboard'}" >Dashboard</v-tab>
            <v-tab :to="{name: 'Events'}" >Events</v-tab>
            <v-tab :to="{name: 'Calendar'}" >Kalender</v-tab>
            <v-tab :to="{name: 'Persons'}">Personen</v-tab>
            <v-tab :to="{name: 'About'}" >About</v-tab>
            </v-tabs>
        </template>
        </v-app-bar>
    </v-card>
</template>
<script>
import axios from 'axios';

  export default {
     data () {
      return {
        alertLogout: false,
        dadJoke: "😝",
      }
    },
    created(){
      this.fetchDadJoke()
    },
    methods:{
    logout(){
      sessionStorage.removeItem('EAtoken');
      this.$store.dispatch('logout');
      this.alertLogout = false;
      this.$router.replace({name:'Login'});
    },
    async fetchDadJoke(){
        await axios.get("https://icanhazdadjoke.com/",
        {
          headers: {
            Accept: "application/json"
            }}).then(res=>{
          console.log(res)
          this.dadJoke = res.data.joke
        }
        ).catch(()=>{
          this.dadJoke = "Dad is angry! Won't tell jokes now.."
        })
    }
  },
  }
</script>
<style scoped>
.logoutButton{
  margin: 20px;
}
</style>