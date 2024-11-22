const requiresAuth = { requiresAuth: true };

export default [
  {
    path: '/',
    component: () => import('@/views/dashboard/Index'),
    children: [
      {
        name: 'Dashboard',
        path: '/',
        component: () => import('@/views/dashboard/Dashboard'),
        meta: requiresAuth, // Add this to protect the route
      },
      {
        name: 'User Profile',
        path: '/pages/user',
        component: () => import('@/views/dashboard/pages/UserProfile'),
        meta: requiresAuth, // Protect this route
      },
      {
        name: 'Master Outlet',
        path: '/master/outlet',
        component: () => import('@/views/dashboard/pages/OutletMaster/MasterOutlet.vue'),
        meta: requiresAuth,
      },
      {
        name: 'Outlet Detail',
        path: '/master/outlet/detail/:id',
        component: () => import('@/views/dashboard/pages/OutletMaster/components/DetailOutlet.vue'),
        meta: requiresAuth,
      },
      {
        name: 'Master Users',
        path: '/master/users',
        component: () => import('@/views/dashboard/pages/UserMaster/MasterUser.vue'),
        meta: requiresAuth, // Protect this route
      },
      {
        name: 'Master Roles',
        path: '/master/roles',
        component: () => import('@/views/dashboard/pages/RoleMaster/MasterRole.vue'),
        meta: requiresAuth, // Protect this route
      },
      {
        name: 'Master Brand',
        path: '/master/brand',
        component: () => import('@/views/dashboard/pages/Brand/MasterBrand.vue'),
        meta: requiresAuth, // Protect this route
      },
      {
        name: 'Master Sio',
        path: '/master/sio',
        component: () => import('@/views/dashboard/pages/Sio/MasterSio.vue'),
        meta: requiresAuth, // Protect this route
      },
      {
        name: 'Master Region',
        path: '/master/region',
        component: () => import('@/views/dashboard/pages/RegionArea/MasterRegion.vue'),
        meta: requiresAuth, // Protect this route
      },
      {
        name: 'Master Area',
        path: '/master/region/area/:id',
        component: () => import('@/views/dashboard/pages/RegionArea/MasterArea.vue'),
        meta: requiresAuth,
      },
      {
        name: 'Master Batch',
        path: '/master/batch',
        component: () => import('@/views/dashboard/pages/Batch/MasterBatch.vue'),
        meta: requiresAuth, // Protect this route
      },
      {
        name: 'Batch Target',
        path: '/master/batch/target/:id',
        component: () => import('@/views/dashboard/pages/Batch/BatchTarget.vue'),
        meta: requiresAuth, // Protect this route
      },
      {
        name: 'Call Plan',
        path: '/call-plan',
        component: () => import('@/views/dashboard/pages/CallPlan/CallPlan.vue'),
        meta: requiresAuth,
      },
      {
        name: 'Call Plan Schedule',
        path: '/call-plan/schedule/:id',
        component: () => import('@/views/dashboard/pages/CallPlan/CallPlanSchedule.vue'),
        meta: requiresAuth, // Protect this route
      },
      {
        name: 'Notifications',
        path: '/components/notifications',
        component: () => import('@/views/dashboard/component/Notifications'),
        meta: requiresAuth, // Protect this route
      },
      {
        name: 'Icons',
        path: '/components/icons',
        component: () => import('@/views/dashboard/component/Icons'),
        meta: requiresAuth, // Protect this route
      },
      {
        name: 'Typography',
        path: '/components/typography',
        component: () => import('@/views/dashboard/component/Typography'),
        meta: requiresAuth, // Protect this route
      },
      {
        name: 'Regular Tables',
        path: '/tables/regular-tables',
        component: () => import('@/views/dashboard/tables/RegularTables'),
        meta: requiresAuth, // Protect this route
      },
      {
        name: 'Google Maps',
        path: '/maps/google-maps',
        component: () => import('@/views/dashboard/maps/GoogleMaps'),
        meta: requiresAuth,
      },
    ],
  },
];
