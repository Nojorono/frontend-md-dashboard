<template>
  <v-app>
    <!-- Show loading indicator while menu is loading -->
    <v-overlay
      v-if="loading"
      absolute
      :opacity="0.8"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="65"
      />
    </v-overlay>
    <dashboard-core-app-bar />
    <dashboard-core-drawer />
    <dashboard-core-view />
    <dashboard-core-settings />
    <!-- Modal Alert -->
    <v-dialog
      v-model="showAlert"
      max-width="400px"
    >
      <v-card>
        <v-card-title class="headline">
          Token Expired
        </v-card-title>
        <v-card-text>{{ alertMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            @click="handleLogout()"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
  export default {
    name: 'DashboardIndex',

    components: {
      DashboardCoreAppBar: () => import('./components/core/AppBar'),
      DashboardCoreDrawer: () => import('./components/core/Drawer'),
      DashboardCoreSettings: () => import('./components/core/Settings'),
      DashboardCoreView: () => import('./components/core/View'),
    },
    data: () => ({
      expandOnHover: false,
      showAlert: false,
      alertMessage: '',
      loading: false,
    }),
    computed: {
      ...mapGetters(['getUser', 'getLoading']),
    },
    watch: {
      getUser(newUser) {
        this.checkUserMenuLoaded(newUser);
      },
      getLoading(state) {
        this.loading =  state;
      },
    },
    created() {
      this.checkUserMenuLoaded(this.getUser);
    },
    mounted() {
    },
    methods: {
      ...mapActions(['showLoading', 'hideLoading']),
      checkUserMenuLoaded(user) {
        this.showLoading()
        if (user && user?.menus) {
          setTimeout(() => {
            this.hideLoading();
          }, 2000);
        } else {
          this.alertMessage = 'User data or menus could not be loaded. Please try again.';
          this.showAlert = true;
        }
      },
      handleLogout(){
        this.showAlert = false;
        this.$router.push('/logout');
      }
    },
  }
</script>
