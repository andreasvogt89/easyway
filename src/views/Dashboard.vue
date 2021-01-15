<template>
   <v-container>
  <v-card
  class='secondary'
  >
    <v-card-title class="blue-grey darken-4">
      Statistik
    </v-card-title>
  <v-row class="ma-1">
    <v-col cols=12 sm="2">
       <v-badge
          class="ma-3"
          color="accent"
          :content="this.$store.getters.getPersons.length"
       >
       <v-icon>mdi-account-multiple</v-icon>
       </v-badge>
       <p>Personen</p>
      </v-col>
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
      <v-col cols=12 sm="2">
       <v-badge
          class="ma-3"
          color="accent"
          :content="avaragePartiPerWeek"
       >
       <v-icon>mdi-chart-line</v-icon>
       </v-badge>
       <p>∅ B/W </p>
      </v-col>
  </v-row>
  <v-row class="ma-1">
    <v-col cols=12 sm="2">
       <v-badge
          class="ma-3"
          color="accent"
          :content="this.$store.getters.getPersons.filter(item=> item.person.city === 'Langendorf').length"
       >
       <v-icon>mdi-counter</v-icon>
       </v-badge>
       <p>Langendorf</p>
      </v-col>
      <v-col cols=12 sm="2">
       <v-badge
          class="ma-3"
          color="accent"
          :content="this.$store.getters.getPersons.filter(item=> item.person.city === 'Oberdorf').length"
       >
       <v-icon>mdi-counter</v-icon>
       </v-badge>
       <p>Oberdorf</p>
      </v-col>
      <v-col cols=12 sm="2">
       <v-badge
          class="ma-3"
          color="accent"
          :content="this.$store.getters.getPersons.filter(item=> item.person.city === 'Bellach').length"
       >
       <v-icon>mdi-counter</v-icon>
       </v-badge>
       <p>Bellach</p>
      </v-col>
      <v-col cols=12 sm="2">
       <v-badge
          class="ma-3"
          color="accent"
          :content="this.$store.getters.getPersons.filter(item=> item.person.city === 'Rüttenen').length"
       >
       <v-icon>mdi-counter</v-icon>
       </v-badge>
       <p>Rüttenen</p>
      </v-col>
      <v-col cols=12 sm="2">
       <v-badge
          class="ma-3"
          color="accent"
          :content="this.$store.getters.getPersons.filter(item=> item.person.city === 'Solothurn').length"
       >
       <v-icon>mdi-counter</v-icon>
       </v-badge>
       <p>Solothurn</p>
      </v-col>
      <v-col cols=12 sm="2">
       <v-badge
          class="ma-3"
          color="accent"
          :content="this.$store.getters.getPersons.filter(item=> item.person.city === 'Bettlach').length"
       >
       <v-icon>mdi-counter</v-icon>
       </v-badge>
       <p>Bettlach</p>
      </v-col>
  </v-row>
  <v-divider class="mx-4"></v-divider>
    <v-card-title >
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
          label="Eventtypen"
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
            :disabled="eventNames < 0"
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
    async created(){
      await this.$store.dispatch('fetchEvents');
      await this.$store.dispatch('fetchPersons');
      
    },
    methods:{
        async downloadExcel(){
        this.loading = true;
        let newDate = new Date();
        moment.locale('de-ch'); 
        let fileName = "Statistik " + new moment(newDate).format('LL');
        await REST_interface.createStatisticExcel(fileName, this.selectedEvents).then(()=>{
          this.loading = false;
        }).catch(err=>{
          this.loading = false;
          console.log(err);
        })
      },
    addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
    },

    getMonday(d) {
    d = new Date(d);
    let day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
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
            if(item.person.age !== undefined){
                ages.push(item.person.age)
            }
        });
        if(ages.length > 2){
            return Math.round(ages.reduce((a, b) => a + b) / ages.length)
        }
            return ""
      },
      avaragePartiPerWeek(){
        if(this.$store.getters.getEvents.length > 1){
        let firstEvent = this.$store.getters.getEvents.slice().sort((a, b) => b.event.eventDate - a.event.eventDate);
        let weeks = [];
        for (let i = this.getMonday(firstEvent[0].event.eventDate); i <= new Date(); i = this.addDays(i, 7)) {
            let currentEvents = firstEvent.filter(item =>
                (new Date(item.event.eventDate).getTime() >= i.getTime() &&
                    new Date(item.event.eventDate).getTime() < this.addDays(i, 7).getTime()));
        
            let week = 0;
            currentEvents.forEach(item=>{
              week = week + item.event.participants.length
            });
            weeks.push(week);
          }
            return Math.round(weeks.reduce((a, b) => a + b) / weeks.length)
        } else {
            return ""
        }
            
      }
    },

}
</script>