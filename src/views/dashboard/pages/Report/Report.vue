<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12">
        <v-card elevation="3" class="rounded-lg">
          <v-card-title class="text-h4 py-4 primary white--text d-flex align-center">
            <v-icon medium color="white" class="mr-3">mdi-file-document-multiple</v-icon>
            Report Management
          </v-card-title>

          <v-list class="py-3">
            <!-- Activity Report Section -->
            <v-list-group
              :value="true"
              color="primary"
            >
              <template v-slot:activator>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-chart-box</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="text-h6">Activity Report</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-card flat class="mx-4 mt-2">
                <v-card-text>
                  <v-row align="center">
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="batch_code"
                        :items="batchCodeOptions"
                        label="Select Batch Code"
                        item-text="batch_code"
                        item-value="batch_code"
                        outlined
                        dense
                        prepend-inner-icon="mdi-barcode"
                        :error-messages="!batch_code ? ['Batch code is required'] : []"
                        :loading="loadingBatchCodes"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" class="text-center">
                      <v-btn
                        color="primary"
                        large
                        rounded
                        :disabled="!batch_code || loadingActivity"
                        @click="downloadReportActivity"
                        class="px-6"
                        elevation="2"
                      >
                        <v-icon left>mdi-cloud-download</v-icon>
                        Download Activity Report
                        <v-progress-circular
                          v-if="loadingActivity"
                          indeterminate
                          color="white"
                          size="20"
                          width="2"
                          class="ml-2"
                        ></v-progress-circular>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-list-group>

            <v-divider class="my-2"></v-divider>

            <!-- Outlet Report Section -->
            <v-list-group
              color="primary"
            >
              <template v-slot:activator>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-store</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="text-h6">Outlet Report</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-card flat class="mx-4 mt-2">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="filter.area"
                        label="Area"
                        outlined
                        dense
                        prepend-inner-icon="mdi-map-marker"
                        clearable
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="filter.region"
                        label="Region"
                        outlined
                        dense
                        prepend-inner-icon="mdi-earth"
                        clearable
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="filter.brand"
                        label="Brand"
                        outlined
                        dense
                        prepend-inner-icon="mdi-tag"
                        clearable
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="filter.sio_type"
                        label="SIO Type"
                        outlined
                        dense
                        prepend-inner-icon="mdi-format-list-checks"
                        clearable
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="text-center">
                      <v-btn
                        color="primary"
                        large
                        rounded
                        :disabled="loadingOutlet"
                        @click="downloadReportOutlet"
                        class="px-6"
                        elevation="2"
                      >
                        <v-icon left>mdi-cloud-download</v-icon>
                        Download Outlet Report
                        <v-progress-circular
                          v-if="loadingOutlet"
                          indeterminate
                          color="white"
                          size="20"
                          width="2"
                          class="ml-2"
                        ></v-progress-circular>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-list-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { reportActivity, reportOutlet } from "@/api/reportService";
import { getAllList } from "@/api/batchService";
export default {
  name: "Report",
  data() {
    return {
      batch_code: null,
      batchCodeOptions: [],
      filter: {
        area: '',
        region: '',
        brand: '',
        sio_type: '',
      },
      loadingBatchCodes: false,
      loadingActivity: false,
      loadingOutlet: false
    };
  },
  async mounted() {
    await this.getBatchCode();
  },
  methods: {
    async getBatchCode() {
      this.loadingBatchCodes = true;
      try {
        const response = await getAllList();
        this.batchCodeOptions = response.data.data.map(item => ({
          batch_code: item.code_batch,
          id: item.id,
        }));
      } catch (error) {
        console.error("Error fetching batch codes:", error);
        alert("Failed to load batch codes");
      } finally {
        this.loadingBatchCodes = false;
      }
    },
    async downloadReportActivity() {
      if (!this.batch_code) {
        alert("Please select a batch code.");
        return;
      }
      this.loadingActivity = true;
      try {
        const response = await reportActivity({
          batch_code: this.batch_code,
        });
        if (response) {
          const blob = new Blob([response], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          
          const date = new Date().toISOString().split('T')[0];
          link.setAttribute("download", `activity_report_${date}.xlsx`);
          
          document.body.appendChild(link);
          link.click();
          
          link.remove();
          window.URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error("Error downloading report:", error);
        alert("There was an error downloading the report.");
      } finally {
        this.loadingActivity = false;
      }
    },
    async downloadReportOutlet() {
      this.loadingOutlet = true;
      try {
        const response = await reportOutlet(this.filter);
        if (response) {
          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "outlet_report.xlsx");
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error("Error downloading report:", error);
        alert("There was an error downloading the report.");
      } finally {
        this.loadingOutlet = false;
      }
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
