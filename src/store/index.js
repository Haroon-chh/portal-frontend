import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
  },
  getters: {
    getUser: (state) => state.user,
    getUserRole: (state) => state.user ? state.user.role : null,
    getUserPermissions: (state) => state.user ? state.user.permissions : [],
  },
  mutations: {
    setUser(state, userData) {
      state.user = userData;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  actions: {
    loginUser({ commit }, userData) {
      // Store the entire response in localStorage as 'authUser'
      localStorage.setItem('authUser', JSON.stringify(userData));
      
      // Store the access token, role, and permissions separately
      localStorage.setItem('access_token', userData.data.access_token);
      localStorage.setItem('userRole', userData.data.role);
      localStorage.setItem('userPermissions', JSON.stringify(userData.data.permissions));

      // Commit the user data to the Vuex store
      commit('setUser', userData.data);  // This sets the user state with the role and permissions
    },
    logoutUser({ commit }) {
      // Clear localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userPermissions');
      localStorage.removeItem('authUser'); // Clear authUser as well

      // Clear user data in the Vuex store
      commit('clearUser');
    },
  },
});
