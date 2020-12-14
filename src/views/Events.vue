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
      <template v-slot:footer >
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
      <EventDialog 
      :dialogEvent="dialogEvent"
      :editEvent="false" 
      @close-dialog="dialogNewEvent = false" />
      </v-dialog>
  </v-container>
</template>

<script>
import EventCard from "@/components/EventCard.vue"
import EventDialog from "@/components/EventDialog.vue"


export default {
  name: 'Events',
  components: {
    EventCard,
    EventDialog
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
      }
  },
  created(){
    this.initialize();
  },
  methods: {
    async initialize () {
        await this.$store.dispatch('fetchEvents');
    },
  },
  computed: {
      getStoredEvents () {
        return this.$store.getters.getEvents
        },
  }
}
</script>
