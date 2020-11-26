import Booking from './Booking.js'
export default class Timetable {
    constructor(name) {
        this.name = name;
        this.numberOfDays = 7;          // render 7 Days
        this.startHour = 9;             // 24 Hour
        this.endHour = 19;              // 24 Hour
        this.lengthOfHour = 60;         // Yes, this should be obvious, but you know people.
        this.sectionsPerHour = 4;      // How many sections of booking an hour can be divided into, e.g 4 = 15 minute sections. NOTE: Currently this should only be even numbers.
        this.gridCellHeight = 80;       // The CSS pixel height of a booking cell in the timetable grid
        this.daysOfTheWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        this.timetableGrid = this.GenerateTimetableGrid();
    }

    GenerateTimetableGrid() {
        // Generate the timetable grid array
        let newGrid = [];
        for (let x = 0; x < this.numberOfDays; x++) {
            let rowData = [];
            for (let y = 0; y < ((this.endHour - this.startHour) * this.sectionsPerHour); y++) {
                // Calculate the hour and minute sections of the ID
                let hour = Math.floor(this.startHour + (y / this.sectionsPerHour));
                if (hour < 10) {
                    hour = "0" + hour;
                }
                let minute = (this.lengthOfHour * (y / this.sectionsPerHour)) % this.lengthOfHour;
                if (minute < 10) {
                    minute = "0" + minute;
                }
                // Generate the SlotID, e.g. Mon 10:45, Tues 17:15
                let slotID = this.daysOfTheWeek[x] + " " + hour+ ":" + minute;
                rowData.push(new Booking(slotID));
            }
            newGrid.push(rowData);
        }
        return newGrid;
    }

    // Get a specific bookable slot from the grid using the slot ID
    GetBooking(slotID) {
        let columnIndex = -1;
        let rowIndex = -1;
        // Recursive find across the 2D array
        this.timetableGrid.find(function(row, index) {
            let indexOfSlot = row.find(function(slot, index) {
                // Check if we've found our desired slot
                if (slot.slotID == slotID) {
                    rowIndex = index;
                    return slot;
                }
                else {
                    return null;
                }
            }, this);
            columnIndex = index;
            return indexOfSlot;
        }, this);
        // Return the element if found
        return this.timetableGrid[columnIndex][rowIndex];
    }

    SetSlot(slotID, booking) {
        let columnIndex = -1;
        let rowIndex = -1;
        // Recursive find across the 2D array
        this.timetableGrid.find(function(row, index) {
            let indexOfSlot = row.find(function(slot, index) {
                // Check if we've found our desired slot
                if (slot.slotID == slotID) {
                    rowIndex = index;
                    return slot;
                }
                else {
                    return null;
                }
            }, this);
            columnIndex = index;
            return indexOfSlot;
        }, this);
        // Return the element if found, set it to the new booking
        this.timetableGrid[columnIndex][rowIndex].name = booking.name;
        this.timetableGrid[columnIndex][rowIndex].timetableID = booking.timetableID;
        this.timetableGrid[columnIndex][rowIndex].startTime = booking.startTime;
        this.timetableGrid[columnIndex][rowIndex].endTime = booking.endTime;
        this.timetableGrid[columnIndex][rowIndex].duration = booking.duration;
        this.timetableGrid[columnIndex][rowIndex].colour = booking.colour;
    }
}
