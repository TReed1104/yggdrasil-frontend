<template>
    <div id="view-content-component" class="container">
        <h1 class="page-title">Content Item Details</h1>
        <div v-if="this.contentItem != null" id="view-content-wrapper">
            <h2>{{ this.contentItem.name }}</h2>
            <p>
                <b>ID: </b>{{ this.contentItem.id }}<br/>
                <b>Carousel: </b>{{ this.contentItem.carousel }}<br/>
                <b>Content Type: </b>{{ this.contentItem.type }}<br/>
                <b>Content Location: </b>{{ this.contentItem.location }}<br/>
                <b>Interval Time: </b>{{ this.contentItem.interval / 1000 }} Seconds<br/>
                <b>Enabled State: </b>{{ this.contentItem.is_enabled }}
            </p>
            <br/>
            <router-link :to="{name: 'Content Edit', params: {id: this.contentItem.id}}" tag="button" class="btn btn-dark" push>Edit Content Item</router-link>
            <router-link :to="{name: 'Content List', params: {carousel: this.contentItem.carousel_id}}" tag="button" class="btn btn-dark" push>Back To Content List</router-link>
            <router-link :to="{name: 'Carousel List'}" tag="button" class="btn btn-dark" push>Back To Carousel List</router-link>
        </div>
        <div v-else id="view-content-wrapper">
            <h2>{{ DefaultPageText }}</h2>
            <br/>
            <router-link :to="{name: 'Carousel List'}" tag="button" class="btn btn-dark" push>Back To Carousel List</router-link>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { setInterval, clearInterval } from 'timers-browserify';
    export default {
        data() {
            return {
                contentItem: null,
                loading: true,
                timer: ''
            }
        },
        computed: {
            DefaultPageText() {
                if (this.loading) {
                    return "Loading...";
                }
                else {
                    let contentItemID = undefined;
                    if (this.$route.params.id != undefined) {
                        contentItemID = this.$route.params.id;
                    }
                    if (contentItemID == undefined) {
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
                    this.loading = false;
                })
                .catch(error => {
                    // Output our error response from the API to the user
                    console.log(error);
                    alert(error.response.status + ": " + error.response.data.message);
                    this.contentItem = null;
                    this.loading = false;
                })
            }
        },
        mounted() {
            this.GetContentItemDetails();
            this.timer = setInterval(this.GetContentItemDetails, 15000);
        },
        beforeDestroy() {
            clearInterval(this.timer);
        }
    }
</script>