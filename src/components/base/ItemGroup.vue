<template>
  <v-list-group
    :group="group"
    :prepend-icon="item.icon"
    :sub-group="subGroup"
    append-icon="mdi-menu-down"
    :color="isGroupActive ? 'primary' : barColor"
    :value="item.expanded || isGroupActive"
  >
    <template v-slot:activator>
      <v-list-item-icon
        v-if="text"
        class="v-list-item__icon--text"
        v-text="computedText"
      />

      <v-list-item-content>
        <v-list-item-title v-text="item.title" />
      </v-list-item-content>
    </template>

    <template v-for="(child, i) in children">
      <base-item-sub-group
        v-if="child.children && child.children.length"
        :item="child"
        :key="`child-${i}`"
      />
      <base-item
        v-else
        :key="`item-${i}`"
        :item="child"
      />
    </template>
  </v-list-group>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ItemGroup',

  props: {
    item: {
      type: Object,
      required: true,
    },
    subGroup: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState(['barColor']),
    children() {
      return this.item.children || [];
    },
    computedText() {
      if (!this.item || !this.item.title) return '';
      return this.item.title
        .split(' ')
        .map(word => word[0])
        .join('');
    },
    group() {
      return this.generateGroupPaths(this.children);
    },
    isGroupActive() {
      return this.checkActive(this.item);
    },
  },

  watch: {
    isGroupActive(newVal) {
      if (newVal) {
        this.item.expanded = true;
      }
    },
  },

  methods: {
    generateGroupPaths(children) {
      return children
        .filter(child => child.to)
        .map(child => {
          const baseGroup = this.item.group || '';
          const childGroup = child.group || `${baseGroup}/${child.to}`;
          return child.children
            ? `${childGroup}|${this.generateGroupPaths(child.children)}`
            : childGroup;
        })
        .join('|');
    },
    checkActive(item) {
      if (item.to && this.$route && this.$route.path === item.to) return true;
      return item.children
        ? item.children.some(child => this.checkActive(child))
        : false;
    },
  },
};
</script>

<style scoped>
.v-list-group__activator p {
  margin-bottom: 0;
}
</style>
