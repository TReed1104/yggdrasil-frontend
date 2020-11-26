<template>
    <div v-if="this.slide.is_enabled" :id="this.name" class="slide">
        <img v-if="this.slide.type == 'picture'" class="slide-content" :src="this.slide.location"/>
        <video v-else-if="this.slide.type == 'video'" class='content' muted>
            <source :src="this.slide.location" type='video/mp4'>
        </video>
        <PCAvailability v-else-if="this.slide.type == 'heimdall'" :roomID="this.slide.location" :key="this.slide.location"></PCAvailability>
        <TimetableApp v-else-if="this.slide.type == 'mimir'" :roomID="this.slide.location" :key="this.slide.location"></TimetableApp>
    </div>
</template>

<script>
    import PCAvailability from '../heimdall/PCAvailability.vue'
    import TimetableApp from '../mimir/TimetableApp.vue'
    export default {
        components: {
            PCAvailability,
            TimetableApp
        },
        props: {
            slide: {
                type: Object,
                required: true
            },
            index: {
                type: Number,
                required: true
            }
        },
        computed: {
            name() {
                return this.slide.name + "_" + this.index;
            }
        }
    }
</script>