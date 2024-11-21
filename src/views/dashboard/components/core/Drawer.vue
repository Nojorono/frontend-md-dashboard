<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
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
      expand
      nav
    >
      <div />

<!--      <template v-for="(item, i) in computedItems">-->
<!--        <base-item-group-->
<!--          v-if="item.children"-->
<!--          :key="`group-${i}`"-->
<!--          :item="item"-->
<!--        >-->
<!--          &lt;!&ndash;  &ndash;&gt;-->
<!--        </base-item-group>-->

<!--        <base-item-->
<!--          v-else-->
<!--          :key="`item-${i}`"-->
<!--          :item="item"-->
<!--        />-->
<!--      </template>-->
      <div />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  // Utilities
  import {
    mapState,
  } from 'vuex'

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
      items: [
        {
          icon: 'mdi-view-dashboard',
          title: 'dashboard',
          to: '/',
        },
        {
          icon: 'mdi-application-cog',
          title: 'Master Outlet',
          to: '/master/outlet',
        },
        {
          icon: 'mdi-clipboard-account',
          title: 'Master Users',
          to: '/master/users',
        },
        {
          icon: 'mdi-account-cog',
          title: 'Master Roles',
          to: '/master/roles',
        },
        {
          icon: 'mdi-account-cog',
          title: 'Master Brand',
          to: '/master/brand',
        },
        {
          icon: 'mdi-account-cog',
          title: 'Master Region',
          to: '/master/region',
        },
        {
          icon: 'mdi-account-cog',
          title: 'Master Sio',
          to: '/master/sio',
        },
        {
          icon: 'mdi-account-cog',
          title: 'Master Batch',
          to: '/master/batch',
        },
        {
          icon: 'mdi-account-group',
          title: 'Call Plan',
          to: '/call-plan',
        },
        {
          title: 'rtables',
          icon: 'mdi-clipboard-outline',
          to: '/tables/regular-tables',
        },
        {
          title: 'typography',
          icon: 'mdi-format-font',
          to: '/components/typography',
        },
        {
          title: 'icons',
          icon: 'mdi-chart-bubble',
          to: '/components/icons',
        },
        {
          title: 'google',
          icon: 'mdi-map-marker',
          to: '/maps/google-maps',
        },
        {
          title: 'notifications',
          icon: 'mdi-bell',
          to: '/components/notifications',
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
      computedItems () {
        const filteredMenu = this.items.filter(item => this.isMenuItemAllowed(item))
        return filteredMenu.map(this.mapItem)
      },
      profile () {
        return {
          avatar: true,
          title: this.$t('avatar'),
        }
      },
    },
    mounted(){
    },

    methods: {
      mapItem (item) {
        return {
          ...item,
          children: item.children ? item.children.map(this.mapItem) : undefined,
          title: this.$t(item.title),
        }
      },
      isMenuItemAllowed(path) {
        return this.user?.menus.some(userMenuItem => userMenuItem.value === path.to)
      },
    },
  }
</script>

<style lang="sass">
  @import '~vuetify/src/styles/tools/_rtl.sass'

  #core-navigation-drawer
    .v-list-group__header.v-list-item--active:before
      opacity: .24

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
