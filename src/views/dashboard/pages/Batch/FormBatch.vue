<template>
  <v-dialog
    v-model="dialogLocal"
    max-width="600px"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
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
            v-model.lazy="itemData.code_batch"
            :rules="nameRules"
            label="Code Batch"
            required
          />

          <v-menu
            ref="startPlanMenu"
            v-model="startPlanMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            min-width="290px"
            @keydown.esc="startPlanMenu = false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="itemData.start_plan"
                label="Start Plan"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                :rules="planRules"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="itemData.start_plan"
              style="margin: 0;"
              @input="startPlanMenu = false"
            />
          </v-menu>

          <!-- End Plan -->
          <v-menu
            ref="endPlanMenu"
            v-model="endPlanMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            min-width="290px"
            @keydown.esc="endPlanMenu = false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="itemData.end_plan"
                label="End Plan"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                :rules="planRules"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="itemData.end_plan"
              style="margin: 0;"
              @input="endPlanMenu = false"
            />
          </v-menu>
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
  name: "FormBatch",
  props: {
    dialog: Boolean,
    isEdit: Boolean,
    item: Object,
  },
  data() {
    return {
      dialogLocal: this.dialog,
      itemData: {
        code_batch: '',
        start_plan: '',
        end_plan: '',
      },
      formValid: false,
      startPlanMenu: false,
      endPlanMenu: false,
      nameRules: [
        (v) => !!v || "Code is required",
        (v) => v.length >= 2 || "Name must be at less 2 characters",
        (v) => v.length <= 20 || "Name must be less than 20 characters"
      ],
      planRules: [
        (v) => !!v || "Plan is required",
      ],
    };
  },
  watch: {
    dialog(newVal) {
      this.dialogLocal = newVal;
    },
    dialogLocal(newVal) {
      this.$emit('update:dialog', newVal);
    },
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
        code_batch: '',
        start_plan: '',
        end_plan: '',
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
          code_batch: this.itemData.code_batch.trim(),
          start_plan: this.itemData.start_plan.trim(),
          end_plan: this.itemData.end_plan.trim()
        };
        this.$emit("save", formattedData);
        this.closeDialog();
      }
    },
  },
};
</script>
