import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store' // Import the Vuex store

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/Login.vue'),
    },
    // Add logout route
    {
      path: '/logout',
      name: 'Logout',
      beforeEnter: (to, from, next) => {
        // Perform the logout action before entering this route
        store.dispatch('logout') // Trigger Vuex logout action
        Vue.prototype.$toast.success(`Logout successfully`)
        next('/login') // Redirect to login page after logout
      },
    },
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        {
          name: 'Dashboard',
          path: '',
          component: () => import('@/views/dashboard/Dashboard'),
          meta: { requiresAuth: true }, // Add this to protect the route
        },
        {
          name: 'User Profile',
          path: 'pages/user',
          component: () => import('@/views/dashboard/pages/UserProfile'),
          meta: { requiresAuth: true }, // Protect this route
        },
        {
          name: 'Master Outlet',
          path: 'master/outlet',
          component: () => import('@/views/dashboard/pages/OutletMaster/MasterOutlet.vue'),
          meta: { requiresAuth: true }, // Protect this route
        },
        {
          name: 'Master Users',
          path: 'master/users',
          component: () => import('@/views/dashboard/pages/UserMaster/MasterUser.vue'),
          meta: { requiresAuth: true }, // Protect this route
        },
        {
          name: 'Master Roles',
          path: 'master/roles',
          component: () => import('@/views/dashboard/pages/RoleMaster/MasterRole.vue'),
          meta: { requiresAuth: true }, // Protect this route
        },
        {
          name: 'Call Plan',
          path: 'call-plan',
          component: () => import('@/views/dashboard/pages/CallPlan/CallPlan.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Call Plan' },
          children: [
            {
              name: 'Call Plan Detail',
              path: 'detail',
              component: () => import('@/views/dashboard/pages/CallPlan/CallPlanDetail.vue'),
              meta: { requiresAuth: true, breadcrumb: 'Call Plan Detail' }, // Protect this route
            },
          ]
        },
        {
          name: 'Notifications',
          path: 'components/notifications',
          component: () => import('@/views/dashboard/component/Notifications'),
          meta: { requiresAuth: true }, // Protect this route
        },
        {
          name: 'Icons',
          path: 'components/icons',
          component: () => import('@/views/dashboard/component/Icons'),
          meta: { requiresAuth: true }, // Protect this route
        },
        {
          name: 'Typography',
          path: 'components/typography',
          component: () => import('@/views/dashboard/component/Typography'),
          meta: { requiresAuth: true }, // Protect this route
        },
        {
          name: 'Regular Tables',
          path: 'tables/regular-tables',
          component: () => import('@/views/dashboard/tables/RegularTables'),
          meta: { requiresAuth: true }, // Protect this route
        },
        {
          name: 'Google Maps',
          path: 'maps/google-maps',
          component: () => import('@/views/dashboard/maps/GoogleMaps'),
          meta: { requiresAuth: true }, // Protect this route
        },
      ],
    },
  ],
})

// Add a global navigation guard
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if the user is authenticated

    if (!store.state.user) {
      // Show toast notification for re-login

      Vue.prototype.$toast && Vue.prototype.$toast.error('Please re-login to continue.')

      // Redirect to the login page if not authenticated
      next({ path: '/logout' })
    } else {
      // If authenticated, proceed
      next()
    }
  } else {
    // If the route does not require authentication, proceed
    next()
  }
})

export default router
