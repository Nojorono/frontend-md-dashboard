<template>
  <div>
    <material-chart-card
      color="warning"
      type="Line"
      :data="chartData"
      :options="chartOptions"
    >
      <h4 class="font-weight-light">Time Motion Analysis</h4>
      <p class="font-weight-light">Average Time: {{ averageTime }} minutes</p>

      <template v-slot:actions>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              v-bind="attrs"
              color="info"
              icon
              v-on="on"
              @click="getTimeMotion"
              :loading="loading"
            >
              <v-icon color="info">mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Refresh Data</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              v-bind="attrs"
              light
              icon
              v-on="on"
              @click="downloadReport"
              :loading="downloading"
            >
              <v-icon>mdi-file-download</v-icon>
            </v-btn>
          </template>
          <span>Download Report</span>
        </v-tooltip>
      </template>

      <v-icon small class="mr-1">mdi-clock-outline</v-icon>
      <span class="caption grey--text font-weight-light">
        Last updated {{ lastUpdated }}
      </span>
    </material-chart-card>

    <v-card class="mt-4">
      <v-data-table
        :headers="headers"
        :items="timeMotion"
        :items-per-page="10"
        class="elevation-1"
        style="max-width: 100%; max-height: 400px; overflow: auto;"
      >
        <template v-slot:item.region="{ item }">
          {{ item.region }}
        </template>
        <template v-slot:item.area="{ item }">
          {{ item.area.join(", ") }}
        </template>
        <template v-slot:item.total_user_md="{ item }">
          {{ item.total_user_md }}
        </template>
        <template v-slot:item.average_time="{ item }">
          {{ formatTime(item.average_time) }} minutes
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { getTimeMotion } from "@/api/dashboardService";
import MaterialChartCard from "@/components/base/MaterialChartCard.vue";

export default {
  name: "TimeMotion",
  components: {
    MaterialChartCard,
  },
  data() {
    return {
      loading: false,
      downloading: false,
      timeMotion: [],
      lastUpdated: new Date().toLocaleString(),
      chartData: {
        labels: [],
        series: [[]],
      },
      chartOptions: {
        lineSmooth: true,
        low: 0,
        high: 10,
        chartPadding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        },
        height: "300px",
      },
      headers: [
        { text: "Region", value: "region", sortable: true },
        { text: "Area", value: "area", sortable: true },
        { text: "Total MD Users", value: "total_user_md", sortable: true },
        { text: "Average Time", value: "average_time", sortable: true },
      ],
    };
  },
  computed: {
    averageTime() {
      if (!this.timeMotion.length) return 0;
      const sum = this.timeMotion.reduce(
        (acc, curr) => acc + curr.average_time,
        0
      );
      return this.formatTime(sum / this.timeMotion.length);
    },
  },
  mounted() {
    this.getTimeMotion();
  },
  methods: {
    async getTimeMotion() {
      this.loading = true;
      try {
        const response = await getTimeMotion();
        this.timeMotion = response.data;
        this.lastUpdated = new Date().toLocaleString();

        // Transform data for chart
        this.chartData = {
          labels: this.timeMotion.map((item) => item.region),
          series: [this.timeMotion.map((item) => item.average_time)],
        };
      } catch (error) {
        console.error("Error fetching time motion data:", error);
      } finally {
        this.loading = false;
      }
    },
    formatTime(time) {
      return Number(time).toFixed(2);
    },
    async downloadReport() {
      this.downloading = true;
      try {
        // Implement download functionality
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } finally {
        this.downloading = false;
      }
    },
  },
};
</script>
