<template>
    <v-card
    class="ma-10"
    min-width="300px"
    color="secondary"
    :loading="waitForApi"
    :disabled="waitForApi"
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
    <v-card-actions
    class="ma-1"
    >
        <v-btn
        @click="dialogEditEvent = true"
        >
        <v-icon>mdi-calendar-edit</v-icon>  
        </v-btn>
        <v-btn
        @click="dialogPersons = true"
        >
        <v-icon>mdi-account-plus-outline</v-icon>  
        </v-btn>
        <v-btn
        >
        <v-icon>mdi-account-multiple-outline</v-icon>  
        </v-btn>
        <v-btn
        @click="downloadExcel(event._id)"
        >
        <v-icon>mdi-file-excel-outline</v-icon>  
        </v-btn>
        <v-btn
        @click="dialogDeleteEvent = true"
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
    <v-dialog
          v-model="dialogDeleteEvent"
        >
        <DeleteItemDialog
          :_id="event._id"
          :collection="'events'"
          @close-dialog=" dialogDeleteEvent = false"
        />
    </v-dialog>
    <v-dialog
          v-model="dialogPersons"
        >
        <PersonList
          :_id="event._id"
          @close-dialog=" dialogPersons = false"
        />
    </v-dialog>
    </v-card>
    
</template>
<script>
import REST_interface from "@/REST_interface";
import moment from "moment";
import EventDialog from "@/components/EventDialog.vue"
import DeleteItemDialog from "@/components/DeleteItemDialog.vue"
import PersonList from "@/components/PersonList.vue"

export default {
    name: 'EventCard',
    props:{event:Object},
    components: {
    EventDialog,
    DeleteItemDialog,
    PersonList
  },
    data () {
      return {
        waitForApi: false,
        dialogEditEvent: false,
        dialogDeleteEvent: false,
        dialogPersons:false,
        }
    },
    methods:{
    parseDate(date){
         let newDate = new Date(date);
         moment.locale('de-ch')        
         return new moment(newDate).format('LL') + "\n";
      },
    async downloadExcel(event_ID){
        this.waitForAPI = true;
        await REST_interface.createExcel(event_ID).then(()=>{
          this.waitForAPI = false;
        }).catch(err=>{
          this.waitForAPI = false;
          close.log(err);
        })
      }
    },

}
</script>