<template>
   <v-container fluid>
    <v-data-iterator
      :items="getStoredEvents"
      :search="search"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar
          dark
          class="mb-1"
        >
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Suche"
          >
          </v-text-field>
        </v-toolbar>
      </template >
      <template v-slot:item="props" >
         <EventCard :event="props.item" />
      </template>
      <template v-slot:footer>
        <v-toolbar
          dark
          class="mb-1"
        >
        <v-btn
        @click="dialogNewEvent = true"
        >Neues Event</v-btn> 
        </v-toolbar>
      </template >
    </v-data-iterator>
    <v-dialog
          v-model="dialogNewEvent"
          max-width="500px"
        >
      <v-card
       color="secondary">
        <v-card-title>Neues Event</v-card-title>
        <v-form>
          <v-text-field 
          v-model="dialogEvent.name" 
          outlined
          class="ma-3"
          label="Event Name"
          ></v-text-field>
          <v-date-picker 
          v-model="dialogEvent.eventDate">
          </v-date-picker>
          <v-text-field 
          v-model="dialogEvent.place" 
          outlined
          class="ma-3"
          label="Wo?"
          ></v-text-field>
          <v-textarea 
          value="dialogEvent.comments" 
          outlined
          class="ma-3"
          label="Kommentar"
          ></v-textarea>
        </v-form>
        <v-btn
        elevation="2"
        class="ma-2"
        :loading="dialogSave"
        @click="saveEvent()"
      >
      <v-icon large>mdi-check</v-icon>
      </v-btn>
      <v-btn
        @click="dialogNewEvent = false"
        elevation="2"
        class="ma-2"
      >
      <v-icon large>mdi-close</v-icon>
      </v-btn>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import EventCard from "@/components/EventCard.vue"
import REST_interface from "@/REST_interface";

export default {
  name: 'Events',
  components: {
    EventCard
  },
   data () {
      return {
        search: '',
        dialogNewEvent: false,
        dialogEvent:{
          eventDate: "",
          name: "",
          place: "",
          participants: [],
          comments:"",
        },
        dialogSave: false,
        item: {name:"Hallo"},
      }
  },
  created(){
    this.initialize();
  },
  methods: {
    async initialize () {
        await this.$store.dispatch('fetchEvents');
    },
    async saveEvent(){
        this.dialogSave = true
        await REST_interface.postToCollection("events",{event:this.dialogEvent}).then(resp=>{
          console.log('Event adding status: ' + resp);
          this.initialize();
          this.dialogNewEvent = false;
      }).catch(err=>{
        alert("Failed to add event: " + err);
      });
      this.dialogSave = false
    }
  },
  computed: {
      getStoredEvents () {
        return this.$store.getters.getEvents
        },
  }
}
</script>
