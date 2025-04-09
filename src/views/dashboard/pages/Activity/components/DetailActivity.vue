<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="12">
        <v-card class="pa-4" elevation="2" style="padding: 20px; border-radius: 20px;">
          <v-row>
            <!-- Back Button -->
            <v-col cols="4" md="4">
              <v-btn small fab outlined color="primary" @click="handleBack">
                <v-icon>mdi-backburger</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="4" md="4">
              <!-- Header Section -->
              <v-card-title style="display: grid;" class="text-h3 font-weight-bold text-center mb-0">
                {{ data.name || 'Activity Detail' }} {{ data.outlet?.name || data.surveyOutlet?.name }}
                <v-card-subtitle class="text-h5 grey--text text-center">
                  {{ data.outlet?.address_line || data.surveyOutlet?.address_line }}, {{ data.outlet?.sub_district ||
                    data.surveyOutlet?.sub_district }} - {{ data.outlet?.region || data.surveyOutlet?.region }}
                </v-card-subtitle>
                <div class="d-flex justify-center">
                  <v-chip small :color="getStatusColor(data.status)" text-color="white">
                    {{ getStatusLabelOption(data.status) }}
                  </v-chip>
                  <v-chip small :color="getStatusColor(data.status_approval)" text-color="white">
                    {{ data.status_approval === 3 ? 'Approved' : data.status_approval === 0 ? 'Butuh Pemeriksaan' : getStatusLabelOption(data.status_approval) }}
                  </v-chip>
                </div>
              </v-card-title>
            </v-col>
          </v-row>        
          <!-- General Information Section -->
          <v-divider class="my-4" />
          <v-card-text>
            <v-row>
              <!-- Left Details -->
              <v-col cols="12" md="6">
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr />
                    </thead>
                    <tbody>
                      <tr v-for="(value, label) in outletDetailsLeft" :key="label">
                        <td class="font-weight-bold">{{ label }}</td>
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

              <!-- Right Details -->
              <v-col cols="12" md="6">
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr />
                    </thead>
                    <tbody>
                      <tr v-for="(value, label) in outletDetailsRight" :key="label">
                        <td class="font-weight-bold">{{ label }}</td>
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

            <!-- Status and Remarks -->
            <v-divider class="my-4" />

            <!-- Location Section -->
            <v-row class="mt-4">
              <v-col cols="12">
                <h3 class="text-h6 font-weight-medium mb-3">Location</h3>
                <v-row class="align-center">
                  <v-col cols="3">
                    <v-btn color="primary" outlined class="mb-4" @click="openInMaps" :disabled="!hasCoordinates">
                      <v-icon left>mdi-map-marker</v-icon>
                      Open in Maps
                    </v-btn>
                  </v-col>
                  <v-col cols="5">
                    <v-btn color="primary" outlined class="mb-4">
                      Total Penjualan Outlet Mingguan  {{ data?.sale_outlet_weekly }}/Bungkus
                    </v-btn>
                  </v-col>
                  <v-col cols="4" v-if="data?.notes">
                    <v-btn color="primary" outlined class="mb-4">Notes: {{ data?.notes }}</v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <!-- Photos Section -->
            <v-divider class="my-4" />
            <v-row>
              <!-- Existing Outlet Photos -->
              <v-col cols="4">
                <v-card outlined>
                  <v-card-title class="d-flex justify-space-between">
                    <h3 class="text-h4 font-weight-medium mb-3">Photos Outlet Existing</h3>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-row>
                    <v-col cols="12">
                      <v-carousel hide-delimiters show-arrows-on-hover height="550">
                        <v-carousel-item v-for="(photo, index) in data.outlet?.photos || data.surveyOutlet?.photos"
                          :key="index" :src="decodeURIComponent(photo)" reverse-transition="fade-transition"
                          transition="fade-transition">
                          <v-img :src="decodeURIComponent(photo)" height="550" width="100%" cover
                            class="d-flex align-center justify-center"></v-img>
                        </v-carousel-item>
                      </v-carousel>
                    </v-col>
                    <v-col cols="12">
                      <!-- Comments Section -->
                      <v-card class="comment-section" ref="commentSection">
                        <v-card-text>
                          <v-list dense class="comment-list">
                            <template v-if="loadingComment">
                              <div class="d-flex justify-center align-center pa-4">
                                <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
                                <span class="ml-2">Loading comments...</span>
                              </div>
                            </template>
                            <template v-else-if="comments.length">
                              <v-list-item v-for="(comment, index) in comments" :key="index" class="comment-item">
                                <v-list-item-content>
                                  <div class="comment-header">
                                    <v-avatar size="32" color="primary" class="mr-2">
                                      <v-icon dark>mdi-account</v-icon>
                                    </v-avatar>
                                    <div class="comment-content">
                                      <div class="comment-text">
                                        <span class="username">{{ comment.user_email }}</span>
                                        <p class="message">{{ comment.content }}</p>
                                      </div>
                                      <div class="comment-actions">
                                        <span class="timestamp">{{ formatDate(comment.created_at) }}</span>
                                      </div>
                                    </div>
                                  </div>
                                </v-list-item-content>
                              </v-list-item>
                            </template>
                            <v-alert v-else type="info" text>No comments yet</v-alert>


                            <!-- Add Comment Input -->
                            <v-divider class="comment-divider" />
                            <div class="comment-input-wrapper">
                              <v-avatar size="32" class="user-avatar">
                                <v-img :src="currentUserAvatar || 'default-avatar.png'" />
                              </v-avatar>
                              <v-text-field v-model="newComment" placeholder="Add a comment..." dense hide-details
                                class="comment-input" @keyup.enter="postComment">
                                <template v-slot:append>
                                  <v-icon class="emoji-btn" @click="toggleEmojiPicker">
                                    mdi-emoticon-outline
                                  </v-icon>
                                  <v-btn icon small color="primary" outlined class="send-btn ml-2"
                                    :disabled="!newComment.trim() || loadingComment" @click="postComment"
                                    :style="{ borderRadius: '5px' }">
                                    <v-icon>mdi-send</v-icon>
                                  </v-btn>
                                </template>
                              </v-text-field>
                            </div>
                          </v-list>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <!-- Activity Section -->
              <v-col cols="8">
                <v-card outlined style="padding-bottom: 20px;">
                  <v-card-title class="d-flex justify-space-between">
                    <h3 class="text-h4 font-weight-medium mb-3">Activity</h3>
                  </v-card-title>
                  <v-divider></v-divider>

                  <!-- Activity Photos and SOG -->
                  <v-row>
                    <v-col cols="6" style="padding-right: unset">
                      <v-card-title class="text-h5 font-weight-medium">Photo Outlet</v-card-title>
                      <v-card-text>
                        <v-carousel hide-delimiters show-arrows-on-hover height="500">
                          <v-carousel-item v-for="(photo, index) in data.photos" :key="index"
                            :src="decodeURIComponent(photo)" reverse-transition="fade-transition"
                            transition="fade-transition">
                            <v-img :src="photo" height="500" width="100%" cover
                              class="d-flex align-center justify-center"></v-img>
                          </v-carousel-item>
                        </v-carousel>
                      </v-card-text>
                    </v-col>

                    <v-col cols="6">
                      <v-row>
                        <v-col cols="12" v-if="activitySogs.length > 0">
                          <v-card-title class="text-h5 font-weight-medium">Activity SOG</v-card-title>
                          <v-card-text>
                            <div style="max-height: 300px; overflow-y: auto;">
                          <v-simple-table dense class="elevation-1" style="padding: 5px;">
                            <template v-slot:default>
                              <thead>
                                <tr>
                                  <th>No</th>
                                  <th>Name</th>
                                  <th>Stock</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(item, index) in activitySogs" :key="item.id">
                                  <td>{{ index + 1 }}</td>
                                  <td>{{ item.name }}</td>
                                  <td>{{ item.value }}</td>
                                </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                        </div>
                      </v-card-text>
                      </v-col>
                      <v-col cols="12" v-if="activityBranches.length > 0">
                          <v-card-title class="text-h5 font-weight-medium">Activity Brand Family</v-card-title>
                          <v-card-text>
                            <div style="max-height: 300px; overflow-y: auto;">
                          <v-simple-table dense class="elevation-1" style="padding: 5px;">
                            <template v-slot:default>
                              <thead>
                                <tr>
                                  <th>No</th>
                                  <th>Name</th>
                                  <th>Stock</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(item, index) in activityBranches" :key="item.id">
                                  <td>{{ index + 1 }}</td>
                                  <td>{{ item.name }}</td>
                                  <td>{{ item.value }}</td>
                                </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                        </div>
                      </v-card-text>
                      </v-col>
                      <v-col cols="12" v-if="activityPrograms.length > 0">
                          <v-card-title class="text-h5 font-weight-medium">Activity Program Competitor</v-card-title>
                          <v-card-text>
                            <div style="max-height: 300px; overflow-y: auto;">
                          <v-simple-table dense class="elevation-1" style="padding: 5px;">
                            <template v-slot:default>
                              <thead>
                                <tr>
                                  <th>No</th>
                                  <th>Name</th>
                                  <th>Desc</th>
                                  <th>Photo</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(item, index) in activityPrograms" :key="item.id">
                                  <td>{{ index + 1 }}</td>
                                  <td>{{ item.name }}</td>
                                  <td>{{ item.desc }}</td>
                                  <td><a :href="item.photo" target="_blank">View Photo</a></td>
                                </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                        </div>
                      </v-card-text>
                      </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-divider></v-divider>

                  <!-- Activity SIO -->
                  <v-row>
                    <v-col cols="12" v-if="activitySios.length > 0">
                      <v-card flat class="mb-6">
                        <v-card-title class="d-flex align-center py-4 flex-wrap">
                          <v-icon large color="primary" class="mr-3">mdi-clipboard-text-clock</v-icon>
                          <h3 class="text-h4 font-weight-medium primary--text mb-0 responsive-title">Activity SIO</h3>
                        </v-card-title>
                      </v-card>
                      <div class="activities-container">
                        <v-row>
                          <v-col v-for="(activity, index) in activitySios" :key="index" cols="12" sm="12" md="6" lg="4" xl="3">
                            <v-hover v-slot="{ hover }">
                              <v-card
                                class="mx-auto activity-card transition-swing h-100"
                                :elevation="hover ? 6 : 2"
                                :class="{ 'on-hover': hover }"
                              >
                                <v-card-title class="text-h6 primary--text justify-center font-weight-bold pa-4 responsive-card-title">
                                  {{ activity.name }}
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-card-text class="text-subtitle-1 text-center grey--text text--darken-1 pt-4 responsive-text">
                                  {{ activity.notes }}
                                </v-card-text>
                                <v-row class="pa-4 image-row">
                                  <v-col cols="12" sm="6" class="pb-2 pb-sm-4">
                                    <v-card
                                      class="image-card"
                                      :class="{ 'scale-up': hover }"
                                      @click="openImagePreview(activity.photo_before, 'before')"
                                      elevation="0"
                                    >
                                      <v-img
                                        :src="activity.photo_before"
                                        :height="$vuetify.breakpoint.xsOnly ? '200' : '160'"
                                        class="rounded-lg grey lighten-2"
                                        cover
                                      >
                                        <template v-slot:placeholder>
                                          <v-row class="fill-height ma-0" align="center" justify="center">
                                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                          </v-row>
                                        </template>
                                        <div class="image-overlay d-flex align-center justify-center">
                                          <v-chip :small="!$vuetify.breakpoint.xsOnly" label color="primary" text-color="white" class="px-4 responsive-chip">
                                            <v-icon :left="!$vuetify.breakpoint.xsOnly" :small="!$vuetify.breakpoint.xsOnly">mdi-clock-time-four-outline</v-icon>
                                            Before
                                          </v-chip>
                                        </div>
                                      </v-img>
                                    </v-card>
                                  </v-col>
                                  <v-col cols="12" sm="6" class="pt-2 pt-sm-4">
                                    <v-card
                                      class="image-card"
                                      :class="{ 'scale-up': hover }"
                                      @click="openImagePreview(activity.photo_after, 'after')"
                                      elevation="0"
                                    >
                                      <v-img
                                        :src="activity.photo_after"
                                        :height="$vuetify.breakpoint.xsOnly ? '200' : '160'"
                                        class="rounded-lg grey lighten-2"
                                        cover
                                      >
                                        <template v-slot:placeholder>
                                          <v-row class="fill-height ma-0" align="center" justify="center">
                                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                          </v-row>
                                        </template>
                                        <div class="image-overlay d-flex align-center justify-center">
                                          <v-chip :small="!$vuetify.breakpoint.xsOnly" label color="success" text-color="white" class="px-4 responsive-chip">
                                            <v-icon :left="!$vuetify.breakpoint.xsOnly" :small="!$vuetify.breakpoint.xsOnly">mdi-check-circle</v-icon>
                                            After
                                          </v-chip>
                                        </div>
                                      </v-img>
                                    </v-card>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-hover>
                          </v-col>
                        </v-row>
                      </div>

    
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- Footer Info -->
          <v-divider class="my-4" />
          <v-card-actions class="justify-end grey--text text--darken-1">
            <v-chip class="mx-2" small outlined>
              <v-icon left small>mdi-account</v-icon>
              <strong>Created By:</strong> {{ data.created_by }}
            </v-chip>
            <v-chip class="mx-2" small outlined>
              <v-icon left small>mdi-clock-outline</v-icon>
              <strong>Created At:</strong> {{ formatDate(data.created_at) }}
            </v-chip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Image Preview Modal -->
    <v-dialog v-model="dialog" max-width="800px" content-class="transparent">
      <v-card class="transparent" flat>
        <v-card-text>
          <v-img :src="previewImage" max-height="700" contain class="transparent"></v-img>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { getById } from '@/api/activityService';
  import { createComment, getByActivityId } from '@/api/commentService';
  import {
    EXISTING_SURVEY_STATUS,
    NEW_SURVEY_STATUS,
    STATUS_COLORS,
  } from "@/constants/status";
  import { updateStatus } from '@/api/activityService';

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
        activityBranches: [],
        activityPrograms: [],
        comments: [],
        dialog: false,
        previewImage: '',
        previewTitle: '',
        newComment: '',
        showAllComments: false,
        currentUserAvatar: null,
        showEmojiPicker: false,
        loadingComment: false,
        statusLevel1Options: [{ value: 101 }, { value: 406 }],
        statusLevel2Options: [{ value: 203 }, { value: 407 }],
      };
    },

    computed: {
      hasCoordinates() {
        const { latitude, longitude } = this.data || {};
        return !!(latitude && longitude);
      },

      outletDetailsLeft() {
        return {
          "Outlet Code": this.data.outlet?.outlet_code || this.data.surveyOutlet?.outlet_code,
          "Brand": this.data.outlet?.brand || this.data.surveyOutlet?.brand,
          "Type": this.data.type_sio || this.data.surveyOutlet?.type_sio,
          "Region": this.data.region || this.data.surveyOutlet?.region,
          "Area": this.data.area || this.data.surveyOutlet?.area,
          "Start Time": this.formattedStartTime || 'N/A',
        };
      },

      outletDetailsRight() {
        return {
          "Cycle": this.data.outlet?.cycle || this.data.surveyOutlet?.cycle || 'N/A',
          "Visit Day": this.data.outlet?.visit_day || this.data.surveyOutlet?.visit_day || 'N/A',
          "Odd/Even": this.data.outlet?.odd_even || this.data.surveyOutlet?.odd_even || 'N/A',
          "Postal Code": this.data.outlet?.postal_code || this.data.surveyOutlet?.postal_code || 'N/A',
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

      currentUser() {
        return this.$store.state.user;
      },


    },

    mounted() {
      this.fetchData(this.id);
      this.getComment();
    },

    methods: {
      getStatusColor(status) {
        if (status === 3) return 'success';
        if (status === 0) return 'warning';
        return STATUS_COLORS[status];
      },
      getStatusLabelOption(value) {
        return EXISTING_SURVEY_STATUS[value]
          ? EXISTING_SURVEY_STATUS[value]
          : NEW_SURVEY_STATUS[value];
      },
      async updateStatus(status) {
        try {
          const labelStatus = this.getStatusLabelOption(status);
          const result = await this.$swal.fire({
            title: `${labelStatus}`,
            text: `You want to update this status to ${labelStatus}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!'
          });

          if (result.isConfirmed) {
            const data = {
              status: status,
            };
            const res = await updateStatus(this.id, data);

            if (res.statusCode === 200) {
              this.$toast.success(`Update status Successfully!`);
              await this.fetchData(this.id);
            }
          }
        } catch (error) {
          await this.$swal({
            title: 'Error!',
            text: error.data.message || 'Something went wrong!',
            icon: 'error'
          });
          console.error(error);
        }
      },
      // Comment Methods
      async postComment() {
        if (this.newComment.trim()) {
          this.loadingComment = true;
          const comment = {
            user_id: this.currentUser.id,
            activity_id: parseInt(this.id),
            outlet_id: parseInt(this.data.outlet?.id),
            content: this.newComment,
            is_liked: false,
          };

          try {
            const response = await createComment(comment);
            if (response.statusCode === 200) {
              this.getComment();
            }
            this.newComment = '';
          } catch (error) {
            Vue.prototype.$toast.error(error.response?.data?.message || "Failed to post comment");
          } finally {
            this.loadingComment = false;
          }
        }
      },

      async getComment() {
        try {
          this.loadingComment = true;
          const getComment = await getByActivityId(parseInt(this.id));
          this.comments = getComment.data;
        } catch (error) {
          Vue.prototype.$toast.error(error.response?.data?.message || "Failed to get comment");
        } finally {
          this.loadingComment = false;
        }
      },

      toggleEmojiPicker() {
        this.showEmojiPicker = !this.showEmojiPicker;
      },

      getChipColor(label, value) {
        if (!value || value === 'N/A') return 'grey';

        switch (label) {
          case 'Brand': return 'purple';
          case 'Type': return 'indigo';
          case 'Region': return 'blue';
          case 'Area': return 'cyan';
          case 'Cycle': return 'teal';
          case 'Visit Day': return 'green';
          case 'Odd/Even': return 'deep-orange';
          default: return 'blue-grey';
        }
      },

      openImagePreview(image, type) {
        if (type === 'before') {
          this.previewImage = image;
          this.previewTitle = 'Before';
        } else {
          this.previewImage = image;
          this.previewTitle = 'After';
        }
        this.dialog = true;
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
          console.log(this.data)
          this.activitySios = response.data.activitySios;
          this.activitySogs = response.data.activitySogs;
          this.activityBranches = response.data.activityBranches;
          this.activityPrograms = response.data.activityPrograms;
        } catch (error) {
          Vue.prototype.$toast.error(error.response?.data?.message || "Failed to load data");
        } finally {
          this.loading = false;
        }
      },

      handleBack() {
        this.$router.back();
      },

      openInMaps() {
        const { latitude, longitude } = this.data || {};
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

  .v-card-title,
  .v-card-subtitle {
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .v-chip {
    font-size: 0.9rem;
    font-weight: bold;
  }

  .activities-container {
    overflow-y: auto;
    max-height: 250px;
  }

  .activity-item {
    transition: transform 0.2s;
  }

  .activity-item:hover {
    transform: scale(1.05);
  }

  .v-card.outlined {
    transition: box-shadow 0.3s ease-in-out;
  }

  .v-card.outlined:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  /* Custom scrollbar styles */
  .activities-container::-webkit-scrollbar {
    width: 8px;
  }

  .activities-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .activities-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  .activities-container::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .comment-section {
    max-height: 220px;
    overflow-y: auto;
  }

  .comment-section::-webkit-scrollbar {
    width: 8px;
  }

  .comment-section::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .comment-section::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  .comment-section::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .comment-list {
    padding: 0;
  }

  .comment-item {
    margin-bottom: 12px;
  }

  .comment-header {
    display: flex;
    align-items: flex-start;
  }

  .comment-avatar {
    margin-right: 12px;
  }

  .comment-content {
    flex: 1;
  }

  .comment-text {
    margin-bottom: 4px;
    max-width: 100%;
    overflow-wrap: break-word;
    white-space: normal;
    word-break: break-all;
  }

  .username {
    font-weight: 600;
    margin-right: 8px;
  }

  .message {
    color: rgba(0, 0, 0, 0.87);
  }

  .comment-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
  }

  .timestamp {
    font-size: 12px;
  }

  .action-btn {
    min-width: unset;
    padding: 0;
  }

  .like-btn {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .replies-section {
    margin-left: 24px;
    margin-top: 8px;
  }

  .reply-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .reply-avatar {
    margin-right: 8px;
  }

  .comment-input-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
  }

  .comment-input {
    flex: 1;
  }

  .emoji-btn {
    cursor: pointer;
    opacity: 0.7;
  }

  .emoji-btn:hover {
    opacity: 1;
  }

  .send-btn {
    transition: all 0.3s ease;
  }

  .send-btn:disabled {
    opacity: 0.9;
  }

  .activity-card {
    transition: all 0.3s ease-in-out;
    border-radius: 12px;
  }
  .activity-card.on-hover {
    transform: translateY(-5px);
  }
  .image-card {
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
    border-radius: 8px;
  }
  .image-card.scale-up img {
    transform: scale(1.05);
  }
  .image-card img {
    transition: transform 0.3s ease-in-out;
  }
  .image-overlay {
    position: absolute;
    bottom: 8px;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.4);
    padding: 4px;
    transition: opacity 0.3s ease;
  }

  /* Responsive styles */
  @media (max-width: 600px) {
    .responsive-title {
      font-size: 1.5rem !important;
      line-height: 1.8rem;
    }
    .responsive-card-title {
      font-size: 1.1rem !important;
      line-height: 1.4rem;
    }
    .responsive-text {
      font-size: 0.9rem !important;
    }
    .responsive-chip {
      height: 28px !important;
    }
    .image-row {
      margin: 0;
    }
  }

  @media (min-width: 601px) and (max-width: 960px) {
    .responsive-title {
      font-size: 1.8rem !important;
    }
    .responsive-card-title {
      font-size: 1.25rem !important;
    }
  }

  .h-100 {
    height: 100%;
  }
</style>  