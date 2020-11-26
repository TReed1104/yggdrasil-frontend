import Vue from 'vue'
import Home from '../components/Home.vue'
import Carousel from '../components/carousel/Carousel.vue'
import Router from 'vue-router'
import CarouselsList from '../components/management/CarouselsList.vue'
import CarouselCreate from '../components/management/CarouselCreate.vue'
import CarouselView from '../components/management/CarouselView.vue'
import CarouselEdit from '../components/management/CarouselEdit.vue'
import ContentList from '../components/management/ContentList.vue'
import ContentCreate from '../components/management/ContentCreate.vue'
import ContentView from '../components/management/ContentView.vue'
import ContentEdit from '../components/management/ContentEdit.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/:display',
            name: 'Carousel',
            component: Carousel
        },
        {
            path: '/admin/carousels',
            name: 'Carousel List',
            component: CarouselsList
        },
        {
            path: '/admin/carousel/:carousel/content',
            name: 'Content List',
            component: ContentList
        },
        {
            path: '/admin/carousel/:id?',
            name: 'Carousel View',
            component: CarouselView
        },
        {
            path: '/admin/content/:id?',
            name: 'Content View',
            component: ContentView
        },
        {
            path: '/admin/create/carousel',
            name: 'Carousel Create',
            component: CarouselCreate
        },
        {
            path: '/admin/create/content',
            name: 'Content Create',
            component: ContentCreate
        },
        {
            path: '/admin/edit/carousel/:id?',
            name: 'Carousel Edit',
            component: CarouselEdit
        },
        {
            path: '/admin/edit/content/:id?',
            name: 'Content Edit',
            component: ContentEdit
        }
    ]
})