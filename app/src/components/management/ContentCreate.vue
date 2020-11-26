<template>
    <div id="create-content-component" class="container">
        <h1 class="page-title">Create New Content Item</h1>
        <div id="create-content-wrapper">
            <div id="carousel-select-wrapper">
                <h2 class="page-title">Choose A Carousel</h2>
                <select v-if="this.carousels.length == 0 && this.loading" id="carousel-input" class="form-control w-25">
                    <option :id="'carousel-option-default'" value="carousel">Loading Carousels...</option>
                </select>
                <select v-else-if="this.carousels.length == 0 && !this.loading" id="carousel-input" class="form-control w-25">
                    <option :id="'carousel-option-default'" value="carousel_option_default">No Carousels Found</option>
                </select>
                <select v-else-if="this.carousels.length > 0" id="carousel-input" class="form-control w-25" @change="OnCarouselSelectionChange($event)">
                    <option :id="'carousel-option-default'" value="carousel_option_default">No Carousel Selected</option>
                    <option v-for="carousel in this.carousels" :key="carousel.id" :id="'carousel_option_' + carousel.id" :value="carousel.name">{{ carousel.name.toUpperCase() }}</option>
                </select>
            </div>
            <div v-if="this.showContentItemDetailInputs" id="content-details-form">
                <h2 class="page-title">Content Item Detail Input</h2>
                <p>
                    Content Item Name
                    <input type="text" class="form-control w-25" placeholder="Content Item Name" v-model="contentName" @input="ToggleSubmitButton($event)"/>
                    <br/>
                    Content Type
                    <select class="form-control w-25" @change="OnTypeSelectionChange($event)">
                        <option value="picture">Picture</option>
                        <option value="video">Video</option>
                        <option value="webpage">Webpage</option>
                        <option value="heimdall">Heimdall</option>
                        <option value="mimir">Mimir</option>
                    </select>
                    <br/>
                    Edit Content Location
                    <input type="text" class="form-control w-25" placeholder="Content Location" v-model="contentLocation" @input="ToggleSubmitButton($event)"/>
                    <br/>
                    Edit Item Interval Time (In Seconds)
                    <input type="number" class="form-control w-25" placeholder="Content Item Interval (ms)" min="1" max="60" @input="OnContentIntervalEntry($event)"/>
                    <br/>
                    Is Content Item Enabled?
                    <select class="form-control w-25" @change="OnEnableStateSelectionChange($event)">
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                    </select>
                </p>
            </div>
            <br/>
            <button :disabled="disableSubmitButton" id="submit-button" class="btn btn-dark" @click="SubmitContentItemDetails">Create Content Item</button>
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
                loading: true,
                carousels: [],
                disableSubmitButton: true,
                showContentItemDetailInputs: false,
                selectedCarousel: null,
                contentName: "",
                contentType: "picture",
                contentLocation: "",
                contentInterval: 0,
                contentEnableState: true
            }
        },
        computed: {
        },
        methods: {
            GetCarouselList() {
                this.loading = true;
                axios.get(this.$store.getters.yggdrasilServerAddress + "/carousels")
                .then(response => {
                    this.carousels = response.data.data.carousels;
                    this.loading = false;
                })
                .catch(error => {
                    // Output our error response from the API to the user
                    console.log(error);
                    alert(error.response.status + ": " + error.response.data.message);
                    this.carousels = [];
                    this.loading = false;
                });
            },
            ToggleSubmitButton() {
                // Check the state of each input value
                let carouselCheck = (this.selectedCarousel != "" && this.selectedCarousel != undefined && this.selectedCarousel != null);
                let contentNameCheck = (this.contentName != "");
                let typeCheck = (this.contentType != "default");
                let locationCheck = (this.contentLocation != "");
                let intervalCheck = (this.contentInterval > 0 && this.contentInterval <= 60000);
                let enableStateCheck = (this.contentEnableState == true || this.contentEnableState == false);
                // Conditional the checks together
                this.disableSubmitButton = !(carouselCheck && contentNameCheck && typeCheck && locationCheck && intervalCheck && enableStateCheck);
            },
            SubmitContentItemDetails() {
                // Create our request body using the component data fields
                let requestBody = {
                    carousel: this.selectedCarousel,
                    name: this.contentName,
                    type: this.contentType,
                    location: this.contentLocation,
                    interval: this.contentInterval,
                    enabled: this.contentEnableState
                }
                // Check the submit button is enabled
                if (!this.disableSubmitButton) {
                    // Submit our POST request to create the content item
                    axios.post(this.$store.getters.yggdrasilServerAddress + "/content_handler", requestBody)
                    .then(response => {
                        //Redirect to carousel list on success
                        if (response.status == 201) {
                            let carouselID = this.carousels.find(carousel => carousel.name == this.selectedCarousel).id;
                            router.push({name: "Content List", params: { carousel: carouselID }});
                        }
                    })
                    .catch(error => {
                        // Output our error response from the API to the user
                        console.log(error);
                        alert(error.response.status + ": " + error.response.data.message);
                    });
                }
            },
            ResetFormStates() {
                this.showContentItemDetailInputs = false;
                // Reset the form data states
                this.contentName = "";
                this.contentType = "picture";
                this.contentLocation = "";
                this.contentInterval = 0;
                this.contentEnableState = true
                // Toggle the submit button after the reset
                this.ToggleSubmitButton();
            },
            OnCarouselSelectionChange(event) {
                // If the selected carousel is not the default
                if (event.target.value != "carousel_option_default") {
                    // Show the input form
                    this.showContentItemDetailInputs = true;
                    // If the selection is a different carousel, reset the form
                    if (this.selectedCarousel != event.target.value) {
                        this.selectedCarousel = event.target.value;
                        this.ToggleSubmitButton();
                    }
                }
                else {
                    // Fully reset the form as the default option has been selected
                    this.ResetFormStates();
                }
            },
            OnTypeSelectionChange(event) {
                this.contentType = event.target.value;
                // check the type is valid
                if (this.contentType != "picture" && this.contentType != "video" && this.contentType != "webpage" && this.contentType != "heimdall" && this.contentType != "mimir") {
                    this.contentType = "picture";
                }
                this.ToggleSubmitButton();
            },
            OnEnableStateSelectionChange(event) {
                this.contentEnableState = (event.target.value == 'true');
                this.ToggleSubmitButton();
            },
            OnContentIntervalEntry(event) {
                this.contentInterval = event.target.value;
                if (this.contentInterval < 1 || this.contentInterval > 60) {
                    this.contentInterval = 0;
                }
                else {
                    // Valid input, convert from seconds to milliseconds on the backend
                    this.contentInterval *= 1000;
                }
                this.ToggleSubmitButton();
            }
        },
        mounted() {
            this.GetCarouselList();
        }
    }
</script>