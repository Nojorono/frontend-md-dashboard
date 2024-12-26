<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12">
        <leaflet-map />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="4">
        <material-chart-card
          color="info"
          type="Pie"
          :data="outletStatusData"
          :options="chartOptions"
        >
          <h4 class="font-weight-light">Outlet Status Distribution</h4>
          <p class="font-weight-light">Total Outlets: {{ totalOutlets }}</p>
          
          <template v-slot:actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  color="info"
                  icon
                  v-on="on"
                  @click="fetchOutletStatusData"
                  :loading="loading"
                >
                  <v-icon color="info">mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>Refresh Outlet Status</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  light
                  icon
                  v-on="on"
                  @click="downloadOutletReport"
                  :loading="downloading"
                >
                  <v-icon>mdi-download</v-icon>
                </v-btn>
              </template>
              <span>Download Outlet Report</span>
            </v-tooltip>
          </template>

          <v-icon small class="mr-1">mdi-clock-outline</v-icon>
          <span class="caption grey--text font-weight-light">
            Last updated {{ outletLastUpdated }}
          </span>
        </material-chart-card>
      </v-col>

      <v-col cols="12" lg="4">
        <material-chart-card
          color="success"
          type="Pie"
          :data="outletRegionData"
          :options="chartOptions"
        >
          <h4 class="font-weight-light">Outlet Distribution by Region</h4>
          <p class="font-weight-light">Active Regions: {{ activeRegions }}</p>

          <template v-slot:actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  color="info"
                  icon
                  v-on="on"
                  @click="fetchOutletRegionData"
                  :loading="loading"
                >
                  <v-icon color="info">mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>Refresh Region Data</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  light
                  icon
                  v-on="on"
                  @click="downloadRegionReport"
                  :loading="downloading"
                >
                  <v-icon>mdi-file-download</v-icon>
                </v-btn>
              </template>
              <span>Download Region Report</span>
            </v-tooltip>
          </template>

          <v-icon small class="mr-1">mdi-clock-outline</v-icon>
          <span class="caption grey--text font-weight-light">
            Last updated {{ regionLastUpdated }}
          </span>
        </material-chart-card>
      </v-col>

      <v-col cols="12" lg="4">
        <material-chart-card
          color="warning"
          type="Pie"
          :data="outletTypeData"
          :options="chartOptions"
        >
          <h4 class="font-weight-light">Outlet Distribution by Type</h4>
          <p class="font-weight-light">Total Types: {{ totalTypes }}</p>

          <template v-slot:actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  color="info"
                  icon
                  v-on="on"
                  @click="fetchOutletTypeData"
                  :loading="loading"
                >
                  <v-icon color="info">mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>Refresh Type Data</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  light
                  icon
                  v-on="on"
                  @click="downloadTypeReport"
                  :loading="downloading"
                >
                  <v-icon>mdi-export</v-icon>
                </v-btn>
              </template>
              <span>Export Type Report</span>
            </v-tooltip>
          </template>

          <v-icon small class="mr-1">mdi-clock-outline</v-icon>
          <span class="caption grey--text font-weight-light">
            Last updated {{ typeLastUpdated }}
          </span>
        </material-chart-card>
      </v-col>

      <v-col cols="12" md="12">
        <base-material-card color="warning" class="px-5 py-3 elevation-6">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">Outlet Analytics Summary</div>
            <div class="subtitle-1 font-weight-light">{{ summaryDate }}</div>
          </template>
          <v-card-text>
            <dashboard-batch-target />
          </v-card-text>
        </base-material-card>
      </v-col>

      <v-col cols="12" md="6"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import LeafletMap from "@/views/dashboard/components/dashboard/LeafletMap.vue";
import DashboardBatchTarget from "@/views/dashboard/components/dashboard/BatchTarget.vue";
import MaterialChartCard from "@/components/base/MaterialChartCard.vue";
import Vue from 'vue';

export default {
  name: "DashboardDashboard",
  components: { 
    LeafletMap, 
    DashboardBatchTarget,
    MaterialChartCard
  },

  data() {
    return {
      loading: false,
      downloading: false,
      outletLastUpdated: new Date().toLocaleString(),
      regionLastUpdated: new Date().toLocaleString(),
      typeLastUpdated: new Date().toLocaleString(),
      summaryDate: new Date().toLocaleDateString(),

      totalOutlets: 0,
      activeRegions: 0,
      totalTypes: 0,

      outletStatusData: {
        labels: ['Active', 'Inactive', 'Pending', 'Closed'],
        series: [25, 25, 25, 25]
      },

      outletRegionData: {
        labels: ['North', 'South', 'East', 'West', 'Central'],
        series: [20, 20, 20, 20, 20]
      },

      outletTypeData: {
        labels: ['Type A', 'Type B', 'Type C', 'Type D'],
        series: [25, 25, 25, 25]
      },

      chartOptions: {
        donut: true,
        donutWidth: 80,
        startAngle: 0,
        total: 100,
        showLabel: true,
        chartPadding: 30,
        labelInterpolationFnc: (value) => `${value}%`
      }
    }
  },

  computed: {
   
  },

  methods: {

    async fetchOutletStatusData() {
      this.loading = true;
      try {
        await this.fetchOutlets();
        this.outletStatusData = this.outletData;
        this.outletLastUpdated = new Date().toLocaleString();
        this.totalOutlets = this.outletData.series.reduce((a,b) => a + b, 0);
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`)
      } finally {
        this.loading = false;
      }
    },

    async fetchOutletRegionData() {
      this.loading = true;
      try {
        await this.fetchRegions();
        this.outletRegionData = this.regionData;
        this.regionLastUpdated = new Date().toLocaleString();
        this.activeRegions = this.regionData.labels.length;
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`)
      } finally {
        this.loading = false;
      }
    },

    async fetchOutletTypeData() {
      this.loading = true;
      try {
        await this.fetchTypes();
        this.outletTypeData = this.typeData;
        this.typeLastUpdated = new Date().toLocaleString();
        this.totalTypes = this.typeData.labels.length;
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`)
      } finally {
        this.loading = false;
      }
    },

    async downloadOutletReport() {
      this.downloading = true;
      try {
        await this.downloadReport('outlet');
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`)
      } finally {
        this.downloading = false;
      }
    },

    async downloadRegionReport() {
      this.downloading = true;
      try {
        await this.downloadReport('region');
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`)
      } finally {
        this.downloading = false;
      }
    },

    async downloadTypeReport() {
      this.downloading = true;
      try {
        await this.downloadReport('type');
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`)
      } finally {
        this.downloading = false;
      }
    },

    async downloadReport(type) {
      // Implement report download logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Downloading ${type} report...`);
    }
  },

  // async created() {
  //   await Promise.all([
  //     this.fetchOutletStatusData(),
  //     this.fetchOutletRegionData(),
  //     this.fetchOutletTypeData()
  //   ]);
  // }
}
</script>

<style scoped>
.task-row {
  transition: background-color 0.2s;
}

.task-row:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.task-text {
  transition: color 0.2s;
}

.completed-task {
  text-decoration: line-through;
  color: #888;
}
</style>
