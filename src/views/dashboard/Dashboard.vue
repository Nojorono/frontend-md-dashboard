<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12">
        <leaflet-map />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="4">
        <base-material-chart-card
          :data="emailsSubscriptionChart.data"
          :options="emailsSubscriptionChart.options"
          :responsive-options="emailsSubscriptionChart.responsiveOptions"
          color="#E91E63"
          hover-reveal
          type="Bar"
          class="elevation-6"
        >
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  color="info"
                  icon
                  v-on="on"
                  @click="refreshData"
                >
                  <v-icon color="info"> mdi-refresh </v-icon>
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
                  @click="openDatePicker"
                >
                  <v-icon>mdi-calendar</v-icon>
                </v-btn>
              </template>

              <span>Select Date Range</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  light
                  icon
                  v-on="on"
                  @click="downloadReport"
                >
                  <v-icon>mdi-download</v-icon>
                </v-btn>
              </template>

              <span>Download Report</span>
            </v-tooltip>
          </template>

          <h4 class="card-title font-weight-light mt-2 ml-2">
            Website Analytics
          </h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Performance Metrics & Insights
          </p>

          <template v-slot:actions>
            <v-icon class="mr-1" small> mdi-clock-outline </v-icon>
            <span class="caption grey--text font-weight-light"
              >Last updated {{ lastUpdated }}</span
            >
          </template>
        </base-material-chart-card>
      </v-col>

      <v-col cols="12" lg="4">
        <base-material-chart-card
          :data="dailySalesChart.data"
          :options="dailySalesChart.options"
          color="success"
          hover-reveal
          type="Line"
          class="elevation-6"
        >
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  color="info"
                  icon
                  v-on="on"
                  @click="refreshSalesData"
                >
                  <v-icon color="info"> mdi-refresh </v-icon>
                </v-btn>
              </template>

              <span>Refresh Sales Data</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  light
                  icon
                  v-on="on"
                  @click="openSalesDatePicker"
                >
                  <v-icon>mdi-calendar</v-icon>
                </v-btn>
              </template>

              <span>Select Sales Period</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  light
                  icon
                  v-on="on"
                  @click="downloadSalesReport"
                >
                  <v-icon>mdi-file-download</v-icon>
                </v-btn>
              </template>

              <span>Download Sales Report</span>
            </v-tooltip>
          </template>

          <h4 class="card-title font-weight-light mt-2 ml-2">
            Sales Performance
          </h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            <v-icon color="green" small> mdi-arrow-up </v-icon>
            <span class="green--text">{{ salesIncrease }}%</span>&nbsp; increase
            in today's sales
          </p>

          <template v-slot:actions>
            <v-icon class="mr-1" small> mdi-clock-outline </v-icon>
            <span class="caption grey--text font-weight-light"
              >Last updated {{ salesLastUpdated }}</span
            >
          </template>
        </base-material-chart-card>
      </v-col>

      <v-col cols="12" lg="4">
        <base-material-chart-card
          :data="dataCompletedTasksChart.data"
          :options="dataCompletedTasksChart.options"
          hover-reveal
          color="info"
          type="Line"
          class="elevation-6"
        >
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  color="info"
                  icon
                  v-on="on"
                  @click="refreshTaskData"
                >
                  <v-icon color="info"> mdi-refresh </v-icon>
                </v-btn>
              </template>

              <span>Refresh Task Data</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  light
                  icon
                  v-on="on"
                  @click="openTaskDatePicker"
                >
                  <v-icon>mdi-calendar</v-icon>
                </v-btn>
              </template>

              <span>Select Task Period</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  light
                  icon
                  v-on="on"
                  @click="exportTaskReport"
                >
                  <v-icon>mdi-export</v-icon>
                </v-btn>
              </template>

              <span>Export Task Report</span>
            </v-tooltip>
          </template>

          <h3 class="card-title font-weight-light mt-2 ml-2">
            Task Completion Metrics
          </h3>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Task completion trends and analysis
          </p>

          <template v-slot:actions>
            <v-icon class="mr-1" small> mdi-clock-outline </v-icon>
            <span class="caption grey--text font-weight-light"
              >Last updated {{ taskLastUpdated }}</span
            >
          </template>
        </base-material-chart-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="info"
          icon="mdi-twitter"
          title="Social Media Reach"
          :value="socialStats.followers"
          sub-icon="mdi-trending-up"
          :sub-text="socialStats.growth"
          class="elevation-6"
          @click="showSocialDetails"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="primary"
          icon="mdi-poll"
          title="Website Analytics"
          :value="websiteStats.visits"
          sub-icon="mdi-chart-line"
          :sub-text="websiteStats.trend"
          class="elevation-6"
          @click="showAnalyticsDetails"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="success"
          icon="mdi-store"
          title="Revenue Overview"
          :value="revenueStats.total"
          sub-icon="mdi-calendar"
          :sub-text="revenueStats.period"
          class="elevation-6"
          @click="showRevenueDetails"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          :color="bookingStats.status"
          icon="mdi-sofa"
          title="Booking Status"
          :value="bookingStats.count"
          sub-icon="mdi-alert"
          :sub-icon-color="bookingStats.alertColor"
          :sub-text="bookingStats.message"
          class="elevation-6"
          @click="showBookingDetails"
        />
      </v-col>

      <v-col cols="12" md="12">
        <base-material-card color="warning" class="px-5 py-3 elevation-6">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">Target Allocation HO</div>

            <div class="subtitle-1 font-weight-light">
              {{ employeeStatsDate }}
            </div>
          </template>
          <v-card-text>
            <dashboard-batch-target />
          </v-card-text>
        </base-material-card>
      </v-col>

      <v-col cols="12" md="6">
        
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LeafletMap from "@/views/dashboard/components/dashboard/LeafletMap.vue";
import DashboardBatchTarget from "@/views/dashboard/components/dashboard/BatchTarget.vue";

export default {
  name: "DashboardDashboard",
  components: { LeafletMap, DashboardBatchTarget },

  data() {
    return {
      search: "",
      sortBy: "name",
      sortDesc: false,
      loading: false,
      lastUpdated: new Date().toLocaleString(),
      salesLastUpdated: new Date().toLocaleString(),
      taskLastUpdated: new Date().toLocaleString(),
      employeeStatsDate: new Date().toLocaleDateString(),
      salesIncrease: 55,

      socialStats: {
        followers: "+245",
        growth: "+12% this week",
      },

      websiteStats: {
        visits: "75,521",
        trend: "Trending upward",
      },

      revenueStats: {
        total: "$ 34,245",
        period: "Last 24 Hours",
      },

      bookingStats: {
        count: "184",
        status: "orange",
        alertColor: "red",
        message: "High demand period",
      },

      dailySalesChart: {
        data: {
          labels: ["M", "T", "W", "T", "F", "S", "S"],
          series: [[12, 17, 7, 17, 23, 18, 38]],
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0,
          }),
          low: 0,
          high: 50,
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
      },
      dataCompletedTasksChart: {
        data: {
          labels: ["12am", "3pm", "6pm", "9pm", "12pm", "3am", "6am", "9am"],
          series: [[230, 750, 450, 300, 280, 240, 200, 190]],
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0,
          }),
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
      },
      emailsSubscriptionChart: {
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          series: [
            [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],
          ],
        },
        options: {
          axisX: {
            showGrid: false,
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0,
          },
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0];
                },
              },
            },
          ],
        ],
      },
      headers: [
        {
          sortable: true,
          text: "ID",
          value: "id",
        },
        {
          sortable: true,
          text: "Name",
          value: "name",
        },
        {
          sortable: true,
          text: "Salary",
          value: "salary",
          align: "right",
        },
        {
          sortable: true,
          text: "Country",
          value: "country",
          align: "right",
        },
        {
          sortable: true,
          text: "City",
          value: "city",
          align: "right",
        },
      ],
      items: [
        {
          id: 1,
          name: "Dakota Rice",
          country: "Niger",
          city: "Oud-Tunrhout",
          salary: "$35,738",
        },
        {
          id: 2,
          name: "Minerva Hooper",
          country: "Curaçao",
          city: "Sinaai-Waas",
          salary: "$23,738",
        },
        {
          id: 3,
          name: "Sage Rodriguez",
          country: "Netherlands",
          city: "Overland Park",
          salary: "$56,142",
        },
        {
          id: 4,
          name: "Philip Chanley",
          country: "Korea, South",
          city: "Gloucester",
          salary: "$38,735",
        },
        {
          id: 5,
          name: "Doris Greene",
          country: "Malawi",
          city: "Feldkirchen in Kārnten",
          salary: "$63,542",
        },
      ],
      tabs: 0,
      tasks: {
        0: [
          {
            text: 'Sign contract for "What are conference organizers afraid of?"',
            value: true,
            dueDate: "2024-01-20",
          },
          {
            text: "Lines From Great Russian Literature? Or E-mails From My Boss?",
            value: false,
            dueDate: "2024-01-21",
          },
          {
            text: "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
            value: false,
            dueDate: "2024-01-22",
          },
          {
            text: "Create 4 Invisible User Experiences you Never Knew About",
            value: true,
            dueDate: "2024-01-23",
          },
        ],
        1: [
          {
            text: "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
            value: true,
            dueDate: "2024-01-24",
          },
          {
            text: 'Sign contract for "What are conference organizers afraid of?"',
            value: false,
            dueDate: "2024-01-25",
          },
        ],
        2: [
          {
            text: "Lines From Great Russian Literature? Or E-mails From My Boss?",
            value: false,
            dueDate: "2024-01-26",
          },
          {
            text: "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
            value: true,
            dueDate: "2024-01-27",
          },
          {
            text: 'Sign contract for "What are conference organizers afraid of?"',
            value: true,
            dueDate: "2024-01-28",
          },
        ],
      },
    };
  },

  methods: {
    refreshData() {
      // Implement refresh logic
      this.lastUpdated = new Date().toLocaleString();
    },

    openDatePicker() {
      // Implement date picker logic
    },

    downloadReport() {
      // Implement report download
    },

    refreshSalesData() {
      // Implement sales refresh logic
      this.salesLastUpdated = new Date().toLocaleString();
    },

    refreshTaskData() {
      // Implement task refresh logic
      this.taskLastUpdated = new Date().toLocaleString();
    },

    showSocialDetails() {
      // Implement social details view
    },

    showAnalyticsDetails() {
      // Implement analytics details view
    },

    showRevenueDetails() {
      // Implement revenue details view
    },

    showBookingDetails() {
      // Implement booking details view
    },

    updateTaskStatus(task) {
      console.log(task);
      // Implement task status update logic
    },

    editTask(task) {
      console.log(task);
      // Implement task edit logic
    },

    deleteTask(task) {
      console.log(task);
      // Implement task delete logic
    },
  },
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
