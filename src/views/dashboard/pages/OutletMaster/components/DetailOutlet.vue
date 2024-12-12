<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="12">
        <v-card class="pa-4" elevation="2" style="padding: 20px; border-radius: 20px">
          <!-- Back Button -->
          <v-btn small fab outlined color="primary" @click="handleBack">
            <v-icon>mdi-backburger</v-icon>
          </v-btn>

          <!-- Outlet Information Header -->
          <v-card-title style="display: grid;" class="text-h3 font-weight-bold text-center mb-0">
            {{ data.name || 'Outlet Detail' }}
            <v-card-subtitle class="text-caption grey--text text-center mb-4">
              {{ data.address_line }}, {{ data.sub_district }} - {{ data.region }}
            </v-card-subtitle>

            <!-- Status Switch and Remarks -->
            <v-row>
              <v-col cols="12" class="d-flex justify-space-between align-center">
                <div class="d-flex align-center">
                  <v-switch
                    v-model="data.is_active"
                    :label="data.is_active ? 'Active' : 'Inactive'"
                    :color="data.is_active ? 'success' : 'error'"
                    :loading="switchLoading"
                    @change="handleSwitchChange(data, data.is_active)"
                  ></v-switch>
                  <v-chip
                    class="ml-2"
                    :color="data.is_active ? 'success' : 'error'"
                    text-color="white"
                    small
                  >
                    {{ data.is_active ? 'Active' : 'Inactive' }}
                  </v-chip>
                </div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <strong>Remarks:</strong> {{ data.remarks || 'None' }}
                    </div>
                  </template>
                  <span>Last updated remarks</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-card-title>

          <!-- General Information Section -->
          <v-divider class="my-4" />
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-simple-table>
                  <template v-slot:default>
                    <thead><tr /></thead>
                    <tbody>
                      <tr v-for="(value, label) in outletDetailsLeft" :key="label">
                        <td class="font-weight-medium">{{ label }}</td>
                        <td>
                          <v-chip small :color="getChipColor(label, value)" text-color="white">
                            {{ value || 'N/A' }}
                          </v-chip>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>

              <v-col cols="12" md="6">
                <v-simple-table>
                  <template v-slot:default>
                    <thead><tr /></thead>
                    <tbody>
                      <tr v-for="(value, label) in outletDetailsRight" :key="label">
                        <td class="font-weight-medium">{{ label }}</td>
                        <td>
                          <v-chip small :color="getChipColor(label, value)" text-color="white">
                            {{ value || 'N/A' }}
                          </v-chip>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>

            <!-- Location with Map Link -->
            <v-divider class="my-4" />
            <v-row class="mt-4">
              <v-col cols="12">
                <h3 class="text-h6 font-weight-medium mb-3">
                  <v-icon left>mdi-map-marker</v-icon>
                  Location
                </h3>
                <v-row class="align-center">
                  <v-col cols="6">
                    <v-btn
                      color="primary"
                      outlined
                      class="mb-4"
                      :disabled="!hasCoordinates"
                      @click="openInMaps"
                    >
                      <v-icon left>mdi-map</v-icon>
                      Open in Maps
                    </v-btn>
                    <div v-if="!hasCoordinates" class="caption error--text mt-1">
                      * Coordinates not available
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <!-- Photos Section -->
            <v-divider class="my-4" />
            <v-row>
              <v-col cols="6">
                <v-card outlined>
                  <v-card-title class="d-flex justify-space-between">
                    <h3 class="text-h6 font-weight-medium">
                      <v-icon left>mdi-image-multiple</v-icon>
                      Photos
                    </h3>
                    <v-chip small color="primary">{{ data.photos?.length || 0 }} photos</v-chip>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-row>
                    <v-col cols="12">
                      <v-carousel
                        v-if="data.photos?.length"
                        hide-delimiter-background
                        show-arrows-on-hover
                        height="400"
                      >
                        <v-carousel-item
                          v-for="(photo, index) in data.photos"
                          :key="index"
                          :src="`${decodeURIComponent(photo)}`"
                          reverse-transition="fade-transition"
                          transition="fade-transition"
                        >
                          <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                              <v-progress-circular indeterminate color="primary"></v-progress-circular>
                            </v-row>
                          </template>
                        </v-carousel-item>
                      </v-carousel>
                      <v-alert v-else type="info" text>No photos available</v-alert>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <v-col cols="6">
                <v-card outlined>
                  <v-card-title class="d-flex justify-space-between">
                    <h3 class="text-h6 font-weight-medium">
                      Activity Outlet
                    </h3>
                    <v-chip small color="primary">{{ data.activities?.length || 0 }} activities</v-chip>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-list dense class="activity-list">
                      <template v-if="data.activities?.length > 0">
                        <v-list-item v-for="(activity, index) in data.activities" :key="index" class="activity-item">
                          <v-list-item-content>
                            <div class="d-flex align-start mb-2">
                              <v-icon left>mdi-clipboard-text</v-icon>
                              <div class="d-flex flex-column justify-start" style="gap: 5px;">
                                <div class="font-weight-bold" style="font-size: 1.2rem; padding-bottom: 3px;">Activity {{ activity.id }} - MD {{ activity.created_by }}</div>
                                <div class="caption grey--text" style="padding-bottom: 3px;">{{ formatDate(activity.start_time) }} - {{ formatDate(activity.end_time) }}</div>
                                <div class="caption" :class="`${getActivityStatusColor(activity.status)}--text`" style="padding-bottom: 3px;">{{ getActivityStatusLabel(activity.status) }}</div>
                          
                                <div class="d-flex align-center justify-space-between pt-2">
                                  <v-icon left>mdi-comment</v-icon>
                                  <v-chip small color="error">{{ activity.comments?.length || 0 }} Comments</v-chip>
                                  <div class="px-2 caption grey--text"> Last Comment {{ formatDate(activity.comments[0].created_at) }}</div>
                                </div>
                              </div>
                              <v-btn style="margin-left: auto;" icon small @click="handleActivityDetail(activity.id)">
                                <v-icon>mdi-chevron-right</v-icon>
                              </v-btn>
                            </div>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <v-alert v-else type="warning" text>No activities recorded</v-alert>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- Footer Info -->
          <v-divider class="my-4" />
          <v-card-actions class="justify-end grey--text text--darken-1">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div class="mx-2" v-bind="attrs" v-on="on">
                  <v-icon small class="mr-1">mdi-account-edit</v-icon>
                  <strong>Created By:</strong> {{ data.created_by }}
                </div>
              </template>
              <span>Created by user</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div class="mx-2" v-bind="attrs" v-on="on">
                  <v-icon small class="mr-1">mdi-calendar</v-icon>
                  <strong>Created At:</strong> {{ formatDate(data.created_at) }}
                </div>
              </template>
              <span>Creation date and time</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getOutletById, updateOutletStatus } from '@/api/masterOutletService';
import { getStatusLabel, getStatusColor } from '@/constants/status';
import Vue from 'vue';

export default {
  name: 'OutletDetail',
  
  data() {
    return {
      id: this.$route.params.id,
      data: {},
      loading: false,
      switchLoading: false,
      activities: [
      ],
    };
  },

  computed: {
    hasCoordinates() {
      return !!(this.data.latitude && this.data.longitude);
    },
    
    outletDetailsLeft() {
      return {
        "Outlet Code": this.data.outlet_code,
        "Brand": this.data.brand,
        "Type": this.data.sio_type,
        "Region": this.data.region,
        "Area": this.data.area,
      };
    },

    outletDetailsRight() {
      return {
        "Cycle": this.data.cycle,
        "Visit Day": this.data.visit_day,
        "Odd/Even": this.data.odd_even,
        "Postal Code": this.data.postal_code || 'N/A',
      };
    },
  },

  mounted() {
    this.fetchData(this.id);
  },

  methods: {
    getActivityStatusLabel(status) {
      return getStatusLabel(status);
    },

    getActivityStatusColor(status) {
      return getStatusColor(status);
    },

    handleActivityDetail(id) {
      this.$router.push(`/activity/detail/${id}`);
    },

    getChipColor(label, value) {
      if (!value || value === 'N/A') return 'grey';
      
      switch(label) {
        case 'Brand':
          return 'purple';
        case 'Type':
          return 'indigo';
        case 'Region':
          return 'blue';
        case 'Area':
          return 'cyan';
        case 'Cycle':
          return 'teal';
        case 'Visit Day':
          return 'green';
        case 'Odd/Even':
          return 'deep-orange';
        default:
          return 'blue-grey';
      }
    },

    formatDate(date) {
      if (!date) return 'N/A';
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(date));
    },

    async fetchData(id) {
      this.loading = true;
      try {
        const response = await getOutletById(id);
        this.data = response.data;
      } catch (error) {
        Vue.prototype.$toast.error(error.response?.data?.message || "Failed to load data");
      } finally {
        this.loading = false;
      }
    },

    handleBack() {
      this.$router.back();
    },

    async handleSwitchChange(data, isActive) {
      console.log(data, isActive);
      this.switchLoading = true;
      try {
        await this.$swal.fire({
          title: `Are you sure you want to ${isActive ? 'activate' : 'deactivate'} this outlet?`,
          text: "This action cannot be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, proceed!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
             updateOutletStatus(data.id, { is_active: isActive ? 1 : 0 });
            this.$swal.fire({
              title: "Success!",
              text: `Outlet ${isActive ? 'activated' : 'deactivated'} successfully.`,
              icon: "success"
            });
          } else {
            this.data.is_active = !isActive;
            this.$swal.fire({
              title: "Cancelled",
              text: "No changes were made.",
              icon: "info"
            });
          }
        });
      } catch (error) {
        Vue.prototype.$toast.error("Failed to update outlet status");
        this.data.is_active = !isActive;
      } finally {
        this.switchLoading = false;
      }
    },

    openInMaps() {
      const { latitude, longitude } = this.data;
      if (latitude && longitude) {
        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(mapUrl, '_blank');
      } else {
        Vue.prototype.$toast.error('Coordinates are not available');
      }
    },
  },
};
</script>

<style scoped>
.v-img.rounded {
  border-radius: 8px;
}

.v-card-title, .v-card-subtitle {
  text-align: center;
  margin-bottom: 0.5rem;
}

.v-chip {
  font-size: 0.9rem;
  font-weight: bold;
}

.activity-list {
  max-height: 600px;
  overflow-y: auto;
}

.activity-item {
  border-bottom: 1px solid #e0e0e0;
  padding: 16px;
}

.activity-item:last-child {
  border-bottom: none;
}

.comment-wrapper {
  font-size: 0.875rem;
  line-height: 1.4;
}

.comment-input {
  background-color: #f5f5f5;
  border-radius: 20px;
}

.comment-input >>> .v-input__slot {
  min-height: 36px !important;
  padding: 0 16px !important;
}

.comments-section {
  background-color: #fafafa;
  padding: 8px;
  border-radius: 4px;
}

/* Custom scrollbar for activity list */
.activity-list::-webkit-scrollbar {
  width: 8px;
}

.activity-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.activity-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.activity-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
