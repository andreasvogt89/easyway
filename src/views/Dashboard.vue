<template>
   <v-container>
  <v-card
  class='secondary'
  v-if="this.$store.getters.getEvents.length > 0"
  >
    <v-card-title class="blue-grey darken-4">
      Statistik
    </v-card-title>
    <LineChart
      class="ma-2"
     :title="`Besucher pro Woche über alle Events`"
     :categories="lineChart.categories"
     :serie1Data="lineChart.serie1Data"
     :serie1Name="lineChart.serie1Name"
     :serie2Data="lineChart.serie2Data"
     :serie2Name="lineChart.serie2Name"
     />
     <v-row>
       <v-col><GenderPie class="ma-2" /></v-col>
       <v-col><PlacesPie class="ma-2" /></v-col>
     </v-row> 
  <v-divider class="mx-4"></v-divider>
    <v-card-title >
      Export
    </v-card-title>
      <v-row class="ma-2 justify-center"> 
        <v-col 
        v-bind:key="year.value" 
        v-for="year in years"
         class="d-flex justify-center"
        >
          <v-switch
              v-model="year.selected"
              color="accent"
              :label="year.value"
              :value="year.selected"
              hide-details
            ></v-switch>
        </v-col>
      </v-row>
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
       <v-alert
      class="ma-2"
      v-if="error != ''"
      text
      prominent
      type="error"
      icon="mdi-cloud-alert"
    >
     {{error}}
       <v-btn
            color="error"
            class="ma-3"
            outlined
            @click="error = ''"
          >
            Okay
          </v-btn>
    </v-alert>
  </v-card>
  
</v-container> 
</template>

<script>
import REST_interface from "@/REST_interface";
import moment from "moment";
import LineChart from "@/components/charts/LineChart.vue";
import GenderPie from "@/components/charts/GenderPie.vue";
import PlacesPie from "@/components/charts/PlacesPie.vue";

Date.prototype.getWeekNumber = function(){
  var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};

export default {
     name:"Dashboard",
     components:{
       LineChart,
       GenderPie,
       PlacesPie,
     },
     data () {
      return {
        selectedEvents: [],
        years: [],
        avarageParticipants: [],
        lineChart:{
          serie1Data:[],
          serie1Name:"Besucher",
          serie2Data:[],
          serie2Name:"Events",
          categories:[],
        },
        error: ""
      }
     },
    async created(){
      await this.$store.dispatch('fetchEvents');
      await this.$store.dispatch('fetchPersons');
        this.$store.getters.getEvents.forEach(item=>{
            let year = new Date(item.event.eventDate).getFullYear().toString();
            if(this.years.filter(item => item.value === year).length === 0){
            this.years.push(
                { 
                value: year,
                selected: false,
                }
              );
            }
        });
      this.calculateChart();
    },
    methods:{
        async downloadExcel(){
        this.loading = true;
        let newDate = new Date();
        moment.locale('de-ch'); 
        let fileName = "Statistik " + new moment(newDate).format('LL');
        let selectedYears = [];
        this.years.forEach(year => {
          if(year.selected){
            selectedYears.push(year.value);
          }
        });
        if(selectedYears.length === 0 || this.selectedEvents.length === 0){
          this.error = "Bitte Typ & Jahr uswähle.. 🙄"
        } else {
        await REST_interface.createStatisticExcel(fileName, this.selectedEvents, selectedYears).then(()=>{
          this.loading = false;
        }).catch(err=>{
          this.loading = false;
          this.error = err;
        });
        }
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
    getAvarageAge(persons){
      let ages = [];
      persons.forEach(item=>{
            if(item.person.age !== undefined){
                ages.push(item.person.age)
            }
        });
        if(ages.length > 2){
            return Math.round(ages.reduce((a, b) => a + b) / ages.length)
        } else return ""
    },
    calculateChart() {
        let firstEvent = this.$store.getters.getEvents.slice().sort((a, b) => b.event.eventDate - a.event.eventDate);
        for (let i = this.getMonday(firstEvent[0].event.eventDate); i <= new Date(); i = this.addDays(i, 7)) {
            let currentEvents = firstEvent.filter(item =>
                (new Date(item.event.eventDate).getTime() >= i.getTime() &&
                    new Date(item.event.eventDate).getTime() < this.addDays(i, 7).getTime()));
            let week = 0;
            currentEvents.forEach(item=>{
              week = week + item.event.participants.length;
            
            });
            this.lineChart.serie2Data.push(currentEvents.length);
            this.lineChart.serie1Data.push(week);
            this.lineChart.categories.push(`KW ${i.getWeekNumber()} ${i.getFullYear()}`);
        }
      }
    },
    computed: {
      eventNames () {
        let eventNames = []; 
        this.$store.getters.getEvents.forEach(item=>{
            eventNames.push(item.event.name)
        });
        return eventNames
        },
    },

}
</script>