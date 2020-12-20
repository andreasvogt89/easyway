<template>
    <v-card
    class="mx-auto"
    max-width="500"
  >
    <v-toolbar
      flat
      color="transparent"
    >
      <v-toolbar-title>Event Picker</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="$refs.search.focus()"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container class="py-0">
      <v-row
        align="center"
        justify="start"
      >
        <v-col
          v-for="(selection, i) in selections"
          :key="selection._id"
          class="shrink"
        >
          <v-chip
            class="accent"
            :disabled="loading"
            close
            @click:close="selected.splice(i, 1)"
          >
            {{ selection.event.name }}
          </v-chip>
        </v-col>

        <v-col
          v-if="!allSelected"
          cols="12"
        >
          <v-text-field
            ref="search"
            v-model="search"
            full-width
            hide-details
            label="Search"
            single-line
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <v-divider v-if="!allSelected"></v-divider>
    <v-list>
      <template v-for="item in categories">
        <v-list-item
          v-if="!selected.includes(item)"
          :key="item._id"
          :disabled="loading"
          @click="selected.push(item)"
        >
          <v-list-item-title v-text="item.event.name"></v-list-item-title>
          <v-list-item-subtitle v-text="parseDate(item.event.eventDate)" ></v-list-item-subtitle>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>
<script>
import moment from "moment";
export default {
    name: "EventPicker",
    props:{events:Array},
    data: () => ({
      loading: false,
      search: '',
      selected: [],
      items: [],
    }),
    created(){
        this.items = this.getEvents();
    },
    computed: {
      allSelected () {
        return this.selected.length === this.items.length
      },
      categories () { 
        const search = this.search.toLowerCase()
        if (!search) return this.items
        return this.items.filter(item => {
          const text = item.event.name.toLowerCase()
          return text.indexOf(search) > -1
        })
      },
      selections () {
        const selections = []
        for (const selection of this.selected) {
          selections.push(selection)
        }
        return selections
      },
    },

    watch: {
      selected () {
        this.search = ''
      },
    },

    methods: {
      getEvents(){
          return this.$store.getters.getEvents
      },
      parseDate(date){
         let newDate = new Date(date);
         moment.locale('de-ch')        
         return new moment(newDate).format('LL');
      },
    },
  }
</script>