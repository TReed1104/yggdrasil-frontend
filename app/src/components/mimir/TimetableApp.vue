<template>
    <div id="mimir-slide" class="container-fluid top-padding">
        <h1 id="room-timetable" class="top-padding bottom-padding">Timetable for {{ this.title.toUpperCase()}}</h1>
        <TimetableGrid :key="this.timetable.name" :timetable="this.timetable"></TimetableGrid>
    </div>
</template>

<script>
    import axios from 'axios'
    import moment from 'moment'
    import Booking from '../../classes/Booking.js'
    import Timetable from '../../classes/Timetable.js'
    import { setInterval, clearInterval } from 'timers-browserify';
    import TimetableGrid from './TimetableGrid.vue'
    export default {
        props:{
            roomID: {
                type: String,
                required: true
            },
        },
        components: {
            TimetableGrid
        },
        data() {
            return {
                timetable: new Timetable("blank"),
                title: '',
                bookings: [],
                updateTimer: ''
            }
        },
        methods: {
            GetTimetableBookings() {
                this.title = this.roomID;
                // Get the timetable data from the Mimir-API
                axios.get(this.$store.getters.mimirEndpointBookings + this.roomID)
                    .then(response => {
                        if (this.bookings != response.data.data.bookings){
                            this.timetable = new Timetable(this.roomID);
                        }
                        this.bookings = response.data.data.bookings;
                        this.UpdateTimetable();
                    })
                    .catch(error => { 
                        console.log(error);
                    });
            },
            UpdateTimetable(){
                // Right now
                let week = moment();
                // Our date bounds for checking if the session is in the week to be rendered
                let startOfWeek = week.startOf('isoWeek').toDate();
                let endOfWeek = week.endOf('isoWeek').toDate();
                // Iterate through the Mimir API response
                this.bookings.forEach(function(booking) {
                    // Create a booking object from the booking
                    let currentBooking = new Booking("", booking.booking, booking.timetable, booking.start_time, booking.end_time, booking.duration, booking.cell_colour);

                    // Check if the current booking object is between the start and end of the week to render
                    if (!currentBooking.startTime.isBetween(startOfWeek, endOfWeek)) {
                        // Not between the start and end of the desired week
                        return;
                    }

                    // Calculate how many slots in the timetable grid to fill
                    let numberOfSlots = (booking.duration * this.timetable.sectionsPerHour);
                    let sectionTimeInMinutes = (this.timetable.lengthOfHour / this.timetable.sectionsPerHour);
                    for (let i = 0; i < numberOfSlots; i++) {
                        // Generate the slotID for the booking
                        let time = moment(currentBooking.startTime, 'HH:mm').add(i * sectionTimeInMinutes, 'minutes').format('HH:mm');
                        let slotID = currentBooking.startTime.format('ddd') + " " + time;

                        // Set the booking slot to the new booking
                        currentBooking.slotID = slotID;
                        this.timetable.SetSlot(slotID, currentBooking);
                    }
                }, this);
            }
        },
        mounted() {
            this.GetTimetableBookings();
            this.updateTimer = setInterval(this.GetTimetableBookings, 30000);
        },
        beforeDestroy() {
            clearInterval(this.updateTimer);
        }
    }
</script>