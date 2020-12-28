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
      <v-col cols=12 md="2">
         <v-progress-circular
          :rotate="360"
          :size="100"
          :width="15"
          :value="getFemalePercent"
          color="accent"
          >
      {{ getFemalePercent }}%
    </v-progress-circular>
      </v-col>
      <v-col cols=12 md="2">
          Hello
      </v-col>
      <v-col cols=12 md="2">
          Hello
      </v-col>
      <v-col cols=12 md="2">
          Hello
      </v-col>
      <v-col cols=12 md="2">
          Hello
      </v-col>
      <v-col cols=12 md="2">
          Hello
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
    getFemalePercent(){
     return this.$store.getters.getPersons.filter(item => item.person.gender === 'W').length
    }
  }
} 
</script>