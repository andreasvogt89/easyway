<template>
<div>
    <v-card v-if="this.$store.getters.getEvents.length > 0" class="pa-2 primary" raised>
    <v-card-title>{{title}}</v-card-title>
    <v-spacer></v-spacer>
    <h2 class="">Anzahl erfasste Events: {{this.$store.getters.getEvents.length}}</h2>
    <v-card-subtitle >Im durchschnitt kommen {{Math.round(serie1Data.reduce((a, b) => a + b) / serie1Data.length)}} leute pro Woche</v-card-subtitle>    
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
}
</script>
