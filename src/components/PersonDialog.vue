<template>
    <v-card
       color="secondary">
        <v-card-title>Neue Lappe</v-card-title>
        <v-form>
            <v-text-field
            v-model="person.firstname"
            :rules="[() => !!person.firstname || 'Bitte Ausfüllen!']"
            outlined
            placeholder="Vorname"
            class="ma-10"
            required
          ></v-text-field>
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


export default {
    name: 'PersonDialog',
    props:{
        dialogPerson:Object,
        editPerson:Boolean,
        }, 
    data () {
      return {
        error:"",
        dialogSave: false,
        person_ID:"",
        person: this.dialogPerson,
        toEdit: this.editPerson,
        pickerDate: "",
        prePickerDate: "",
      }
  },
  created(){
        if(this.toEdit){
         this.person_ID = this.person._id;
         this.person = this.person.person;
         //this.prePickerDate = this.event.eventDate;
      } 
      
  },
  methods: {
    async initialize () {
        await this.$store.dispatch('fetchPersons');
    },

    async savePerson(){
        this.dialogSave = true
        if(this.toEdit){
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
    }
  },
}
</script>