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
    </v-toolbar>

    <v-container class="py-0">
      <v-row
        align="center"
        justify="start"
      >
        <v-col
          v-for="(selection, i) in selected"
          :key="selection._id"
          class="shrink"
        >
          <v-chip
            class="accent"
            :disabled="loading"
            close
            @click:close="refreshSelectionEvents(selection, i)"
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
            label="Suchen.."
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
          @click="refreshSelectedEvents(item)"
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
    props:{
      preEventSelection:Array
      },
    data () {
      return {
      loading: false,
      err: '',
      search: '',
      selected: this.preEventSelection,
      items: []
      }
    },
    created(){
      this.initialize();
    },
    computed: {
      allSelected () {
        return this.items.length === 0
      },
      categories () { 
        const search = this.search.toLowerCase()
        if (!search) return this.items
        return this.items.filter(item => {
          const text = item.event.name.toLowerCase()
          return text.indexOf(search) > -1
        })
      },
    },

    watch: {
      selected () {
        this.search = ''
      },
    },

    methods: {
      parseDate(date){
         let newDate = new Date(date);
         moment.locale('de-ch')        
         return new moment(newDate).format('LL');
      },
      pushEvents(){
        this.$emit('push-events', this.selected);
      },
      refreshSelectedEvents(item){
        this.selected.push(item);
        this.pushEvents();
        this.initialize();
      },
      refreshSelectionEvents(selection, i){
        this.selected.splice(i,1);
        this.pushEvents();
        this.initialize();
      },
      async initialize(){
        this.items = [];
        this.$store.getters.getEvents.forEach(element => {
            if(this.selected.find(item => item._id === element._id))
            {
              console.log('yeeeiit!!');
            }else{
              this.items.push(element)
            }
          });
      },
    },
  }
</script>