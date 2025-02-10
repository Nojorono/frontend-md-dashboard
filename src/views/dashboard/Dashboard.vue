<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12">
        <leaflet-map />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="6">
        <time-motion />
      </v-col>

      <v-col cols="12" lg="6">
        <outlet-distribution />
      </v-col>

      <v-col cols="12" md="12">
        <base-material-card color="warning" class="px-5 py-3 elevation-6">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Outlet Analytics Summary
            </div>
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
import TimeMotion from "@/views/dashboard/components/dashboard/TimeMotion.vue";
import OutletDistribution from "@/views/dashboard/components/dashboard/OutletDistribution.vue";
import Vue from "vue";

export default {
  name: "DashboardDashboard",
  components: {
    LeafletMap,
    DashboardBatchTarget,
    TimeMotion,
    OutletDistribution,
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
        labels: ["Active", "Inactive", "Pending", "Closed"],
        series: [25, 25, 25, 25],
      },

      outletRegionData: {
        labels: ["North", "South", "East", "West", "Central"],
        series: [20, 20, 20, 20, 20],
      },

      outletTypeData: {
        labels: ["Type A", "Type B", "Type C", "Type D"],
        series: [25, 25, 25, 25],
      },

      chartOptions: {
        donut: true,
        donutWidth: 80,
        startAngle: 0,
        total: 100,
        showLabel: true,
        chartPadding: 30,
        labelInterpolationFnc: (value) => `${value}%`,
      },
    };
  },

  computed: {},

  methods: {
    async fetchOutletStatusData() {
      this.loading = true;
      try {
        await this.fetchOutlets();
        this.outletStatusData = this.outletData;
        this.outletLastUpdated = new Date().toLocaleString();
        this.totalOutlets = this.outletData.series.reduce((a, b) => a + b, 0);
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`);
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
        Vue.prototype.$toast.error(`${error.data.message}`);
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
        Vue.prototype.$toast.error(`${error.data.message}`);
      } finally {
        this.loading = false;
      }
    },

    async downloadOutletReport() {
      this.downloading = true;
      try {
        await this.downloadReport("outlet");
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`);
      } finally {
        this.downloading = false;
      }
    },

    async downloadRegionReport() {
      this.downloading = true;
      try {
        await this.downloadReport("region");
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`);
      } finally {
        this.downloading = false;
      }
    },

    async downloadTypeReport() {
      this.downloading = true;
      try {
        await this.downloadReport("type");
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`);
      } finally {
        this.downloading = false;
      }
    },

    async downloadReport(type) {
      // Implement report download logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Downloading ${type} report...`);
    },
  },

  // async created() {
  //   await Promise.all([
  //     this.fetchOutletStatusData(),
  //     this.fetchOutletRegionData(),
  //     this.fetchOutletTypeData()
  //   ]);
  // }
};
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
