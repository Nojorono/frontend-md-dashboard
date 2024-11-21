<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEdit ? "Edit Batch Target" : "Add Batch Target" }}</span>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="form"
          v-model="formValid"
        >
          <template v-if="!isEdit">
            <!-- Brand Input -->
            <v-autocomplete
              v-model="itemDataReplace.sio"
              :items="sioOptions"
              item-text="name"
              item-value="name"
              label="Sio"
              clearable
              return-object
              @change="onSioChange"
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-content>Sio not found</v-list-item-content>
                </v-list-item>
              </template>
            </v-autocomplete>
            <!-- Brand Input -->
            <v-autocomplete
              v-model="itemDataReplace.brand"
              :items="brandOptions"
              item-text="brand"
              item-value="brand"
              label="Brand"
              clearable
              return-object
              @change="onBrandChange"
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-content>Brand not found</v-list-item-content>
                </v-list-item>
              </template>
            </v-autocomplete>
            <!-- Region Input -->
            <v-autocomplete
              v-model="itemDataReplace.region"
              :items="regionOptions"
              item-text="name"
              item-value="name"
              label="Region"
              clearable
              return-object
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
              v-model="itemDataReplace.area"
              :items="areaOptions"
              item-text="area"
              item-value="area"
              label="Area"
              clearable
              return-object
              @change="onAreaChange"
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-content>Area not found</v-list-item-content>
                </v-list-item>
              </template>
            </v-autocomplete>
          </template>
          <template v-else>
            <v-text-field
              v-model="itemData.regional"
              :rules="requiredRules"
              label="Region"
              readonly
              required
            />
            <v-text-field
              v-model="itemData.amo"
              :rules="requiredRules"
              label="Area"
              readonly
              required
            />
          </template>
          <v-text-field
            v-model="itemData.brand_type_sio"
            :rules="requiredRules"
            label="Brand Type Sio"
            readonly
            required
          />
          <v-text-field
            v-model="itemData.amo_brand_type"
            :rules="requiredRules"
            label="Amo Brand Type"
            readonly
            required
          />
          <v-text-field
            v-model="itemData.allocation_ho"
            :rules="requiredRules"
            label="Allocation Ho"
            required
          />
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
import {getAllArea, getAllBrand, getAllRegion, getAllSio} from "@/api/constantService";

export default {
  name: "FormBatchTarget",
  props: {
    dialog: Boolean,
    isEdit: Boolean,
    item: Object,
  },
  data() {
    return {
      itemData: {
        batch_id: 0,
        regional: '',
        amo: '',
        brand_type_sio: '',
        amo_brand_type: '',
        allocation_ho: 0,
      },
      itemDataReplace: {
        brand: '',
        sio: '',
        region: '',
        area: '',
      },
      isFullyPopulated: false,
      regionOptions: [],
      areaOptions: [],
      brandOptions: [],
      sioOptions: [],
      formValid: false,
      requiredRules: [
        (v) => !!v || "required!",
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
          };
        } else {
          this.resetForm();
        }
      },
    },
    itemDataReplace: {
      handler() {
        if (!this.isEdit){
          this.checkFullyPopulated();
        }
      },
      deep: true,
    },
  },
  mounted() {
    if (!this.isEdit) {
      this.fetchRegion()
      this.fetchArea()
      this.fetchSio()
      this.fetchBrand()
    }
  },
  methods: {
    checkFullyPopulated() {
      // Check if all fields in itemDataReplace are filled
      this.isFullyPopulated = Object.values(this.itemDataReplace).every(
        (value) => value?.trim() !== ''
      );

      if (this.isFullyPopulated) {
        this.itemData.amo = this.itemDataReplace.area;
        this.itemData.regional = this.itemDataReplace.region;
        this.itemData.brand_type_sio = `${this.itemDataReplace.brand}-${this.itemDataReplace.sio}`;
        this.itemData.amo_brand_type = `${this.itemDataReplace.area}-${this.itemDataReplace.brand}-${this.itemDataReplace.sio}`;
      }
    },
    async fetchSio() {
      this.loading = true;
      try {
        const response = await getAllSio();
        this.sioOptions = response.data.data;
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
        this.areaOptions = response.data.data;
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
        this.regionOptions = response.data.data;
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        this.loading = false;
      }
    },
    onSioChange(item) {
      if (item) {
        this.itemDataReplace.sio = item.name;
      } else {
        this.itemDataReplace.sio = null;
      }
    },
    onBrandChange(item) {
      if (item) {
        this.itemDataReplace.brand = item.brand;
      } else {
        this.itemDataReplace.brand = null;
      }
    },
    onRegionChange(item) {
      if (item) {
        this.itemDataReplace.region = item.name;
      } else {
        this.itemDataReplace.region = null;
      }
    },
    onAreaChange(item) {
      if (item) {
        this.itemDataReplace.area = item.area;
      } else {
        this.itemDataReplace.area = null;
      }
    },
    resetForm() {
      this.itemData = {
        batch_id: 0,
        regional: '',
        amo: '',
        brand_type_sio: '',
        amo_brand_type: '',
        allocation_ho: 0,
      };
      if (!this.isEdit){
        this.itemDataReplace = {
          brand: '',
          sio: '',
          region: '',
          area: '',
        }
      }
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
          ...this.itemData
        };
        this.$emit("save", formattedData);
        this.closeDialog();
      }
    },
  },
};
</script>
