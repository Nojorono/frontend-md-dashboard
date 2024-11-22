<template>
  <v-list-item
    :href="computedHref"
    :rel="computedHref && computedHref !== '#' ? 'noopener' : undefined"
    :target="computedHref && computedHref !== '#' ? '_blank' : undefined"
    :to="item.to"
    :active-class="computedActiveClass"
    :exact-active-class="computedExactActiveClass"
    :aria-current="isRouteActive ? 'page' : undefined"
  >
    <v-list-item-icon
      v-if="text"
      class="v-list-item__icon--text"
      v-text="computedText"
    />

    <v-list-item-icon v-else-if="item.icon">
      <v-icon v-text="item.icon" />
    </v-list-item-icon>

    <v-list-item-content v-if="item.title || item.subtitle">
      <v-list-item-title v-text="item.title" />
      <v-list-item-subtitle v-text="item.subtitle" />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import Themeable from 'vuetify/lib/mixins/themeable';

export default {
  name: 'Item',

  mixins: [Themeable],

  props: {
    item: {
      type: Object,
      required: true,
    },
    text: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    computedText() {
      if (!this.item || !this.item.title) return '';
      return this.item.title
        .split(' ')
        .map(word => word[0])
        .join('');
    },
    computedHref() {
      return this.item.href || (!this.item.to ? '#' : undefined);
    },
    isRouteActive() {
      return this.$route && this.item.to && this.$route.path === this.item.to;
    },
    computedActiveClass() {
      return `primary ${!this.isDark ? 'white' : 'white'}--text`;
    },
    computedExactActiveClass() {
      return `primary ${this.isDark ? 'black' : 'white'}--text`;
    },
  },
};
</script>
