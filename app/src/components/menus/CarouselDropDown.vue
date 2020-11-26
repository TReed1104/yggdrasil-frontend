<template>
    <div class="dropdown">
        <a class="nav-item nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Carousels
        </a>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <router-link tag="a" v-for="carousel in this.carousels" :key="'menu_link_' + carousel" class="dropdown-item" :to="{name: 'Carousel', params: {display: carousel}}">{{carousel.toUpperCase()}}</router-link>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { setInterval, clearInterval } from 'timers';
    export default {
        data() {
            return {
                timer: '',
                carousels: []
            }
        },
        methods: {
            GetCarousels() {
                axios.get(this.$store.getters.yggdrasilServerAddress + "/carousels").then(response => {
                    // Clear the Carousel list
                    this.carousels = [];

                    // Use the response to store the routes in the Vuex Store
                    response.data.data.carousels.forEach(function (carousel) {
                        this.carousels.push(carousel.name);

                    }, this);

                }).catch(error => {
                    console.log(error);
                });
            }
        },
        mounted() {
            this.GetCarousels();
            this.timer = setInterval(this.GetCarousels, 30000);
        },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    }
</script>