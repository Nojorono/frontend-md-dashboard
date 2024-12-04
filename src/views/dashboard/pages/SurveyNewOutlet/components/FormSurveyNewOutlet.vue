<template>
  <v-dialog
    v-model="dialog"
    max-width="1000px"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEdit ? "Edit Survey" : "Add New Survey" }}</span>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="form"
          v-model="formValid"
        >
          <v-row>
            <!-- Left Column -->
            <v-col
              sm="6"
              md="6"
              lg="6"
              xl="6"
            >
              <!-- Batch Code -->
              <v-text-field
                v-model="itemData.batch_code"
                label="Batch Code"
                readonly
              />
              <!-- Name -->
              <v-text-field
                v-model="itemData.name"
                :rules="rules.nameRules"
                label="Nama Toko"
                required
              />
              <!-- Outlet Code -->
              <v-text-field
                v-model="itemData.outlet_code"
                label="Outlet Code SFA"
              />

              <!-- SIO Type -->
              <v-autocomplete
                v-model="itemData.sio_type"
                :items="sioTypeOptions"
                item-text="name"
                item-value="name"
                label="Sio Type"
                clearable
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>Sio not found</v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>

              <!-- Region -->
              <v-autocomplete
                v-model="itemData.region"
                :items="regionOptions"
                item-text="name"
                item-value="name"
                label="Region"
                clearable
                @change="onRegionChange"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>Region not found</v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>

              <!-- Area -->
              <v-autocomplete
                v-model="itemData.area"
                :items="areaOptions"
                item-text="area"
                item-value="area"
                label="Area"
                clearable
                @change="onAreaChange"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>Area not found</v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>

              <!-- Brand -->
              <v-autocomplete
                v-model="itemData.brand"
                :items="brandOptions"
                item-text="brand"
                item-value="brand"
                label="Brand"
                clearable
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>Brands not found</v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>

              <!-- Address Line -->
              <v-text-field
                v-model="itemData.address_line"
                label="Alamat Toko"
              />

              <!-- Sub-District -->
              <v-text-field
                v-model="itemData.sub_district"
                label="Kecamatan"
              />
              <!-- District -->
              <!-- City or Regency -->
              <v-text-field
                v-model="itemData.city_or_regency"
                label="Kab/Kota"
              />

              <!-- Postal Code -->
              <v-text-field
                v-model="itemData.postal_code"
                label="Kode Pos"
                type="number"
              />

              <!-- Photos -->
              <!-- <template>
                <v-text-field
                  label="Photos"
                  readonly
                />
                <div>
                  <vue-dropzone
                    v-model="itemData.photos"
                    id="dropzone"
                    :options="dropzoneOptions"
                    @vdropzone-success="handleDropzoneSuccess"
                    @vdropzone-removed-file="handleFileRemove"
                  />
                </div>
              </template> -->
            </v-col>

            <!-- Right Column -->
            <v-col
              sm="6"
              md="6"
              lg="6"
              xl="6"
            >
              <!-- Latitude -->
              <v-text-field
                v-model="itemData.latitude"
                label="Latitude"
              />

              <!-- Longitude -->
              <v-text-field
                v-model="itemData.longitude"
                label="Longitude"
              />

              <!-- Cycle -->
              <v-text-field
                v-model="itemData.cycle"
                label="Cycle"
              />

              <!-- Visit Day -->
              <v-select
                v-model="itemData.visit_day"
                :items="visitOptions"
                label="Hari Kunjungan"
                clearable
              />

              <!-- Odd/Even -->
              <v-select
                v-model="itemData.odd_even"
                :items="oddEvenOptions"
                label="Ganjil/Genap"
                clearable
              />

              <!-- Remarks -->
              <v-text-field
                v-model="itemData.remarks"
                label="Remarks"
              />

              <!-- Outlet ID -->
              <v-autocomplete
                v-model="itemData.outlet_id"
                :items="outletOptions"
                item-text="name"
                item-value="id"
                label="Outlet yang diganti"
                clearable
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>Outlet not found</v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>

              <template>
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
                        alt="asdasd"
                      >
                      <button
                        class="delete-button"
                        @click="deleteImage(index)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </button>
                    </div>
                  </div>
                </div>
              </template>
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
import {mapGetters} from "vuex";
import {findLast} from "@/api/batchService";
// import Vue2Dropzone from 'vue2-dropzone'
// import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import {deleteImageS3} from "@/api/S3Service";
import {getAllSio} from "@/api/sioService";
import {getAllBrand} from "@/api/brandService";
import {getAllOutletSurvey} from "@/api/masterOutletService";



export default {
  name: "FormSurveyNewOutlet",
  components: {
    // vueDropzone: Vue2Dropzone
  },
  props: {
    dialog: Boolean,
    isEdit: Boolean,
    item: Object(),
  },
  data() {
    return {
      apiUrl: process.env.VUE_APP_API_URL,
      itemData : {
        name: '',
        batch_code: '',
        brand: '',
        address_line: '',
        sub_district: '',
        district: '',
        city_or_regency: '',
        postal_code: null,
        latitude: '',
        longitude: '',
        outlet_code: '',
        sio_type: '',
        region: '',
        area: '',
        cycle: '',
        visit_day: '',
        odd_even: '',
        remarks: '',
        photos: [],
        outlet_id: null,
        is_approved: 0,
      },
      map: null,
      marker: null,
      visitOptions: [
        "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU", "MINGGU"
      ],
      oddEvenOptions: [ "GANJIL", "GENAP" ],
      outletOptions: [],
      brandOptions: [],
      sioTypeOptions: [],
      regionOptions: [],
      areaOptions: [],
      rolesOptions: [],
      formValid: false,
      dropzoneOptions: {
        url: `http://localhost:9001/api/v1/images/upload`,
        thumbnailWidth: 150,
        addRemoveLinks: true,
        dictDefaultMessage: `<span class="mdi mdi-upload-multiple"></span>`,
        maxFilesize: 2,
        parallelUploads: 5,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
          keyDirectory: 'new-survey',
        },
      },
      rules: {
        rulesName: [(v) => !!v || 'Name is required'],
        rulesBatchCode: [(v) => !!v || 'Batch code is required'],
        rulesBrand: [(v) => !!v || 'Brand is required'],
        rulesAddressLine: [(v) => !!v || 'Address line is required'],
        rulesSubDistrict: [(v) => !!v || 'Sub-district is required'],
        rulesDistrict: [(v) => !!v || 'District is required'],
        rulesCityOrRegency: [(v) => !!v || 'City or regency is required'],
        rulesPostalCode: [
          (v) => !!v || 'Postal code is required',
          (v) => /^[0-9]+$/.test(v) || 'Postal code must be numeric',
        ],
        rulesLatitude: [(v) => !!v || 'Latitude is required'],
        rulesLongitude: [(v) => !!v || 'Longitude is required'],
        rulesOutletCode: [(v) => !!v || 'Outlet code is required'],
        rulesSioType: [(v) => !!v || 'SIO Type is required'],
        rulesRegion: [(v) => !!v || 'Region is required'],
        rulesArea: [(v) => !!v || 'Area is required'],
        rulesCycle: [(v) => !!v || 'Cycle is required'],
        rulesVisitDay: [(v) => !!v || 'Visit day is required'],
        rulesOddEven: [(v) => !!v || 'Odd/even is required'],
        rulesRemarks: [],
        rulesPhotos: [],
        rulesRangeHealthFacilities: [
          (v) => !!v || 'Range to health facilities is required',
          (v) => v >= 0 || 'Range must be positive',
        ],
        rulesRangeWorkPlace: [
          (v) => !!v || 'Range to work place is required',
          (v) => v >= 0 || 'Range must be positive',
        ],
        rulesRangePublicTransportationFacilities: [
          (v) => !!v || 'Range to public transportation is required',
          (v) => v >= 0 || 'Range must be positive',
        ],
        rulesRangeWorshipFacilities: [
          (v) => !!v || 'Range to worship facilities is required',
          (v) => v >= 0 || 'Range must be positive',
        ],
        rulesRangePlaygroundFacilities: [
          (v) => !!v || 'Range to playground facilities is required',
          (v) => v >= 0 || 'Range must be positive',
        ],
        rulesRangeEducationalFacilities: [
          (v) => !!v || 'Range to educational facilities is required',
          (v) => v >= 0 || 'Range must be positive',
        ],
        rulesOutletId: [
          (v) => !!v || 'Outlet ID is required',
          (v) => /^[0-9]+$/.test(v) || 'Outlet ID must be numeric',
        ],
        rulesStatus: [(v) => !!v || 'Status is required'],
        rulesCreatedBy: [(v) => !!v || 'Created by is required'],
        rulesCreatedAt: [
          (v) => !!v || 'Created date is required',
          (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) || 'Date must be in YYYY-MM-DD format',
        ],
      },
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
    this.fetchBatch()
    this.fetchSio()
    this.fetchBrand()
    this.fetchOutletSurvey()
  },
  methods: {
    deleteImage(index) {
      const photo = this.itemData.photos[index];
      this.itemData.photos.splice(index, 1);
      this.removeImageFromServer(photo.url);
    },
    handleDropzoneSuccess(file, response) {
      this.itemData.photos.push({
        name: file.upload.uuid,
        url: response.data.url,
      });
    },
    handleFileRemove(file) {
      const fileToRemove = this.itemData.photos.find(f => f.name === file.upload.uuid);
      this.removeImageFromServer(fileToRemove.url);
      this.itemData.photos = this.itemData.photos.filter(f => f.name !== file.upload.uuid);
    },
    async removeImageFromServer(key) {
      try {
        await deleteImageS3(key)
      } catch (error) {
        console.error('Error deleting image from server:', error);
      }
    },
    async fetchSio() {
      this.loading = true;
      try {
        const response = await getAllSio();
        this.sioTypeOptions = response.data.data;
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchOutletSurvey() {
      this.loading = true;
      try {
        const response = await getAllOutletSurvey();
        this.outletOptions = response.data.data;
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchBrand() {
      this.loading = true;
      try {
        const response = await getAllBrand();
        this.brandOptions = response.data.data;
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchArea() {
      this.loading = true;
      try {
        const response = await getAllArea();
        if (this.getUser.area > 0) {
          this.areaOptions = response.data.data.filter(
            (area) => this.getUser.area.includes(area.area)
          );
        } else {
          this.areaOptions = response.data.data;
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
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchBatch() {
      this.loading = true;
      try {
        const response = await findLast();
        this.itemData.batch_code = response.data.code_batch;
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.itemData = {
        name: '',
        batch_code: '',
        brand: '',
        address_line: '',
        sub_district: '',
        district: '',
        city_or_regency: '',
        postal_code: null,
        latitude: '',
        longitude: '',
        outlet_code: '',
        sio_type: '',
        region: '',
        area: '',
        cycle: '',
        visit_day: '',
        odd_even: '',
        remarks: '',
        photos: [],
        // range_health_facilities: null,
        // range_work_place: null,
        // range_public_transportation_facilities: null,
        // range_worship_facilities: null,
        // range_playground_facilities: null,
        // range_educational_facilities: null,
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
      if (item) {
        this.itemData.region = item;
      } else {
        this.itemData.region = null;
      }
    },
    onAreaChange(item) {
      if (item) {
        this.itemData.area = item;
      } else {
        this.itemData.area = null;
      }
    },
    saveItem() {
      if (this.$refs.form.validate()) {
        const formattedData = {
          ...this.itemData
        };
        this.$emit("save", formattedData);
      }
    },
  },
};
</script>
<style>
.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.image-container {
  position: relative;
  width: 150px;
  height: 150px;
}
.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}
.delete-button {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}
.delete-button:hover {
  background: rgba(250, 21, 21, 0.72);
}
</style>
