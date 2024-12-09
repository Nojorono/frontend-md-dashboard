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
              {{ data.address_line }}, {{ data.sub_district }} - {{ data.city_or_regency }}
            </v-card-subtitle>

            <!-- Status and Batch Info -->
            <v-row>
              <v-col cols="12" class="d-flex justify-space-between align-center">
                <div class="d-flex align-center">
                  <v-chip
                    class="mr-2"
                    :color="data.is_approved === null ? 'warning' : data.is_approved ? 'success' : 'error'"
                    text-color="white"
                    small
                  >
                    {{ data.is_approved === null ? 'Pending' : data.is_approved ? 'Approved' : 'Rejected' }}
                  </v-chip>
                  <v-chip color="primary" small>
                    Batch: {{ data.batch_code }}
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

          <!-- Outlet Information Tabs -->
          <v-tabs v-model="activeTab" background-color="transparent" grow>
            <v-tab>New Outlet Info</v-tab>
            <v-tab>Existing Outlet Info</v-tab>
          </v-tabs>

          <v-tabs-items v-model="activeTab">
            <!-- New Outlet Information -->
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <v-col cols="6">
                      <v-simple-table>
                        <tbody>
                          <tr v-for="(value, key) in newOutletDetailsLeft" :key="key">
                            <td class="font-weight-medium">{{ key }}</td>
                            <td>
                              <v-chip small :color="getChipColor(key, value)" text-color="white">
                                {{ value || 'N/A' }}
                              </v-chip>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-col>
                    <v-col cols="6">
                      <v-simple-table>
                        <tbody>
                          <tr v-for="(value, key) in newOutletDetailsRight" :key="key">
                            <td class="font-weight-medium">{{ key }}</td>
                            <td>
                              <v-chip small :color="getChipColor(key, value)" text-color="white">
                                {{ value || 'N/A' }}
                              </v-chip>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-col>
                  </v-row>

                  <!-- Range Facilities Section -->
                  <v-divider class="my-4" />
                  <h3 class="text-h6 mb-3">Range Facilities</h3>
                  <v-row>
                    <v-col v-for="(value, facility) in rangeFacilities" :key="facility" cols="4">
                      <v-card outlined>
                        <v-card-text class="text-center">
                          <div class="text-subtitle-2 mb-2">{{ formatFacilityName(facility) }}</div>
                          <v-chip small :color="getRangeFacilityColor(value)">
                            {{ value }} meters
                          </v-chip>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <!-- Existing Outlet Information -->
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <v-col cols="6">
                      <v-simple-table>
                        <tbody>
                          <tr v-for="(value, key) in existingOutletDetailsLeft" :key="key">
                            <td class="font-weight-medium">{{ key }}</td>
                            <td>
                              <v-chip small :color="getChipColor(key, value)" text-color="white">
                                {{ value || 'N/A' }}
                              </v-chip>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-col>
                    <v-col cols="6">
                      <v-simple-table>
                        <tbody>
                          <tr v-for="(value, key) in existingOutletDetailsRight" :key="key">
                            <td class="font-weight-medium">{{ key }}</td>
                            <td>
                              <v-chip small :color="getChipColor(key, value)" text-color="white">
                                {{ value || 'N/A' }}
                              </v-chip>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <!-- Photos Section -->
              <v-divider class="my-4" />
              <v-card outlined class="mt-4">
                <v-card-title>
                  <v-icon left>mdi-image-multiple</v-icon>
                  Photos
                  <v-spacer></v-spacer>
                  <v-chip small color="primary">{{ data.outlet?.photos?.length || 0 }} photos</v-chip>
                </v-card-title>
                <v-card-text>
                  <v-carousel
                    v-if="data.outlet?.photos?.length"
                    hide-delimiter-background
                    show-arrows-on-hover
                    height="400"
                  >
                    <v-carousel-item
                      v-for="(photo, index) in data.outlet?.photos"
                      :key="index"
                      :src="photo"
                    >
                      <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                          <v-progress-circular indeterminate color="primary"></v-progress-circular>
                        </v-row>
                      </template>
                    </v-carousel-item>
                  </v-carousel>
                  <v-alert v-else type="info" text>No photos available</v-alert>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

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
import { getById } from '@/api/surveyService';
import Vue from 'vue';

export default {
  name: 'DetailSurveyNewOutlet',
  
  data() {
    return {
      id: this.$route.params.id,
      data: {},
      loading: false,
      activeTab: 0,
    };
  },

  computed: {
    newOutletDetailsLeft() {
      return {
        "Outlet Code": this.data.outlet_code,
        "Brand": this.data.brand,
        "Type": this.data.sio_type,
        "Region": this.data.region,
        "Area": this.data.area,
      };
    },

    newOutletDetailsRight() {
      return {
        "Cycle": this.data.cycle,
        "Visit Day": this.data.visit_day,
        "Odd/Even": this.data.odd_even,
        "Postal Code": this.data.postal_code || 'N/A',
      };
    },

    existingOutletDetailsLeft() {
      return {
        "Outlet Code": this.data.outlet?.outlet_code,
        "Brand": this.data.outlet?.brand,
        "Type": this.data.outlet?.sio_type,
        "Region": this.data.outlet?.region,
        "Area": this.data.outlet?.area,
      };
    },

    existingOutletDetailsRight() {
      return {
        "Cycle": this.data.outlet?.cycle,
        "Visit Day": this.data.outlet?.visit_day,
        "Odd/Even": this.data.outlet?.odd_even,
        "Status": this.data.outlet?.is_active ? 'Active' : 'Inactive',
      };
    },

    rangeFacilities() {
      return {
        range_health_facilities: this.data.range_health_facilities,
        range_work_place: this.data.range_work_place,
        range_public_transportation_facilities: this.data.range_public_transportation_facilities,
        range_worship_facilities: this.data.range_worship_facilities,
        range_playground_facilities: this.data.range_playground_facilities,
        range_educational_facilities: this.data.range_educational_facilities,
      };
    },
  },

  mounted() {
    this.fetchData(this.id);
  },

  methods: {
    formatFacilityName(facility) {
      return facility
        .replace('range_', '')
        .replace('_facilities', '')
        .replace('_', ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },

    getRangeFacilityColor(value) {
      if (value === 0) return 'grey';
      if (value <= 100) return 'success';
      if (value <= 500) return 'warning';
      return 'error';
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
        case 'Status':
          return value === 'Active' ? 'success' : 'error';
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
        const response = await getById(id);
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
  },
};
</script>

<style scoped>
.v-card-title, .v-card-subtitle {
  text-align: center;
  margin-bottom: 0.5rem;
}

.v-chip {
  font-size: 0.9rem;
  font-weight: bold;
}

.v-tabs {
  margin-bottom: 20px;
}
</style>