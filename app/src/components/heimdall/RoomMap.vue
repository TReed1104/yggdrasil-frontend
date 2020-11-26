<template>
    <div class="map-wrapper black-border">
        <DeskRow v-for="(row, row_index) in this.map" :mapRow="row" :key="row_index"></DeskRow>
    </div>
</template>

<script>
    import DeskRow from './DeskRow.vue'
    export default {
        props: {
            map: {
                type: Array,
                required: true
            }
        },
        components: {
            DeskRow
        }
    }
</script>