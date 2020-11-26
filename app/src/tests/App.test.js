// Testing core packages
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import router from '../router/index.js';
import Vuex from 'vuex';

// Components
import App from '../components/App.vue';

// Configure the vue instance
const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
const store = new Vuex.Store();

// Default rendering test for the App core components
it('renders without crashing', () => {
    const wrapper = shallowMount(App, {
        localVue,
        router,
        store,
    });
});
