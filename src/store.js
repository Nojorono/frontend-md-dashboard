import Vue from 'vue'
import Vuex from 'vuex'
import logo from '../public/logo-nna.png'
import { getOutletArea, getOutletRegion } from "@/api/masterOutletService";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgb(228, 226, 226, 9), rgb(105, 105, 105)',
    barImage: logo,
    drawer: null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    visible: false,
    message: '',
    type: 'success',
    regionOptions: JSON.parse(localStorage.getItem('regionOptions')) || [],
    areaOptions: JSON.parse(localStorage.getItem('areaOptions')) || [],
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
    SET_REGION_OPTIONS(state, payload) {
      state.regionOptions = payload
    },
    SET_AREA_OPTIONS(state, payload) {
      state.areaOptions = payload
    },
  },
  actions: {
    async fetchRegionOptions({ commit, state }) {
      const response = await getOutletRegion();
      if (state.user.region) {
        const data = response.data.filter(region => region === state.user.region) 
        commit('SET_REGION_OPTIONS', data)
        localStorage.setItem('regionOptions', JSON.stringify(data))
      } else {
        commit('SET_REGION_OPTIONS', response.data)
        localStorage.setItem('regionOptions', JSON.stringify(response.data))
      }
    },
    async fetchAreaOptions({ commit, state }) {
      const response = await getOutletArea();
      if (Array.isArray(state.user.area) && state.user.area.length > 0) {
        const data = response.data.filter(area => state.user.area.includes(area))
        commit('SET_AREA_OPTIONS', data)
        localStorage.setItem('areaOptions', JSON.stringify(data))
      } else {
        commit('SET_AREA_OPTIONS', response.data)
        localStorage.setItem('areaOptions', JSON.stringify(response.data))
      }
    },
    // Action to log in
    login({ commit }, { token, user }) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
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
        commit('SET_TOKEN', token)
      }
    },
    showLoading({ commit }) {
      commit('SET_LOADING', true)
    },
    hideLoading({ commit }) {
      commit('SET_LOADING', false)
    },
  },
  getters: {
    getUser: (state) => state.user,
    getLoading: (state) => state.loading,
    getRegionOptions: (state) => state.regionOptions,
    getAreaOptions: (state) => state.areaOptions,
  },
})
