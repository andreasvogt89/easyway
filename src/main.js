import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import Vuetify from "vuetify";
import vuetify from '@/plugins/vuetify';


Vue.use(Vuetify);


new Vue({
    vuetify,
    store,
    router,
    render: h => h(App)
}).$mount('#app')