import { createRouter, createWebHashHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue'; // Importing the Login view

const routes = [
  {
    path: '/',
    name: 'login',  // Make the root path redirect to the login page
    component: LoginView,
    meta: { title: 'Login' }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Login' }
  },

];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// Global navigation guard to dynamically change the title based on route meta
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Default App Title'; // Change page title
  next();
});

export default router;
