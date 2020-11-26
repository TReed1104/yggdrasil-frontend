<template>
    <div class="dropdown">
        <a class="nav-item nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Management
        </a>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <router-link tag="a" class="dropdown-item" :to="{ name: 'Carousel Create' }">Create Carousel</router-link>
            <router-link tag="a" class="dropdown-item" :to="{ name: 'Content Create' }">Create Content</router-link>
            <router-link tag="a" class="dropdown-item" :to="{ name: 'Carousel List' }">Carousels</router-link>
        </div>
    </div>
</template>

<script>
    export default {
    }
</script>