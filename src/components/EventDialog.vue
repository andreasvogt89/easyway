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
          locale="de-ch"
          v-model="pickerdate"
          value="prePickerDate"
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
      <v-alert
      class="ma-2"
      v-if="error != ''"
      text
      prominent
      type="error"
      icon="mdi-cloud-alert"
    >
      Somthing went wrong 😐 => error message: {{error}}
       <v-btn
            color="error"
            class="ma-1"
            outlined
            @click="error = ''"
          >
            Okay
          </v-btn>
    </v-alert>
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
        error:"",
        dialogSave: false,
        event_ID:"",
        event: this.dialogEvent,
        toEdit: this.editEvent,
        pickerdate:"",
        prePickerDate:"",
      }
  },
  created(){
        if(this.toEdit){
         this.event_ID = this.event._id;
         this.event = this.event.event;
         this.prePickerDate = this.event.eventDate;
      } 
  },
  methods: {
    async initialize () {
        await this.$store.dispatch('fetchEvents');
    },

    async saveEvent(){
        this.dialogSave = true
        if(this.toEdit){
          this.event.eventDate = this.pickerdate;
          await REST_interface.changeItemInCollection("events", this.event_ID, {event:this.event}).then(resp=>{
                console.log('Event changing status: ' + resp);
                this.initialize();
                this.closeDialog();
                this.dialogSave = false
            }).catch(err=>{
              this.error = err;
              this.dialogSave = false
            });
        } else {
          this.event.eventDate = this.pickerdate;
          await REST_interface.postToCollection("events",{event:this.event}).then(resp=>{
                console.log('Event adding status: ' + resp);
                this.initialize();
                this.closeDialog();
                this.dialogSave = false
            }).catch(err=>{
              this.error = err;
               this.dialogSave = false
            });
        }
    },
    closeDialog(){
        this.$emit('close-dialog');
    }
  },
}
</script>