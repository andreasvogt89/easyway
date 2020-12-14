<template>
    <v-card
    class="ma-10"
    color="secondary"
    >
    <v-card-title
    class="blue-grey darken-4"
    >{{event.event.name}}</v-card-title>
    <div class="text-left">
    <v-card-subtitle
    >
        Wo: 
        <v-chip
        class="ma-2"
        color="accent">  
        <strong>{{event.event.place}}</strong>
        </v-chip>
        Anzahl Personen: 
        <v-chip
        class="ma-2"
        color="accent"> 
        <strong>{{event.event.participants.length}}</strong>
        </v-chip>
        Wann:
        <v-chip
        class="ma-2"
        color="accent"> 
        <strong>{{this.parseDate(event.event.eventDate)}}</strong>
        </v-chip>
    </v-card-subtitle>
    </div>
    <v-divider class="mx-4"></v-divider>
    <v-card-text outlined label="Kommentare" >{{event.event.comments}}</v-card-text>
    <v-divider class="ma-2"></v-divider>
    <v-card-actions>
        <v-btn
        @click="dialogEditEvent = true"
        >
        <v-icon>mdi-calendar-edit</v-icon>  
        </v-btn>
        <v-btn
        >
        <v-icon>mdi-account-plus-outline</v-icon>  
        </v-btn>
        <v-btn
        >
        <v-icon>mdi-account-multiple-outline</v-icon>  
        </v-btn>
        <v-btn
        @click="downloadExcel(event._id)"
        :loading="waitForAPI"
        :disabled="waitForAPI"
        >
        <v-icon>mdi-file-excel-outline</v-icon>  
        </v-btn>
        <v-btn
        @click="deleteEvent(event._id)"
        :loading="waitForAPI"
        :disabled="waitForAPI"
        >
        <v-icon>mdi-delete</v-icon>  
        </v-btn>
    </v-card-actions>
    <v-dialog
          v-model="dialogEditEvent"
          max-width="500px"
        >
      <EventDialog 
      :dialogEvent="event"
      :editEvent="true" 
      @close-dialog="dialogEditEvent = false" />
      </v-dialog>
    </v-card>
    
</template>
<script>
import REST_interface from "@/REST_interface";
import moment from "moment";
import EventDialog from "@/components/EventDialog.vue"

export default {
    name: 'EventCard',
    props:{event:Object},
    components: {
    EventDialog
  },
    data () {
      return {
        waitForAPI: false,
        dialogEditEvent: false,
        }
    },
    methods:{
        async deleteEvent(event_ID) {
        if (confirm('Are you sure you want to delete this?')) {
        this.waitForAPI = true;
        console.log(event_ID);
        await REST_interface.deleteItemInCollection("events",event_ID).then(()=>{
            this.$store.dispatch('fetchEvents');
        }).catch(err=>{
          alert('Event deleting failed: ' + err)
          console.log('Event delete failed: ' + err);
            });
          } else {
            alert("You're weak... weichbächer");
            this.waitForAPI = false;
            }
        },
    parseDate(date){
         let newDate = new Date(date);
         return new moment(newDate).format('LL') + "\n";
      },

    async downloadExcel(event_ID){
        this.waitForAPI = true;
        await REST_interface.createExcel(event_ID).then(()=>{
          console.log("done!");
          this.waitForAPI = false;
        }).catch(err=>{
          this.waitForAPI = false;
          close.log(err);
        })
      }
    },

}
</script>