<!-- src/components/Forbidden.vue -->
<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="3">
        <v-card>
          <v-card-title class="text-h5">
            Download Report Activity
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-row>
                <v-col cols="12">
                  <v-menu
                    v-model="menuStart"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateRange.start"
                        label="Start Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="dateRange.start"
                      @input="menuStart = false"
                      no-title
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-menu
                    v-model="menuEnd"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateRange.end"
                        label="End Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="dateRange.end"
                      @input="menuEnd = false"
                      no-title
                    ></v-date-picker>
                  </v-menu>
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
    </v-row>
  </v-container>
</template>

<script>
import { reportActivity } from "@/api/reportService";

export default {
  name: "Report",
  data() {
    return {
      dateRange: {
        start: null,
        end: null,
      },
      menuStart: false,
      menuEnd: false,
    };
  },
  methods: {
    async downloadReportActivity() {
      if (!this.dateRange.start || !this.dateRange.end) {
        alert("Please select both start and end dates.");
        return;
      }

      try {
        // Call an API or generate the report locally
        const response = await reportActivity(this.dateRange);
        if (response.status === 200) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "report.xlsx");
          document.body.appendChild(link);
          link.click();
          link.remove();
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
