import store from '@/store';
import {toastSuccess} from "@/utils/toast";

export function checkAuthGuard(to, next) {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      this.$swal.fire({
        title: 'Need to login again?',
        text: "You will be logged out of the system",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#FF5733',
        cancelButtonColor: '#6B7A8F',
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          store.dispatch('logout').then(() => {
            toastSuccess('Logout successfully');
            next('/login');
          }).catch((error) => {
            console.error('Logout error:', error);
            next('/login');
          });
        }
      });
    } else {
      next();
    }
  } else {
    next();
  }
}
