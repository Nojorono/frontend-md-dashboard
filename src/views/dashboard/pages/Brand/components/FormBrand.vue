<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEdit ? "Edit Item" : "Add Brand & SOG" }}</span>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="form"
          v-model="formValid"
        >
          <!-- Name Input -->
          <v-text-field
            v-model="itemData.brand"
            :rules="requiredRules"
            label="Brand"
            required
          />

          <!-- Dynamic SOG Inputs -->
          <div
            v-for="(sog, index) in itemData.sog"
            :key="index"
            class="sog-input"
          >
            <v-text-field
              v-model="itemData.sog[index]"
              :label="`SOG ${index + 1}`"
              placeholder="Enter SOG"
              class="mr-2"
            />
            <v-btn
              icon
              @click="removeSog(index)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>

          <!-- Add SOG Button -->
          <v-btn
            color="blue darken-1"
            text
            @click="addSog"
          >
            <v-icon left>
              mdi-plus
            </v-icon> Add SOG
          </v-btn>
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
  name: "FormBrand",
  props: {
    dialog: Boolean,
    isEdit: Boolean,
    item: Object,
  },
  data() {
    return {
      itemData: {
        brand: "",
        sog: [],
      },
      formValid: false,
      requiredRules: [(v) => !!v || "required"],
    };
  },
  watch: {
    item: {
      immediate: true,
      handler(newItem) {
        if (newItem) {
          this.itemData = {...newItem};
        } else {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    resetForm() {
      this.itemData = {
        brand: "",
        sog: [],
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
        const formattedData = {...this.itemData};
        this.$emit("save", formattedData);
        this.closeDialog();
      }
    },
    addSog() {
      this.itemData.sog.push("");
    },
    removeSog(index) {
      this.itemData.sog.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.sog-input {
  display: flex;
  align-items: center;
}
</style>
