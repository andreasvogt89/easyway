import Vue from 'vue'
import VueRouter from 'vue-router'
import Events from '../views/Events.vue'
import Login from '../views/Login.vue'
import Calendar from '../views/Calendar.vue'
import Persons from '../views/Persons.vue'
Vue.use(VueRouter)

const routes = [{
        path: '/',
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
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/About.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router