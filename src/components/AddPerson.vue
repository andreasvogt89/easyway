<template>
    <v-container>
  <v-card
  class="secondary"
  >
    <v-card-title>
      <v-text-field
        v-model="search" 
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      class="secondary"
      show-select
      v-model="selected"
      :headers="headers"
      :items="getStoredPersons"
      :search="search"
      item-key="_id"
      :loading="loading"
      loading-text="Heb chli geduld"
    >
    <template v-slot:top>
        <h3>Add Bestehendi Lappe to <strong class="accent--text">{{event.event.name}}</strong></h3>
    </template>
    <template v-slot:[`item.person.birthdate`]="{ item }">
      {{parseDate(item.person.birthdate)}}
    </template>
    </v-data-table>
       <v-btn
        elevation="2"
        class="ma-2"
        :loading="dialogSave"
        @click="addEventToPersons()"
      >
      <v-icon large>mdi-check</v-icon>
      </v-btn>
      <v-btn
        @click="closeDialog()"
        elevation="2"
        class="ma-2"
      >
      <v-icon large>mdi-close</v-icon>
      </v-btn>
      <v-alert
      class="ma-2"
      v-if="error != ''"
      text
      prominent
      type="error"
      icon="mdi-cloud-alert"
        >
      Something went wrong 😐 => {{error}}
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
import moment from "moment";
import REST_interface from "@/REST_interface";
export default {
    
    name:'AddPerson',
    props:{
        eventItem:Object,
    },
     data () {
      return {
            event: this.eventItem,
            search: '',
            error: false,
            dialogSave: false,
            singleSelect: false,
            selected: [],
            loading: false,
             headers: [
          { text: 'Vorname', value: 'person.firstname' },
          { text: 'Nachname', value: 'person.lastname' },
          { text: 'Geschlecht', value: 'person.gender' },
          { text: 'Alter', value: 'person.age' },
          { text: 'Geburtstag', value: 'person.birthdate' },
        ],
        }
    },
    computed: {
      getStoredPersons () {
        return this.$store.getters.getPersons.filter(
          item => (item.person.firstname !== '#DUMMY'
          && !this.event.event.participants.includes(item._id))
          )}
    },
    methods:{
        closeDialog(){
            this.$emit('close-dialog');
        },
        parseDate(date){
         let newDate = new Date(date);
         moment.locale('de-ch')        
         return new moment(newDate).format('LL');
      },
      async addEventToPersons(){
        this.dialogSave = true
        await this.asyncForEach(this.selected, async(item) => { 
          this.event.event.participants.push(item._id) 
        });
        console.log(this.event)
        await REST_interface.changeItemInCollection("events", this.event._id, {
        event: this.event.event
        })
        .then(()=>{
              this.initialize();
              this.closeDialog();
              this.dialogSave = false;
        })
        .catch((err) => {
              this.error = err;
            });
      },
      async initialize (){
        await this.$store.dispatch('fetchPersons');
      },
      async asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        }
    }
    
}
</script>