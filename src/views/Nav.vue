<template>
<div>
     <v-overlay
      :value="alertLogout"
      :opacity="1"
    > 
    <div class="pa-2">
    <h1 >Wirklich Ausloggen ?</h1>
    <br>
    </div>
      <v-btn
        class="white--text pa-10"
        color="teal"
        @click="alertLogout = false"
        icon
      >
         <v-icon large>mdi-close</v-icon>
      </v-btn>
      <v-btn
        class="white--text pa-10"
        color="teal"
        @click="logout"
        icon
      >
         <v-icon large>mdi-check</v-icon>
      </v-btn>
    </v-overlay>
    <v-card class="overflow-hidden">
        <v-app-bar
        absolute
        dark
        shrink-on-scroll
        prominent
        fade-img-on-scroll
        scroll-target="#scrolling-techniques-3"
        >
        
            
        <v-toolbar-title>
        EASY WAY
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon
        @click="alertLogout = true"
        >
            <v-icon>mdi-account-arrow-left</v-icon>
        </v-btn>

        <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>

        <template v-slot:extension>
            <v-tabs align-with-title>
            <v-tab @click="$router.replace({name: 'Home'})" >Events</v-tab>
            <v-tab @click="$router.replace({name: 'Calendar'})" >Kalender</v-tab>
            <v-tab>Personen</v-tab>
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
<style scoped>
.title{
    height:50%;
    width: 50%;
}
</style>