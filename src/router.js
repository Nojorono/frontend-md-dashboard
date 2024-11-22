import Vue from 'vue';
import Router from 'vue-router';
import { checkAuthGuard } from '@/utils/navigationGuards';
import authRoutes from "@/router/authRoutes";
import dashboardRoutes from "@/router/dashboardRoutes";

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    ...authRoutes,
    ...dashboardRoutes,
  ],
});

// Add a global navigation guard
router.beforeEach((to, from, next) => checkAuthGuard(to, next));

export default router;
