<template>
  <v-dialog
    v-model="dialog"
    max-width="800"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEdit ? "Edit Schedule Plan" : "New Schedule Plan" }}</span>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="form"
          v-model="formValid"
        >
          <!-- User Selection using v-autocomplete -->
          <v-autocomplete
            v-model="itemData.outlet_id"
            :items="outletsOptions"
            :item-text="getOutletText"
            item-value="id"
            label="Select Outlets"
            chips
            clearable
            deletable-chips
            :multiple="!isEdit"
            small-chips-call
            :rules="outletRules"
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>No outlets found</v-list-item-content>
              </v-list-item>
            </template>
          </v-autocomplete>
          <v-row>
            <v-col
              sm="6"
              md="6"
              lg="6"
              xl="6"
            >
              <v-autocomplete
                v-model="itemData.user_id"
                :items="userOptions"
                item-text="email"
                item-value="id"
                label="Select User"
                clearable
                return-object
                :rules="userRules"
                @change="onUserChange"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>No users found</v-list-item-content>
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
              />
            </v-col>
            <v-col
              sm="6"
              md="6"
              lg="6"
              xl="6"
            >
              <v-menu
                ref="startPlanMenu"
                v-model="startPlanMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="itemData.day_plan"
                    label="Day Plan"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    :rules="startPlanRules"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="itemData.day_plan"
                  style="margin: 0;"
                  @input="startPlanMenu = false"
                />
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
import {getAllRole} from "@/api/userService";

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
      itemData: {
        user_id: null,
        outlet_id: [],
        notes: '',
        day_plan: '',
      },
      formValid: false,
      startPlanMenu: false,
      endPlanMenu: false,
      outletsOptions: [],
      userOptions: [],
      // Validation rules
      outletRules: [
        v => {
          if (Array.isArray(v)) {
            return v.length > 0 || 'Please select at least one outlet';
          } else {
            return !!v || 'Please select an outlet';
          }
        },
      ],
      userRules: [
        v => !!v || 'User selection is required',
      ],
      notesRules: [
        v => !!v && v.length <= 300 || 'Notes must be 300 characters or less',
      ],
      startPlanRules: [
        v => !!v || 'Start plan date is required',
      ],
      endPlanRules: [
        v => !!v || 'End plan date is required',
        v => !this.itemData.start_plan || new Date(v) >= new Date(this.itemData.start_plan) || 'End plan must be after start plan',
      ],
    };
  },
  computed :{
    userLogin() {
      return this.$store.getters.getUser
    }
  },
  watch: {
    dialog(newValue) {
      if (newValue) {
        this.call_plan_id = this.$route.params.id
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
          // Ensure outlet_id format matches the selection type
          if (this.isEdit && Array.isArray(this.itemData.outlet_id)) {
            this.itemData.outlet_id = this.itemData.outlet_id[0] || null;
          } else if (!this.isEdit && !Array.isArray(this.itemData.outlet_id)) {
            this.itemData.outlet_id = this.itemData.outlet_id ? [this.itemData.outlet_id] : [];
          }
        } else {
          this.resetForm();
        }
      },
    },
  },
  mounted() {
    this.fetchOutlets();
    this.fetchUsers();
  },
  methods: {
    getOutletText(item) {
      return `${item.outlet_code} - ${item.name} - ${item.region} - ${item.area}`;
    },
    resetForm() {
      this.itemData = {
        outlet_id: [],
        notes: '',
        start_plan: '',
        end_plan: '',
      };
      this.formValid = false;
      // Check if the form reference exists before calling resetValidation
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
        this.itemData.call_plan_id = this.$route.params.id;
        this.$emit("save", { ...this.itemData });
      }
    },
    async fetchUsers () {
      const response = await getAllRole(this.userLogin.region , this.userLogin.area)
      this.userOptions = response.data
    },
    async fetchOutlets () {
      const response = await getOutletByType();
      this.outletsOptions = response.data
    },
    onUserChange(user) {
      // Handle user selection change
      if (user) {
        this.itemData.user_id = user.id;
      } else {
        this.itemData.user_id = null;
      }
    },
  },
};
</script>

<style scoped>
/* Additional styles if necessary */
</style>
