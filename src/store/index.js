import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
  },
  getters: {
    getUser: (state) => state.user,
    getUserRole: (state) => state.user ? state.user.roles[0] : null,
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
      // Store user data in localStorage
      localStorage.setItem('jwtToken', userData.access_token);
      localStorage.setItem('userRole', JSON.stringify(userData.data.roles));
      localStorage.setItem('userPermissions', JSON.stringify(userData.data.permissions));
      localStorage.setItem('authUser', JSON.stringify(userData));

      // Commit the mutation with the user data
      commit('setUser', userData.data);
    },
    logoutUser({ commit }) {
      // Clear localStorage
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userPermissions');
      localStorage.removeItem('authUser');

      // Clear the user in the store
      commit('clearUser');
    },
  },
});
