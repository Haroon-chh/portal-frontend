import Store from "../app/store/index";

const RouteGuard = (to, from, next) => {
  const publicPages = ['/login', '/registration', '/forgot-password', '/set-password'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = Store.state.Auth.token;

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  if (loggedIn && publicPages.includes(to.path)) {
    return next('/dashboard');
  }

  next();
};

export default RouteGuard;
