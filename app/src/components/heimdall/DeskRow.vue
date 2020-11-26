<template>
    <div class="desk-row">
        <Desk v-for="(desk, desk_index) in this.mapRow" :desk="desk" :key="desk_index"></Desk>
    </div>
</template>

<script>
    import Desk from './Desk.vue'
    export default {
        props: {
            mapRow: {
                type: Array,
                required: true
            }
        },
        components: {
            Desk
        }
    }
</script>