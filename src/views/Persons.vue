<template>
<div>
<v-container>
  <PersonList 
  :eventView="false"
  />
</v-container>
</div>
</template>

<script>
import PersonList from '../components/PersonList.vue';
export default {
  components: { PersonList },
  computed:{
    
  }
} 
</script>