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

                <v-autocomplete
                  v-model="itemData.outlet_id"
                  :items="outletOptions"
                  :item-text="getOutletText"
                  item-value="id"
                  label="Outlet yang diganti"
                  clearable
                >
                  <template #no-data>
                    <v-list-item>
                      <v-list-item-content
                        >Outlet not found</v-list-item-content
                      >
                    </v-list-item>
                  </template>
                </v-autocomplete>

                <v-text-field
                  v-model="itemData.batch_code"
                  label="Batch Code"
                  readonly
                />

                <v-text-field
                  v-model="itemData.name"
                  :rules="rules.nameRules"
                  label="Nama Toko"
                  required
                />

                <v-text-field
                  v-model="itemData.outlet_code"
                  label="Outlet Code SFA"
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

                <div v-if="isEdit">
                  <div class="image-gallery">
                    <div
                      v-for="(photo, index) in itemData.photos"
                      :key="index"
                      class="image-container"
                    >
                      <img
                        :src="`${decodeURIComponent(photo.url)}`"
                        class="image-preview"
                        alt="Store Photo"
                      />
                      <button class="delete-button" @click="deleteImage(index)">
                        <v-icon>mdi-delete</v-icon>
                      </button>
                    </div>
                  </div>
                </div>
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
import { deleteImageS3 } from "@/api/S3Service";
import { getAllOutletSurvey } from "@/api/masterOutletService";

export default {
  name: "FormSurveyNewOutlet",

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
      apiUrl: process.env.VUE_APP_API_URL,
      itemData: {
        name: "",
        batch_code: "",
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
        photos: [],
        outlet_id: null,
        is_approved: 0,
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
      outletOptions: [],
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
      "getUser",
      "getRegionOptions",
      "getAreaOptions",
      "getBrandOptions",
      "getSioTypeOptions",
      "getCodeBatch",
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
    this.fetchOutletSurvey();
    this.batchCode();
  },

  methods: {

    async batchCode() {
      this.itemData.batch_code = this.getCodeBatch.code_batch;
    },

    getOutletText(item) {
      return item
        ? `${item.outlet_code} - ${item.name} - ${item.region} - ${item.area} - ${item.sio_type} - ${item.brand}`
        : "";
    },

    async deleteImage(index) {
      const photo = this.itemData.photos[index];
      this.itemData.photos.splice(index, 1);
      await this.removeImageFromServer(photo.url);
    },

    async removeImageFromServer(key) {
      try {
        await deleteImageS3(key);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    },

    async fetchOutletSurvey() {
      try {
        const { data } = await getAllOutletSurvey();
        this.outletOptions = data.data;
      } catch (error) {
        console.error("Error fetching outlets:", error);
      }
    },

    resetForm() {
      this.itemData = {
        name: "",
        batch_code: "",
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
        photos: [],
        outlet_id: null,
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

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.image-container {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-button {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.delete-button:hover {
  background: rgba(244, 67, 54, 0.9);
  color: white;
}
</style>
