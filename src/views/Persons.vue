<template>
<div>
<v-container>
  <PersonList 
  :eventView="false"
  />
</v-container>
<v-container>
  <v-card>
    <v-card-title>
      Statistik
    </v-card-title>
    <v-card-subtitle class="text-left">
      Personen total: {{this.$store.getters.getPersons.length}}
    </v-card-subtitle>
  <v-row>
      <v-col cols=12 md="1">
       <v-badge
          class="ma-3"
          color="accent"
          :content="this.$store.getters.getPersons.filter(item => item.person.gender === 'W').length"
       >
       <v-icon>mdi-face-woman</v-icon>
       </v-badge>
      </v-col>
      <v-col cols=12 md="1">
       <v-badge
          class="ma-3"
          color="accent"
          :content="this.$store.getters.getPersons.filter(item => item.person.gender === 'M').length"
       >
       <v-icon>mdi-face</v-icon>
       </v-badge>
      </v-col>
      <v-col cols=12 md="1">
       <v-badge
          class="ma-3"
          color="accent"
          :content="this.$store.getters.getEvents.length"
       >
       <v-icon>mdi-calendar-multiple</v-icon>
       </v-badge>
      </v-col>
  </v-row>
  </v-card>
  
</v-container>
</div>
</template>

<script>
import PersonList from '../components/PersonList.vue';
export default {
  components: { PersonList },
  computed:{
    
  }
} 
</script>