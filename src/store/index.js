import Vue from 'vue';
import Vuex from 'vuex';
import REST_interface from "@/REST_interface";
import router from '@/router/index'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        login: {
            isLoggedIn: false,
            username: "",
            role: "",
            expiresAt: "",
        },
        timeLeft: "",
        events: [],
        persons: [],
        error: "",
        backend: "",
    },
    mutations: {
        setUser(state, data) {
            state.login.username = data.user[0].username;
            state.login.role = data.user[0].role;
            state.login.expiresIn = data.expiresIn;
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
        },
        setPersons(state, persons) {
            state.persons = persons
        },
        setTimeLeft(state, time) {
            state.timeLeft = time
        }
    },
    actions: {
        async login({ commit, dispatch }, user) {
            await REST_interface.login(user)
                .then(res => {
                    localStorage.setItem('user', JSON.stringify(res.data));
                    commit('setUser', res.data);
                    dispatch('setLogoutTimer', res.data.expiresAt);
                }).catch(err => {
                    commit('error', err);
                });

        },
        async reLogin({ commit, dispatch }, data) {
            commit('setUser', data);
            dispatch('setLogoutTimer', data.expiresAt);
        },
        logout({ commit }) {
            commit('removeUser');
            localStorage.removeItem('user');
        },
        setLogoutTimer({ commit }, expirationAt) {
            setTimeout(() => {
                commit('removeUser');
            }, 3600 * 3 * 1000);
            setInterval(() => {
                let distance = new Date(expirationAt).getTime() -
                    new Date().getTime();
                let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((distance % (1000 * 60)) / 1000);
                let timeLeft = hours + ':' + minutes + ':' + seconds
                commit('setTimeLeft', timeLeft)
            }, 10);
            router.replace('/');
        },
        async fetchEvents({ commit }) {
            await REST_interface.getCollection("events")
                .then(res => {
                    //get inner properties for search perpeses
                    res.data.forEach(element => {
                        element.name = element.event.name;
                        element.eventDate = element.event.eventDate;
                        element.place = element.event.place;
                    });
                    commit('setEvents', res.data);
                }).catch(err => {
                    localStorage.removeItem('user');
                    commit('error', err)
                });
        },

        async fetchPersons({ commit }) {
            await REST_interface.getCollection("persons")
                .then(res => {
                    commit('setPersons', res.data);
                }).catch(err => {
                    localStorage.removeItem('user');
                    commit('error', err)
                });
        },

        async backendState({ commit }) {
            await REST_interface.isBackendRunning()
                .then(res => {
                    if (res.data.message instanceof String) {
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
        },
        getPersons: state => {
            return state.persons
        },
        getError: state => {
            return state.error
        },
        getTokenExpiresIn: state => {
            return state.timeLeft
        }
    },
});