<template>
  <v-dialog v-model="dialog" max-width="600px" @click:outside="closeDialog">
    <v-card>
      <v-card-title>
        <span class="headline">{{
          isEdit ? "Edit Item" : "Add Program"
        }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="formValid">
          <!-- Name Input -->
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="itemData.name"
                :rules="requiredRules"
                label="Name"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="itemData.description"
                :rules="maxLengthRules"
                label="Description"
              />
            </v-col>
            <!-- <v-col cols="12">
              <v-textarea
                v-model="itemData.notes"
                :rules="maxLengthRules"
                label="Notes"
              />
            </v-col> -->
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
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
  name: "FormProgram",
  props: {
    dialog: Boolean,
    isEdit: Boolean,
    item: Object,
  },
  data() {
    return {
      itemData: {
        name: "",
        description: "",
        notes: "",
      },
      formValid: false,
      requiredRules: [(v) => !!v || "required"],
      maxLengthRules: [(v) => v.length <= 255 || "Max length is 255 characters"],
    };
  },
  watch: {
    item: {
      immediate: true,
      handler(newItem) {
        if (newItem) {
          this.itemData = { ...newItem };
        } else {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    resetForm() {
      this.itemData = {
        name: "",
        description: "",
        notes: "",
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
        const formattedData = { ...this.itemData };
        this.$emit("save", formattedData);
        this.closeDialog();
      }
    },
  },
};
</script>

<style scoped>

</style>
