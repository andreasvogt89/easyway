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
          color="blue darken-3"
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
    </v-data-iterator>
  </v-container>
</template>

<script>
import EventCard from "@/components/EventCard.vue"

export default {
  name: 'Events',
  components: {
    EventCard
  },
   data () {
      return {
        search: '',
        item: {name:"Hallo"},
      }
  },
  created(){
    this.initialize();
  },
  methods: {
    initialize () {
        //fetch events to store after saving and so on
    },
  },
  computed: {
      getStoredEvents () {
        return this.$store.getters.getEvents
        },
  }
}
</script>
