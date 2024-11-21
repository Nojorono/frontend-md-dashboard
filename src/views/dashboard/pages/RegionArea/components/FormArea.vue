<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEdit ? "Edit Item" : "Add Area" }}</span>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="form"
          v-model="formValid"
        >
          <!-- Name Input -->
          <v-text-field
            v-model="itemData.region_id"
            label=""
            required
            hidden="hidden"
          />
          <v-text-field
            v-model="itemData.area"
            label="Area"
            required
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="closeDialog"
        >
          Cancel
        </v-btn>
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
  name: "FormArea",
  props: {
    dialog: Boolean,
    isEdit: Boolean,
    item: Object,
  },
  data() {
    return {
      itemData: {
        region_id: 0,
        area: '',
      },
      formValid: false,
      requiredRules: [
        (v) => !!v || "required!",
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
        region_id: 0,
        area: '',
      };
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },
    closeDialog() {
      this.resetForm();
      this.$emit("close");
    },
    saveItem() {
      if (this.$refs.form.validate()) {
        const formattedData = {
          ...this.itemData
        };
        this.$emit("save", formattedData);
        this.closeDialog();
      }
    },
  },
};
</script>
