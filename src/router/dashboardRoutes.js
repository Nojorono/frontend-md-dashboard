const requiresAuth = { requiresAuth: true };

export default [
  {
    path: '/',
    component: () => import('@/views/dashboard/Index'),
    children: [
      {
        name: 'Forbidden',
        path: '/forbidden',
        component: () => import('@/views/dashboard/pages/Forbidden'),
      },
      {
        name: 'Dashboard',
        path: '/',
        component: () => import('@/views/dashboard/Dashboard'),
        meta: requiresAuth, // Add this to protect the route
      },
      {
        name: 'Report',
        path: '/report',
        component: () => import('@/views/dashboard/pages/Report/Report.vue'),
        meta: requiresAuth, // Protect this route
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
        name: 'Sio Gallery',
        path: '/master/sio/:id',
        component: () => import('@/views/dashboard/pages/Sio/SioGallery.vue'),
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
        name: 'Batch Allocation',
        path: '/master/batch/allocation/:id',
        component: () => import('@/views/dashboard/pages/Batch/BatchTarget.vue'),
        meta: requiresAuth, // Protect this route
      },
      {
        name: 'Survey Outlet',
        path: '/survey',
        component: () => import('@/views/dashboard/pages/SurveyNewOutlet/SurveyNewOutlet.vue'),
        meta: requiresAuth,
      },
      {
        name: 'Detail Survey Outlet',
        path: '/survey/detail/:id',
        component: () => import('@/views/dashboard/pages/SurveyNewOutlet/components/DetailSurveyNewOutlet.vue'),
        meta: requiresAuth,
      },
      {
        name: 'Activity',
        path: '/activity',
        component: () => import('@/views/dashboard/pages/Activity/Activity.vue'),
        meta: requiresAuth,
      },
      {
        name: 'Detail Activity',
        path: '/activity/detail/:id',
        component: () => import('@/views/dashboard/pages/Activity/components/DetailActivity.vue'),
        meta: requiresAuth,
      },
      {
        name: 'Call Plan',
        path: '/call-plan',
        component: () => import('@/views/dashboard/pages/CallPlan/CallPlan.vue'),
        meta: requiresAuth,
      },
      {
        name: 'Call Plan Schedule',
        path: '/call-plan/schedule/:id/:region/:area',
        component: () => import('@/views/dashboard/pages/CallPlan/CallPlanSchedule.vue'),
        meta: requiresAuth, // Protect this route
      },
      {
        name: 'Absensi',
        path: '/absensi',
        component: () => import('@/views/dashboard/pages/Absensi/Absensi.vue'),
        meta: requiresAuth, // Protect this route
      },
      {
        name: 'Master Program',
        path: '/master/program',
        component: () => import('@/views/dashboard/pages/Program/MasterProgram.vue'),
        meta: requiresAuth, // Protect this route
      },
      {
        name: 'Notifications',
        path: '/components/notifications',
        component: () => import('@/views/dashboard/component/Notifications'),
        meta: requiresAuth, // Protect this route
      },
      {
        name: 'Reimburse Bbm',
        path: '/reimburse-bbm',
        component: () => import('@/views/dashboard/pages/ReimburseBbm/ReimburseBbm.vue'),
        meta: requiresAuth, // Protect this route
      },
    ],
  },
];
