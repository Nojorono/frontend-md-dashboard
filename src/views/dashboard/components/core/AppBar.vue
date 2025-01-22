<template>
  <v-app-bar
    id="app-bar"
    absolute
    app
    color="transparent"
    flat
    height="75"
  >
    <v-btn
      class="mr-3"
      elevation="1"
      fab
      small
      @click="setDrawer(!drawer)"
    >
      <v-icon v-if="value">
        mdi-view-quilt
      </v-icon>

      <v-icon v-else>
        mdi-dots-vertical
      </v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      v-text="$route.name"
    />

    <v-spacer />

    <div class="mx-3" />

    <v-btn
      class="ml-2"
      min-width="0"
      text
      to="/"
    >
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>

    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
      :max-height="400"
      absolute
      style="max-width: 400px; z-index: 99999999999;"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-badge
            color="red"
            overlap
            bordered
            :content="unreadCount"
            :value="unreadCount > 0"
          >
            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-list
        :tile="false"
        nav
        class="overflow-y-auto notification-list"
        style="max-width: 400px"
      >
        <div v-if="notifications.length > 0">
          <v-list-item
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item py-2"
            :class="{ 'grey lighten-4': notification.is_read }"
            @click="goToNotification(notification)"
            style="cursor: pointer"
          >
            <v-list-item-avatar>
              <v-icon :color="notification.is_read ? 'grey' : 'primary'">mdi-comment</v-icon>
            </v-list-item-avatar>
            
            <v-list-item-content>
              <v-list-item-title class="subtitle-1" :class="{ 'grey--text': notification.is_read }">
                {{ notification?.outlet?.name }} - {{ notification?.outlet?.outlet_code }}
              </v-list-item-title>
              <v-list-item-subtitle class="caption">
                {{ notification?.user?.email }} - {{ notification?.message }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="caption">
                {{ formatDate(notification.created_at) }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action v-if="!notification.is_read">
              <v-btn
                icon
                small
                @click.stop="markAsRead(notification.id)"
              >
                <v-icon small>mdi-check</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <div class="text-center py-2" v-if="hasMoreNotifications">
            <v-btn
              text
              small
              color="primary"
              @click="loadMoreNotifications"
              :loading="loading"
              :disabled="loading"
            >
              Load More
            </v-btn>
          </div>
        </div>
        <v-list-item v-else>
          <v-list-item-content class="text-center">
            <v-list-item-title>No notifications</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <template>
      <div class="text-center">
        <v-menu
          offset-y
          style="max-width: 400px; z-index: 99999999999;"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="ml-2"
              min-width="0"
              text
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item :to="{ path: '/pages/user' }">
              <v-list-item-title>
                {{ 'Profile' }}
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="handleLogout">
              <v-list-item-title>
                {{ 'Logout' }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </template>
  </v-app-bar>
</template>

<script>
  // Utilities
  import { mapState, mapMutations, mapGetters } from 'vuex'
  import { getAll, updateData } from '@/api/notificationService'

  export default {
    name: 'DashboardCoreAppBar',

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      notifications: [],
      notificationInterval: null,
      limit: 10,
      offset: 0,
      hasMoreNotifications: false,
      loading: false
    }),

    computed: {
      ...mapState(['drawer']),
      ...mapGetters(['getUser']),
      unreadCount() {
        return this.notifications.filter(n => !n.is_read).length;
      }
    },

    mounted() {
      this.$socket.on('notification', this.fetchNotifications);
      this.fetchNotifications();
      // Poll for new notifications every minute
      this.notificationInterval = setInterval(this.fetchNotifications, 60000);
    },

    beforeDestroy() {
      if (this.notificationInterval) {
        clearInterval(this.notificationInterval);
      }
    },

    methods: {
      ...mapMutations({
        setDrawer: 'SET_DRAWER',
        logout: 'LOGOUT',
      }),

      formatDate(date) {
        const now = new Date();
        const notifDate = new Date(date);
        const diff = now - notifDate;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 60) {
          return `${minutes} minutes ago`;
        } else if (hours < 24) {
          return `${hours} hours ago`;
        } else if (days < 7) {
          return `${days} days ago`;
        } else {
          return notifDate.toLocaleDateString();
        }
      },

      async fetchNotifications() {
        try {
          const user = this.getUser;
          const response = await getAll({userId: user.id, limit: this.limit, offset: this.offset});
          const newNotifications = response.data.data.sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          
          // Check if there are potentially more notifications
          this.hasMoreNotifications = newNotifications.length >= this.limit;

          if (this.offset === 0) {
            this.notifications = newNotifications;
          } else {
            this.notifications = [...this.notifications, ...newNotifications];
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      },

      async loadMoreNotifications() {
        try {
          this.loading = true;
          this.offset += this.limit;
          await this.fetchNotifications();
        } catch (error) {
          console.error('Error loading more notifications:', error);
        } finally {
          this.loading = false;
        }
      },

      handleLogout() {
        this.$swal.fire({
          title: 'Are you sure?',
          text: "You will be logged out of the system",
          icon: 'warning', 
          showCancelButton: true,
          confirmButtonColor: '#FF5733',
          cancelButtonColor: '#6B7A8F',
          confirmButtonText: 'Yes, logout',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.replace({ path: '/logout' })
              .then(() => {
                this.$router.push({ path: '/login' });
              });
          }
        });
      },

      async markAsRead(id) {
        try {
          await updateData(id, { is_read: true });
          const notification = this.notifications.find(n => n.id === id);
          if (notification) {
            notification.is_read = true;
          }
        } catch (error) {
          console.error('Error marking notification as read:', error);
        }
      },

      goToNotification(notification) {
        // Mark as read when clicking
        if (!notification.is_read) {
          this.markAsRead(notification.id);
        }
        
        // Navigate based on notification type and identifier

        switch (notification.type) {
          case 1:
            this.$router.push({
              path: `/activity/detail/${notification.comments.activity_id}`
            });
            break;
          case 2:
            this.$router.push({
              path: `/activity/detail/${notification.activity_id}`
            });
            break;
        }
      },
    },
  }
</script>

<style scoped>
  .notification-item {
    cursor: pointer;
  }
</style>
