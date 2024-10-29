<template>
  <v-dialog
    v-model="dialog"
    max-width="800"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEdit ? "Edit Call Plan" : "Add New Schedule Plan" }}</span>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="form"
          v-model="formValid"
        >
          <v-row>
            <v-col sm="6" md="6" lg="6" xl="6">
              <v-text-field
                v-model="code_call_plan"
                label="Code Call Plan"
                readonly
                :rules="codeCallPlanRules"
              ></v-text-field>
              <v-text-field
                v-model="call_plan_id"
                style="display: none;"
                label="Id Call Plan"
              ></v-text-field>
              <!-- User Selection using v-autocomplete -->
              <v-autocomplete
                v-model="itemData.outlet_id"
                :items="outletsOptions"
                :item-text="getOutletText"
                item-value="id"
                label="Select Outlets"
                clearable
                return-object
                hide-selected
                @change="selectOutlet"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>No outlets found</v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>

              <v-textarea
                v-model="itemData.notes"
                clearable
                clear-icon="mdi-close-circle"
                label="Notes"
                value="This is clearable text."
                :rules="notesRules"
              ></v-textarea>
            </v-col>
            <v-col sm="6" md="6" lg="6" xl="6">
              <v-menu
                ref="startPlanMenu"
                v-model="startPlanMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="itemData.start_plan"
                    label="Start Plan"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  style="margin: 0;"
                  v-model="itemData.start_plan"
                  @input="startPlanMenu = false"
                ></v-date-picker>
              </v-menu>

              <!-- End Plan -->
              <v-menu
                ref="endPlanMenu"
                v-model="endPlanMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="itemData.end_plan"
                    label="End Plan"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  style="margin: 0;"
                  v-model="itemData.end_plan"
                  @input="endPlanMenu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
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
import { getOutletByType } from '@/api/masterOutletService'
export default {
  name: "FormCallPlanSchedule",
  props: {
    dialog: Boolean,
    isEdit: Boolean,
    item: Object,
  },
  data() {
    return {
      code_call_plan: '',
      call_plan_id: '',
      itemData: {
        outlet_id: 0,
        notes: '',
        start_plan: '',
        end_plan: '',
      },
      formValid: false,
      startPlanMenu: false,
      endPlanMenu: false,
      outletsOptions: [],
      notesRules: [
        (v) => !!v || "Notes is required",
      ],
      codeCallPlanRules: [
        (v) => !!v || "Code Call Plan is required",
      ],
    };
  },
  watch: {
    dialog(newValue) {
      if (newValue) {
        this.call_plan_id = this.$route.params.id
        this.code_call_plan = this.$route.params.code_call_plan
        if (this.outletsOptions.length === 0) {
          this.fetchOutlets()
        }
      }
    },
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
  mounted() {
    this.fetchOutlets();
  },
  methods: {
    getOutletText(item) {
      return `${item.outlet_code} - ${item.name} - ${item.region} - ${item.area}`;
    },
    resetForm() {
      this.itemData = {
        outlet_id: 0,
        notes: '',
        start_plan: '',
        end_plan: '',
      };
      this.formValid = false;
    },
    closeDialog() {
      this.resetForm();
      this.$emit("close");
    },
    saveItem() {
      if (this.$refs.form.validate()) {
        this.itemData.call_plan_id = this.$route.params.id;
        this.itemData.code_call_plan = this.$route.params.code_call_plan;
        this.$emit("save", { ...this.itemData });
        this.closeDialog();
      }
    },
    async fetchOutlets () {
      const response = await getOutletByType();
      this.outletsOptions = response.data
    },
    selectOutlet(item) {
      if (item) {
        this.itemData.outlet_id = item.id; // Store the selected user ID
      } else {
        this.itemData.outlet_id = null; // Reset if no user selected
      }
    },
  },
};
</script>

<style scoped>
/* Additional styles if necessary */
</style>
