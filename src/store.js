import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: 'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg',
    drawer: null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    visible: false,
    message: '',
    type: 'success',
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) {
      state.barImage = payload
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    // Auth mutations
    SET_USER (state, user) {
      state.user = user
    },
    SET_TOKEN (state, token) {
      state.token = token
      state.isAuthenticated = !!token
    },
    LOGOUT (state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
    SET_LOADING(state, payload) {
      state.loading = payload
    },
    SHOW_SNACKBAR(state, { message, type }) {
      state.visible = true;
      state.message = message;
      state.type = type;
    },
    HIDE_SNACKBAR(state) {
      state.visible = false;
      state.message = '';
      state.type = '';
    },
  },
  actions: {
    // Action to log in
    login({ commit }, { token, user }) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user)) // Store user in localStorage
      commit('SET_USER', user)
      commit('SET_TOKEN', token)
    },
    // Action to log out
    logout({ commit }) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      commit('LOGOUT')
    },
    // Action to check authentication
    checkAuth({ commit }) {
      const token = localStorage.getItem('token')
      if (token) {
        // You could also fetch user info here if necessary
        commit('SET_TOKEN', token)
      }
    },
    showLoading({ commit }) {
      commit('SET_LOADING', true)
    },
    hideLoading({ commit }) {
      commit('SET_LOADING', false)
    },
    showSnackbar({ commit }, payload) {
      commit('SHOW_SNACKBAR', payload);
      setTimeout(() => {
        commit('HIDE_SNACKBAR');
      }, 3000); // Adjust duration as necessary
    },
  },
  getters: {
    getUser: (state) => state.user,
  },
})
