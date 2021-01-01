<template>
  <v-container>
    <v-card class="secondary ma-2 pa-3">
      <h3>Neui Statistik Lappe erfasse</h3>
      <v-form>
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
            class="ma-3"
          >
            <v-icon>mdi-face</v-icon>
          </v-btn>
        </div>
        <v-row>
          <v-col cols="12" sm="8">
            <v-slider
              class="ma-2"
              v-model="person.age"
              color="accent"
              label="Alter"
              min="1"
              max="100"
              thumb-label
            >
            </v-slider>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="person.age"
              outlined
              label="Alter"
            ></v-text-field>
          </v-col>
        </v-row>
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
              placeholder="Postleitzahl"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="person.class"
              outlined
              placeholder="Klasse"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="person.comments"
              outlined
              placeholder="Kommentar"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="8">
            <v-slider
              class="ma-2"
              v-model="dummies"
              color="accent"
              label="Wie viele?"
              min="1"
              max="20"
              thumb-label
            >
            </v-slider>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="dummies"
              outlined
              label="Dummies"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
      <v-btn
        elevation="2"
        class="ma-2"
        :loading="dialogSave"
        @click="addEventToPersons()"
      >
        <v-icon large>mdi-check</v-icon>
      </v-btn>
      <v-btn @click="closeDialog()" elevation="2" class="ma-2">
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
        Somthing went wrong 😐 => error message: {{ error }}
        <v-btn color="error" class="ma-1" outlined @click="error = ''">
          Okay
        </v-btn>
      </v-alert>
    </v-card>
  </v-container>
</template>
<script>
import REST_interface from "@/REST_interface";
export default {
  name: "AddPerson",
  props: {
    eventItem: Object,
  },
  data() {
    return {
      event: this.eventItem,
      error: "",
      dialogSave: false,
      dummies: 0,
      loading: false,
      person: {
        firstname: "#DUMMY",
        lastname: "#DUMMY",
        email: "",
        emergency_phone: "",
        phone: "",
        city: "",
        street: "",
        street_number: "",
        postcode: "",
        gender: "",
        age: "",
        birthdate: "",
        class: "",
        comments: "",
      },
    };
  },
  methods: {
    closeDialog() {
      this.$emit("close-dialog");
    },
    async addEventToPersons() {
      this.dialogSave = true;
      for (let i = 0; i < this.dummies; i++) {
        await REST_interface.postToCollection("persons", {
          person: this.person,
        })
          .then((resp) => {
            this.event.event.participants.push(resp.data.newID)
          })
          .catch((err) => {
            this.error = err;
          });
      }
      if(this.error === ''){
      await REST_interface.changeItemInCollection("events", this.event._id ,{
        event: this.event.event
      })
      .then(()=>{
            this.closeDialog();
      })
      .catch((err) => {
            this.error = err;
          });
      }
       this.initialize();
       this.dialogSave = false;              
    },
    async initialize() {
      await this.$store.dispatch("fetchPersons");
      await this.$store.dispatch("fetchEvents");
    },
    async asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    },
  },
};
</script>
