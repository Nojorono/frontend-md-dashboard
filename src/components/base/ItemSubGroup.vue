<template>
  <base-item-group
    :item="item"
    text
    sub-group
  />
</template>

<script>
export default {
  name: 'ItemSubGroup',

  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
