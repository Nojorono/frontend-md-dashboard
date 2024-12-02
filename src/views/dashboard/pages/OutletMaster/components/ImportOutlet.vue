<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Upload File</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="uploadForm">
          <v-file-input
            ref="fileInput"
            v-model="file"
            label="Choose file"
            prepend-icon="mdi-upload"
            accept=".csv,.xlsx"
            required
            :loading="loading"
            hint="Supported formats: CSV, XLSX"
            persistent-hint
          />
        </v-form>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            :disabled="loading"
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            :disabled="loading || !file"
            @click="uploadFile"
          >
            Upload
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ImportOutlet",
  props: {
    dialog: Boolean,
  },
  data() {
    return {
      file: null,
    };
  },
  computed: {
    loading() {
      return this.$store.getters.getLoading;
    },
    fileType() {
      if (!this.file) return null;
      const extension = this.file.name.split(".").pop().toLowerCase();
      return extension === "csv" ? "csv" : extension === "xlsx" ? "excel" : null;
    },
  },
  methods: {
    closeDialog() {
      this.file = null;
      this.$refs.fileInput.reset();
      this.$emit("close");
    },
    async uploadFile() {
      if (this.file) {
        await this.$store.dispatch("showLoading");
        const fileData = {
          file: this.file,
          fileType: this.fileType,
        };

        try {
          this.$emit("upload", fileData);
        } catch (error) {
          this.$toast.error("File upload failed!");
        } finally {
          await this.$store.dispatch("hideLoading");
          this.closeDialog();
        }
      }
    },
  },
};
</script>

<style scoped>
/* Style for better UX */
.v-dialog .v-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.v-file-input {
  margin-bottom: 20px;
}

.v-btn[disabled] {
  background-color: #b0bec5 !important; /* Disable color */
  color: white !important;
}

.v-card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
