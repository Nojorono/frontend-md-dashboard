<template>
  <v-dialog
    v-model="dialog"
    max-width="800"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEdit ? "Edit Call Plan" : "Add New Call Plan" }}</span>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="form"
          v-model="formValid"
        >
          <v-row>
            <v-col sm="6" md="6" lg="6" xl="6">
              <!-- User Selection using v-autocomplete -->
              <v-autocomplete
                v-model="itemData.user_id"
                :items="userOptions"
                item-text="name"
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
              <!-- Region Input -->
              <v-autocomplete
                v-model="itemData.region"
                :items="regionOptions"
                item-text="name"
                item-value="name"
                label="Region"
                clearable
                return-object
                :rules="regionRules"
                @change="onRegionChange"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>Region not found</v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>

              <!-- Area Input -->
              <v-autocomplete
                v-model="itemData.area"
                :items="areaOptions"
                item-text="name"
                item-value="name"
                label="Area"
                clearable
                return-object
                :rules="areaRules"
                @change="onAreaChange"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>Area not found</v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>
              <!-- Area Input -->
            </v-col>
            <v-col sm="6" md="6" lg="6" xl="6">
              <!-- Code Call Plan -->
              <v-text-field
                v-model="itemData.code_call_plan"
                label="Code Call Plan"
                :rules="codeCallPlanRules"
                required
              />
              <!-- Start Plan -->
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
  import { getOutletArea, getOutletRegion } from '@/api/masterOutletService'
  import { getAllRole } from '@/api/userService'

  export default {
    name: "FormCallPlan",
    props: {
      dialog: Boolean,
      isEdit: Boolean,
      item: Object,
    },
    data() {
      return {
        itemData: {
          user_id: null,
          code_call_plan: '',
          area: '',
          region: '',
          start_plan: '',
          end_plan: '',
        },
        formValid: false,
        startPlanMenu: false,
        endPlanMenu: false,
        userOptions: [], // This will hold the user options (replace with real data)
        regionOptions: [],
        areaOptions: [],
        userRules: [
          (v) => !!v || "User is required", // Add validation for user selection
        ],
        codeCallPlanRules: [
          (v) => !!v || "Code Call Plan is required",
          (v) => v.length <= 20 || "Code must be less than 20 characters"
        ],
        regionRules: [
          (v) => !!v || "Region is required",
        ],
        areaRules: [
          (v) => !!v || "Area is required",
        ],
      };
    },
    computed :{
      userLogin() {
        return this.$store.getters.getUser
      }
    },
    watch: {
      item: {
        immediate: true,
        handler(newItem) {
          if (newItem) {
            this.itemData = { ...newItem }; // Populate form with item data when editing
          } else {
            this.resetForm(); // Reset form for new item
          }
        },
      },
    },
    mounted() {
      this.fetchUsers(); // Fetch user data to populate select options
      this.fetchRegion()
      this.fetchArea()
    },
    methods: {
      resetForm() {
        this.itemData = {
          user_id: null,
          code_call_plan: '',
          area: '',
          region: '',
        };
        this.formValid = false;
      },
      closeDialog() {
        this.resetForm();
        this.$emit("close");
      },
      saveItem() {
        if (this.$refs.form.validate()) {
          this.$emit("save", { ...this.itemData });
          this.closeDialog();
        }
      },
      async fetchUsers () {
        console.log(this.userLogin.region, this.userLogin.area)
        // Fetch users from API or other sources
        const response = await getAllRole(this.userLogin.region , this.userLogin.area)
        console.log(response)
        this.userOptions = response.data
      },
      async fetchArea() {
        this.loading = true;
        try {
          const response = await getOutletArea();
          this.areaOptions = response.data;
        } catch (error) {
          console.error("Error fetching :", error);
        } finally {
          this.loading = false;
        }
      },
      async fetchRegion() {
        this.loading = true;
        try {
          const response = await getOutletRegion();
          this.regionOptions = response.data;
        } catch (error) {
          console.error("Error fetching :", error);
        } finally {
          this.loading = false;
        }
      },
      onUserChange(user) {
        // Handle user selection change
        if (user) {
          this.itemData.user_id = user.id; // Store the selected user ID
        } else {
          this.itemData.user_id = null; // Reset if no user selected
        }
      },
      onRegionChange(item) {
        if (item) {
          this.itemData.region = item.name;
        } else {
          this.itemData.region = null;
        }
      },
      onAreaChange(item) {
        if (item) {
          this.itemData.area = item.name;
        } else {
          this.itemData.area = null;
        }
      },
    },
  };
</script>

<style scoped>
/* Additional styles if necessary */
</style>
