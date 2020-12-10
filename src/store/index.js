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
        data: [],
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
    },
    actions: {
        async login({ commit }, user) {
            await REST_interface.login(user)
                .then(res => {
                    sessionStorage.setItem('EAtoken', res.accessToken)
                    commit('setUser', res.user[0]);
                }).catch(err => {
                    commit('error', err);
                });
        },
        logout({ commit }) {
            commit('removeUser');
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
            console.log(state.login.isLoggedIn)
            return state.login.isLoggedIn;
        },
        getUsername: state => {
            return state.login.username
        },
        getUserRole: state => {
            return state.login.role
        }
    },
});