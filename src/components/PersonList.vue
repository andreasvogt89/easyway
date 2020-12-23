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
      <v-btn
            v-if="eventView"
            @click="closeDialog()"
            elevation="2"
            class="ma-2"
        >
        <v-icon large>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-data-table
      class="secondary"
      :headers="headers"
      :items="event_view ? getFilteredPersons : getStoredPersons"
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
              v-if="eventView"
              class="ma-2"
              @click="dialogAddPersonActiv = true"
            >
              Add Bestehendi Lappe
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
    <template v-slot:[`item.person.birthdate`]="{ item }">
      {{parseDate(item.person.birthdate)}}
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
          v-if="dialogPersonActive"
          v-model="dialogPersonActive"
          max-width="500px"
        >
      <PersonDialog
      :dialogPerson="dialogPerson"
      :editPerson="edit"
      :preEventSelection="event_view ? eventItem : undefined" 
      @close-dialog="dialogPersonActive = false" />
    </v-dialog>
    <v-dialog
          v-if="dialogAddPersonActiv"
          v-model="dialogAddPersonActiv"
        >
        <AddPerson
        :eventItem="eventItem"
        @close-dialog="dialogAddPersonActiv = false" />
        />   
    </v-dialog>
    <v-dialog
          v-model="dialogDeletePerson"
        >
        <DeleteItemDialog
          :_id="delete_ID"
          :collection="'persons'"
          @close-dialog=" dialogDeletePerson = false"
        />
    </v-dialog>
  </v-card>
</v-container>
</div>
</template>

<script>
import DeleteItemDialog from "@/components/DeleteItemDialog.vue";
import PersonDialog from "@/components/PersonDialog.vue";
import AddPerson from "@/components/AddPerson.vue";
import moment from "moment";

export default {
    name: 'PersonList',
    props:{
      eventView: Boolean,
      event: Object,
    },
    data () {
      return {
        search: '',
        error: false,
        loading: false,
        dialogPersonActive: false,
        dialogAddPersonActiv: false,
        dialogDeletePerson: false,
        delete_ID: "",
        edit: false,
      
        eventItem: this.event,
        event_view:this.eventView,
        persons: [],
        headers: [
          { text: 'Vorname', value: 'person.firstname' },
          { text: 'Nachname', value: 'person.lastname' },
          { text: 'Geschlecht', value: 'person.gender' },
          { text: 'Alter', value: 'person.age' },
          { text: 'Geburtstag', value: 'person.birthdate' },
          { text: 'Kommentar', value: 'person.comments' },
          { text: 'Strasse', value: 'person.street' },
          { text: 'Strassennummer', value: 'person.street_number' },
          { text: 'Wohnort', value: 'person.city' },
          { text: 'Postleizahl', value: 'person.postcode' },
          { text: 'Kontaktnummer', value: 'person.phone' },
          { text: 'Notfallnummer', value: 'person.emergency_phone' },
          { text: 'Email', value: 'person.email' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
      }
      
    },
    components:{
      PersonDialog,
      DeleteItemDialog,
      AddPerson
    },
    created() {
      this.initialize();   
    },
    computed: {
      getStoredPersons () {
        return this.$store.getters.getPersons.filter(
          item => item.person.firstname !== '#DUMMY')
        },
      getFilteredPersons(){
        return this.$store.getters.getPersons.
        filter(item => this.isIncluded(this.event._id,item.person.event))
      }
    },
    methods: {
      async initialize (){
        await this.$store.dispatch('fetchPersons');
        await this.$store.dispatch('fetchEvents');
      },

      editPerson (item) {
        this.edit = true;
        this.dialogPerson = item; 
        this.dialogPersonActive = true;
      },

      deletePerson (item) {
        this.dialogDeletePerson = true;
        this.delete_ID = item._id;
      },

      newPerson(){
        this.edit = false;
        this.dialogPerson = {
          firstname:"",
          lastname:"",
          gender:"",
          birthdate:"",
          email:"",
          phone:"",
          emergency_phone:"",
          class: "",
          comments: "",
          postcode: "",
          street: "",
          street_number: "",
          city:"",
          event:[],
        }
        this.dialogPersonActive = true;
      },

      parseDate(date){
         let newDate = new Date(date);
         moment.locale('de-ch')        
         return new moment(newDate).format('LL');
      },
      isIncluded(id, personEvents) {
          let answer = false;
          personEvents.forEach(item => {
              if (item._id == id) {
                  answer = true;
              }
          });
          return answer;
      },
      closeDialog(){
        this.initialize();
        this.$emit('close-dialog');
      }

    }
} 
</script>