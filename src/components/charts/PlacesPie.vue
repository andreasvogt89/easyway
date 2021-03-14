<template>
<div>
    <v-card class="pa-2 primary" min-height="200" raised>
    <v-card-title>Erfasste Personen per Ort</v-card-title>
     <v-card-subtitle>Total: {{this.$store.getters.getPersons.length}} (inkl. Dummys)</v-card-subtitle> 
    <div id="chart" class="ma-2">
            <apexchart type="donut" width="480" :options="chartOptions" :series="series"></apexchart>
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
    color:"#535A6C"
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
        series: this.getData(),
          chartOptions: {
            chart: {
              type: 'donut',
            },
            theme: {
            monochrome: {
                enabled: true,
                color: '#d12662',
                shadeTo: 'light',
                shadeIntensity: 0.88
            }
            },
            labels: this.$store.getters.getPlaces,
            responsive: [{
              breakpoint: 680,
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
      getData(){
         let data = [];
         let counter = 0;
         this.$store.getters.getPlaces.forEach(place=>{
            let amount = this.$store.getters.getPersons.filter(item=> item.person.city === place).length; 
            counter = counter + amount
            data.push(amount);
         });
         // set "others" place
         data[data.length -1] = this.$store.getters.getPersons.length - counter;
         return data;
      },
      getLabel(){

      }
    }
}
</script>
