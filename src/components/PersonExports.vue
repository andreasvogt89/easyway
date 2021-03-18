<template>
    <div>
        <v-card>
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
                :disabled="selectedEvents < 0"
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
    </div>
</template>

<script>
export default {
    name: "PersonExport",
    data() {
        return {
            error:"",
            selectedEvents: [],
        }
    }
}
</script>