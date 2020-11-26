<template>
    <div id="view-carousel-component" class="container">
        <h1 class="page-title">Carousel Details</h1>
        <div v-if="this.carousel != null" id="view-carousel-wrapper">
            <h2>General</h2>
            <p>
                Name: {{ this.carousel.name.toUpperCase() }}<br/>
                ID: {{ this.carousel.id }}<br/>
                Sidebar Enabled: {{ this.carousel.show_sidebar }}
            </p>
            <br/>
            <h2>Carousel Content</h2>
            <p>
                Number Of Content Items: {{ this.carousel.content.length }}<br/>
                Total Duration of Content Items: {{ this.carousel.total_duration / 1000 + " Seconds" }}<br/>
            </p>
            <router-link :to="{ name: 'Content List', params: { carousel: this.carousel.id } }" tag="button" class="btn btn-dark" push>View Content Items</router-link>
            <br/>
            <br/>
            <br/>
            <router-link :to="{ name: 'Carousel Edit', params: { id: this.carousel.id } }" tag="button" class="btn btn-dark" push>Edit Carousel</router-link>
            <router-link :to="{ name: 'Carousel List' }" tag="button" class="btn btn-dark" push>Back To Carousel List</router-link>
        </div>
        <div v-else id="view-carousel-wrapper">
            <h2>{{ DefaultPageText }}</h2>
            <br/>
            <router-link :to="{ name: 'Carousel List' }" tag="button" class="btn btn-dark" push>Back To Carousel List</router-link>
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
                carousel: null,
                timer: ''
            }
        },
        computed: {
            DefaultPageText() {
                if (this.loading) {
                    return "Loading...";
                }
                else {
                    let carouselID = undefined;
                    if (this.$route.params.id != undefined) {
                        carouselID = this.$route.params.id;
                    }
                    if (carouselID == undefined) {
                        return "No Carousel Selected";
                    }
                    if (this.carousel == null) {
                        return "Carousel not found";
                    }
                }
            }
        },
        methods: {
            GetCarouselDetails() {
                // Reset the loading toggle
                this.loading = true;
                // Get the carousel id from the vue-router route
                let carouselID = undefined;
                if (this.$route.params.id != undefined) {
                    carouselID = this.$route.params.id;
                }
                // If the ID was not supplied, return and exit
                if (carouselID == undefined) {
                    this.carousel = null;
                    this.loading = false;
                    return;
                }
                // Get the Carousel details from the API
                axios.get(this.$store.getters.yggdrasilServerAddress + "/carousel_handler?id=" + carouselID)
                .then(response => {
                    this.carousel = response.data.data.carousel
                    this.loading = false;
                })
                .catch(error => {
                    // Output our error response from the API to the user
                    console.log(error);
                    alert(error.response.status + ": " + error.response.data.message);
                    this.carousel = null;
                    this.loading = false;
                });
            }
        },
        mounted() {
            this.GetCarouselDetails();
            this.timer = setInterval(this.GetCarouselDetails, 15000);
        },
        beforeDestroy() {
            clearInterval(this.timer);
        }
    }
</script>