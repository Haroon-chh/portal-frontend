import { createRouter, createWebHistory } from 'vue-router'; 
import LoginView from '../views/LoginView.vue'; 
import RegistrationView from '../views/RegistrationView.vue'; 
import DashboardView from '../views/DashboardView.vue'; 
import ResetPasswordView from '../views/ResetPasswordView.vue';
import ForgotPasswordView from '../views/ForgotPasswordView.vue';

const routes = [
  {
    path: '/',
    redirect: '/login' 
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Login', requiresAuth: false } // No auth required
  },
  {
    path: '/registration',
    name: 'registration',
    component: RegistrationView,
    meta: { title: 'Registration', requiresAuth: false } // No auth required
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { title: 'Dashboard', requiresAuth: true } // Auth required
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPasswordView,
    meta: { title: 'Reset Password', requiresAuth: false } // Auth required

  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordView,
    meta: { title: 'Forget Password', requiresAuth: false } // Auth required

  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Global route guard for authentication and role checks
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!JSON.parse(localStorage.getItem('authUser')); // Check if user is logged in

  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      next('/login');
    } else {
      // Allow access if authenticated, else redirect to login
      next();
    }
  } else {
    // Proceed to the route if no auth is required
    next();
  }
});

// Dynamically change the document title
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Default App Title';
  next();
});

export default router;
