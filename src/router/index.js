import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () =>
            import ('@/views/Dashboard.vue')
    },
    {
        path: '/events',
        name: 'Events',
        component: () =>
            import ('@/views/Events.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ('@/views/Login.vue')
    },
    {
        path: '/persons',
        name: 'Persons',
        component: () =>
            import ('@/views/Persons.vue')
    },
    {
        path: '/calendar',
        name: 'Calendar',
        component: () =>
            import ('@/views/Calendar.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () =>
            import ('@/views/About.vue')
    }
]

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes,
})

export default router