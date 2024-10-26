<template>
  <v-dialog v-model="dialog" max-width="400px" @click:outside="closeDialog">
    <v-card>
      <v-card-title class="headline">Are you sure?</v-card-title>
      <v-card-text>
        Do you really want to delete this item? This process cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" @click="confirmDelete">Delete</v-btn>
        <v-btn color="blue darken-1" @click="closeDialog">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "ConfirmDeleteDialog",
    props: {
      dialog: Boolean,
    },
    methods: {
      closeDialog() {
        this.$emit("close");
      },
      confirmDelete() {
        this.$emit("confirm");
        this.closeDialog();
      },
    },
  };
</script>
