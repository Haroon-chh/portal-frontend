import Store from "../app/store/index";

let RouteService = function routeGuard(permission, to) {
  if (Store.state.Auth.token) {
    if (Store.state.Auth.permissions.includes(permission)) {
      // write logic here 
      // // Store.commit("setCurrentPath", {
      // //   currentPath: to.name,
      // });
      return true;
    } else {
      return false;
    }
  } else {
    return "/signin";
  }
};

export default RouteService;
