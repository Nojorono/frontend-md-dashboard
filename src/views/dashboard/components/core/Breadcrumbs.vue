<!-- Breadcrumbs.vue -->
<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
  export default {
    computed: {
      breadcrumbs() {
        let currentRoute = this.$route;
        let breadcrumbs = [];
        // Iterate over matched routes
        currentRoute.matched.forEach(route => {
          if (route.meta && route.meta.breadcrumb) {
            breadcrumbs.push({
              text: route.meta.breadcrumb, // Breadcrumb text
              path: route.path,            // Route path
            });
          }
        });

        return breadcrumbs;
      }
    }
  };
</script>
