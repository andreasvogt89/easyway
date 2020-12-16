import Vue from 'vue';
import Vuex from 'vuex';
import REST_interface from "@/REST_interface";


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        login: {
            isLoggedIn: false,
            username: "",
            role: "",
        },
        events: [],
        error: "",
        backend: "",
    },
    mutations: {
        setUser(state, data) {
            state.login.username = data.username;
            state.login.role = data.role;
            state.login.isLoggedIn = true;
        },
        removeUser(state) {
            state.login.username = ""
            state.login.role = ""
            state.login.isLoggedIn = false;
        },
        error(state, error) {
            state.error = error
        },
        backend(state, data) {
            state.backend = data
        },
        setEvents(state, events) {
            state.events = events
        }
    },
    actions: {
        async login({ commit }, user) {
            await REST_interface.login(user)
                .then(res => {
                    localStorage.setItem('user', JSON.stringify(res));
                    commit('setUser', res.user[0]);
                }).catch(err => {
                    commit('error', err);
                });
        },
        async reLogin({ commit }, user) {
            commit('setUser', user);
        },
        logout({ commit }) {
            commit('removeUser');
            localStorage.removeItem('user');
        },
        async fetchEvents({ commit }) {
            await REST_interface.getCollection("events")
                .then(res => {
                    //get inner properties for search perpeses
                    res.forEach(element => {
                        element.name = element.event.name;
                        element.eventDate = element.event.eventDate;
                        element.place = element.event.place;
                    });
                    console.log(res);
                    commit('setEvents', res);
                }).catch(err => {
                    commit('removeUser');
                    localStorage.removeItem('user');
                    commit('error', err);
                });
        },
        async backendState({ commit }) {
            await REST_interface.isBackendRunning()
                .then(res => {
                    if (res.message instanceof String) {
                        commit('backend', true)
                    } else {
                        commit('backend', false)
                    }
                }).catch(err => {
                    commit('error', err)
                });
        },

    },
    getters: {
        loginState: state => {
            return state.login.isLoggedIn;
        },
        getUsername: state => {
            return state.login.username
        },
        getUserRole: state => {
            return state.login.role
        },
        getEvents: state => {
            return state.events
        }
    },
});