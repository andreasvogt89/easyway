import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            dark: {
                primary: '#181A1F',
                secondary: '#2c3e50',
                accent: '#d12662'

            },
        },
        dark: true
    },
});