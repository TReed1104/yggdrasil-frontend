<template>
    <div class="timetable-column">
        <div class="timetable-row black-border-bottom timetable-colour-grey">
            <div class="cell cell-height-40px">
                {{columnTitle}}
            </div>
        </div>
        <Booking v-for="(booking, booking_index) in timetable.timetableGrid[index]" :timetable="timetable" :booking="booking" :key="booking_index"></Booking>
    </div>
</template>

<script>
    import Booking from './Booking.vue'
    import moment from 'moment'
    export default {
        props: {
            timetable: {
                type: Object,
                required: true
            },
            index: {
                type: Number,
                required: true
            }
        },
        components: {
            Booking
        },
        computed: {
            columnTitle() {
                // Calculate the week to render
                let week = moment();
                let date = week.startOf('isoWeek').add(this.index, 'days');
                let columnTitle = date.format('dddd') + " " + date.format('DD/MM')
                return columnTitle;
            }
        }
    }
</script>