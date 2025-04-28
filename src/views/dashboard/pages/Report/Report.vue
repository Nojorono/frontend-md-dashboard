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
                      <v-autocomplete
                        v-model="outletFilter.area"
                        :items="getAreaOptions"
                        item-text="area"
                        item-value="area"
                        label="Area"
                        outlined
                        dense
                        prepend-inner-icon="mdi-map-marker"
                        clearable
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete
                        v-model="outletFilter.region"
                        :items="getRegionOptions"
                        item-text="name"
                        item-value="name"
                        label="Region"
                        outlined
                        dense
                        prepend-inner-icon="mdi-earth"
                        clearable
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete
                        v-model="outletFilter.brand"
                        :items="getBrandOptions"
                        item-text="brand"
                        item-value="brand"
                        label="Brand"
                        outlined
                        dense
                        prepend-inner-icon="mdi-tag"
                        clearable
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete
                        v-model="outletFilter.sio_type"
                        :items="getSioTypeOptions"
                        item-text="name"
                        item-value="name"
                        label="SIO Type"
                        outlined
                        dense
                        prepend-inner-icon="mdi-format-list-checks"
                        clearable
                      ></v-autocomplete>
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

            <v-divider class="my-2"></v-divider>

            <!-- Outlet Report Reimbursement -->
            <v-list-group
              color="primary"
            >
              <template v-slot:activator>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-store</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="text-h6">Report Reimbursement</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-card flat class="mx-4 mt-2">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-autocomplete
                        v-model="reimbursementFilter.area"
                        :items="getAreaOptions"
                        item-text="area"
                        item-value="area"
                        label="Area"
                        outlined
                        dense
                        prepend-inner-icon="mdi-map-marker"
                        clearable
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete
                        v-model="reimbursementFilter.region"
                        :items="getRegionOptions"
                        item-text="name"
                        item-value="name"
                        label="Region"
                        outlined
                        dense
                        prepend-inner-icon="mdi-earth"
                        clearable
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" class="text-center">
                      <v-btn
                        color="primary"
                        large
                        rounded
                        :disabled="loadingReimbursement"
                        @click="downloadReportReimbursement"
                        class="px-6"
                        elevation="2"
                      >
                        <v-icon left>mdi-cloud-download</v-icon>
                        Download Report Reimbursement
                        <v-progress-circular
                          v-if="loadingReimbursement"
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

            <!-- Outlet Report Absent -->
            <v-list-group
              color="primary"
            >
              <template v-slot:activator>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-store</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="text-h6">Report Absent</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-card flat class="mx-4 mt-2">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-autocomplete
                        v-model="absentFilter.area"
                        :items="getAreaOptions"
                        item-text="area"
                        item-value="area"
                        label="Area"
                        outlined
                        dense
                        prepend-inner-icon="mdi-map-marker"
                        clearable
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete
                        v-model="absentFilter.region"
                        :items="getRegionOptions"
                        item-text="name"
                        item-value="name"
                        label="Region"
                        outlined
                        dense
                        prepend-inner-icon="mdi-earth"
                        clearable
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" class="text-center">
                      <v-btn
                        color="primary"
                        large
                        rounded
                        :disabled="loadingAbsent"
                        @click="downloadReportAbsent"
                        class="px-6"
                        elevation="2"
                      >
                        <v-icon left>mdi-cloud-download</v-icon>
                        Download Report Absent
                        <v-progress-circular
                          v-if="loadingAbsent"
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
import { reportActivity, reportOutlet, reportReimbursement, reportAbsent } from "@/api/reportService";
import { getAllList } from "@/api/batchService";
import { mapGetters } from "vuex";
export default {
  name: "Report",
  data() {
    return {
      batch_code: null,
      batchCodeOptions: [],
      outletFilter: {
        area: '',
        region: '',
        brand: '',
        sio_type: '',
      },
      reimbursementFilter: {
        area: '',
        region: '',
      },
      absentFilter: {
        area: '',
        region: '',
      },
      loadingBatchCodes: false,
      loadingActivity: false,
      loadingOutlet: false,
      loadingReimbursement: false,
      loadingAbsent: false,
    };
  },
  computed: {
    ...mapGetters([
      "getUser",
      "getAreaOptions",
      "getRegionOptions",
      "getBrandOptions",
      "getSioTypeOptions",
    ]),
  },
  async mounted() {
    await this.getBatchCode();
    console.log(this.getAreaOptions);
    console.log(this.getRegionOptions);
    console.log(this.getBrandOptions);
    console.log(this.getSioTypeOptions);
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
        console.log('Starting outlet report download with filters:', this.outletFilter);
        const response = await reportOutlet(this.outletFilter);
        
        if (!response) {
          throw new Error('Empty response received');
        }
        
        console.log('Response received, type:', typeof response);
        
        // Create a proper blob with the correct MIME type
        let blob;
        if (response instanceof Blob) {
          console.log('Response is already a Blob');
          blob = response;
        } else if (response instanceof ArrayBuffer) {
          console.log('Response is an ArrayBuffer, converting to Blob');
          blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
        } else {
          console.log('Response is not a Blob or ArrayBuffer, trying to convert');
          blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
        }
        
        console.log('Blob created, size:', blob.size);
        
        // Create a download link and trigger download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const date = new Date().toISOString().split('T')[0];
        link.setAttribute("download", `outlet_report_${date}.xlsx`);
        
        // Use a more reliable way to trigger the download
        document.body.appendChild(link);
        setTimeout(() => {
          console.log('Triggering download click');
          link.click();
          setTimeout(() => {
            link.remove();
            window.URL.revokeObjectURL(url);
            console.log('Download link removed and URL revoked');
          }, 200);
        }, 100);
      } catch (error) {
        console.error("Error downloading report:", error);
        alert(`Error downloading report: ${error.message || 'Unknown error'}`); 
      } finally {
        this.loadingOutlet = false;
      }
    },

    async downloadReportReimbursement() {
      this.loadingReimbursement = true;
      try {
        const response = await reportReimbursement(this.reimbursementFilter);
        if (response) {
          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          const date = new Date().toISOString().split('T')[0];
          link.setAttribute("download", `reimbursement_report_${date}.xlsx`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error("Error downloading report:", error);
        alert("There was an error downloading the report.");
      } finally {
        this.loadingReimbursement = false;
      }
    },

    async downloadReportAbsent() {
      this.loadingAbsent = true;
      try {
        const response = await reportAbsent(this.absentFilter);
        if (response) {
          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          const date = new Date().toISOString().split('T')[0];
          link.setAttribute("download", `absent_report_${date}.xlsx`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error("Error downloading report:", error);
        alert("There was an error downloading the report.");
      } finally {
        this.loadingAbsent = false;
      }
    }
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
