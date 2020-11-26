<template>
    <div class="timetable-row" :style="slotColour">
        <div :id="this.booking.slotID" class="cell" :class="[slotCellHeight, slotBordering]">
            {{ slotTitleText }}
            {{ slotTimeText }}
        </div>
    </div>
</template>

<script>
    import moment from 'moment'
    export default {
        props: {
            timetable: {
                type: Object,
                required: true
            },
            booking: {
                type: Object,
                required: true
            }
        },
        computed: {
            slotTitleText() {
                // Check the Booking cell has been initialised for a booking
                if (this.booking.name == undefined) {
                    return "";
                }
                let sectionsForBooking = (this.booking.duration * this.timetable.sectionsPerHour);
                // Check if the booking is only one bookable slot long
                if (sectionsForBooking == 1) {
                    var titleCellIndex = 0;
                }
                else {
                    if ((sectionsForBooking) % 2 == 0) {
                        // If the booking is an even number of sections long, use ((x / 2) - 1)
                        var titleCellIndex = ((sectionsForBooking) / 2) - 1;
                    }
                    else {
                        // If the booking is an odd number of sections long, use Math.floor(x / 2)
                        var titleCellIndex = Math.floor((sectionsForBooking) / 2) - 1;
                    }
                }
                // Calculate what cell to use for the title
                let deltaTime = titleCellIndex * (this.timetable.lengthOfHour / this.timetable.sectionsPerHour);
                let rowForTitle = this.booking.startTime.format('ddd') + " " + moment(this.booking.startTime).add(deltaTime, 'minutes').format('HH:mm');
                // Check if the current slot ID is the one we are after
                if (this.booking.slotID == rowForTitle) {
                    return this.booking.name;
                }
            },
            slotTimeText(){
                // Check the Booking cell has been initialised for a booking
                if (this.booking.name == undefined) {
                    return "";
                }

                let sectionsForBooking = (this.booking.duration * this.timetable.sectionsPerHour);
                // Check if the booking is only one bookable slot long
                if (sectionsForBooking == 1) {
                    var titleCellIndex = 0;
                }
                else {
                    if ((sectionsForBooking) % 2 == 0) {
                        // If the booking is an even number of sections long, use ((x / 2) + 1) to offset from the cell
                        var titleCellIndex = ((sectionsForBooking) / 2) + 1;
                        if (titleCellIndex >= sectionsForBooking) {
                            titleCellIndex = sectionsForBooking - 1;
                        }
                    }
                    else {
                        // If the booking is an odd number of sections long, use Math.floor(x / 2) + 1
                        var titleCellIndex = Math.floor((sectionsForBooking) / 2) + 1;
                    }
                }
                // Calculate what cell to use for the title
                let deltaTime = titleCellIndex * (this.timetable.lengthOfHour / this.timetable.sectionsPerHour);
                let rowForTitle = this.booking.startTime.format('ddd') + " " + moment(this.booking.startTime).add(deltaTime, 'minutes').format('HH:mm');
                // Check if the current slot ID is the one we are after
                if (this.booking.slotID == rowForTitle) {
                    let timeText = this.booking.startTime.format("HH:mm") + " - " + this.booking.endTime.format("HH:mm");
                    return timeText;
                }
            },
            slotColour() {
                // If the name isn't set, assume its a unbooked
                if (this.booking.name == undefined) {
                    return "background-color: #7CFC00;"
                }
                return "background-color: " + this.booking.colour + ";"
            },
            slotCellHeight() {
                // This is hacky, I will probably think of a better implementation
                let height = this.timetable.gridCellHeight / this.timetable.sectionsPerHour;
                return "cell-height-" + height + "px"
            },
            slotBordering(){
                // If the booking hasn't been given a name, assume its not set
                if (this.booking.name == undefined) {
                    return ""
                }
                // Work out what the slotID of the first and last cell in a booking would be
                let firstSlotID = this.booking.startTime.format('ddd') + " " + this.booking.startTime.format('HH:mm');
                let lastSlotID = this.booking.endTime.format('ddd') + " " + moment(this.booking.endTime).subtract((this.timetable.lengthOfHour / this.timetable.sectionsPerHour), 'minutes').format('HH:mm');

                let classesToBind = "";
                // Check if the current slot is the first
                if (this.booking.slotID == firstSlotID) {
                    classesToBind += "black-border-top "
                }
                // Check if the current slot is the last
                if (this.booking.slotID == lastSlotID) {
                    classesToBind += "black-border-bottom"
                }
                return classesToBind;
            }
        }
    }
</script>