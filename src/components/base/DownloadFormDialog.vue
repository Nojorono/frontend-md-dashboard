<template>
  <v-dialog v-model="dialog" max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">Download Data</span>
      </v-card-title>

      <v-card-text>
        Choose the format to download the data.
      </v-card-text>

      <v-card-actions>
        <v-btn color="blue darken-1" text @click="download('csv')">CSV</v-btn>
        <v-btn color="green darken-1" text @click="download('xlsx')">Excel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "DownloadFormDialog",
    props: {
      dialog: Boolean,
    },
    methods: {
      closeDialog() {
        this.$emit("close");
      },
      download(format) {
        this.$emit("download", format);
        this.closeDialog();
      },
    },
  };
</script>
