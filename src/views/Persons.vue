<template>
<v-container>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table    
      dense
      :headers="headers"
      :items="personList"
      :search="search"
      show-select
      item-key="_id"
      :loading="loading"
      loading-text="Loading... Please wait"
    >
    

    </v-data-table>
  </v-card>
</v-container>
</template>

<script>
import REST_interface from "@/REST_interface";
export default {
    data () {
      return {
        search: '',
        error: false,
        loading: false,
        headers: [
          {
            text: 'Vorname',
            align: 'start',
            value: 'person.firstname',
          },
          { text: 'Nachname', value: 'person.lastname' },
          { text: 'Strasse', value: 'person.street' },
          { text: 'Geschlecht', value: 'person.gender' },
          { text: 'Alter', value: 'person.age' },
          { text: 'Strassennummer', value: 'person.street_number' },
          { text: 'Wohnort', value: 'person.city' },
          { text: 'Kontaktnummer', value: 'person.phone' },
          { text: 'Notfallnummer', value: 'person.emergency_phone' },
          { text: 'Email', value: 'person.email' },
        ],
        personList: [],
      }
      
    },
    async created() {
    this.personList = [],
    this.loading = true;
    await REST_interface.getCollection("persons").then(resp=>{
        resp.forEach(item=> {
        if (item.person.firstname !== '#DUMMY') {
          this.personList.push({
            person: item.person,
            _id: item._id,
            selected: false,
          });
        }
      });
    }).catch(err=>{
      this.error = err;
    });
    this.loading = false; 
  },
} 
</script>