import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
    loggedUser: null,
  },
  getters: {
    getUser: (state) => state.user,
    getUserRole: (state) => state.user ? state.user.role : null,
    getUserPermissions: (state) => state.user ? state.user.permissions : [],
    getLoggedUser: (state) => state.loggedUser,
  },
  mutations: {
    setUser(state, userData) {
      state.user = userData;
    },
    setLoggedUser(state, loggedUserData) {
      state.loggedUser = loggedUserData;
    },
    clearUser(state) {
      state.user = null;
      state.loggedUser = null;
    },
  },
  actions: {
    loginUser({ commit }, userData) {
      localStorage.setItem('authUser', JSON.stringify(userData));
      localStorage.setItem('access_token', userData.data.access_token);
      localStorage.setItem('userRole', userData.data.role);
      localStorage.setItem('userPermissions', JSON.stringify(userData.data.permissions));
      commit('setUser', userData.data);
    },
    logoutUser({ commit }) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userPermissions');
      localStorage.removeItem('authUser');
      localStorage.removeItem('logged_user');
      commit('clearUser');
    },
    setLoggedUserData({ commit }, loggedUserData) {
      localStorage.setItem('logged_user', JSON.stringify(loggedUserData));
      commit('setLoggedUser', loggedUserData);
    },
  },
});
