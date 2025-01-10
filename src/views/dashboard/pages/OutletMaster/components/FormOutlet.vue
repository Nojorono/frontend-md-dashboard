<template>
    <v-dialog
      v-model="dialog"
      max-width="1000px"
      @click:outside="closeDialog"
      @keydown.esc="closeDialog"
    >
      <v-card class="form-card">
        <v-card-title class="primary white--text py-4 rounded-t">
          <span class="headline">{{
            isEdit ? "Edit Survey" : "Add New Survey"
          }}</span>
        </v-card-title>
  
        <v-card-text class="pa-6">
          <v-form ref="form" v-model="formValid">
            <v-row>
              <v-col sm="6" md="6" lg="6" xl="6">
                <v-card flat class="pa-4 rounded-lg">
                  <v-card-title class="px-0 pb-4">Store Information</v-card-title>

                  <v-text-field
                    v-model="itemData.name"
                    :rules="rules.nameRules"
                    label="Nama Toko"
                    required
                  />
  
                  <v-text-field
                    v-model="itemData.outlet_code"
                    label="Outlet Code"
                  />
  
                  <v-autocomplete
                    v-model="itemData.sio_type"
                    :items="getSioTypeOptions"
                    item-text="name"
                    item-value="name"
                    label="Sio Type"
                    clearable
                  >
                    <template #no-data>
                      <v-list-item>
                        <v-list-item-content>Sio not found</v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
  
                  <v-autocomplete
                    v-model="itemData.region"
                    :items="getRegionOptions"
                    item-text="name"
                    item-value="name"
                    label="Region"
                    clearable
                    @change="onRegionChange"
                  >
                    <template #no-data>
                      <v-list-item>
                        <v-list-item-content
                          >Region not found</v-list-item-content
                        >
                      </v-list-item>
                    </template>
                  </v-autocomplete>
  
                  <v-autocomplete
                    v-model="itemData.area"
                    :items="getAreaOptions"
                    item-text="area"
                    item-value="area"
                    label="Area"
                    clearable
                    @change="onAreaChange"
                  >
                    <template #no-data>
                      <v-list-item>
                        <v-list-item-content>Area not found</v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
  
                  <v-autocomplete
                    v-model="itemData.brand"
                    :items="getBrandOptions"
                    item-text="brand"
                    item-value="brand"
                    label="Brand"
                    clearable
                  >
                    <template #no-data>
                      <v-list-item>
                        <v-list-item-content
                          >Brands not found</v-list-item-content
                        >
                      </v-list-item>
                    </template>
                  </v-autocomplete>
  
                  <v-text-field
                    v-model="itemData.address_line"
                    label="Alamat Toko"
                  />
  
                  <v-text-field
                    v-model="itemData.sub_district"
                    label="Kecamatan"
                  />
  
                  <v-text-field
                    v-model="itemData.city_or_regency"
                    label="Kab/Kota"
                  />
  
                  <v-text-field
                    v-model="itemData.postal_code"
                    label="Kode Pos"
                    type="number"
                  />
                </v-card>
              </v-col>
  
              <v-col sm="6" md="6" lg="6" xl="6">
                <v-card flat class="pa-4 rounded-lg">
                  <v-card-title class="px-0 pb-4"
                    >Location & Schedule</v-card-title
                  >
  
                  <v-text-field v-model="itemData.latitude" label="Latitude" />
  
                  <v-text-field v-model="itemData.longitude" label="Longitude" />
  
                  <v-text-field v-model="itemData.cycle" label="Cycle" />
  
                  <v-select
                    v-model="itemData.visit_day"
                    :items="visitOptions"
                    label="Hari Kunjungan"
                    clearable
                  />
  
                  <v-select
                    v-model="itemData.odd_even"
                    :items="oddEvenOptions"
                    label="Ganjil/Genap"
                    clearable
                  />
  
                  <v-text-field v-model="itemData.remarks" label="Remarks" />
                </v-card>
              </v-col>
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
  import { mapGetters } from "vuex";
  
  export default {
    name: "FormOutlet",
  
    props: {
      dialog: Boolean,
      isEdit: Boolean,
      item: {
        type: Object,
        default: () => ({}),
      },
    },
  
    data() {
      return {
        itemData: {
          id: null,
          name: "",
          brand: "",
          address_line: "",
          sub_district: "",
          district: "",
          city_or_regency: "",
          postal_code: null,
          latitude: "",
          longitude: "",
          outlet_code: "",
          sio_type: "",
          region: "",
          area: "",
          cycle: "",
          visit_day: "",
          odd_even: "",
          remarks: "",
        },
        visitOptions: [
          "SENIN",
          "SELASA",
          "RABU",
          "KAMIS",
          "JUMAT",
          "SABTU",
          "MINGGU",
        ],
        oddEvenOptions: ["GANJIL", "GENAP"],
        brandOptions: [],
        sioTypeOptions: [],
        regionOptions: [],
        areaOptions: [],
        formValid: false,
        rules: {
          nameRules: [(v) => !!v || "Name is required"],
        },
      };
    },
  
    computed: {
      ...mapGetters([
        "getRegionOptions",
        "getAreaOptions",
        "getBrandOptions",
        "getSioTypeOptions",
      ]),
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
  
    mounted() {
    },
  
    methods: {
  
      resetForm() {
        this.itemData = {
          id: null,
          name: "",
          brand: "",
          address_line: "",
          sub_district: "",
          district: "",
          city_or_regency: "",
          postal_code: null,
          latitude: "",
          longitude: "",
          outlet_code: "",
          sio_type: "",
          region: "",
          area: "",
          cycle: "",
          visit_day: "",
          odd_even: "",
          remarks: "",
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
  
      onRegionChange(item) {
        this.itemData.region = item || null;
      },
  
      onAreaChange(item) {
        this.itemData.area = item || null;
      },
  
      saveItem() {
        if (this.$refs.form.validate()) {
          this.$emit("save", { ...this.itemData });
        }
      },
    },
  };
  </script>
  
  <style>
  .form-card {
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  </style>
  