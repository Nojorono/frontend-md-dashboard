<template>
  <v-dialog v-model="dialog" max-width="600px" @click:outside="closeDialog">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEdit ? "Edit Item" : "Add New Item" }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="formValid">
          <!-- Name Input -->
          <v-text-field
            v-model="itemData.name"
            :rules="nameRules"
            label="Name"
            required
          />

          <!-- Description Input -->
          <v-text-field
            v-model="itemData.description"
            :rules="descriptionRules"
            label="Description"
            required
          />

          <!-- is_active Switch -->
          <v-switch
            v-model="itemData.is_active"
            label="Is Active"
          />

          <!-- is_mobile Switch -->
          <v-switch
            v-model="itemData.is_mobile"
            label="Is Mobile"
          />

          <!-- is_web Switch -->
          <v-switch
            v-model="itemData.is_web"
            label="Is Web"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="saveItem" :disabled="!formValid">
          {{ isEdit ? "Save" : "Add" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "FormRole",
    props: {
      dialog: Boolean,
      isEdit: Boolean,
      item: Object,
    },
    data() {
      return {
        itemData: {
          name: '',
          description: '',
          is_active: true,
          is_mobile: false,
          is_web: false,
        },
        formValid: false,
        nameRules: [
          (v) => !!v || "Name is required",
          (v) => v.length >= 2 || "Name must be at less 2 characters",
          (v) => v.length <= 20 || "Name must be less than 20 characters"
        ],
        descriptionRules: [
          (v) => !!v || "Description is required",
          (v) => v.length <= 255 || "Description must be less than 255 characters"
        ],
      };
    },
    watch: {
      item: {
        immediate: true,
        handler(newItem) {
          if (newItem) {
            this.itemData = {
              ...newItem,
              is_active: newItem.is_active === 1,
              is_mobile: newItem.is_mobile === 1,
              is_web: newItem.is_web === 1,
            };
          } else {
            this.resetForm();
          }
        },
      },
    },
    methods: {
      resetForm() {
        this.itemData = {
          name: '',
          description: '',
          is_active: true,
          is_mobile: false,
          is_web: false,
        };
        this.formValid = false;
      },
      closeDialog() {
        this.resetForm();
        this.$emit("close");
      },
      saveItem() {
        if (this.$refs.form.validate()) {
          const formattedData = {
            ...this.itemData,
            is_active: this.itemData.is_active ? 1 : 0,
            is_mobile: this.itemData.is_mobile ? 1 : 0,
            is_web: this.itemData.is_web ? 1 : 0,
          };
          this.$emit("save", formattedData);
          this.closeDialog();
        }
      },
    },
  };
</script>
