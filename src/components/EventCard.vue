<template>
    <v-card
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
       <v-textarea
        class="text-md-body-1 ma-3"
        no-resize
        outlined
        background-color="secondary"
        auto-grow
        v-model="event.event.comments"
        readonly
        disabled
        >
       </v-textarea>
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
        @click="dialogAddDummy = true"
        >
        <v-icon>mdi-account-multiple-outline</v-icon>  
        </v-btn>
        <v-btn
        @click="downloadExcel(event)"
        >
        <v-icon>mdi-file-excel-outline</v-icon>  
        </v-btn>
        <v-btn
        v-if="!calendarView"
        @click="dialogDeleteEvent = true"
        >
        <v-icon>mdi-delete</v-icon>  
        </v-btn>
    </v-card-actions>
    <v-dialog
          persistent
          v-if="dialogEditEvent"
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
          v-if="dialogDeleteEvent"
        >
        <DeleteItemDialog
          :_id="event._id"
          :collection="'events'"
          @close-dialog=" dialogDeleteEvent = false"
        />
    </v-dialog>
    <v-dialog
          persistent
          v-if="dialogPersons"
          v-model="dialogPersons"
        >
        <PersonList
          :eventItem="event"
          :eventView="true"
          @close-dialog=" dialogPersons = false"
        />
    </v-dialog>
    <v-dialog
          v-if="dialogAddDummy"
          v-model="dialogAddDummy"
          persistent
        >
        <AddDummy
          :eventItem="event"
          @close-dialog=" dialogAddDummy = false"
        />
    </v-dialog>
    <div v-if="calendarView">
      <v-btn
        @click="closeEvent"
        elevation="2"
        class="ma-2"
      >
      <v-icon large>mdi-close</v-icon>
      </v-btn>
    </div>
    </v-card>
  
</template>
<script>
import REST_interface from "@/REST_interface";
import moment from "moment";
import EventDialog from "@/components/EventDialog.vue"
import DeleteItemDialog from "@/components/DeleteItemDialog.vue"
import PersonList from "@/components/PersonList.vue"
import AddDummy from "@/components/AddDummy.vue"

export default {
    name: 'EventCard',
    props:{
      event:Object,
      calendar_view:Boolean,
      },
    components: {
    EventDialog,
    DeleteItemDialog,
    PersonList,
    AddDummy
  },
    data () {
      return {
        calendarView: this.calendar_view,
        waitForApi: false,
        dialogEditEvent: false,
        dialogDeleteEvent: false,
        dialogPersons:false,
        dialogAddDummy: false,
        }
    },
    methods:{
    parseDate(date){
         let newDate = new Date(date);
         moment.locale('de-ch')        
         return new moment(newDate).format('LL');
      },
    async downloadExcel(event){
        this.waitForAPI = true;
        let fileName = event.name +'_'+ this.parseDate(event.eventDate);
        await REST_interface.createEventExcel(fileName ,event._id).then(()=>{
          this.waitForAPI = false;
        }).catch(err=>{
          this.waitForAPI = false;
          console.log(err);
        })
      },
    closeEvent(){
        this.$emit('close-event');
    },
    },
}
</script>
