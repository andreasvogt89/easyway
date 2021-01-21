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
            <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                    v-model="pickerDate"
                    outlined
                    label="Geburtstag DD.MM.JJJJ"
                    required
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
                  
                    outlined
                    label="Handy"
                ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
                <v-text-field
                    v-model="person.emergency_phone"
                    
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
                v-model="person.comments"
                outlined
                label="Kommentar"
              ></v-text-field>
            </v-col>
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
            :rules="[rules.postcode]"
            label="Nr."
          ></v-text-field>
        </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4">
          <v-text-field
            v-model="person.postcode"
            outlined
            :rules="[rules.postcode]"
            label="Postleitzahl"
          ></v-text-field>
        </v-col>
         <v-col cols="12" sm="8">
            <v-text-field
                v-model="person.city"
                outlined
                label="Ort"
            ></v-text-field>
        </v-col>
        </v-row>
        <v-expansion-panels
          multiple
          popout
        >
          <v-expansion-panel>
             <v-expansion-panel-header class="title">Eventpicker</v-expansion-panel-header>
            <v-expansion-panel-content>
              <EventPicker
              @push-events="setEvents($event)"
              :preEventSelection="events"  />
              </v-expansion-panel-content>
          </v-expansion-panel>
         </v-expansion-panels>
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
        person_ID:null,
        person: this.dialogPerson,
        toEdit: this.editPerson,
        preEvent: this.preEventSelection,
        changedPersonID:null,
        events: [],
        menu: false,
        pickerDate: null,
        rules: {
          required: value => !!value || 'Üsfülle!!',
          counter: value => value.length <= 20 || 'Max 20 characters',
          postcode: v => v.length <= 4 || 'chli läng, ni ? ',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Mail adresse bitte'
          },
          birthday: value => {
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
         this.events = this.getPersonEvents
          if(this.person.birthdate){
            this.parseBirthdate(this.person.birthdate);
          }
        } else {
          if(this.preEvent !== undefined){
            this.events.push(this.preEvent);
          }
          this.person_ID = null;
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
        await this.$store.dispatch('fetchEvents');
    },
    async savePerson(){
        this.dialogSave = true;
        if(this.pickerDate !== null){
            try {
            this.person.birthdate = this.reverseParseDate(this.pickerDate);
            } catch(err){
              this.error = err;
            }
          } else {
            this.person.birthdate = null
          }
        if(this.toEdit){
          await REST_interface.changeItemInCollection("persons", this.person_ID, {person:this.person}).then(()=>{
            }).then(()=>{}).catch(err=>{
              this.error = err;
            });
        } else {
          await REST_interface.postToCollection("persons",{person:this.person}).then(resp=>{
              this.person_ID = resp.data.newID
            }).then((
            )=>{}).catch(err=>{
              this.error = err;
            });
        }
        if(this.error === ""){
        let validEvents = [];
        this.events.forEach(item=>{
          validEvents.push(item._id);
        }) 
        await this.asyncForEach(this.$store.getters.getEvents,async (eventItem) =>{
            if(validEvents.includes(eventItem._id)){
              if(!eventItem.event.participants.includes(this.person_ID)){
                eventItem.event.participants.push(this.person_ID)
                this.updateEvent(eventItem);
              }
            } else if(eventItem.event.participants.includes(this.person_ID)) {
                eventItem.event.participants.splice(eventItem.event.participants.indexOf(this.person_ID), 1);
                this.updateEvent(eventItem);
            }
            
          });
          this.closeDialog();
        }
        this.initialize();
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
    async updateEvent(eventItem){
      await REST_interface.changeItemInCollection("events", eventItem._id, {
              event: eventItem.event
              }).then(()=>{ 
              }).catch((err) => {
                    this.error = err;
              });
    },
    parseBirthdate(date){
      let dates = new Date(date).toISOString().substr(0, 10).split('-');
      this.pickerDate = dates[2] + "." + dates[1] + "." + dates[0]
    },
    reverseParseDate(date){
      let dates = date.split('.');
      let d = new Date(dates[2] + "-" + dates[1] + "-" + dates[0]);
      if(d instanceof Date && !isNaN(d)){
        return d
      } else throw new Error("This is not güet format für geburi!"); 
    }
  },
}
</script>