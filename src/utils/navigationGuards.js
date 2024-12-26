import store from '@/store';

export function checkAuthGuard(to, from, next) {
  // Handle public routes
  const publicRoutes = ['/login', '/forgot-password', '/reset-password'];
  if (publicRoutes.includes(to.path)) {
    // If user is already logged in, redirect to dashboard
    if (store.state.user) {
      next('/');
      return;
    }
    next();
    return;
  }

  // Handle logout route specially to avoid redirect loop
  if (to.path === '/logout') {
    next();
    return;
  }

  // Check if route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (requiresAuth) {
    if (!store.state.user) {
      // Save attempted route for redirect after login
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
      return;
    }

    // Check if user has access to menu
    const userMenus = store.state.user.menus || [];
    const hasMenuAccess = userMenus.some(menu => to.path.startsWith(menu.path));

    if (!hasMenuAccess) {
      next('/forbidden');
      return;
    }
  }

  next();
}
