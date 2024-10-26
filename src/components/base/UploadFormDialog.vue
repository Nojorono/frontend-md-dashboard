<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Upload File</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="uploadForm">
          <v-file-input
            v-model="file"
            label="Choose file"
            prepend-icon="mdi-upload"
            accept=".csv,.xlsx"
            required
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog(false)">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="uploadFile">Upload</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "UploadFormDialog",
    props: {
      dialog: Boolean,
    },
    data() {
      return {
        file: null,
      };
    },
    computed: {
      fileType() {
        if (!this.file) return null;
        const extension = this.file.name.split(".").pop().toLowerCase();
        return extension === "csv" ? "csv" : extension === "xlsx" ? "excel" : null;
      },
    },
    methods: {
      closeDialog(e) {
        this.$emit("close", e);
      },
      uploadFile() {
        if (this.file) {
          const fileData = {
            file: this.file,
            fileType: this.fileType, // Pass file type flag
          };
          this.$emit("upload", fileData);
          this.closeDialog(false);
        }
      },
    },
  };
</script>
