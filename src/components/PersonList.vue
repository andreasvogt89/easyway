<template>
<div>
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
      :headers="headers"
      :items="getStoredPersons"
      :search="search"
      item-key="_id"
      :loading="loading"
      loading-text="Heb chli geduld"
    >
    <template v-slot:top>
      <v-toolbar
        flat
        color="secondary"
      >
      <v-btn
              color="primary"
              dark
              class="ma-2"
              @click="newPerson()"
            >
              Neue Lappe
      </v-btn>
      <v-btn
              color="primary"
              dark
              v-if="event_ID !== 'all'"
              class="ma-2"
              @click="addExistingPerson()"
            >
              Add Lappe
            </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editPerson(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deletePerson(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
    </v-data-table>
    <v-dialog
          v-model="dialogPersonActive"
          max-width="500px"
        >
      <PersonDialog
      :dialogPerson="dialogPerson"
      :editPerson="edit" 
      @close-dialog="dialogPersonActive = false" />
    </v-dialog>
  </v-card>
</v-container>
</div>
</template>

<script>

import PersonDialog from "@/components/PersonDialog.vue"
export default {
    name: 'PersonList',
    props:{
     _id:String,
    },
    data () {
      return {
        search: '',
        error: false,
        loading: false,
        dialogPersonActive: false,
        dialogPerson:{},
        dialogDeleteItem: false,
        edit: false,
        event_ID: this._id,
        headers: [
          { text: 'Vorname', value: 'person.firstname' },
          { text: 'Nachname', value: 'person.lastname' },
          { text: 'Strasse', value: 'person.street' },
          { text: 'Geschlecht', value: 'person.gender' },
          { text: 'Alter', value: 'person.age' },
          { text: 'Strassennummer', value: 'person.street_number' },
          { text: 'Wohnort', value: 'person.city' },
          { text: 'Kontaktnummer', value: 'person.phone' },
          { text: 'Notfallnummer', value: 'person.emergency_phone' },
          { text: 'Email', value: 'person.email' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
      }
      
    },
    components:{
      PersonDialog,
    },
    created() {
    this.initialize();  
    },
    computed: {
      getStoredPersons () {
        return this.$store.getters.getPersons
        },
    },
    methods: {
      async initialize (){
        await this.$store.dispatch('fetchPersons');
      },

      editPerson (item) {
        this.dialogPerson = {};
        this.edit = true;
        this.dialogPerson = item; 
        this.dialogPersonActive = true;
      },

      deletePerson () {
        
      },

      newPerson(){
        this.dialogPerson = {};
        this.edit = false;
        this.dialogPersonActive = true;
        this.dialogPerson = {
          firstname:"",
        }
      }
    }
    
} 
</script>