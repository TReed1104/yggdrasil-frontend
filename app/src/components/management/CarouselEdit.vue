<template>
    <div id="edit-carousel-component" class="container">
        <h1 class="page-title">Edit Carousel Details</h1>
        <div v-if="this.carousel != null" id="edit-carousel-wrapper">
            <h2>Current Details</h2>
            <p>
                Name: {{ this.carousel.name.toUpperCase() }}<br/>
                ID: {{ this.carousel.id }}<br/>
                Sidebar Enabled: {{ this.carousel.show_sidebar }}
            </p>
            <h2>Edit Details</h2>
            <p>
                Enable Carousel Sidebar
                <select class="form-control w-25" @change="OnSidebarToggleStateChange($event)">
                    <option value="true" :selected="this.carousel.show_sidebar">Enabled</option>
                    <option value="false" :selected="!this.carousel.show_sidebar">Disabled</option>
                </select>
                <br/>
                Rename Carousel (Optional)
                <input type="text" class="form-control w-25" placeholder="New Carousel Name" @input="OnNewNameChange($event)"/>
            </p>
            <br/>
            <button :disabled="disableSubmitButton" class="btn btn-dark" @click="SubmitCarouselChanges">Save Changes</button>
            <router-link :to="{ name: 'Carousel View', params: { id: this.carousel.id } }" tag="button" class="btn btn-dark" push>Back To Carousel View</router-link>
            <router-link :to="{ name: 'Carousel List' }" tag="button" class="btn btn-dark" push>Back To Carousel List</router-link>
        </div>
        <div v-else id="edit-carousel-wrapper">
            <h2>{{ DefaultPageText }}</h2>
            <br/>
            <router-link :to="{ name: 'Carousel List' }" tag="button" class="btn btn-dark" push>Back To Carousel List</router-link>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import router from '../../router'
    export default {
        data() {
            return {
                loading: true,
                carousel: null,
                disableSubmitButton: true,
                newCarouselSidebarState: "default",
                newCarouselName: "default"
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
                    this.newCarouselName = this.carousel.name;
                    this.newCarouselSidebarState = this.carousel.show_sidebar;
                    this.loading = false;
                })
                .catch(error => {
                    // Output our error response from the API to the user
                    console.log(error);
                    alert(error.response.status + ": " + error.response.data.message);
                    this.carousel = null;
                    this.loading = false;
                });
            },
            ToggleSubmitButton() {
                let sidebarEnableCheck = (this.newCarouselSidebarState != "default" && this.newCarouselSidebarState != this.carousel.show_sidebar);
                let newNameCheck = (this.newCarouselName != "default" && this.newCarouselName != this.carousel.name && this.newCarouselName != "");
                this.disableSubmitButton = !(sidebarEnableCheck || newNameCheck);
            },
            OnNewNameChange(event) {
                this.newCarouselName = event.target.value;
                if (this.newCarouselName == "" || this.newCarouselName == "default") {
                    this.newCarouselName = this.carousel.name;
                }
                this.ToggleSubmitButton();
            },
            OnSidebarToggleStateChange(event) {
                this.newCarouselSidebarState = (event.target.value == 'true');
                this.ToggleSubmitButton();
            },
            SubmitCarouselChanges() {
                // Generate our requestBody for the API endpoint
                let requestBody = undefined;
                if (this.newCarouselName != this.carousel.name) {
                    // If a new name has been set, ensure its in the requestbody
                    requestBody = {
                        id: this.carousel.id,
                        show_sidebar: this.newCarouselSidebarState,
                        new_name: this.newCarouselName
                    }
                }
                else {
                    // new name has not been set, only send the required fields
                    requestBody = {
                        id: this.carousel.id,
                        show_sidebar: this.newCarouselSidebarState
                    }
                }
                // Check the submit button isn't disabled
                if (!this.disableSubmitButton) {
                    axios.put(this.$store.getters.yggdrasilServerAddress + "/carousel_handler", requestBody)
                    .then(response => {
                        if (response.status == 202) {
                            router.push({name: "Carousel View", params: { id: this.carousel.id }});
                        }
                    })
                    .catch(error => {
                        // Output our error response from the API to the user
                        console.log(error);
                        alert(error.response.status + ": " + error.response.data.message);
                    });
                }
            }
        },
        mounted() {
            this.GetCarouselDetails();
        }
    }
</script>