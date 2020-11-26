<template>
    <div id="timetable" class="timetable-grid black-border">
        <HourColumn :timetable="timetable"></HourColumn>
        <BookingColumn v-for="(column, column_index) in timetable.timetableGrid" :index="column_index" :timetable="timetable" :key="column_index"></BookingColumn>
    </div>
</template>

<script>
    import HourColumn from './HourColumn.vue'
    import BookingColumn from './BookingColumn.vue'
    export default {
        props: {
            timetable: {
                type: Object,
                required: true
            }
        },
        components: {
            HourColumn,
            BookingColumn
        }
    }
</script>