<template>
        <v-card class="secondary">
            <v-card-title>
            Export Personen per Eventtypen
            <v-spacer></v-spacer>
            <v-btn
                @click="closeDialog()"
                elevation="2"
            >
            <v-icon large>mdi-close</v-icon>
            </v-btn>
            </v-card-title>
                <v-combobox
                class="ma-2"
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
                <v-card-text>Export auswahl in Excel</v-card-text>
                <v-btn
                class="ma-2"
                x-large
                :disabled="selectedEvents.length < 0"
                @click="downloadExcel"
                >
                <v-icon>mdi-file-excel-outline</v-icon>  
                </v-btn>
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
</template>

<script>
import REST_interface from "@/REST_interface";
import moment from "moment";

export default {
    name: "PersonExport",
    data() {
        return {
            error:"",
            selectedEvents: [],
            loading: false,
        }
    },
    computed: {
      eventNames() {
        let eventNames = []; 
        this.$store.getters.getEvents.forEach(item=>{
            eventNames.push(item.event.name)
        });
        return eventNames
        },
    },
    methods:{
        closeDialog(){
        this.$emit('close-dialog');
    },
    async downloadExcel(){
        this.loading = true;
        if(this.selectedEvents.length === 0){
          this.error = "Bitte Typ uswähle.. 🙄";
        } else {
            let fileName = `Personen stand ${new moment(newDate).format('LL')} von: `;
            let newDate = new Date();
            moment.locale('de-ch');
            this.selectedEvents.forEach((name, i) => {
                if (i === 0) {
                    fileName = fileName + ` ${name}`
                } else {
                    fileName = fileName + ` & ${name}`
                }
            }); 
        await REST_interface.createPersonExcel(fileName, this.selectedEvents).then(()=>{
          this.loading = false;
        }).catch(err=>{
          this.loading = false;
          this.error = err;
        });
        }
     }
    
    },
}
</script>