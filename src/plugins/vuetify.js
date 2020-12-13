import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#181A1F',
                secondary: '#2c3e50',
                accent: '#8c9eff',
                error: '#b71c1c',
            },
        },
    },
});