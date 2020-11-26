<template>
    <div class="root">
        <template v-if="this.$route.name == 'Carousel'">
            <router-view :key="$route.fullPath"></router-view>
        </template>
        <template v-else>
            <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
                <a class="navbar-brand" href="#/">Yggdrasil</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav">
                        <router-link tag="a" class="nav-item nav-link" :to="{name: 'Home'}">Home</router-link>
                        <CarouselDropDown></CarouselDropDown>
                        <ManagementDropDown></ManagementDropDown>
                    </div>
                </div>
            </nav>
            <div id="page" class="container-fluid top-padding bottom-padding">
                <div id="page-body" class="container-fluid">
                    <router-view :key="$route.fullPath"></router-view>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import 'bootstrap';
    import CarouselDropDown from './menus/CarouselDropDown.vue'
    import ManagementDropDown from './menus/ManagementDropDown.vue'
    export default {
        components: {
            CarouselDropDown,
            ManagementDropDown
        }
    }
</script>