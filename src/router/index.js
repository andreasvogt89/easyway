import Vue from 'vue'
import VueRouter from 'vue-router'
import Events from '../views/Events.vue'
import Login from '../views/Login.vue'
import Calendar from '../views/Calendar.vue'
import Persons from '../views/Persons.vue'
import About from '../views/About.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/events',
    },
    {
        path: '/events',
        name: 'Events',
        component: Events
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/persons',
        name: 'Persons',
        component: Persons
    },
    {
        path: '/calendar',
        name: 'Calendar',
        component: Calendar
    },
    {
        path: '/about',
        name: 'About',
        component: About
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

export default router