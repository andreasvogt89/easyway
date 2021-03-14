<template>
<div>
  <v-card class="pa-2 primary" raised>
    <v-card-title class="text-h5">{{title}}
      <v-spacer></v-spacer>
         <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <div
                v-bind="attrs"
                v-on="on"
            >
              <v-badge
                class="ma-3"
                color="accent"
                :content="$store.getters.getEvents.length"
                >
              <v-icon>mdi-calendar-multiple</v-icon>
              </v-badge>
            </div>
          </template>
          <span>Erfasste Events</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <div
                v-bind="attrs"
                v-on="on"
            >
              <v-badge
                class="ma-3"
                color="accent"
                :content="getNumberOfVisitors"
            >
            <v-icon>mdi-account-multiple</v-icon>
            </v-badge>
            </div>
          </template>
          <span>Total Besucher</span>
        </v-tooltip>
    </v-card-title>
        <div v-if="serie1Data.length > 0" class="overline">
          Im durchschnitt kommen <strong class="accent--text">{{Math.round(serie1Data.reduce((a, b) => a + b) / serie1Data.length)}}</strong> lappen pro Woche
        </div>
    <div id="chart" class="ma-2">
      <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>
    </div>
  </v-card>
 </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

window.Apex = {
  chart: {
    foreColor: '#ccc',
    toolbar: {
      show: false
    },
  },
  stroke: {
    width: 3
  },
  dataLabels: {
    enabled: false
  },
  tooltip: {
    theme: 'dark'
  },
  grid: {
    borderColor: "#535A6C",
    xaxis: {
      lines: {
        show: true
      }
    }
  }
};

export default {
    name:"LineChart",
    props:{
        title:String,
        serie1Data:Array,
        serie1Name:String,
        serie2Data:Array,
        serie2Name:String,
        categories:Array,
    },
    components: {
          apexchart: VueApexCharts,
    },
    data() {
    return {
          series: [{
            name: this.serie1Name,
            data: this.serie1Data,
          },{
            name: this.serie2Name,
            data: this.serie2Data,
          }],
          chartOptions: {
            chart: {
              height: 350,
              type: 'area'
            },
            colors:['#d12662','#e26691'],
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'smooth'
            },
            xaxis: {
              type: 'string',
              categories: this.categories,
               tooltip: {
                    enabled: false,
               },
            },
          },
        }
    },
    computed:{
      getNumberOfVisitors(){
        let numberOfVisitors = 0;
        this.$store.getters.getEvents.forEach(event=>{
          numberOfVisitors += event.event.participants.length
        })
        return numberOfVisitors
      },
    }
}
</script>
