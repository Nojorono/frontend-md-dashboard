<template>
    <v-container fluid>
      <v-row justify="center">
        <v-col
          cols="12"
          md="12"
        >
          <v-card
            class="pa-4"
            elevation="2"
          >
            <v-btn
              small
              fab
              outlined
              color="primary"
              @click="handleBack"
            >
              <v-icon>mdi-backburger</v-icon>
            </v-btn>
            <v-card-title
              style="display: grid;"
              class="text-h3 font-weight-bold text-center mb-0"
            >
              {{ data.name || 'Activity Detail' }} {{ data.outlet?.name }}
              <v-card-subtitle class="text-h5 grey--text text-center mb-4">
                {{ data.outlet?.address_line }}, {{ data.outlet?.sub_district }} - {{ data.outlet?.region }}
              </v-card-subtitle>
            </v-card-title>
  
            <!-- General Information Section -->
            <v-divider class="my-4" />
            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr />
                      </thead>
                      <tbody>
                        <tr
                          v-for="(value, label) in outletDetailsLeft"
                          :key="label"
                        >
                          <td><strong>{{ label }}</strong></td>
                          <td>: {{ value }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
  
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr />
                      </thead>
                      <tbody>
                        <tr
                          v-for="(value, label) in outletDetailsRight"
                          :key="label"
                        >
                          <td><strong>{{ label }}</strong></td>
                          <td>: {{ value }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
  
              <!-- Status and Remarks -->
              <v-divider class="my-4" />
  
              <!-- Location with Map Link -->
              <v-row class="mt-4">
                <v-col cols="12">
                  <h3 class="text-h6 font-weight-medium mb-3">
                    Location
                  </h3>
                  <v-row class="align-center">
                    <v-col cols="6">
                      <v-btn
                        color="primary"
                        outlined
                        class="mb-4"
                        @click="openInMaps"
                      >
                        Open in Maps
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
  
              <!-- Photos Section -->
              <v-divider class="my-4" />
              <v-row>
                <v-col cols="4">
                  <v-card outlined>
                    <v-card-title class="d-flex justify-space-between">
                      <h3 class="text-h4 font-weight-medium mb-3">
                        Photos Outlet Existing
                      </h3>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-row>
                      <v-col
                        cols="12"
                      >
                        <template>
                          <v-carousel>
                            <v-carousel-item
                              v-for="(photo, index) in data.outlet?.photos"
                              :key="index"
                              :src="decodeURIComponent(photo)"
                              reverse-transition="fade-transition"
                              transition="fade-transition"
                            />
                          </v-carousel>
                        </template>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
                <v-col cols="8">
                  <v-card outlined>
                    <v-card-title class="d-flex justify-space-between">
                      <h3 class="text-h4 font-weight-medium mb-3">
                        Activity
                      </h3>
                    </v-card-title>
                    <v-divider></v-divider>
                    <template>
                        <v-col cols="8">
                            <v-divider></v-divider>
                            <v-card-title class="text-h5 font-weight-medium">
                                Photo Outlet
                            </v-card-title>
                            <v-card-text>
                                <v-carousel>
                                <v-carousel-item
                                    v-for="(photo, index) in data.photos"
                                    :key="index"
                                    :src="photo"
                                    reverse-transition="fade-transition"
                                    transition="fade-transition"
                                >
                                    <v-img :src="photo" width="100%" height="auto" />
                                </v-carousel-item>
                                </v-carousel>
                            </v-card-text>
                        </v-col>
                    </template>
                    <template>
                        <v-col cols="8">
                            <v-card-title class="d-flex justify-space-between">
                                <h3 class="text-h4 font-weight-medium mb-3">
                                    Activity
                                </h3>
                            </v-card-title>
                            <div class="activities-container">
                            <v-list dense>
                                <v-list-item-group>
                                <v-list-item
                                    v-for="(activity, index) in activitySios"
                                    :key="index"
                                    class="activity-item"
                                    @click="openImagePreview(activity)"
                                >
                                    <v-list-item-content>
                                    <v-list-item-title class="font-weight-bold">
                                        {{ activity.name }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        <v-img
                                        :src="activity.photo"
                                        width="100"
                                        />
                                    </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                                </v-list-item-group>
                            </v-list>
                            </div>
                        </v-col>
                    </template>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
  
            <!-- Footer Info -->
            <v-divider class="my-4" />
            <v-card-actions class="justify-end grey--text text--darken-1">
              <div class="mx-2">
                <strong>Created By:</strong> {{ data.created_by }}
              </div>
              <div class="mx-2">
                <strong>Created At:</strong> {{ new Date(data.created_at).toLocaleString() }}
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <!-- Custom Image Preview Modal -->
      <div v-if="dialog" class="modal" @click="dialog = false">
          <div class="modal-content">
            <span class="close" @click="dialog = false">&times;</span>
            <h2>{{ previewTitle }}</h2>
            <img :src="previewImage" class="preview-image" />
          </div>
      </div>
    </v-container>
  </template>
  
  <script>
  import { getById } from '@/api/activityService';
  import Vue from 'vue';
  
  export default {
    name: 'DetailActivity',
    data() {
      return {
        id: this.$route.params.id,
        data: {},
        loading: false,
        activitySios: [],
        activitySogs: [],
        dialog: false,
        previewImage: '',
        previewTitle: '',
      };
    },
  
    computed: {
      outletDetailsLeft() {
        return {
          "Outlet Code": this.data.outlet?.outlet_code,
          "Brand": this.data.outlet?.brand,
          "Type": this.data.type_sio,
          "Region": this.data.region,
          "Area": this.data.area,
          "Start Time": this.formattedStartTime || 'N/A',
        };
      },
      outletDetailsRight() {
        return {
          "Cycle": this.data.outlet?.cycle,
          "Visit Day": this.data.outlet?.visit_day,
          "Odd/Even": this.data.outlet?.odd_even,
          "Postal Code": this.data.outlet?.postal_code || 'N/A',
          "": '',
          "End Time": this.formattedEndTime || 'N/A',
        };
      },

      formattedStartTime() {
        return this.data.start_time ? this.$options.filters.formatDate(this.data.start_time, 'dddd, DD MMM YYYY HH:mm') : 'N/A';
      },
      formattedEndTime() {
        return this.data.end_time ? this.$options.filters.formatDate(this.data.end_time, 'dddd, DD MMM YYYY HH:mm') : 'N/A';
      },
    },
  
    mounted() {
      this.fetchData(this.id);
    },
  
    methods: {
        openImagePreview(activity) {
            this.previewImage = activity.photo;
            this.previewTitle = activity.name;
            this.dialog = true;
        },
      formatDate(date) {
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
          this.activitySios = response.data.activitySios;
          this.activitySogs = response.data.activitySogs;
        } catch (error) {
          Vue.prototype.$toast.error(error.response?.data?.message || "Failed to load data");
        } finally {
          this.loading = false;
        }
      },
      handleBack(){
        this.$router.back();
      },
      handleSwitchChange(data, isActive) {
        if(isActive){
            this.$swal.fire({
                title: "Are you sure?",
                text: "This action cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, do it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$swal.fire("Success!", "Your action was completed.", "success");
                } else {
                    this.$swal.fire("Cancelled", "Your action has been cancelled.", "error");
                }
            });
        }
      },
      openInMaps() {
        const { latitude, longitude } = this.data.outlet || {};
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

  .activities-container {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
  }

  .activity-item {
    justify-content: center;
    align-items: center;
    display: inline-block;
    width: 100%;
    max-width: 150px;
    cursor: pointer;
    text-align: -webkit-center;
  }

  .modal {
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent background */
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px; /* Max width for the modal */
  text-align: center;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.preview-image {
  max-width: 100%; /* Responsive image */
  height: auto;
}
</style>
  