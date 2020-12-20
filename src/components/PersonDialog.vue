<template>
    <v-card
       color="secondary pa-3">
        <v-card-title>Neue Lappe</v-card-title>
        <v-form>
            <v-row>
            <v-col cols="12" sm="6">
                <v-text-field
                v-model="person.firstname"
                :rules="[() => !!person.firstname || 'Bitte Ausfüllen!']"
                outlined
                placeholder="Vorname"
                required
            ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
                <v-text-field
                    v-model="person.lastname"
                    :rules="[() => !!person.lastname || 'Bitte Ausfüllen!']"
                    outlined
                    placeholder="Nachname"
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
                    readonly
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
           v-bind="person.gender"
           :color="person.gender === 'W' ? 'accent' : 'primary'"
           class="ma-3"
           >
            <v-icon>mdi-face-woman</v-icon>
          </v-btn>
          <v-btn
          x-large 
          @click="person.gender = 'M'"
           v-bind="person.gender"
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
                    placeholder="Handy"
                ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
                <v-text-field
                    v-model="person.emergency_phone"
                    :rules="[rules.number, rules.numberLength]"
                    outlined
                    placeholder="Notfallnummer"
                ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
                <v-text-field
                    outlined
                    v-model="person.email"
                    :rules="[rules.email]"
                    placeholder="E-mail"
                ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">         
                <v-text-field
                    v-model="person.class"
                    outlined
                    placeholder="Klasse"
                ></v-text-field>
            </v-col>
          </v-row>
          <v-text-field
            v-model="person.comments"
            outlined
            placeholder="Kommentar"
          ></v-text-field>
        <v-row>
         <v-col cols="12" sm="8">
            <v-text-field
                v-model="person.city"
                outlined
                placeholder="Ort"
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="person.postcode"
            outlined
            :rules="[rules.number, rules.postcode]"
            placeholder="Postleizahl"
          ></v-text-field>
        </v-col>
        </v-row>
        <v-row>
         <v-col cols="12" sm="8">
            <v-text-field
                v-model="person.street"
                outlined
                placeholder="Strasse"
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="person.street_number"
            outlined
            :rules="[rules.number, rules.postcode]"
            placeholder="Nr."
          ></v-text-field>
        </v-col>
        </v-row>
        <EventPicker :v-bind="person.event" 
        :events="person.event" />
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
import EventPicker from "@/components/EventPicker.vue";

export default {
    name: 'PersonDialog',
    props:{
        dialogPerson:Object,
        editPerson:Boolean,
        preEventSelection:String,
        },
    components:{
      EventPicker
    }, 
    data () {
      return {
        error:"",
        dialogSave: false,
        person_ID:"",
        event_ID: this.preEventSelection,
        person: this.dialogPerson,
        toEdit: this.editPerson,
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
      } else{
        if(this.event_ID !== undefined){
        this.person.push(this.event_ID);
        }
      } 
      
  },
  methods: {
    async initialize () {
        await this.$store.dispatch('fetchPersons');
    },
    async savePerson(){
        this.dialogSave = true
        if(this.toEdit){
          this.person.birthdate = new Date(this.pickerDate);
          this.person.age = this.calculateAge();
          await REST_interface.changeItemInCollection("persons", this.person_ID, {person:this.person}).then(resp=>{
                console.log('Person adding status: ' + resp);
                this.initialize();
                this.closeDialog();
                this.dialogSave = false
            }).catch(err=>{
              this.error = err;
              this.dialogSave = false
            });
        } else {
          this.person.birthdate = new Date(this.pickerDate);
          this.person.age = this.calculateAge();
          await REST_interface.postToCollection("persons",{person:this.person}).then(resp=>{
                console.log('Person adding status: ' + resp);
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
    },
    save (date) {
        this.$refs.menu.save(date)
      },
    calculateAge() { 
    var ageDifMs = Date.now() - new Date(this.pickerDate).getTime();
    var ageDate = new Date(ageDifMs); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
    },
  },
}
</script>