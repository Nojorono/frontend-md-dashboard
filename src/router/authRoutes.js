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
        // Perform the logout action
        await store.dispatch('logout');

        // Clear all intervals if any are running
        const intervals = window.intervals || [];
        intervals.forEach(clearInterval);

        // Show a success toast notification
        toastSuccess('Logout successfully');

        // Redirect to the login page
        return next({ path: '/login' });
      } catch (error) {
        console.error('Logout error:', error);

        // Show an error toast notification
        toastError('Logout failed. Please try again.');

        // Redirect to the login page with an error query parameter
        return next({
          path: '/login',
          query: { error: 'logout_failed' },
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
