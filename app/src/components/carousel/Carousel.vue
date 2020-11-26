<template>
    <div id="page-content" class="page-content">
        <div v-if="this.showSideBar" id="page-sidebar" class="side-bar">
            <img :src="this.sidebarLogo"/>
            <h1 class="side-bar-timer">{{this.sidebarTimeText}} <br> {{this.sidebarDateText}}</h1>
        </div>
        <div id="page-carousel" class="carousel">
            <CarouselSlide v-for="(slide, slide_index) in this.carouselContent" :slide=slide :index=slide_index :key=slide_index></CarouselSlide>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import CarouselSlide from './Slide.vue'
    import { setInterval, clearInterval } from 'timers-browserify';
    import moment from 'moment'
    export default {
        components: {
            CarouselSlide
        },
        data () {
            return {
                showSideBar: true,
                sidebarLogo: './content/University_Logo.png',
                sidebarTimeText: 'time',
                sidebarDateText: 'date',
                carouselUpdateTimer: '',
                carouselContent: [],
                slideIndex: 0,
                slideInterval: 0,
                carouselTimer: ''
            }
        },
        methods: {
            GetCarouselConfig(){
                // Get the name of our room (default to inb1102)
                let displayID = 'inb1102';
                if (Object.keys(this.$route.params).length != 0) {
                    displayID = this.$route.params.display;
                }
                axios.get(this.$store.getters.yggdrasilEndpointCarousel + displayID)
                    .then(response => {
                        if (response.data != []){
                            this.showSideBar = response.data.data.carousel.show_sidebar;
                        }
                        this.GetCarouselContent(displayID);
                    })
                    .catch(error => {
                        console.log(error);
                    })
            },
            GetCarouselContent(displayID) {
                // Get the data from the API
                axios.get(this.$store.getters.yggdrasilEndpointContent + displayID)
                    .then(response => {
                        this.carouselContent = response.data.data.carousel_content;
                        clearInterval(this.carouselTimer);
                        this.carouselTimer = setInterval(this.ChangeSlide, this.slideInterval);
                    })
                    .catch(error => {
                        console.log(error);
                    })
            },
            CarouselController(){
                // Catch for the first run
                if (this.slideIndex == 0 && this.slideInterval == 0) {
                    // Create our looping variables
                    let foundFirstActiveSlide = false;
                    let iterator = 0;
                    // Iterate and find the first active slide
                    while (!foundFirstActiveSlide) {
                        let slide = this.carouselContent[iterator];
                        // Check if the slide is enabled
                        if (slide.is_enabled) {
                            // Set the component variables controlling the carousel loop
                            this.slideIndex = iterator;
                            this.slideInterval = slide.interval;
                            // Set the slide to display as the current slide
                            let slideElement = document.getElementById(slide.name + "_" + this.slideIndex);
                            if (slideElement != null) {
                                slideElement.style.display = "block";
                            }
                            // Set the loop trigger as we've now found the slide
                            foundFirstActiveSlide = true;
                        }
                        iterator++; // Increment our iterator
                        // No active content
                        if (iterator == this.carouselContent.length) {
                            foundFirstActiveSlide = true;
                        }
                    }
                    // Stop the rest of the controller running
                    return;
                }

                // Initialise our slides
                let slide = this.carouselContent[this.slideIndex];
                let nextSlide = this.carouselContent[this.slideIndex];
                // Hide the current slide
                if (slide != null) {
                    let slideElement = document.getElementById(slide.name + "_" + this.slideIndex);
                    if (slideElement != null) {
                        slideElement.style.display = "none";
                    }
                }
                // Create our loop variables
                let foundNextslide = false;
                let iterator = 1;
                while (!foundNextslide) {
                    // update the index of the slide to try
                    let newIndex = this.slideIndex + iterator;
                    if (newIndex == this.carouselContent.length){
                        newIndex = 0;
                    }
                    // Grab the new slide
                    let trySlide = this.carouselContent[newIndex];
                    if (trySlide != null) {
                        // Check if its enabled
                        if (trySlide.is_enabled) {
                            // If its enabled allow the slide to be used
                            nextSlide = this.carouselContent[newIndex];
                            foundNextslide = true;
                            this.slideIndex = newIndex;
                        }
                    }
                    // Increment our iterator
                    iterator++;
                }
                // Show the Next Slide and set the component fields for the carousel controller
                if (nextSlide != null) {
                    let newSlideElement = document.getElementById(nextSlide.name + "_" + this.slideIndex);   // We add the slide index, which allows slides to not need unique names
                    if (newSlideElement != null) {
                        newSlideElement.style.display = "block";
                        // Interval Update, this allows us to have a different interval per slide
                        this.slideInterval = nextSlide.interval;
                    }
                }
            },
            ChangeSlide() {
                clearInterval(this.carouselTimer);
                this.CarouselController();
                this.carouselTimer = setInterval(this.ChangeSlide, this.slideInterval);
            },
            UpdatePageTime() {
                this.sidebarTimeText = moment().format("HH:mm:ss");
                this.sidebarDateText = moment().format("DD MMM");
                setTimeout(this.UpdatePageTime, 100);
            }
        },
        mounted() {
            this.GetCarouselConfig();
            this.carouselUpdateTimer = setInterval(this.GetCarouselConfig, 60000);
            this.UpdatePageTime();
        },
        beforeDestroy() {
            clearInterval(this.carouselUpdateTimer);
        }
    }
</script>