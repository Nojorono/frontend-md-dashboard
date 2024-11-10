<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
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
            <v-col>
              <!-- Name Input -->
              <v-text-field
                v-model="itemData.code_batch"
                label="Code Batch"
                required
                readonly
              />
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
        },
        formValid: false,
        userOptions: [],
        regionOptions: [],
        areaOptions: [],
        regionRules: [
          (v) => !!v || "Region is required",
        ],
        areaRules: [
          (v) => !!v || "Area is required",
        ],
      };
    },
    computed: {
      ...mapGetters(['getUser']), // Map loading state getter
    },
    watch: {
      isEdit(newValue){
        if (newValue) {
          this.itemData = { ...this.item }; // Populate form with item data when editing
        }
      },
      dialog(newValue) {
        if (newValue) {
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
      },
      closeDialog() {
        this.$emit("close");
        this.resetForm();
      },
      saveItem() {
        if (this.$refs.form.validate()) {
          this.$emit("save", { ...this.itemData });
        }
      },
      async fetchArea() {
        this.loading = true;
        try {
          const response = await getOutletArea();
          // Check if user area array is defined and not empty; if so, filter based on areas
          if (Array.isArray(this.getUser.area) && this.getUser.area.length > 0) {
            this.areaOptions = response.data.filter(
              (area) => this.getUser.area.includes(area)
            );
          } else {
            this.areaOptions = response.data;
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
          const response = await getOutletRegion();
          if (this.getUser.region) {
            this.regionOptions = response.data.filter(
              (region) => region === this.getUser.region
            );
          } else {
            this.regionOptions = response.data; // No filtering if region is undefined
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
          this.itemData.code_batch = response.data.code_batch;
        } catch (error) {
          console.error("Error fetching :", error);
        } finally {
          this.loading = false;
        }
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
    },
  };
</script>

<style scoped>
/* Additional styles if necessary */
</style>
