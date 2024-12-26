<!-- src/components/Forbidden.vue -->
<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4" class="text-center">
        <v-card class="pa-8" elevation="8">
          <v-icon size="100" color="error">mdi-alert-circle-outline</v-icon>

          <div class="forbidden-content mt-6">
            <h1 class="text-h2 font-weight-bold error--text mb-2">403</h1>
            <h2 class="text-h4 font-weight-medium mb-4">Forbidden Access</h2>
            <p class="text-subtitle-1 grey--text mb-6">
              Sorry, you don't have permission to access this page. Please
              contact your administrator for assistance.
            </p>

            <v-btn
              color="primary"
              x-large
              rounded
              elevation="2"
              @click="goHome"
              class="px-8"
            >
              <v-icon left>mdi-home</v-icon>
              Return Home
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Forbidden",
  methods: {
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.fill-height {
  height: 100%;
  width: 100%;
}

.forbidden-content {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
