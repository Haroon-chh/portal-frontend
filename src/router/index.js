import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegistrationView from '../views/RegistrationView.vue';
import DashboardView from '../views/DashboardView.vue';
import ResetPasswordView from '../views/ResetPasswordView.vue';
import ForgotPasswordView from '../views/ForgotPasswordView.vue';
import StudentResultView from '../views/StudentResultView.vue';
import AddStaffView from '../views/AddStaffView.vue';
import DeleteUserView from '../views/DeleteUserView.vue';
import AssignQuizView from '../views/AssignQuizView.vue';
import RouteGuard from '../services/RouteGuard'; // Import the RouteGuard

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Login', requiresAuth: false }
  },
  {
    path: '/registration',
    name: 'registration',
    component: RegistrationView,
    meta: { title: 'Registration', requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { title: 'Dashboard', requiresAuth: true }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPasswordView,
    meta: { title: 'Reset Password', requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordView,
    meta: { title: 'Forget Password', requiresAuth: false }
  },
  {
    path: '/view-results',
    name: 'StudentResult',
    component: StudentResultView,
    meta: { title: 'Student Result', requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/add-staff',
    name: 'AddStaff',
    component: AddStaffView,
    meta: { title: 'Add Manager', requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/delete-user',
    name: 'DeleteUser',
    component: DeleteUserView,
    meta: { title: 'Delete User', requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/assign-quiz',
    name: 'AssignQuiz',
    component: AssignQuizView,
    meta: { title: 'Assign Quiz', requiresAuth: true, roles: ['admin'] }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Use the RouteGuard
router.beforeEach(RouteGuard);

// Set document title
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Default App Title';
  next();
});

export default router;
