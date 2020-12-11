<template>
<div>
     <v-overlay
      :value="alertLogout"
      :opacity="1"
    >
    <v-container> 
    <v-card>
    <v-card-title 
    class="ma-5px"
    >Wirklich Ausloggen ?</v-card-title>
    <v-card-text>
      <v-btn
        class="ma-5px"
        @click="logout"
        elevation="2"
      >
      <v-icon large>mdi-check</v-icon>
      </v-btn>
      <v-btn
        @click="alertLogout = false"
        class="ma-5px"
        elevation="2"
      >
      <v-icon large>mdi-close</v-icon>
      </v-btn>
      </v-card-text>
    </v-card>
    </v-container>
    </v-overlay>
    <v-card class="overflow-hidden">
        <v-app-bar
        absolute
        dark
        shrink-on-scroll
        prominent
        fade-img-on-scroll
        scroll-target="#scrolling-techniques-3"
        :disabled="this.$store.getters.loginState"
        >
        <v-toolbar-title>
        EASY WAY
        </v-toolbar-title>
    
        <v-spacer></v-spacer>

        <v-btn icon
        @click="alertLogout = true"
        >
             <v-icon>mdi-export</v-icon>
        </v-btn>

        <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>

        <template v-slot:extension>
            <v-tabs align-with-title>
            <v-tab @click="$router.replace({name: 'Home'})" >Events</v-tab>
            <v-tab @click="$router.replace({name: 'Calendar'})" >Kalender</v-tab>
            <v-tab @click="$router.replace({name: 'Persons'})">Personen</v-tab>
            <v-tab @click="$router.replace({name: 'About'})" >About</v-tab>
            </v-tabs>
        </template>
        </v-app-bar>
        <v-sheet
        id="scrolling-techniques-3"
        class="overflow-y-auto"
        max-height="600"
        >
        <v-container class="ma-10" style="height: 14em;"></v-container>
        </v-sheet>
    </v-card>
</div>
</template>
<script>
  export default {
     data () {
      return {
        alertLogout: false,
      }
    },
    methods:{
    logout(){
      sessionStorage.removeItem('EAtoken');
      this.$store.dispatch('logout');
      console.log("By Token 👋");
      this.alertLogout = false;
      this.$router.replace({name:'Login'});
    },
  },
  }
</script>