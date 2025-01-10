<template>
  <v-dialog v-model="dialog" max-width="600px" @click:outside="closeDialog">
    <v-card>
      <v-card-title>
        <span class="headline">{{
          isEdit ? "Edit User" : "Add New User"
        }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="formValid">
          <v-row>
            <v-col sm="6" md="6" lg="6" xl="6">
              <!-- Username Input -->
              <v-text-field
                v-model="itemData.username"
                :rules="usernameRules"
                label="Username"
                required
                outlined
                dense
              />
              <!-- Fullname Input -->
              <v-text-field
                v-model="itemData.fullname"
                :rules="fullnameRules"
                label="Full Name"
                required
                outlined
                dense
              />

              <!-- Email Input -->
              <v-text-field
                v-model="itemData.email"
                :rules="emailRules"
                label="Email"
                required
                outlined
                dense
              />

              <!-- Phone Input -->
              <v-text-field
                v-model="itemData.phone"
                :rules="phoneRules"
                label="Phone"
                type="tel"
                maxlength="20"
                @keypress="isNumber"
                required
                outlined
                dense
              />

              <!-- Type MD Input -->
              <v-select
                v-model="itemData.type_md"
                :items="typeMD"
                clearable
                label="Type MD"
                outlined
                dense
              />
            </v-col>
            <v-col sm="6" md="6" lg="6" xl="6">
              <!-- Region Input -->
              <v-autocomplete
                v-model="itemData.region"
                :items="regionOptions"
                item-text="name"
                item-value="name"
                label="Region"
                clearable
                :rules="regionRules"
                @update:search-input="onRegionChange"
                outlined
                dense
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
                :items="filteredAreaOptions"
                item-text="area"
                item-value="area"
                label="Area"
                chips
                deletable-chips
                required
                :rules="areaRules"
                outlined
                dense
                multiple
                :disabled="!itemData.region"
                @change="onAreaChange"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>
                      {{ !itemData.region ? 'Please select a region first' : 'Area not found' }}
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>

              <!-- Role Input -->
              <v-autocomplete
                v-model="itemData.user_role_id"
                :items="rolesOptions"
                item-text="name"
                item-value="id"
                label="Role"
                clearable
                :rules="roleRules"
                required
                @change="onRoleChange"
                outlined
                dense
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>Role not found</v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>

              <!-- Valid From Date -->
              <v-menu
                ref="validStartMenu"
                v-model="validStartMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                min-width="290px"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="itemData.valid_from"
                    label="Valid From"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    :rules="dateRules"
                    v-on="on"
                    outlined
                    dense
                  />
                </template>
                <v-date-picker
                  v-model="itemData.valid_from"
                  @input="validStartMenu = false"
                  :min="new Date().toISOString().substr(0, 10)"
                />
              </v-menu>

              <!-- Valid To Date -->
              <v-menu
                ref="validEndMenu"
                v-model="validEndMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                min-width="290px"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="itemData.valid_to"
                    label="Valid To"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    :rules="[...dateRules, validEndDateRule]"
                    v-on="on"
                    outlined
                    dense
                  />
                </template>
                <v-date-picker
                  v-model="itemData.valid_to"
                  @input="validEndMenu = false"
                  :min="
                    itemData.valid_from ||
                    new Date().toISOString().substr(0, 10)
                  "
                />
              </v-menu>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="grey darken-1" text @click="closeDialog"> Cancel </v-btn>
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="!formValid"
          @click="saveItem"
        >
          {{ isEdit ? "Save Changes" : "Add User" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { getAllArea, getAllRegion } from "@/api/regionAreaService";
import { getAllList } from "@/api/masterRoleService";
import { mapGetters } from "vuex";

export default {
  name: "FormUser",
  props: {
    dialog: Boolean,
    isEdit: Boolean,
    item: Object,
  },
  data() {
    return {
      loading: false,
      itemData: {
        id: null,
        username: "",
        user_role_id: null,
        fullname: "",
        email: "",
        phone: "",
        type_md: "",
        area: [],
        region: "",
        valid_from: "",
        valid_to: "",
      },
      regionOptions: [],
      areaOptions: [],
      rolesOptions: [],
      typeMD: ["MOTOR", "MOBIL"],
      formValid: false,
      validStartMenu: false,
      validEndMenu: false,
      usernameRules: [
        (v) => !!v || "Username is required",
        (v) => v.length >= 2 || "Username must be at least 2 characters",
        (v) => v.length <= 50 || "Username must be less than 50 characters",
      ],
      fullnameRules: [
        (v) => !!v || "FullName is required",
        (v) => v.length >= 2 || "Username must be at least 2 characters",
        (v) => v.length <= 50 || "Full Name must be less than 50 characters",
      ],
      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
        (v) => v.length <= 60 || "Email must be less than 60 characters",
      ],
      phoneRules: [
        (v) => !!v || "Phone number is required",
        (v) => /^[0-9]*$/.test(v) || "Phone number must contain only numbers",
        (v) => v.length <= 20 || "Phone number must be less than 20 characters",
      ],
      regionRules: [(v) => !!v || "Region is required"],
      areaRules: [(v) => !!v || "Area is required"],
      roleRules: [(v) => !!v || "Role is required"],
      dateRules: [(v) => !!v || "Date is required"],
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
    validEndDateRule() {
      return (v) =>
        !this.itemData.valid_from ||
        !v ||
        v >= this.itemData.valid_from ||
        "Valid To date must be after Valid From date";
    },
    filteredAreaOptions() {
      if (!this.itemData.region) return [];
      
      const selectedRegion = this.regionOptions.find(
        (region) => region.name === this.itemData.region
      );
      
      if (!selectedRegion) return [];
      
      return this.areaOptions.filter(
        (area) => area.region_id === selectedRegion.id
      );
    }
  },
  watch: {
    item: {
      immediate: true,
      handler(newItem) {
        if (newItem) {
          let parsedArea;
          try {
            parsedArea = typeof newItem.area === 'string' ? 
              JSON.parse(newItem.area) : 
              Array.isArray(newItem.area) ? 
                newItem.area : [];
          } catch (e) {
            parsedArea = [];
            console.error('Error parsing area:', e);
          }

          this.itemData = {
            id: newItem.id || null,
            username: newItem.username || "",
            user_role_id: newItem.user_role_id || null,
            fullname: newItem.fullname || "",
            email: newItem.email || "",
            phone: newItem.phone || "",
            type_md: newItem.type_md || "",
            area: parsedArea,
            region: newItem.region || "",
            valid_from: newItem.valid_from || "",
            valid_to: newItem.valid_to || "",
          };
        } else {
          this.resetForm();
        }
      },
    },
    'itemData.region': {
      handler(newVal, oldVal) {
        if (newVal !== oldVal && !this.isEdit) {
          this.itemData.area = [];
        }
      }
    }
  },
  async mounted() {
    await Promise.all([
      this.fetchRegion(),
      this.fetchArea(),
      this.fetchRoles(),
    ]);
  },
  methods: {
    isNumber(event) {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    },
    async fetchArea() {
      this.loading = true;
      try {
        const response = await getAllArea();
        this.areaOptions = response.data.data;
      } catch (error) {
        console.error("Error fetching areas:", error);
        this.$toast.error("Failed to fetch areas");
      } finally {
        this.loading = false;
      }
    },
    async fetchRegion() {
      this.loading = true;
      try {
        const response = await getAllRegion();
        this.regionOptions = response.data.data;
      } catch (error) {
        console.error("Error fetching regions:", error);
        this.$toast.error("Failed to fetch regions");
      } finally {
        this.loading = false;
      }
    },
    async fetchRoles() {
      this.loading = true;
      try {
        const response = await getAllList();
        this.rolesOptions = response.data;
      } catch (error) {
        console.error("Error fetching roles:", error);
        this.$toast.error("Failed to fetch roles");
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.itemData = {
        id: null,
        username: "",
        user_role_id: null,
        fullname: "",
        email: "",
        phone: "",
        type_md: "",
        area: [],
        region: "",
        valid_from: "",
        valid_to: "",
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
          ...this.itemData,
          area: JSON.stringify(this.itemData.area)
        };
        this.$emit("save", formattedData);
        this.closeDialog();
      }
    },
    onRegionChange(item) {
      if (!item) {
        this.itemData.region = "";
        if (!this.isEdit) {
          this.itemData.area = [];
        }
      } else {
        if (!this.isEdit) {
          this.itemData.area = [];
        }
        this.itemData.region = item;
      }
    },
    onAreaChange(selectedAreas) {
      if (!selectedAreas) {
        this.itemData.area = [];
      }
    },
    onRoleChange(item) {
      if (item) {
        this.itemData.user_role_id = item;
      } else {
        this.itemData.user_role_id = null;
      }
    },
  },
};
</script>
