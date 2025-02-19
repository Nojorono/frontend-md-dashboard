<template>
  <v-dialog
    v-model="dialog"
    max-width="1000"
    persistent
    @click:outside="closeDialog"
  >
    <v-card class="rounded-lg">
      <v-card-title class="primary white--text py-4">
        <v-icon left color="white">{{
          isEdit ? "mdi-calendar-edit" : "mdi-calendar-plus"
        }}</v-icon>
        <span class="text-h6">{{
          isEdit ? "Edit Schedule Plan" : "New Schedule Plan"
        }}</span>
      </v-card-title>

      <v-card-text class="pt-6">
        <v-form ref="form" v-model="formValid" lazy-validation>
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="itemData.type"
                :items="typeOptions"
                label="Schedule Type"
                outlined
                dense
                prepend-inner-icon="mdi-format-list-checks"
                :menu-props="{ offsetY: true }"
                class="rounded-lg"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-autocomplete
                v-model="itemData.user_id"
                :items="userOptions"
                item-text="email"
                item-value="id"
                label="Select User"
                outlined
                dense
                clearable
                return-object
                prepend-inner-icon="mdi-account"
                :rules="userRules"
                @change="onUserChange"
                :menu-props="{ offsetY: true }"
                class="rounded-lg"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content class="text-center">
                      <v-icon large color="grey lighten-1"
                        >mdi-account-off</v-icon
                      >
                      <div class="mt-2">No users found</div>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>

          <v-slide-y-transition>
            <template v-if="itemData.type === 0">
              <v-autocomplete
                v-model="itemData.outlet_id"
                :items="outletsOptions || []"
                :item-text="getOutletText"
                item-value="id"
                label="Select Outlets"
                outlined
                dense
                chips
                clearable
                deletable-chips
                :multiple="!isEdit"
                small-chips
                prepend-inner-icon="mdi-store"
                :rules="outletRules"
                :menu-props="{ offsetY: true }"
                class="rounded-lg mt-3"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content class="text-center">
                      <v-icon large color="grey lighten-1"
                        >mdi-store-off</v-icon
                      >
                      <div class="mt-2">No outlets found</div>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </template>
          </v-slide-y-transition>

          <v-slide-y-transition>
            <template v-if="itemData.type === 1">
              <v-autocomplete
                v-model="itemData.survey_outlet_id"
                :items="surveyOutletOptions || []"
                :item-text="getOutletText"
                item-value="id"
                label="Select Survey Outlets"
                outlined
                dense
                chips
                clearable
                deletable-chips
                small-chips
                prepend-inner-icon="mdi-clipboard-list"
                :rules="outletRules"
                @change="onSurveyOutletChange"
                :menu-props="{ offsetY: true }"
                class="rounded-lg mt-3"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content class="text-center">
                      <v-icon large color="grey lighten-1"
                        >mdi-clipboard-off</v-icon
                      >
                      <div class="mt-2">No survey outlets found</div>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </template>
          </v-slide-y-transition>

          <v-row>
            <v-col cols="6" sm="6">
              <v-checkbox
                v-model="isProgram"
                label="Program"
                @change="onProgramChange"
              />
            </v-col>
            <v-col cols="6" sm="6">
              <v-autocomplete
                v-if="isProgram"
                v-model="itemData.program_id"
                :items="programOptions"
                item-text="name"
                item-value="id"
                label="Select Program"
                outlined
                dense
                prepend-inner-icon="mdi-calendar"
                @click:clear="itemData.program_id = null"
              />
            </v-col>
          </v-row>

          <v-row class="mt-3">
            <v-col cols="12" sm="6">
              <v-textarea
                v-model="itemData.notes"
                outlined
                dense
                clearable
                clear-icon="mdi-close-circle"
                label="Notes"
                prepend-inner-icon="mdi-note-text"
                :rules="notesRules"
                counter="300"
                auto-grow
                rows="3"
                class="rounded-lg"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div>
                <v-menu
                  ref="startPlanMenu"
                  v-model="startPlanMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  min-width="290px"
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="itemData.day_plan"
                      label="Day Plan"
                      outlined
                      dense
                      readonly
                      prepend-inner-icon="mdi-calendar"
                      :rules="startPlanRules"
                      v-bind="attrs"
                      v-on="on"
                      class="rounded-lg"
                    />
                  </template>
                  <v-date-picker
                    v-model="itemData.day_plan"
                    color="primary"
                    :min="new Date().toISOString().substr(0, 10)"
                    @input="startPlanMenu = false"
                  />
                </v-menu>

                <v-select
                  v-if="isEdit"
                  v-model="itemData.status"
                  :items="statusOptions"
                  label="Status"
                  outlined
                  dense
                  prepend-inner-icon="mdi-check-circle"
                />
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn text color="grey darken-1" @click="closeDialog" class="px-4">
          <v-icon left>mdi-close</v-icon>
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!formValid"
          @click="saveItem"
          class="px-6"
          elevation="2"
        >
          <v-icon left>{{ isEdit ? "mdi-content-save" : "mdi-plus" }}</v-icon>
          {{ isEdit ? "Save Changes" : "Add Schedule" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { getOutletByType } from "@/api/masterOutletService";
import { getAllMdRole } from "@/api/userService";
import { getAllSurveyOutlet } from "@/api/surveyService";
import { getAllProgram } from "@/api/programService";

export default {
  name: "FormCallPlanSchedule",
  props: {
    dialog: Boolean,
    isEdit: Boolean,
    item: Object,
  },
  data() {
    return {
      call_plan_id: this.$route.params.id,
      region: this.$route.params.region,
      area: this.$route.params.area,
      itemData: {
        user_id: null,
        outlet_id: [],
        notes: "",
        day_plan: "",
        type: 0,
        survey_outlet_id: null,
        program_id: null,
        status: 400,
      },
      formValid: false,
      startPlanMenu: false,
      endPlanMenu: false,
      isProgram: false,
      outletsOptions: [],
      surveyOutletOptions: [],
      userOptions: [],
      programOptions: [],
      statusOptions: [
        {
          text: "Belum Dikunjungi",
          value: 400,
        },
        {
          text: "Schedule Dibatalkan",
          value: 405,
        },
      ],
      typeOptions: [
        {
          text: "Visit Schedule",
          value: 0,
          icon: "mdi-store-check",
        },
        {
          text: "Survey Schedule",
          value: 1,
          icon: "mdi-clipboard-check",
        },
      ],
      outletRules: [
        (v) => {
          if (Array.isArray(v)) {
            return v.length > 0 || "Please select at least one outlet";
          } else {
            return !!v || "Please select an outlet";
          }
        },
      ],
      userRules: [(v) => !!v || "User selection is required"],
      notesRules: [
        (v) => !!v || "Notes are required",
        (v) => v.length <= 300 || "Notes must be 300 characters or less",
      ],
      startPlanRules: [(v) => !!v || "Day plan date is required"],
      endPlanRules: [
        (v) => !!v || "End plan date is required",
        (v) =>
          !this.itemData.start_plan ||
          new Date(v) >= new Date(this.itemData.start_plan) ||
          "End plan must be after start plan",
      ],
    };
  },
  computed: {
    userLogin() {
      return this.$store.getters.getUser;
    },
  },
  watch: {
    dialog(newValue) {
      if (newValue) {
        this.call_plan_id = this.$route.params.id;
        this.fetchOutlets();
        this.fetchSurveyOutlet();
      }
    },
    item: {
      immediate: true,
      handler(newItem) {
        if (newItem) {
          this.itemData = { ...newItem };
          if (this.isEdit && Array.isArray(this.itemData.outlet_id)) {
            this.itemData.outlet_id = this.itemData.outlet_id[0] || null;
          } else if (!this.isEdit && !Array.isArray(this.itemData.outlet_id)) {
            this.itemData.outlet_id = this.itemData.outlet_id
              ? [this.itemData.outlet_id]
              : [];
          }
          if (this.itemData.program_id) {
            this.isProgram = true;
          }
        } else {
          this.resetForm();
        }
      },
    },
  },
  created() {
    this.fetchOutlets();
    this.fetchUsers();
    this.fetchSurveyOutlet();
    this.fetchProgram();
  },
  methods: {
    getOutletText(item) {
      return item
        ? `${item.outlet_code} - ${item.name} - ${item.region} - ${item.area} - ${item.sio_type} - ${item.brand} - ${item.visit_day}`
        : "";
    },
    onSurveyOutletChange(surveyOutlet) {
      if (surveyOutlet) {
        this.itemData.survey_outlet_id = surveyOutlet;
      } else {
        this.itemData.survey_outlet_id = null;
      }
    },
    resetForm() {
      this.isProgram = false;
      this.itemData = {
        outlet_id: [],
        notes: "",
        day_plan: "",
        survey_outlet_id: null,
        type: 0,
        user_id: null,
        program_id: null,
        status: 400,
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
        if (!this.isEdit) {
          this.itemData.call_plan_id = this.$route.params.id;
        }
        this.$emit("save", { ...this.itemData });
      }
    },
    async fetchUsers() {
      try {
        const response = await getAllMdRole(this.region, this.area);
        this.userOptions = response.data || [];
      } catch (error) {
        console.error("Error fetching users:", error);
        this.userOptions = [];
      }
    },
    async fetchProgram() {
      try {
        const response = await getAllProgram();
        this.programOptions = response.data.data || [];
      } catch (error) {
        console.error("Error fetching programs:", error);
        this.programOptions = [];
      }
    },
    async fetchOutlets() {
      try {
        const response = await getOutletByType({
          region: this.region,
          area: this.area,
        });
        this.outletsOptions = response.data || [];
      } catch (error) {
        console.error("Error fetching outlets:", error);
        this.outletsOptions = [];
      }
    },
    async fetchSurveyOutlet() {
      try {
        const response = await getAllSurveyOutlet(this.call_plan_id);
        this.surveyOutletOptions = response.data || [];
      } catch (error) {
        console.error("Error fetching survey outlets:", error);
        this.surveyOutletOptions = [];
      }
    },
    onUserChange(user) {
      if (user) {
        this.itemData.user_id = user.id;
      } else {
        this.itemData.user_id = null;
      }
    },
    onProgramChange() {
      if (!this.isProgram) {
        this.itemData.program_id = null;
      }
    },
  },
};
</script>

<style scoped>
.v-text-field.rounded-lg >>> .v-input__control .v-input__slot,
.v-select.rounded-lg >>> .v-input__control .v-input__slot,
.v-autocomplete.rounded-lg >>> .v-input__control .v-input__slot {
  border-radius: 8px !important;
}

.v-text-field >>> .v-input__prepend-inner {
  margin-right: 8px;
}

.v-card-title {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
</style>
