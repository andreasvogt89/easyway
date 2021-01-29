<template>
  <v-container>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
            bottom
            right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          :weekdays='days'
          locale="de-Ch"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-dialog
          v-model="selectedOpen"
        >
         <EventCard
         :event="selectedEvent"
         :calendar_view="true"
          @close-event="closeEvent()" />
        </v-dialog>
      </v-sheet>
    </v-col>
  </v-row>
  </v-container>
</template>
<script>
import EventCard from "@/components/EventCard.vue"
  export default {
    components:{
      EventCard,
    },
    data: () => ({
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      days: [1, 2, 3, 4, 5, 6, 0],
      selectedEvent: {},
      selectedOpen: false,
      events: [],
      colors: ['blue', 'indigo', 
      'deep-purple', 'cyan', 'green', 'orange', 'accent',
      'red lighten-3','pink lighten-3','purple lighten-3','purple darken-1',
      'indigo lighten-1','blue lighten-3','deep-purple accent-1',
      'teal lighten-1','teal darken-4','cyan darken-4','green darken-4','green lighten-2'
      ],
    }),
    mounted() {
      this.updateRange();
    },
    methods: {
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({  event }) {
        this.selectedEvent = event.data
        this.selectedOpen = true  
      },
      closeEvent(){
        this.selectedOpen = false;
        this.updateRange();
      },
      async updateRange () {
        const events = []
        for (let i = 0; i < this.getStoredEvents.length; i++) {
          events.push({
            data: this.getStoredEvents[i],
            name: this.getStoredEvents[i].event.name,
            start: new Date(this.getStoredEvents[i].event.eventDate),
            color: this.colors[this.rnd(0, this.colors.length - 1)],
          })
        }
        this.events = events
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    },
    computed: {
      getStoredEvents () {
        return this.$store.getters.getEvents
        },
  }
  }
</script>