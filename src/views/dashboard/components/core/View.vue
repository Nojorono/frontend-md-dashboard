<template>
  <v-content>
    <breadcrumbs />
    <router-view />

<!--    <dashboard-core-footer />-->
  </v-content>
</template>

<script>
  import Breadcrumbs from '@/views/dashboard/components/core/Breadcrumbs.vue'

  export default {
    name: 'DashboardCoreView',
    components: { Breadcrumbs },

    // components: {
    //   DashboardCoreFooter: () => import('./Footer'),
    // },
  }
</script>
