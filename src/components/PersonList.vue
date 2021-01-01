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
              v-if="event_view"
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
    <template v-slot:[`item.person.gender`]="{ item }">
      <v-icon>{{item.person.gender === 'W' ? 'mdi-face-woman': 'mdi-face'}}</v-icon>
    </template>
    <template v-slot:no-data>
      <v-alert
      text 
      class="ma-3"
      type="error" >Keni Lappe ume hie..</v-alert>
    </template>
    </v-data-table>
    <v-dialog
          v-if="dialogPersonActive"
          v-model="dialogPersonActive"
          max-width="600px"
          persistent
        >
      <PersonDialog
      :dialogPerson="dialogPerson"
      :editPerson="edit"
      :preEventSelection="event_view ? event_item : undefined" 
      @close-dialog="dialogPersonActive = false" />
    </v-dialog>
    <v-dialog
          v-if="dialogAddPersonActiv"
          v-model="dialogAddPersonActiv"
          persistent
        >
        <AddPerson
        :eventItem="event_item"
        @close-dialog="dialogAddPersonActiv = false" />
        />   
    </v-dialog>
    <v-dialog
          v-model="dialogDeletePerson"
          v-if="dialogDeletePerson" 
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
      eventItem: Object,
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
        event_item: this.eventItem,
        event_view:this.eventView,
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
          { text: 'Postleitzahl', value: 'person.postcode' },
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
        if(this.event_view){
          let currentEvent = this.$store.getters.getEvents
          .find(item => item._id === this.event_item._id);
          return this.$store.getters.getPersons.filter(
          item => currentEvent.event.participants.includes(item._id))
        } else {
        return this.$store.getters.getPersons.filter(
          item => item.person.firstname !== '#DUMMY')
        }
      },
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
          gender:null,
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
        }
        this.dialogPersonActive = true;
      },

      parseDate(date){
        if(date !== null){
         let newDate = new Date(date);
         moment.locale('de-ch')        
         return new moment(newDate).format('LL');
        } else {
          return ""
        }
      },

      closeDialog(){
        this.initialize();
        this.$emit('close-dialog');
      }
    }
} 
</script>