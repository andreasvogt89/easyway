<template>
    <v-card
       color="secondary">
        <v-card-title>Neues Event</v-card-title>
        <v-form>
          <v-text-field 
          v-model="event.name" 
          outlined
          class="ma-3"
          label="Event Name"
          ></v-text-field>
          <v-date-picker 
          v-model="event.eventDate"
          value="pickerDate"
          >
          </v-date-picker>
          <v-text-field 
          v-model="event.place" 
          outlined
          class="ma-3"
          label="Wo?"
          ></v-text-field>
          <v-textarea 
          v-model="event.comments" 
          outlined
          class="ma-3"
          label="Kommentar"
          ></v-textarea>
        </v-form>
        <v-btn
        elevation="2"
        class="ma-2"
        :loading="dialogSave"
        @click="saveEvent()"
      >
      <v-icon large>mdi-check</v-icon>
      </v-btn>
      <v-btn
        @click="closeDialog()"
        elevation="2"
        class="ma-2"
      >
      <v-icon large>mdi-close</v-icon>
      </v-btn>
    </v-card>
</template>
<script>
import REST_interface from "@/REST_interface";

export default {
    name: 'EventDialog',
    props:{
        dialogEvent:Object,
        editEvent:Boolean,
        }, 
    data () {
      return {
        dialogSave: false,
        event_ID:"",
        event: this.dialogEvent,
        toEdit: this.editEvent,
        pickerDate: undefined,
      }
  },
  created(){
        if(this.toEdit){
            console.log(this.event)
         this.event_ID = this.event._id;
         this.event = this.event.event;
         this.pickerDate = this.event.eventDate;
         this.event.eventDate = "";
      } 
  },
  methods: {
    async initialize () {
        await this.$store.dispatch('fetchEvents');
    },

    async saveEvent(){
        this.dialogSave = true
        await REST_interface.postToCollection("events",{event:this.dialogEvent}).then(resp=>{
          console.log('Event adding status: ' + resp);
          this.initialize();
          this.closeDialog();
      }).catch(err=>{
        alert("Failed to add event: " + err);
      });
      this.dialogSave = false
    },
    closeDialog(){
        this.$emit('close-dialog');
    }
  },
}
</script>