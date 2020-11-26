<template>
    <div id="edit-content-component" class="container">
        <h1 class="page-title">Edit Content Item Details</h1>
        <div v-if="this.contentItem != null" id="edit-content-wrapper">
            <h2>{{ this.contentItem.name }}</h2>
            <p>
                <b>ID: </b>{{ this.contentItem.id }}<br/>
                <b>Carousel: </b>{{ this.contentItem.carousel }}<br/>
                <b>Content Type: </b>{{ this.contentItem.type }}<br/>
                <b>Content Location: </b>{{ this.contentItem.location }}<br/>
                <b>Interval Time: </b>{{ this.contentItem.interval / 1000 }} Seconds<br/>
                <b>Enabled State: </b>{{ this.contentItem.is_enabled }}
            </p>
            <h2>Edit Details</h2>
            <p>
                Move Content Item To Carousel:
                <select v-if="this.carousels.length == 0 && this.carouselLoading" id="carousel-input" class="form-control w-25">
                    <option :id="'carousel-option-default'" value="carousel_option_default">Loading Carousel List...</option>
                </select>
                 <select v-if="this.carousels.length == 0 && !this.carouselLoading" id="carousel-input" class="form-control w-25">
                    <option :id="'carousel-option-default'" value="carousel_option_default">No Carousels found</option>
                </select>
                <select v-else-if="this.carousels.length > 0 && !this.carouselLoading" id="carousel-input" class="form-control w-25" @change="OnCarouselChange($event)">
                    <option v-for="carousel in this.carousels" :key="carousel" :id="'carousel_option_' + carousel" :value="carousel" :selected="SelectDefaultCarouselOnLoad(carousel)">{{ carousel.toUpperCase() }}</option>
                </select>
                <br/>
                Rename Content Item
                <input type="text" class="form-control w-25" :placeholder="this.contentItem.name" @input="OnNameChange($event)"/>
                <br/>
                Edit Content Type
                <select class="form-control w-25" @change="OnTypeChange($event)">
                    <option value="picture" :selected="this.newContentType== 'picture'">Picture</option>
                    <option value="video" :selected="this.newContentType == 'video'">Video</option>
                    <option value="webpage" :selected="this.newContentType == 'webpage'">Webpage</option>
                    <option value="heimdall" :selected="this.newContentType == 'heimdall'">Heimdall</option>
                    <option value="mimir" :selected="this.newContentType == 'mimir'">Mimir</option>
                </select>
                <br/>
                Edit Content Location
                <input type="text" class="form-control w-25" :placeholder="this.contentItem.location" @input="OnLocationChange($event)"/>
                <br/>
                Edit Item Interval Time (In Seconds)
                <input type="number" class="form-control w-25" placeholder="New Content Interval (ms)" min="1" max="60" :value="this.newContentInterval / 1000" @input="OnIntervalChange($event)"/>
                <br/>
                Is Content Item Enabled?
                <select class="form-control w-25" @change="OnEnableStateChange($event)">
                    <option value="true" :selected="this.newContentEnableState">Enabled</option>
                    <option value="false" :selected="!this.newContentEnableState">Disabled</option>
                </select>
            </p>
            <br/>
            <button :disabled="disableSubmitButton" class="btn btn-dark" @click="SubmitContentChanges">Save Changes</button>
            <router-link :to="{name: 'Content View', params: {id: this.contentItem.id}}" tag="button" class="btn btn-dark" push>Back To Content View</router-link>
            <br/>
            <br/>
            <router-link :to="{name: 'Content List', params: {carousel: this.contentItem.carousel_id}}" tag="button" class="btn btn-dark" push>Back To Content List</router-link>
            <router-link :to="{name: 'Carousel List'}" tag="button" class="btn btn-dark" push>Back To Carousel List</router-link>
        </div>
        <div v-else id="edit-content-wrapper">
            <h2>{{ DefaultPageText }}</h2>
            <br/>
            <router-link :to="{name: 'Carousel List'}" tag="button" class="btn btn-dark" push>Back To Carousel List</router-link>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import router from '../../router'
    export default {
        data() {
            return {
                contentItem: null,
                loading: true,
                carousels: [],
                carouselLoading: true,
                disableSubmitButton: true,
                newCarousel: 'default',
                newContentName: 'default',
                newContentType: 'default',
                newContentLocation: 'default',
                newContentInterval: 'default',
                newContentEnableState: 'default'
            }
        },
        computed: {
            DefaultPageText() {
                if (this.loading) {
                    return "Loading...";
                }
                else {
                    let contentID = undefined;
                    if (this.$route.params.id != undefined) {
                        contentID = this.$route.params.id;
                    }
                    if (contentID == undefined) {
                        return "No Content Item Selected";
                    }
                    if (this.contentItem == null) {
                        return "Content Item not found";
                    }
                }
            }
        },
        methods: {
            GetContentItemDetails() {
                // Reset loading state
                this.loading = true;
                // Get the content item id
                let contentItemID = undefined;
                if (this.$route.params.id != undefined) {
                    contentItemID = this.$route.params.id;
                }
                // If the ID was not supplied, return and exit
                if (contentItemID == undefined) {
                    // Cleanup the component data field states
                    this.contentItem = null;
                    this.loading = false;
                    return;
                }
                // Execute the GET request
                axios.get(this.$store.getters.yggdrasilServerAddress + "/content_handler?id=" + contentItemID)
                .then(response => {
                    // Process the response from the API
                    this.contentItem = response.data.data.content;
                    // Set the newValues to their current values to prevent false data value
                    this.newContentName = this.contentItem.name;
                    this.newCarousel = this.contentItem.carousel;
                    this.newContentType = this.contentItem.type;
                    this.newContentLocation = this.contentItem.location;
                    this.newContentInterval = this.contentItem.interval;
                    this.newContentEnableState = this.contentItem.is_enabled;
                    // Mark component data as loaded
                    this.loading = false;
                })
                .catch(error => {
                    // Output our error response from the API to the user
                    console.log(error);
                    alert(error.response.status + ": " + error.response.data.message);
                    this.contentItem = null;
                    this.loading = false;
                })
            },
            GetCarouselList() {
                this.carouselLoading = true;
                // Make a request to the carousels list API endpoint
                axios.get(this.$store.getters.yggdrasilServerAddress + "/carousels")
                .then(response => {
                    this.carousels = [];
                    // Parse the response, create an array of the carousel names
                    response.data.data.carousels.forEach(function (carousel) {
                        // Just take the carousel name
                        this.carousels.push(carousel.name);
                    }, this);
                    this.carouselLoading = false;
                })
                .catch(error => {
                    // Output our error response from the API to the user
                    console.log(error);
                    alert(error.response.status + ": " + error.response.data.message);
                    this.carousels = [];
                    this.carouselLoading = false;
                });
            },
            SelectDefaultCarouselOnLoad(carouselName) {
                // Used for defaulting the carousel select box
                return (carouselName == this.contentItem.carousel);
            },
            ToggleSubmitButton() {
                // Check the state of each input value
                let carouselCheck = (this.newCarousel != "default" && this.newCarousel != this.contentItem.carousel);
                let newNameCheck = (this.newContentName != "default" && this.newContentName != "" && this.newContentName != this.contentItem.name);
                let newTypeCheck = (this.newContentType != "default" && this.newContentType != "" && this.newContentType != this.contentItem.type);
                let newLocationCheck = (this.newContentLocation != "default" && this.newContentLocation != "" && this.newContentLocation != this.contentItem.location);
                let newIntervalCheck = (this.newContentInterval != "default" && this.newContentInterval != "" && this.newContentInterval != this.contentItem.interval && this.newContentInterval > 0 && this.newContentInterval <= 60000);
                let newEnableStateCheck = (this.newContentEnableState != "default" && this.newContentEnableState != this.contentItem.is_enabled && (this.newContentEnableState == true || this.newContentEnableState == false));

                // Conditional the checks together
                this.disableSubmitButton = !(carouselCheck || newNameCheck || newTypeCheck || newLocationCheck || newIntervalCheck || newEnableStateCheck);
            },
            OnCarouselChange(event) {
                this.newCarousel = event.target.value;
                // Ensure the carousel name is found in our carousel list
                if (!this.carousels.includes(this.newCarousel)) {
                    this.newCarousel = this.contentItem.carousel;
                }
                this.ToggleSubmitButton();
            },
            OnNameChange(event) {
                this.newContentName = event.target.value;
                if (this.newContentName == "" || this.newContentName == "default") {
                    this.newContentName = this.contentItem.name;
                }
                this.ToggleSubmitButton();
            },
            OnTypeChange(event) {
                this.newContentType = event.target.value;
                // check the new type is valid
                if (this.newContentType != "picture" && this.newContentType != "video" && this.newContentType != "webpage" && this.newContentType != "heimdall" && this.newContentType != "mimir") {
                    this.newContentType = this.contentItem.type;
                }
                this.ToggleSubmitButton();
            },
            OnLocationChange(event) {
                this.newContentLocation = event.target.value;
                if (this.newContentLocation == "" || this.newContentLocation == "default") {
                    this.newContentLocation = this.contentItem.location;
                }
                this.ToggleSubmitButton();
            },
            OnIntervalChange(event) {
                this.newContentInterval = event.target.value;
                if (this.newContentInterval < 1 || this.newContentInterval > 60 || this.newContentInterval == "default") {
                    this.newContentInterval = this.contentItem.interval;
                }
                else {
                    // Valid input, convert from seconds to milliseconds on the backend
                    this.newContentInterval *= 1000;
                }
                this.ToggleSubmitButton();
            },
            OnEnableStateChange(event) {
                this.newContentEnableState = (event.target.value == 'true');
                this.ToggleSubmitButton();
            },
            SubmitContentChanges() {
                let requestBody = {
                    id: this.contentItem.id,
                }
                // Append the request body with the correct editted data
                if (this.newCarousel != this.contentItem.carousel) {
                    requestBody.carousel = this.newCarousel;
                }
                if (this.newContentName != this.contentItem.name) {
                    requestBody.name = this.newContentName;
                }
                if (this.newContentType != this.contentItem.type) {
                    requestBody.type = this.newContentType;
                }
                if (this.newContentLocation != this.contentItem.location) {
                    requestBody.location = this.newContentLocation;
                }
                if (this.newContentInterval != this.contentItem.interval) {
                    requestBody.interval = this.newContentInterval;
                }
                if (this.newContentEnableState != this.contentItem.is_enabled) {
                    requestBody.enabled = this.newContentEnableState;
                }
                // Check the submit button isn't disabled
                if (!this.disableSubmitButton) {
                    axios.put(this.$store.getters.yggdrasilServerAddress + "/content_handler", requestBody)
                    .then(response => {
                        if (response.status == 202) {
                            router.push({name: "Content View", params: { id: this.contentItem.id }});
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
            this.GetContentItemDetails();
            this.GetCarouselList();
        }
    }
</script>