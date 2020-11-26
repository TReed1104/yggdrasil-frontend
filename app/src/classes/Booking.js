import moment from 'moment'
export default class Booking {
    constructor(slotID, name, timetableID, startTime, endTime, duration, colour) {
        this.slotID = slotID;
        this.name = name;
        this.timetableID = timetableID;
        this.startTime = moment(startTime, "ddd, DD MMM YYYY HH:mm:ss");
        this.endTime = moment(endTime, "ddd, DD MMM YYYY HH:mm:ss");
        this.duration = duration;
        this.colour = colour;
    }
}
