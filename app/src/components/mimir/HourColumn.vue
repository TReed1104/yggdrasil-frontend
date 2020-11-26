<template>
    <div class="timetable-column timetable-colour-grey">
        <div class="timetable-row black-border-bottom">
            <div class="cell hour-cell cell-height-40px">
            </div>
        </div>
        <HourRow v-for="(row, row_index) in timetable.timetableGrid[0]" :index="row_index" :key="row_index" :timetable="timetable"></HourRow>
    </div>
</template>

<script>
    import HourRow from './HourColumnRows.vue'
    export default {
        props: {
            timetable: {
                type: Object,
                required: true
            }
        },
        components: {
            HourRow
        }
    }
</script>