import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null, // Holds the logged-in user's data
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getUserRole(state) {
      return state.user ? state.user.authorization.role : null;
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user; // Mutates user state
    },
    clearUser(state) {
      state.user = null; // Clears the user on logout
    },
  },
  actions: {
    loginUser({ commit }, user) {
      commit('setUser', user); // Triggers mutation to store user
    },
    logoutUser({ commit }) {
      commit('clearUser'); // Triggers mutation to clear user data
    },
  },
});
