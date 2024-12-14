<template>
  <v-dialog v-model="dialog" max-width="600px" @click:outside="closeDialog">
    <v-card>
      <v-card-title>
        <span class="headline">{{
          isEdit ? "Edit Sio Component" : "Add Sio Component"
        }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="formValid">
          <!-- Name Input -->
          <v-text-field
            v-model="itemData.name"
            :rules="requiredRules"
            label="Component Name"
            required
          />

          <v-file-input
            v-model="itemData.photo"
            label="Photo"
            accept="image/*"
            @change="handlePhotoChange"
            required
            show-size
            prepend-icon="mdi-camera"
          >
            <template v-slot:selection="{ text }">
              <v-chip small label color="primary">
                {{ text || 'No file selected' }}
              </v-chip>
            </template>
          </v-file-input>

          <v-img
            v-if="previewImage"
            :src="previewImage"
            max-width="200"
            class="mt-3"
          ></v-img>

          <v-img
            v-else-if="itemData.photo && typeof itemData.photo === 'string'"
            :src="itemData.photo"
            max-width="200"
            class="mt-3"
          ></v-img>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog"> Cancel </v-btn>
        <v-btn
          color="green darken-1"
          text
          :disabled="!formValid"
          @click="saveItem"
        >
          {{ isEdit ? "Save" : "Add" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "FormSioGallery",
  props: {
    dialog: Boolean,
    isEdit: Boolean,
    item: Object,
  },
  data() {
    return {
      sioId: this.$route.params.id,
      sioName: this.$route.params.name,
      itemData: {
        name: "",
        photo: null,
        sio_type_id: this.sioId,
      },
      previewImage: "",
      formValid: false,
      requiredRules: [(v) => !!v || "required"],
      
    };
  },
  watch: {
    item: {
      immediate: true,
      handler(newItem) {
        console.log(newItem);
        if (newItem) {
          this.itemData = { ...newItem };
          if (typeof this.itemData.photo === 'string') {
            this.previewImage = this.itemData.photo;
          } else {
            this.previewImage = null;
          }
        } else {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    handlePhotoChange(file) {
      if (!file) {
        if (this.isEdit && this.itemData.photo && typeof this.itemData.photo === 'string') {
          this.previewImage = this.itemData.photo;
        } else {
          this.previewImage = null;
        }
        return;
      }

      this.itemData.photo = file;
      this.previewImage = URL.createObjectURL(file);
    },
    resetForm() {
      this.itemData = {
        name: "",
        photo: null,
        sio_type_id: this.sioId,
      };
      this.previewImage = null;
      this.formValid = false;
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },
    closeDialog() {
      this.resetForm();
      this.$emit("close");
    },
    async saveItem() {
      if (this.$refs.form.validate()) {
        const formData = new FormData();
        formData.append("name", this.itemData.name);
        formData.append("sio_type_id", this.sioId);
        
        // Handle photo upload for both create and edit
        if (this.itemData.photo instanceof File) {
          formData.append("photo", this.itemData.photo);
        }

        // For edit mode, include the ID and existing photo if not changed
        if (this.isEdit) {
          formData.append("id", this.itemData.id);
          if (typeof this.itemData.photo === 'string') {
            formData.append("photo", this.itemData.photo);
          }
        }

        // Log formData entries
        // for (let [key, value] of formData.entries()) {
        //   console.log(`${key}:`, value);
        // }
        
        this.$emit("save", formData);
        this.closeDialog();
      }
    },
  },
  beforeDestroy() {
    // Clean up object URL to avoid memory leaks
    if (this.previewImage && this.previewImage !== this.itemData.photo) {
      URL.revokeObjectURL(this.previewImage);
    }
  },
};
</script>

<style scoped>
</style>
