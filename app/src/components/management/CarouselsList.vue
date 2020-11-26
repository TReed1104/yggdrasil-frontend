<template>
    <div id="list-carousels-component" class="container">
        <h1 class="page-title">Content Carousels</h1>
        <div v-if="this.carousels != null" id="list-carousels-wrapper">
            <router-link :to="{name: 'Carousel Create'}" tag="button" class="btn btn-dark" push>Create Carousel</router-link>
            <router-link :to="{name: 'Index'}" tag="button" class="btn btn-dark" push>Back To Home</router-link>
            <br/>
            <br/>
            <div class="scrollable-div-500 black-border">
                <ul class="list-group">
                    <li v-for="carousel in this.carousels" :key="'carousel-link-item-' + carousel.id" class="list-group-item">
                        <div class="col- float-left">
                            <h3>{{ carousel.name.toUpperCase() }}</h3>
                        </div>
                        <div class="col- float-right">
                            <router-link :to="{name: 'Carousel View', params: { id: carousel.id }}" tag="button" class="btn btn-dark" push>View Carousel</router-link>
                            <router-link :to="{name: 'Content List', params: { carousel: carousel.id }}" tag="button" class="btn btn-dark" push>View Content</router-link>
                            <router-link :to="{name: 'Carousel Edit', params: { id: carousel.id }}" tag="button" class="btn btn-dark" push>Edit Carousel</router-link>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else id="list-carousels-wrapper">
            <router-link :to="{name: 'Carousel Create'}" tag="button" class="btn btn-dark" push>Create Carousel</router-link>
            <br/>
            <br/>
            <h2>{{ DefaultPageText }}</h2>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { setInterval, clearInterval } from 'timers-browserify';
    export default {
        data() {
            return {
                loading: true,
                carousels: null,
                timer: ''
            }
        },
        computed: {
            DefaultPageText() {
                if (this.loading) {
                    return "Loading...";
                }
                else {
                    return "No Carousels Found";
                }
            }
        },
        methods: {
            GetCarouselList() {
                // Reset loading state
                this.loading = true;
                // Get the carousels list from the API
                axios.get(this.$store.getters.yggdrasilServerAddress + "/carousels")
                .then(response => {
                    this.carousels = response.data.data.carousels;
                    this.loading = false;
                })
                .catch(error => {
                    // Output our error response from the API to the user
                    console.log(error);
                    alert(error.response.status + ": " + error.response.data.message);
                    // Set the component data fields for a fail state
                    this.carousels = null;
                    this.loading = false;
                });
            }
        },
        mounted() {
            this.GetCarouselList();
            this.timer = setInterval(this.GetCarouselList, 15000);
        },
        beforeDestroy() {
            clearInterval(this.timer);
        }
    }
</script>