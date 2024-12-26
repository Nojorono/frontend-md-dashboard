import store from "@/store";
import { toastSuccess, toastError } from "@/utils/toast";

export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: async (to, from, next) => {
      try {
        
        await store.dispatch('logout');
        
        const intervals = window.intervals || [];
        intervals.forEach(clearInterval);
        
        toastSuccess('Logout successfully');
        
        return next();
      } catch (error) {
        console.error('Logout error:', error);
        toastError('Logout failed. Please try again.');
        
        return next({ 
          path: '/login',
          query: { error: 'logout_failed' }
        });
      }
    },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPassword.vue'),
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/auth/PasswordReset.vue'),
  },
];
