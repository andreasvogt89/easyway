
<template>
    <v-card
    class="ma-pa-10"
    color="secondary"
    >
    <h1>{{event.event.name}}</h1>
    <h1>{{event.event.place}}</h1>
    </v-card>
</template>
<script>
export default {
    name: 'EventCard',
    props:{event:Object}
}
</script>