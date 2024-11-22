import store from '@/store';
import {toastError} from "@/utils/toast";

export function checkAuthGuard(to, next) {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      toastError('Please re-login to continue.');
      next({ path: '/logout' });
    } else {
      next();
    }
  } else {
    next();
  }
}
