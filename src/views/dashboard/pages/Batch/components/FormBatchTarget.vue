<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEdit ? "Edit Item" : "Add Batch Item" }}</span>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="form"
          v-model="formValid"
        >
          <!-- Name Input -->
          <v-text-field
            v-model="itemData.id"
            :rules="[requiredRules]"
            label="Batch Id"
            required
          />
          <v-text-field
            v-model="itemData.regional"
            :rules="[requiredRules]"
            label="Regional"
            required
          />
          <v-text-field
            v-model="itemData.amo"
            :rules="[requiredRules]"
            label="Area"
            required
          />
          <v-text-field
            v-model="itemData.brand_type_sio"
            :rules="[requiredRules]"
            label="Brand Type Sio"
            required
          />
          <v-text-field
            v-model="itemData.amo_brand_type"
            :rules="[requiredRules]"
            label="Amo Brand Type"
            required
          />
          <v-text-field
            v-model="itemData.allocation_ho"
            :rules="[requiredRules]"
            label="Allocation Ho"
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
  name: "FormBatchTarget",
  props: {
    dialog: Boolean,
    isEdit: Boolean,
    item: Object,
  },
  data() {
    return {
      itemData: {
        id: 0,
        regional: '',
        amo: '',
        brand_type_sio: '',
        amo_brand_type: '',
        allocation_ho: 0,
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
        id: 0,
        regional: '',
        amo: '',
        brand_type_sio: '',
        amo_brand_type: '',
        allocation_ho: 0,
      };
      this.formValid = false;
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
