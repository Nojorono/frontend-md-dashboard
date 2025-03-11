<template>
  <v-dialog
    v-model="dialog"
    max-width="800"
    persistent
    @click:outside="closeDialog"
  >
    <v-card class="rounded-lg">
      <v-card-title class="primary white--text py-4">
        <v-icon left color="white">{{ isEdit ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
        <span class="headline">{{ isEdit ? "Edit Call Plan" : "Add New Call Plan" }}</span>
      </v-card-title>

      <v-card-text class="pt-6">
        <v-form
          ref="form"
          v-model="formValid"
          lazy-validation
        >
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="itemData.code_batch"
                label="Code Batch"
                outlined
                dense
                required
                readonly
                prepend-inner-icon="mdi-barcode"
                :disabled="loading"
                class="mb-2"
              />

              <v-autocomplete
                v-model="itemData.region"
                :items="regionOptions"
                item-text="name"
                item-value="name"
                label="Region"
                outlined
                dense
                clearable
                return-object
                :rules="regionRules"
                :loading="loading"
                :disabled="loading"
                prepend-inner-icon="mdi-map-marker"
                @change="onRegionChange"
                class="mb-2"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-icon left>mdi-alert</v-icon>
                        Region not found
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>

              <v-autocomplete
                v-model="itemData.area"
                :items="areaOptions"
                item-text="area"
                item-value="area"
                label="Area"
                outlined
                dense
                clearable
                return-object
                :rules="areaRules"
                :loading="loading"
                :disabled="loading || !itemData.region"
                prepend-inner-icon="mdi-map"
                @change="onAreaChange"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-icon left>mdi-alert</v-icon>
                        Area not found
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>

            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="grey darken-1"
          text
          :disabled="loading"
          @click="closeDialog"
        >
          <v-icon left>mdi-close</v-icon>
          Cancel
        </v-btn>
        <v-btn
          color="success"
          :loading="loading"
          :disabled="!formValid || loading"
          @click="saveItem"
        >
          <v-icon left>{{ isEdit ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
          {{ isEdit ? "Save Changes" : "Create Call Plan" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { getAllArea, getAllRegion} from '@/api/regionAreaService'
import {findLast} from "@/api/batchService";
import {mapGetters} from "vuex";

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
        code_batch: '',
        area: '',
        region: '',
        start_plan: '',
        end_plan: '',
      },
      formValid: false,
      loading: false,
      startDateMenu: false,
      endDateMenu: false,
      userOptions: [],
      regionOptions: [],
      areaOptions: [],
      regionRules: [
        v => !!v || "Region is required",
      ],
      areaRules: [
        v => !!v || "Area is required",
      ],
      dateRules: [
        v => !!v || "Date is required",
      ],
    };
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  watch: {
    isEdit(newValue){
      if (newValue) {
        this.itemData = { ...this.item };
      }
    },
    dialog(newValue) {
      if (newValue) {
        this.$refs.form?.resetValidation();
        this.fetchRegion();
        this.fetchArea();
        this.fetchBatch();
      }
    },
  },
  methods: {
    resetForm() {
      this.itemData = {
        code_batch: '',
        area: '',
        region: '',
        start_plan: '',
        end_plan: '',
      };
      this.formValid = false;
      this.$refs.form?.resetValidation();
    },
    closeDialog() {
      if (this.loading) return;
      this.$emit("close");
      this.resetForm();
    },
    async saveItem() {
      if (!this.$refs.form.validate()) return;
      
      try {
        this.loading = true;
        await this.$emit("save", { ...this.itemData });
        this.closeDialog();
      } catch (error) {
        this.$toast.error(`Failed to ${this.isEdit ? 'update' : 'create'} Call Plan`);
      } finally {
        this.loading = false;
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
      } catch (error) {
        this.$toast.error("Failed to fetch areas");
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
        this.$toast.error("Failed to fetch regions" + error);
      } finally {
        this.loading = false;
      }
    },
    async fetchBatch() {
      this.loading = true;
      try {
        const response = await findLast();
        this.itemData.code_batch = response.data.code_batch;
      } catch (error) {
        this.$toast.error("Failed to fetch batch code");
      } finally {
        this.loading = false;
      }
    },
    onRegionChange(item) {
      if (item) {
        this.itemData.region = item.name;
        this.itemData.area = null;
      } else {
        this.itemData.region = null;
      }
    },
    onAreaChange(item) {
      if (item) {
        this.itemData.area = item.area;
      } else {
        this.itemData.area = null;
      }
    },
  },
};
</script>

<style scoped>
.v-dialog {
  border-radius: 8px;
}
.v-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
