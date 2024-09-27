import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS bundle (optional)
import axios from 'axios'; // Import axios
import VueAxios from 'vue-axios'; // VueAxios for axios integration

// Import BootstrapVue 3 for Vue 3 compatibility
import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'; // Import BootstrapVue 3 CSS

// Create the app instance
const app = createApp(App);
app.provide('axios', axios);

// // Initialize store from localStorage
// store.dispatch('initializeStore')

// Use store, router, VueAxios, and BootstrapVue 3
app.use(store)
   .use(router)
   .use(VueAxios, axios) // Ensure axios is passed as a second argument
   .use(BootstrapVue3) // Use BootstrapVue 3 (compatible with Vue 3)
   .mount('#app');
