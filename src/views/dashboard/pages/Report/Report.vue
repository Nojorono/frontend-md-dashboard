<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
        <v-card>
          <v-card-title class="text-h5">
            Download Report Activity
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="batch_code"
                    :items="batchCodeOptions"
                    label="Batch Code"
                    item-text="batch_code"
                    item-value="batch_code"
                  ></v-autocomplete>
                </v-col>
                <v-card-actions>
                  <v-btn
                    light
                    fab
                    color="primary"
                    @click="downloadReportActivity"
                  >
                    <v-icon>mdi-file-download</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-card-title class="text-h5">
            Download Report Outlet
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-row>
                <v-card-actions>
                  <v-btn
                    light
                    fab
                    color="primary"
                    @click="downloadReportOutlet"
                  >
                    <v-icon>mdi-file-download</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-row>
            </v-form>
          </v-card-text>
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
    };
  },
  async mounted() {
    await this.getBatchCode();
  },
  methods: {
    async getBatchCode() {
      const response = await getAllList();
      this.batchCodeOptions = response.data.data.map(item => ({
        batch_code: item.code_batch,
        id: item.id,
      }));
    },
    async downloadReportActivity() {
      if (!this.batch_code) {
        alert("Please select a batch code.");
        return;
      }
      try {
        // Call API with responseType blob to handle binary data properly
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
          
          // Get current date for filename
          const date = new Date().toISOString().split('T')[0];
          link.setAttribute("download", `activity_report_${date}.xlsx`);
          
          document.body.appendChild(link);
          link.click();
          
          // Cleanup
          link.remove();
          window.URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error("Error downloading report:", error);
        alert("There was an error downloading the report.");
      }
    },
    async downloadReportOutlet() {
      try {
        const response = await reportOutlet(this.filter);
        console.log(response);
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
      }
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
