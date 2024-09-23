import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS bundle (optional)
import axios from 'axios'; // Import axios
import VueAxios from 'vue-axios';

// Create the app instance
const app = createApp(App);

// Use store, router, and VueAxios (pass axios instance)
app.use(store)
   .use(router)
   .use(VueAxios, axios) // Ensure axios is passed as a second argument
   .mount('#app');
