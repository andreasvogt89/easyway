<template>
   <v-container
    max-height="300px"
   >
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
          <v-btn
        @click="dialogEventActive = true"
        class="ma-10"
        >Neues Event</v-btn>
        </v-toolbar>
      </template >
      <template v-slot:item="props" >
         <EventCard 
         :event="props.item"
         :calendar_view="false"
          />
      </template>
      <template v-slot:no-data>
      <v-alert
      text 
      class="ma-3"
      type="error" >Keni Events ume hie..
      </v-alert>
    </template>
    </v-data-iterator>
      <v-dialog
          v-if="dialogEventActive" 
          v-model="dialogEventActive"
          max-width="500px"
        >
      <EventDialog
      :dialogEvent="dialogEvent"
      :editEvent="false" 
      @close-dialog="dialogEventActive = false" />
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
        dialogEventActive: false,
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
