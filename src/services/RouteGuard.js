import store from "../store/index";

const RouteGuard = (to, from, next) => {
  const publicPages = ['/login', '/registration', '/forgot-password', '/reset-password'];
  const adminPages = ['/dashboard','/view-results', '/add-staff', '/delete-user'];
  const studentPages = ['/dashboard', '/view-grades', '/submit-assignments'];
  const managerPages = ['/dashboard', '/view-reports', '/manage-staff'];

  const authRequired = !publicPages.includes(to.path);
  const userRole = store.getters.getUserRole;

  // If the route requires auth and there's no user role, redirect to login
  if (authRequired && !userRole) {
    return next('/login');
  }

  // If user has a role and tries to access a public page, redirect to dashboard
  if (userRole && publicPages.includes(to.path)) {
    return next('/dashboard');
  }

  // Role-based access control
  if (userRole) {
    if (userRole === 'admin' && !adminPages.includes(to.path)) {
      return next('/dashboard');
    } else if (userRole === 'student' && !studentPages.includes(to.path)) {
      return next('/dashboard');
    } else if (userRole === 'manager' && !managerPages.includes(to.path)) {
      return next('/dashboard');
    }
  }

  // If none of the above conditions are met, allow navigation
  next();
};

export default RouteGuard;
