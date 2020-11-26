<template>
    <div id="list-content-component" class="container">
        <div v-if="this.carousel != null" id="list-content-wrapper">
            <h1 class="page-title">Contents for Carousel: {{ this.carousel.name.toUpperCase() }}</h1>
            <router-link :to="{name: 'Content Create'}" tag="button" class="btn btn-dark" push>Create Content Item</router-link>
            <router-link :to="{name: 'Carousel List'}" tag="button" class="btn btn-dark" push>Back To Carousel List</router-link>
            <br/>
            <br/>
            <div class="scrollable-div-750 black-border">
                <ul class="list-group">
                    <li v-for="content in this.carousel.content" :key="content.id" class="list-group-item">
                        <div class="col- float-left">
                            <h5>Content ID: {{ content.name }}</h5>
                            <h6>Type: {{ content.type }}</h6>
                        </div>
                        <div class="col- float-right">
                            <router-link :to="{name: 'Content View', params: {id: content.id}}" tag="button" class="btn btn-dark" push>View Content</router-link>
                            <router-link :to="{name: 'Content Edit', params: {id: content.id}}" tag="button" class="btn btn-dark" push>Edit Content</router-link>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else id="list-content-wrapper">
            <h1 class="page-title">Carousel Content List</h1>
            <router-link :to="{name: 'Content Create'}" tag="button" class="btn btn-dark" push>Create Content Item</router-link>
            <router-link :to="{name: 'Carousel List'}" tag="button" class="btn btn-dark" push>Back To Carousel List</router-link>
            <br/>
            <br/>
            <h2>{{ DefaultPageText }}</h2>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { setInterval, clearInterval } from 'timers';
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
                    if (Object.keys(this.$route.params).length != 0) {
                        carouselID = this.$route.params.carousel;
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
            GetCarousels() {
                // Reset the loading state
                this.loading = true;
                // Get the carousel ID from the vue route
                let carouselID = undefined;
                if (Object.keys(this.$route.params).length != 0) {
                    carouselID = this.$route.params.carousel;
                }
                // If the carousel id was not supplied, don't execute the API request
                if (carouselID == undefined) {
                    this.carousel = null;
                    this.loading = false;
                    return;
                }
                axios.get(this.$store.getters.yggdrasilServerAddress + "/carousel_handler?id=" + carouselID)
                .then(response => {
                    this.carousel = response.data.data.carousel;
                    this.loading = true;
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
            this.GetCarousels();
            this.timer = setInterval(this.GetCarousels, 15000);
        },
        beforeDestroy() {
            clearInterval(this.timer);
        }
    }
</script>