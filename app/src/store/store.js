import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // Server address for each API
        serverAddress: "http://127.0.0.1",
        yggdrasilAPI: "/yggdrasil-api",
        heimdallAPI: "/heimdall-api",
        mimirAPI: "/mimir-api",
    },
    getters: {
        // API endpoints
        yggdrasilServerAddress: state => {return state.serverAddress + state.yggdrasilAPI },
        yggdrasilEndpointCarousel: state => { return state.serverAddress + state.yggdrasilAPI + "/carousel_handler?name=" },
        yggdrasilEndpointContent: state => { return state.serverAddress + state.yggdrasilAPI + "/carouselcontent?carousel=" },
        heimdallServerAddress: state => { return state.serverAddress + state.heimdallAPI },
        heimdallEndpointAvailability: state => { return state.serverAddress + state.heimdallAPI + "/availability?room=" },
        mimirServerAddress: state => { return state.serverAddress + state.mimirAPI },
        mimirEndpointBookings: state => { return state.serverAddress + state.mimirAPI + "/bookings?timetable="},
    },
    mutations: {
    },
    actions: {
    }
})