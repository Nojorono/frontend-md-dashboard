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
    beforeEnter: (to, from, next) => {
      store.dispatch('logout')
        .then(() => {
          toastSuccess('Logout successfully');
            next('/login'); // Redirect to login after successful logout
        })
        .catch((error) => {
          console.error('Logout error:', error);
          toastError('Logout failed. Please try again.');
          next('/login'); // Redirect to login even if logout fails
        });
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
