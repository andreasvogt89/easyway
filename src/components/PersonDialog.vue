<template>
    <v-card
       color="secondary pa-3"
       >
        <v-card-title>Neue Lappe</v-card-title>
        <v-form>
            <v-row>
            <v-col cols="12" sm="6">
                <v-text-field
                v-model="person.firstname"
                :rules="[() => !!person.firstname || 'Bitte Ausfüllen!']"
                outlined
                label="Vorname"
                required
            ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
                <v-text-field
                    v-model="person.lastname"
                    :rules="[() => !!person.lastname || 'Bitte Ausfüllen!']"
                    outlined
                    label="Nachname"
                    required
                ></v-text-field>
            </v-col>
            </v-row>
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
                    v-model="pickerDate"
                    label="Geburtstag"
                    prepend-icon="mdi-calendar"
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
                </template>
                <v-date-picker
                ref="picker"
                v-model="pickerDate"
                locale="de-ch"
                :max="new Date().toISOString().substr(0, 10)"
                min="1950-01-01"

                @change="save"
                ></v-date-picker>
            </v-menu>
          <div>
           <v-btn
           x-large 
           @click="person.gender = 'W'"
           :color="person.gender === 'W' ? 'accent' : 'primary'"
           class="ma-3"
           >
            <v-icon>mdi-face-woman</v-icon>
          </v-btn>
          <v-btn
          x-large 
          @click="person.gender = 'M'"
           :color="person.gender === 'M' ? 'accent' : 'primary'"
          class="ma-3" >
            <v-icon>mdi-face</v-icon>
          </v-btn>
          </div>
          <v-row>
            <v-col cols="12" sm="6">
                <v-text-field
                    v-model="person.phone"
                    :rules="[rules.number, rules.numberLength]"
                    outlined
                    label="Handy"
                ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
                <v-text-field
                    v-model="person.emergency_phone"
                    :rules="[rules.number, rules.numberLength]"
                    outlined
                    label="Notfallnummer"
                ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
                <v-text-field
                    outlined
                    v-model="person.email"
                    :rules="[rules.email]"
                    label="E-mail"
                ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">         
                <v-text-field
                    v-model="person.class"
                    outlined
                    label="Klasse"
                ></v-text-field>
            </v-col>
          </v-row>
          <v-text-field
            v-model="person.comments"
            outlined
            label="Kommentar"
          ></v-text-field>
        <v-row>
         <v-col cols="12" sm="8">
            <v-text-field
                v-model="person.city"
                outlined
                label="Ort"
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="person.postcode"
            outlined
            :rules="[rules.number, rules.postcode]"
            label="Postleitzahl"
          ></v-text-field>
        </v-col>
        </v-row>
        <v-row>
         <v-col cols="12" sm="8">
            <v-text-field
                v-model="person.street"
                outlined
                label="Strasse"
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="person.street_number"
            outlined
            :rules="[rules.number, rules.postcode]"
            label="Nr."
          ></v-text-field>
        </v-col>
        </v-row>
        <EventPicker 
        @push-events="setEvents($event)"
        :preEventSelection="events"  />
        </v-form>
        <v-btn
        elevation="2"
        class="ma-2"
        :loading="dialogSave"
        @click="savePerson()"
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
import EventPicker from "@/components/EventPicker.vue";

export default {
    name: 'PersonDialog',
    props:{
        dialogPerson:Object,
        editPerson:Boolean,
        preEventSelection:Object,
        },
    components:{
      EventPicker
    }, 
    data () {
      return {
        error:"",
        dialogSave: false,
        person_ID:"",
        person: this.dialogPerson,
        toEdit: this.editPerson,
        preEvent: this.preEventSelection,
        changedPersonID:null,
        events: [],
        menu: false,
        pickerDate: "",
        rules: {
          required: value => !!value || 'Required.',
          counter: value => value.length <= 20 || 'Max 20 characters',
          number: v => Number.isInteger(Number(v)) || 'Bisch du blööd?😂',
          numberLength: v => v.length >= 10 || 'chli churz ni ? ',
          postcode: v => v.length <= 4 || 'chli läng, ni ? ',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Mail adresse bitte'
          },
        },

      }
  },
  watch: {
      menu (val) {
        val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
    },
  created(){
        if(this.toEdit){
         this.person_ID = this.person._id;
         this.person = this.person.person;
         this.pickerDate = new Date(this.person.birthdate).toISOString().substr(0, 10);
         this.events = this.getPersonEvents
        } else {
          if(this.preEvent !== undefined){
            this.events.push(this.preEvent);
          }
        }   
  },
  computed: {
      getPersonEvents () {
        return this.$store.getters.getEvents.filter(
          item => item.event.participants.includes(this.person_ID))
      },
    },
  methods: {
    async initialize () {
        await this.$store.dispatch('fetchPersons');
    },
    async savePerson(){
        this.dialogSave = true
        this.changedPersonID = "";
        if(this.toEdit){
          if(this.pickerDate !== ""){
            this.person.birthdate = new Date(this.pickerDate);
          }
          await REST_interface.changeItemInCollection("persons", this.person_ID, {person:this.person}).then(()=>{
            this.changedPersonID = this.person_ID;
            }).catch(err=>{
              this.error = err;
              this.dialogSave = false
            });
        } else {
          if(this.pickerDate !== ""){
            this.person.birthdate = new Date(this.pickerDate);
          }
          await REST_interface.postToCollection("persons",{person:this.person}).then(resp=>{
              this.changedPersonID = resp.data.newID
            }).catch(err=>{
              this.error = err;
              this.dialogSave = false
            });
        }
        await this.asyncForEach(this.$store.getters.getEvents,async (eventItem) =>{
            if(this.events.find(item=> item._id === eventItem._id)){
              if(!eventItem.event.participants.includes(this.changedPersonID)){
                eventItem.event.participants.push(this.changedPersonID)
              }
            } else {
              eventItem.event.participants.splice(eventItem.event.participants.indexOf(this.changedPersonID), 1);
            }
            await REST_interface.changeItemInCollection("events", eventItem._id, {
              event: eventItem.event
              }).catch((err) => {
                    this.error = err;
                    this.dialogSave = false;
              });
        });
        this.initialize();
        this.closeDialog();
        this.dialogSave = false;
    },
    closeDialog(){
        this.$emit('close-dialog');
    },
    save (date) {
        this.$refs.menu.save(date)
      },
    setEvents(selectedEvents){
      this.events = selectedEvents;
    },
    async asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    },
  },
}
</script>