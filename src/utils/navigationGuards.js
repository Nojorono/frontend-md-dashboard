import store from '@/store';

export function checkAuthGuard(to, from, next) {
  // Handle logout route specially to avoid redirect loop
  if (to.path === '/logout') {
    next();
    return;
  }

  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      // Redirect to login if not authenticated
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    // Public route, allow access
    next();
  }
}
