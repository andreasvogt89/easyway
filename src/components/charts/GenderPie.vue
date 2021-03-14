<template>
  <div>
    <v-card class="pa-2 primary" raised min-height="200">
    <v-card-title>Erfasste Personen</v-card-title>
    <v-card-subtitle>Total: {{this.$store.getters.getPersons.length}} (inkl. Dummys)</v-card-subtitle>    
    <div id="chart" class="ma-2">
            <apexchart type="pie" width="480" :options="chartOptions" :series="series"></apexchart>
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
    name:"GenderPie",
    components: {
          apexchart: VueApexCharts,
    },
    data() {
    return {
        series: [this.getGenderPercent("W"),this.getGenderPercent("M")],
          chartOptions: {
            chart: {
              type: 'pie',
            },
            colors:['#d12662','#e26691'],
            labels: [`Frauen`, 
                     `Männer`],
            responsive: [{
              breakpoint: 480,
              options: {
                legend: {
                  position: 'bottom'
                }
              }
            }]
          },
          }
    },
    methods:{
      getGenderPercent(gen){
        return this.$store.getters.getPersons.filter(item => item.person.gender === gen).length
      }
    }
}
</script>
