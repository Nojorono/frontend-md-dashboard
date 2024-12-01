<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEdit ? "Edit User" : "Add New User" }}</span>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="form"
          v-model="formValid"
        >
          <v-row>
            <v-col
              sm="6"
              md="6"
              lg="6"
              xl="6"
            >
              <!-- Username Input -->
              <v-text-field
                v-model="itemData.username"
                :rules="usernameRules"
                label="Username"
                required
              />
              <!-- Fullname Input -->
              <v-text-field
                v-model="itemData.fullname"
                :rules="fullnameRules"
                label="Full Name"
                required
              />

              <!-- Email Input -->
              <v-text-field
                v-model="itemData.email"
                :rules="emailRules"
                label="Email"
                required
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
              />

              <!-- Type MD Input -->
              <v-select
                v-model="itemData.type_md"
                :items="typeMD"
                clearable
                label="Type MD"
              />
            </v-col>
            <v-col
              sm="6"
              md="6"
              lg="6"
              xl="6"
            >
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
                item-text="area"
                item-value="area"
                label="Area"
                clearable
                return-object
                chips
                required
                @change="onAreaChange"
                :rules="areaRules"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>Area not found</v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>
              <!-- Area Input -->
              <v-autocomplete
                v-model="itemData.user_role_id"
                :items="rolesOptions"
                item-text="name"
                item-value="id"
                label="Role"
                clearable
                return-object
                :rules="roleRules"
                required
                @change="onRoleChange"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>Area not found</v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>
              <v-menu
                ref="validStartMenu"
                v-model="validStartMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                min-width="290px"
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
                  />
                </template>
                <v-date-picker
                  v-model="itemData.valid_from"
                  style="margin: 0;"
                  required
                  @input="validStartMenu = false"
                />
              </v-menu>

              <!-- End Plan -->
              <v-menu
                ref="validEndMenu"
                v-model="validEndMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="itemData.valid_to"
                    label="Valid To"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    :rules="dateRules"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="itemData.valid_to"
                  style="margin: 0;"
                  required
                  @input="validEndMenu = false"
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
import { getAllArea, getAllRegion} from '@/api/regionAreaService'
import { getAllList } from '@/api/masterRoleService'
import {mapGetters} from "vuex";

  export default {
    name: "FormUser",
    props: {
      dialog: Boolean,
      isEdit: Boolean,
      item: Object,
    },
    data() {
      return {
        itemData: {
          username: '',
          user_role_id: '',
          fullname: '',
          email: '',
          phone: '',
          type_md: '',
          area: '',
          region: '',
          valid_from: '',
          valid_to: '',
        },
        regionOptions: [],
        areaOptions: [],
        rolesOptions: [],
        typeMD : [
          'MOTOR', 'MOBIL'
        ],
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

        regionRules: [
          (v) => !!v || "Region is required",
        ],
        areaRules: [
          (v) => !!v || "Area is required",
        ],
        roleRules: [
          (v) => !!v || "Role is required",
        ],
        dateRules: [
          (v) => !!v || "Valid is required",
        ],
      };
    },
    computed: {
      ...mapGetters(['getUser']),
    },
    watch: {
      item: {
        immediate: true,
        handler(newItem) {
          if (newItem) {
            this.itemData = {
              ...newItem
            };
          } else {
            this.resetForm();
          }
        },
      },
    },
    mounted () {
      this.fetchRegion()
      this.fetchArea()
      this.fetchRoles()
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
          if (Array.isArray(this.getUser.area) && this.getUser.area.length > 0) {
            this.areaOptions = response.data.data.filter(
              (area) => this.getUser.area.includes(area.area)
            );
          } else {
            this.areaOptions = response.data.data;
          }
          if (this.areaOptions.length === 1) {
            this.itemData.area = [this.areaOptions[0]];
          }
        } catch (error) {
          console.error("Error fetching :", error);
        } finally {
          this.loading = false;
        }
      },
      async fetchRegion() {
        this.loading = true;
        try {
          const response = await getAllRegion();
          if (this.getUser.region) {
            this.regionOptions = response.data.data.filter(
              (region) => region.name === this.getUser.region
            );
          } else {
            this.regionOptions = response.data.data;
          }
          if (this.regionOptions.length === 1) {
            this.itemData.region = this.regionOptions[0].name;
          }
        } catch (error) {
          console.error("Error fetching :", error);
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
          console.error("Error fetching :", error);
        } finally {
          this.loading = false;
        }
      },
      resetForm() {
        this.itemData = {
          username: '',
          user_role_id: '',
          fullname: '',
          email: '',
          phone: '',
          type_md: '',
          area: '',
          region: '',
          valid_from: '',
          valid_to: '',
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
          const formattedData = {
            ...this.itemData,
            area: [this.itemData.area],
          };
          this.$emit("save", formattedData);
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
          this.itemData.area = item.area;
        } else {
          this.itemData.area = [];
        }
      },
      onRoleChange(item) {
        if (item) {
          this.itemData.user_role_id = item.id;
        } else {
          this.itemData.user_role_id = null;
        }
      },
    },
  };
</script>
