import { createRouter, createWebHistory } from 'vue-router'; // Use createWebHistory for clean URLs
import LoginView from '../views/LoginView.vue'; // Importing the Login view
import RegistrationView from '../views/RegistrationView.vue'; // Importing the Login view
import DashboardView from '../views/DashboardView.vue'; // import your DashboardView



const routes = [
  {
    path: '/',
    redirect: '/login' // Redirect the root path to /login
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Login' }
  },
  {
    path: '/registration',
    name: 'registration',
    component: RegistrationView,
    meta: { title: 'Registration' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
  },
];

const router = createRouter({
  history: createWebHistory(), // Use createWebHistory for cleaner URLs
  routes
});

// Global navigation guard to dynamically change the title based on route meta
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Default App Title'; // Change page title
  next();
});

export default router;
