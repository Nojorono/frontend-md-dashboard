// =========================================================
// * Vuetify Material Dashboard - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vuetify-material-dashboard
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import moment from 'moment'
import 'moment/locale/id'

// Import Vue Toastification and CSS
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
// Set the global locale to Indonesian
moment.locale('id')
// Add a global filter to format dates with Moment.js
Vue.filter('formatDate', function(value, format = 'dddd, DD MMM YYYY') {
  if (value) {
    return moment(value).format(format)
  }
  return ''
})
// Customize Toastification options if needed
const toastOptions = {
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnHover: true,
}

Vue.use(Toast, toastOptions)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')
