<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    :src="barImage"
    mobile-break-point="960"
    app
    width="260"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img
        :gradient="`to bottom, ${barColor}`"
        v-bind="props"
      />
    </template>
    <v-list
      dense
      nav
    >
      <v-list-item>
        <v-list-item-avatar
          class="align-self-center"
          height="100"
          width="220"
          style="border-radius: unset;"
        >
          <v-img
            :src="imagePath"
            max-height="100"
          />
        </v-list-item-avatar>
      </v-list-item>
    </v-list>

    <v-divider class="mb-2" />
    <v-list
      dense
      nav
    >
      <div />
      <template v-for="(item, i) in computedMenuItems">
        <base-item-group
          v-if="item.children"
          :key="`child-${i}`"
          :item="item"
        />

        <base-item
          v-else
          :key="`item-${i}`"
          :item="item"
        />
      </template>
      <div />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: 'DashboardCoreDrawer',
  props: {
    expandOnHover: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    imagePath: '/logo-nna.png',
    menuItems: [
      { title: 'Dashboard', icon: 'mdi-monitor-dashboard', to: '/' },
      {
        title: 'Master Data', 
        icon: 'mdi-database',
        expanded: null,
        children: [
          { title: 'Outlet', icon: 'mdi-storefront-outline', to: '/master/outlet' },
          { title: 'Users', icon: 'mdi-account-group-outline', to: '/master/users' },
          { title: 'Roles', icon: 'mdi-shield-key-outline', to: '/master/roles' },
          { title: 'Brands', icon: 'mdi-tag-multiple-outline', to: '/master/brand' },
          { title: 'Sio', icon: 'mdi-package-variant-closed', to: '/master/sio' },
          { title: 'Batch', icon: 'mdi-archive-outline', to: '/master/batch' },
          { title: 'Region & Area', icon: 'mdi-map-marker-radius-outline', to: '/master/region' },
          { title: 'Program', icon: 'mdi-library-outline', to: '/master/program' },
        ],
      },
      { title: 'Call Plan', icon: 'mdi-calendar-clock', to: '/call-plan' },
      { title: 'Activity MD', icon: 'mdi-calendar-check', to: '/activity' },
      { title: 'Survey New Outlet', icon: 'mdi-clipboard-text-search', to: '/survey' },
      { title: 'Absensi', icon: 'mdi-account-clock-outline', to: '/absensi' },
      { title: 'Reimburse Bbm', icon: 'mdi-account-cash', to: '/reimburse-bbm' },
      {
        title: 'Settings',
        icon: 'mdi-cog-outline',
        expanded: null,
        children: [
          { title: 'Profile', icon: 'mdi-account-circle-outline', to: '/pages/user' },
          { title: 'Report', icon: 'mdi-file-document-outline', to: '/report' },
          // { title: 'Notifications', icon: 'mdi-bell-ring-outline', to: '/components/notifications' },
        ],
      },
    ]
  }),
  computed: {
    ...mapState(['barColor', 'barImage', 'user']),
    drawer: {
      get () {
        return this.$store.state.drawer
      },
      set (val) {
        this.$store.commit('SET_DRAWER', val)
      },
    },
    computedMenuItems() {
      const userMenus = this.user?.menus || [];
      
      return this.menuItems.reduce((acc, item) => {
        if (item.children) {
          const filteredChildren = item.children.filter(child => 
            userMenus.some(userMenu => userMenu.path === child.to)
          );
          
          if (filteredChildren.length > 0) {
            acc.push({
              ...item,
              children: filteredChildren
            });
          }
        } else {
          if (userMenus.some(userMenu => userMenu.path === item.to)) {
            acc.push(item);
          }
        }
        return acc;
      }, []);
    }
  },
}
</script>

<style lang="scss">
#core-navigation-drawer {
  .v-list-group__header.v-list-item--active:before {
    opacity: 0.12;
  }

  .v-list-item {
    &__icon--text,
    &__icon:first-child {
      justify-content: center;
      text-align: center;
      width: 20px;

      :deep([dir="ltr"]) & {
        margin-right: 24px;
        margin-left: 12px !important;
      }

      :deep([dir="rtl"]) & {
        margin-left: 24px;
        margin-right: 12px !important;
      }
    }
  }

  .v-list--dense {
    .v-list-item {
      &__icon--text,
      &__icon:first-child {
        margin-top: 10px;
      }
    }
  }

  .v-list-group--sub-group {
    .v-list-item {
      :deep([dir="ltr"]) & {
        padding-left: 8px;
      }

      :deep([dir="rtl"]) & {
        padding-right: 8px;
      }
    }

    .v-list-group__header {
      :deep([dir="ltr"]) & {
        padding-right: 0;
      }

      :deep([dir="rtl"]) & {
        padding-right: 0;
      }

      .v-list-item__icon--text {
        margin-top: 19px;
        order: 0;
      }

      .v-list-group__header__prepend-icon {
        order: 2;

        :deep([dir="ltr"]) & {
          margin-right: 8px;
        }

        :deep([dir="rtl"]) & {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
