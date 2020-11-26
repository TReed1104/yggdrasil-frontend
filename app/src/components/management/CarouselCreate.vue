<template>
    <div id="create-carousel-component" class="container">
        <h1 class="page-title">Create New Carousel</h1>
        <div id="create-carousel-wrapper">
            <p>
                Carousel Name:
                <input type="text" class="form-control w-25" placeholder="Carousel Name" v-model="carouselName" @input="ToggleSubmitButton($event)"/>
                <br/>
                Enable Carousel Sidebar
                <select class="form-control w-25" @change="OnSidebarToggleStateChange($event)">
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                </select>
            </p>
            <br/>
            <button :disabled="disableSubmitButton" id="submit-button" class="btn btn-dark" @click="SubmitCarouselDetails">Create Carousel</button>
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
                carouselName: "",
                showSideBar: true,
                disableSubmitButton: true
            }
        },
        computed: {
        },
        methods: {
            ToggleSubmitButton() {
                // Check the states of the inputs
                let nameCheck = (this.carouselName != "" && this.carouselName != undefined && this.carouselName != null);
                let sidebarEnableStateCheck = (this.showSideBar == true || this.showSideBar == false);
                // Set the submit buttons enable state using a sum of the checks
                this.disableSubmitButton = !(nameCheck && sidebarEnableStateCheck);
            },
            OnSidebarToggleStateChange(event) {
                this.showSideBar = (event.target.value == 'true');
                this.ToggleSubmitButton();
            },
            SubmitCarouselDetails() {
                // Create the request body for the API
                let requestBody = {
                    name: this.carouselName,
                    show_sidebar: this.showSideBar
                }
                console.log(requestBody);
                // Check the submit button is enabled
                if (!this.disableSubmitButton) {
                    axios.post(this.$store.getters.yggdrasilServerAddress + "/carousel_handler", requestBody)
                    .then(response => {
                        //Redirect to carousel list on success
                        if (response.status == 201) {
                            router.push({name: "Carousel List"});
                        }
                    })
                    .catch(error => {
                        // Output our error response from the API to the user
                        console.log(error);
                        alert(error.response.status + ": " + error.response.data.message);
                    });
                }
            }
        }
    }
</script>