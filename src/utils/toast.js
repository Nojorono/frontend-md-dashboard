import Vue from 'vue';

export function toastSuccess(message) {
  if (message && Vue.prototype.$toast) {
    Vue.prototype.$toast.success(message);
  }
}

export function toastError(message) {
  if (message && Vue.prototype.$toast) {
    Vue.prototype.$toast.error(message);
  }
}
