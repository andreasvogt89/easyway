<template>
<div>
<v-container>
  <PersonList :_id="'all'" />
</v-container>
</div>
</template>

<script>
import PersonList from '../components/PersonList.vue';
export default {
  components: { PersonList },      
} 
</script>