<template>
    <v-card color="secondary">
    <v-card-title 
    class="ma-5px text-center"

    >Würklich wägputze 😱?</v-card-title>
    <v-card-text>
      <v-btn
        class="ma-2"
        @click="deleteItem"
        :loading="waitForAPI"
        :disabled="waitForAPI"
        elevation="2"
      >
      <v-icon large>mdi-check</v-icon>
      </v-btn>
      <v-btn
        @click="closeDialog"
        elevation="2"
        class="ma-2"
      >
      <v-icon large>mdi-close</v-icon>
      </v-btn>
    </v-card-text>
    <v-alert
      class="ma-10"
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
 name:"DeleteItemDialog",
 props:{
     collection:String,
     _id:String
 },
 data () {
      return {
        waitForAPI: false,
        error:"",
        event_ID: this._id,
        collectionName: this.collection
        }
    },
 methods:{
    async deleteItem() {
        this.waitForAPI = true;
        await REST_interface.deleteItemInCollection(this.collectionName,this.event_ID).then(resp=>{
            console.log("Status deleting: "+ resp.statusText);
            this.$store.dispatch('fetchEvents');
            this.$store.dispatch('fetchPersons');
            this.waitForAPI = false;
            this.closeDialog();
        }).catch(err=>{
          this.waitForAPI = false;
          this.error = err;
            });
          },
    closeDialog(){
          this.$emit('close-dialog');
      }, 
          
 }
}
</script>