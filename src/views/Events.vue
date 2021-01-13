<template>
   <v-container
    max-height="300px"
   >
    <v-data-iterator
      :items="getStoredEvents"
      :search="search"
      :sort-by="propMap.get(sortBy)"
      :sort-desc="sortDesc"
      hide-default-footer
      disable-pagination
    >
      <template v-slot:header>
        <v-toolbar
          dark
          class="mb-1"
        >
          <v-text-field
            v-model="search"
            class="ma-2"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Suche"
          >
          </v-text-field>
          <template>
            <v-spacer></v-spacer>
            <v-select
              class="ma-2"
              color="accent"
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keys"
              label="Sort by"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle
              
              v-model="sortDesc"
              mandatory
            >
              <v-btn
                large
                depressed
                :value="false"
              >
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn
                large
                depressed
                :value="true"
              >
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
          <v-btn
        @click="dialogEventActive = true"
        class="ma-3"
        >Neues Event</v-btn>
        </v-toolbar>
      </template >
      <template v-slot:item="props" >
         <EventCard 
         class="ma-8"
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
      @close-dialog="clearEventDialog()" />
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
        sortDesc: true,
        sortBy: 'Datum',
        keys: [
          'Eventtyp',
          'Datum',
          'Kommentar',
          'Wo',
          'Anzahl Personen',
        ],
        dialogEventActive: false,
        dialogEvent:{
          eventDate: "",
          name: "",
          place: "",
          participants: [],
          comments:"",
        },
        propMap: new Map(),
      }
  },
  created(){
    this.initialize();
    this.propMap.set('Eventtyp', 'name');
    this.propMap.set('Datum', 'sortDate');
    this.propMap.set('Kommentar', 'comments');
    this.propMap.set('Wo', 'place');
    this.propMap.set('Anzahl Personen', 'participants');
  },
  methods: {
    async initialize () {
        await this.$store.dispatch('fetchEvents');
    },
    clearEventDialog(){
      this.dialogEventActive = false;
      this.dialogEvent = {
          eventDate: "",
          name: "",
          place: "",
          participants: [],
          comments:"",
        };
    }
  },
  computed: {
      getStoredEvents () {
        return this.$store.getters.getEvents
        },
  }
}
</script>
