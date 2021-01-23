<template>
    <v-card
       color="secondary">
        <v-card-title>Neues Event</v-card-title>
        <v-form>
          <v-select
            class="ma-3"
            v-model="event.name"
            :items="eventNames"
            label="Event"
            required
            item-color="accent"
            outlined
          ></v-select>
          <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
            >
                <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    outlined
                    class="ma-3"
                    prepend-inner-icon="mdi-calendar"
                    v-model="pickerDate"
                    label="Datum YYYY-MM-DD"
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
                </template>
                <v-date-picker
                ref="picker"
                v-model="pickerDate"
                locale="de-ch"
                @change="save"
                ></v-date-picker>
            </v-menu>
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
      Something went wrong 😐 => {{error}}
       <v-btn
            color="error"
            class="ma-3"
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
        pickerDate:"",
        menu: false,
        selectEvent: null, 
      }
  },
  created(){
        if(this.toEdit){
         this.event_ID = this.event._id;
         this.event = this.event.event;
         this.pickerDate = new Date(this.event.eventDate).toISOString().substr(0, 10);
      } 
  },
  computed: {
      eventNames () {
        return this.$store.getters.getEventNames
        },
  },
  methods: {
    async initialize () {
        await this.$store.dispatch('fetchEvents');
    },
    async saveEvent(){
        this.dialogSave = true
        if(this.toEdit){
          this.event.eventDate = this.pickerDate;
          await REST_interface.changeItemInCollection("events", this.event_ID, {event:this.event}).then(resp=>{
                console.log('Event changing status: ' + resp.statusText);
                this.initialize();
                this.closeDialog();
                this.dialogSave = false
            }).catch(err=>{
              this.error = err;
              this.dialogSave = false
            });
        } else {
          this.event.eventDate = this.pickerDate;
          await REST_interface.postToCollection("events",{event:this.event}).then(resp=>{
                console.log('Event adding status: ' + resp.statusText);
                this.initialize();
                this.closeDialog();
                this.dialogSave = false
            }).catch(err=>{
              this.error = err
              this.dialogSave = false
            });
        }
    },
    closeDialog(){
        this.$emit('close-dialog');
    },
    save (date) {
        this.$refs.menu.save(date)
      },
    

  },
}
</script>