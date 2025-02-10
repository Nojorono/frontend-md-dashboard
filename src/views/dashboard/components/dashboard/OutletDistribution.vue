<template>
  <div>
    <material-chart-card
      color="primary"
      type="Pie"
      :data="chartData"
      :options="chartOptions"
    >
      <h4 class="font-weight-light">Outlet Distribution</h4>
      <p class="font-weight-light">Total Outlets: {{ totalOutlets }}</p>

      <template v-slot:actions>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              v-bind="attrs"
              color="info"
              icon
              v-on="on"
              @click="getOutletData"
              :loading="loading"
            >
              <v-icon color="info">mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Refresh Data</span>
        </v-tooltip>
      </template>

      <v-icon small class="mr-1">mdi-store</v-icon>
      <span class="caption grey--text font-weight-light">
        Last updated {{ lastUpdated }}
      </span>
    </material-chart-card>

    <v-card class="mt-4">
      <v-data-table
        :headers="headers"
        :items="outletTypes"
        :items-per-page="10"
        class="elevation-1"
        style="max-width: 100%; max-height: 300px; overflow: auto;"
      >
        <template v-slot:item.percentage="{ item }">
          {{ ((item.count / totalOutlets) * 100).toFixed(1) }}%
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import { getOutletDistribution } from '@/api/dashboardService';
import MaterialChartCard from '@/components/base/MaterialChartCard.vue';

export default {
  name: 'OutletDistribution',
  components: {
    MaterialChartCard,
  },
  data() {
    return {
      loading: false,
      lastUpdated: new Date().toLocaleString(),
      outletDistribution: {},
      outletTypes: [],
      chartData: {
        labels: ['Active', 'Inactive'],
        series: [0, 0],
      },
      chartOptions: {
        height: '300px',
        colors: ['#4CAF50', '#FF5722'],
        donut: true,
        donutWidth: 60,
        labelInterpolationFnc: value => `${value}`
      },
      headers: [
        { text: 'Outlet Type', value: 'sio_type' },
        { text: 'Count', value: 'count' },
        { text: 'Percentage', value: 'percentage' }
      ]
    };
  },
  computed: {
    totalOutlets() {
      return this.outletDistribution?.totalOutlet || 0;
    }
  },
  mounted() {
    this.getOutletData();
  },
  methods: {
    async getOutletData() {
      this.loading = true;
      try {
        const response = await getOutletDistribution();
        this.outletDistribution = response.data.outletDistribution;
        this.outletTypes = response.data.outletDistributionType.totalOutletType;
        
        // Update chart data
        this.chartData = {
          labels: ['Active ' + this.outletDistribution.totalOutletActive, 'Inactive ' + this.outletDistribution.totalOutletInactive],
          colors: ['#4CAF50', '#FF5722'],
          series: [
            this.outletDistribution.totalOutletActive,
            this.outletDistribution.totalOutletInactive
          ]
        };

        this.chartOptions.total = this.outletDistribution.totalOutlet;

        this.lastUpdated = new Date().toLocaleString();
      } catch (error) {
        console.error('Error fetching outlet distribution:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>