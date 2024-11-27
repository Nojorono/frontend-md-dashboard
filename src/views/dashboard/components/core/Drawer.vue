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
    <!-- Sidebar Header -->
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

    <!-- Dynamic Menu Items -->
<!--    <v-list-->
<!--      dense-->
<!--      nav-->
<!--    >-->
<!--      <template v-for="(item, index) in menuItems">-->
<!--        &lt;!&ndash; Check if the item has children &ndash;&gt;-->
<!--        <v-list-group-->
<!--          v-if="item.children"-->
<!--          :key="`group-${index}`"-->
<!--          :prepend-icon="item.icon"-->
<!--          :value="item.expanded"-->
<!--        >-->
<!--          <template #activator>-->
<!--            <v-list-item-title>{{ item.title }}</v-list-item-title>-->
<!--          </template>-->

<!--          <v-list-item-->
<!--            v-for="(child, childIndex) in item.children"-->
<!--            :key="`child-${index}-${childIndex}`"-->
<!--            :to="child.to"-->
<!--          >-->
<!--            <v-list-item-icon>-->
<!--              <v-icon>{{ child.icon }}</v-icon>-->
<!--            </v-list-item-icon>-->
<!--            <v-list-item-title>{{ child.title }}</v-list-item-title>-->
<!--          </v-list-item>-->
<!--        </v-list-group>-->

<!--        <v-list-item-->
<!--          v-if="!item.children"-->
<!--          :key="`item-${index}`"-->
<!--          :to="item.to"-->
<!--          :class="{ 'v-list-item&#45;&#45;active': $route.path === child.to }"-->
<!--        >-->
<!--          <v-list-item-icon>-->
<!--            <v-icon>{{ item.icon }}</v-icon>-->
<!--          </v-list-item-icon>-->
<!--          <v-list-item-title>{{ item.title }}</v-list-item-title>-->
<!--        </v-list-item>-->
<!--      </template>-->
<!--    </v-list>-->
    <v-list
      dense
      nav
    >
      <div />
      <template v-for="(item, i) in menuItems">
        <base-item-group
          v-if="item.children"
          :key="`child-${i}`"
          :item="item"
        >
        </base-item-group>

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
      { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
      {
        title: 'Master Data',
        icon: 'mdi-folder-multiple',
        expanded: null,
        children: [
          { title: 'Outlet', icon: 'mdi-account', to: '/master/outlet' },
          { title: 'Users', icon: 'mdi-account', to: '/master/users' },
          { title: 'Roles', icon: 'mdi-key', to: '/master/roles' },
          { title: 'Brands', icon: 'mdi-cube', to: '/master/brand' },
          { title: 'Sio', icon: 'mdi-cube', to: '/master/sio' },
          { title: 'Batch', icon: 'mdi-cube', to: '/master/batch' },
          { title: 'Region & Area', icon: 'mdi-cube', to: '/master/region' },
        ],
      },
      { title: 'Survey New Outlet', icon: 'mdi-calendar', to: '/survey' },
      { title: 'Call Plan', icon: 'mdi-calendar', to: '/call-plan' },
      { title: 'Activity MD', icon: 'mdi-calendar', to: '/activity' },
      {
        title: 'Settings',
        icon: 'mdi-cog',
        expanded: null,
        children: [
          { title: 'Profile', icon: 'mdi-account-circle', to: '/settings/profile' },
          { title: 'Notifications', icon: 'mdi-bell', to: '/settings/notifications' },
        ],
      },
    ],
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
  },
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/tools/_rtl.sass'

#core-navigation-drawer
  .v-list-group__header.v-list-item--active:before
    opacity: .12

  .v-list-item
    &__icon--text,
    &__icon:first-child
      justify-content: center
      text-align: center
      width: 20px

      +ltr()
        margin-right: 24px
        margin-left: 12px !important

      +rtl()
        margin-left: 24px
        margin-right: 12px !important

  .v-list--dense
    .v-list-item
      &__icon--text,
      &__icon:first-child
        margin-top: 10px

  .v-list-group--sub-group
    .v-list-item
      +ltr()
        padding-left: 8px

      +rtl()
        padding-right: 8px

    .v-list-group__header
      +ltr()
        padding-right: 0

      +rtl()
        padding-right: 0

      .v-list-item__icon--text
        margin-top: 19px
        order: 0

      .v-list-group__header__prepend-icon
        order: 2

        +ltr()
          margin-right: 8px

        +rtl()
          margin-left: 8px
</style>
