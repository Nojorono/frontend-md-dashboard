import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import 'leaflet/dist/leaflet.css';
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import moment from 'moment'
import 'moment/locale/id'
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import Toast from 'vue-toastification'
import Swal from 'sweetalert2'
import 'vue-toastification/dist/index.css'
import io from 'socket.io-client';
import VueSocketIOExtended from 'vue-socket.io-extended';

moment.locale('id')

Vue.filter('formatDate', function(value, format = 'dddd, DD MMM YYYY') {
  if (value) {
    return moment(value).format(format)
  }
  return ''
})
const toastOptions = {
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnHover: true,
}

Vue.use(Toast, toastOptions)
Vue.prototype.$swal = Swal;

Vue.config.productionTip = false

// Enhanced configuration for the Socket.IO client
const socket = io('http://localhost:9001', {
  auth: {
    token: localStorage.getItem('token')
  },
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: true,
});

socket.on('notification', (payload) => {
  Vue.prototype.$toast.info(payload.message);
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server at http://localhost:9001');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  if (reason === 'io server disconnect') {
    socket.connect();
  }
});

Vue.use(VueSocketIOExtended, socket);

// Make socket instance available globally
Vue.prototype.$socket = socket;

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')
