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

            <v-col sm="6" md="6" lg="6" xl="6">
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
              />

              <!-- Type MD Input -->
              <v-select
                v-model="itemData.type_md"
                :items="typeMD"
                clearable
                label="Type MD"
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
              <v-autocomplete
                v-model="itemData.user_role_id"
                :items="rolesOptions"
                item-text="name"
                item-value="id"
                label="Role"
                clearable
                return-object
                :rules="roleRules"
                @change="onRoleChange"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>Area not found</v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>
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
  import { getAllList } from '@/api/masterRoleService'

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
        },
        regionOptions: [],
        areaOptions: [],
        rolesOptions: [],
        typeMD : [
          'MOTOR', 'MOBIL'
        ],
        formValid: false,
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
      };
    },
    watch: {
      item: {
        immediate: true,
        handler(newItem) {
          if (newItem) {
            this.itemData = {
              ...newItem,
              is_active: newItem.is_active === 1,
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
        // Only allow numbers (0-9)
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode < 48 || charCode > 57) {
          event.preventDefault();
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
      async fetchRoles() {
        this.loading = true;
        try {
          const response = await getAllList();
          console.log(response.data)
          this.rolesOptions = response.data.data;
        } catch (error) {
          console.error("Error fetching :", error);
        } finally {
          this.loading = false;
        }
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
      resetForm() {
        this.itemData = {
          username: '',
          fullname: '',
          email: '',
          phone: '',
          type_md: '',
          area: '',
          region: '',
          is_active: true,
        };
        this.formValid = false;
      },
      closeDialog() {
        this.resetForm();
        this.$emit("close");
      },
      saveItem() {
        if (this.$refs.form.validate()) {
          const formattedData = {
            ...this.itemData,
            is_active: this.itemData.is_active ? 1 : 0,
          };
          this.$emit("save", formattedData);
          this.closeDialog();
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
