<template>
    <div class="timetable-row">
        <div class="cell hour-cell" :class="[SetCellHeight, SetCellBorder]">
            {{this.SetRowTitle}}
        </div>
    </div>
</template>

<script>
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
        computed: {
            SetRowTitle() {
                let currentRow = this.index % this.timetable.sectionsPerHour;        // This gives us the index within each hour block
                let rowForTitle = (0 + (this.timetable.sectionsPerHour / 2) - 1);    // This gives us the block above the middle section of the hour block
                // When the timetable has 1 section per hour, the rowForTitle goes below zero, so cap it to prevent errors
                if (rowForTitle < 0) {
                    rowForTitle = 0;
                }
                // If the currentRow is not the row for rendering the title, return blank for the cell content
                if (currentRow != rowForTitle) {
                    return ""
                }
                // If we've found the right cell for the title, print the right hour
                let hour = Math.floor(this.timetable.startHour + (this.index / this.timetable.sectionsPerHour));
                return hour + ":00";
            }, 
            SetCellHeight() {
                // This is hacky, I will probably think of a better implementation
                let height = this.timetable.gridCellHeight / this.timetable.sectionsPerHour;
                return "cell-height-" + height + "px"
            },
            SetCellBorder() {
                // If we are within the first cell within an hour block, add a border to its top to cap it from the previous
                let currentRow = this.index % this.timetable.sectionsPerHour;
                if (currentRow == 0) {
                    return "black-border-top"
                }
                return "";
            }
        }
    }
</script>