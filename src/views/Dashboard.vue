<template>
   <v-container>
  <v-card
  class='secondary'
  >
    <v-card-title>
      Statistik
    </v-card-title>
    <v-divider class="mx-4"></v-divider>
    <v-card-subtitle class="text-left">
      Personen total: {{this.$store.getters.getPersons.length}}
    </v-card-subtitle>
  <v-row class="ma-1">
      <v-col cols=12 sm="2">
       <v-badge
          class="ma-3"
          color="accent"
          :content="this.$store.getters.getPersons.filter(item => item.person.gender === 'W').length"
       >
       <v-icon>mdi-face-woman</v-icon>
       </v-badge>
       <p>Frauen</p>
      </v-col>
      <v-col cols=12 sm="2">
       <v-badge
          class="ma-3"
          color="accent"
          :content="this.$store.getters.getPersons.filter(item => item.person.gender === 'M').length"
       >
       <v-icon>mdi-face</v-icon>
       </v-badge>
       <p>Männer</p>
      </v-col>
      <v-col cols=12 sm="2">
       <v-badge
          class="ma-3"
          color="accent"
          :content="this.$store.getters.getEvents.length"
       >
       <v-icon>mdi-calendar-multiple</v-icon>
       </v-badge>
       <p>Events</p>
      </v-col>
      <v-col cols=12 sm="2">
       <v-badge
          class="ma-3"
          color="accent"
          :content="avarageAge"
       >
       <v-icon>mdi-account</v-icon>
       </v-badge>
       <p>∅ Alter</p>
      </v-col>
  </v-row>
  <v-divider class="mx-4"></v-divider>
    <v-card-title>
      Export
    </v-card-title>
      <v-row
      class="ma-2"
      >
        <v-col cols=12 sm=12>
          <v-combobox
          item-color="accent"
          outlined
          light
          chips
          deletable-chips
          color="accent"
          v-model="selectedEvents"
          :items="eventNames"
          label="Event typen"
          multiple
        >
        </v-combobox>
        </v-col>
        </v-row>
       <v-row>
         <v-col cols=12 sm="12">
            <div class="justify-center">
            <v-card-text>Export auswahl in Excel</v-card-text>
            <v-btn
            x-large
            @click="downloadExcel()"
            >
            <v-icon>mdi-file-excel-outline</v-icon>  
            </v-btn>
            </div>
         </v-col>    
      </v-row>
  </v-card>
  
</v-container> 
</template>

<script>
import REST_interface from "@/REST_interface";
import moment from "moment";

export default {
     name:"Dashboard",
     data () {
      return {
        selectedEvents: [],
      }
     },
    methods:{
        async downloadExcel(){
        this.loading = true;
        let newDate = new Date();
        moment.locale('de-ch'); 
        let fileName = "Alle Personen " + new moment(newDate).format('LL');
        await REST_interface.createPersonExcel(fileName, this.selectedEvents).then(()=>{
          this.loading = false;
        }).catch(err=>{
          this.loading = false;
          console.log(err);
        })
      },
    },
    computed: {
      eventNames () {
        let eventNames = []; 
        this.$store.getters.getEvents.forEach(item=>{
            eventNames.push(item.event.name)
        });
        return eventNames
        },
      avarageAge(){
        let ages = []; 
        this.$store.getters.getPersons.forEach(item=>{
            ages.push(item.person.age);
        })
        if(ages.length > 2){
            return Math.round(ages.reduce((a, b) => a + b) / ages.length)
        }
            return "NO DATA"
      }
    },

}
</script>