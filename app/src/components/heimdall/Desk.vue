<template>
    <div class="desk-column">
        <div :id="this.desk.deskNumber" :key="this.desk.status" class="desk" :class="statusColouring">{{deskID}}</div>
    </div>
</template>

<script>
    export default {
        props: {
            desk: {
                type: Object,
                required: true
            }
        },
        computed: {
            deskID() {
                // Decide what to render on the desk
                let deskID = "";
                if (this.desk.deskNumber != "..") {
                    deskID = this.desk.deskNumber;
                }
                return deskID;
            },
            statusColouring() {
                if (this.desk.deskNumber == "..") {
                    return 'floor';
                }
                if (this.desk.status == "") {
                    return 'empty_desk'
                }
                else if (this.desk.status == "Available") {
                    return 'pc_available';
                }
                else if (this.desk.status == "Not Available") {
                    return 'pc_unavailable';
                }
                else if (this.desk.status == "Broken") {
                    return 'pc_broken';
                }
            }
        }
    }
</script>