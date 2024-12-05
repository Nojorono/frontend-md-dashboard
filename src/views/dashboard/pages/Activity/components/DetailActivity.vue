<template>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" md="12">
          <v-card class="pa-4" elevation="2" style="padding: 20px; border-radius: 20px;">
            <!-- Back Button -->
            <v-btn small fab outlined color="primary" @click="handleBack">
              <v-icon>mdi-backburger</v-icon>
            </v-btn>

            <!-- Header Section -->
            <v-card-title style="display: grid;" class="text-h3 font-weight-bold text-center mb-0">
              {{ data.name || 'Activity Detail' }} {{ data.outlet?.name }}
              <v-card-subtitle class="text-h5 grey--text text-center mb-4">
                {{ data.outlet?.address_line }}, {{ data.outlet?.sub_district }} - {{ data.outlet?.region }}
              </v-card-subtitle>
            </v-card-title>
  
            <!-- General Information Section -->
            <v-divider class="my-4" />
            <v-card-text>
              <v-row>
                <!-- Left Details -->
                <v-col cols="12" md="6">
                  <v-simple-table>
                    <template v-slot:default>
                      <thead><tr /></thead>
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
                      <thead><tr /></thead>
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
                    <v-col cols="6">
                      <v-btn color="primary" outlined class="mb-4" @click="openInMaps" :disabled="!hasCoordinates">
                        <v-icon left>mdi-map-marker</v-icon>
                        Open in Maps
                      </v-btn>
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
                          <v-carousel-item
                            v-for="(photo, index) in data.outlet?.photos"
                            :key="index"
                            :src="decodeURIComponent(photo)"
                            reverse-transition="fade-transition"
                            transition="fade-transition"
                          >
                            <v-img 
                              :src="decodeURIComponent(photo)"
                              height="550"
                              width="100%"
                              cover
                              class="d-flex align-center justify-center"
                            ></v-img>
                          </v-carousel-item>
                        </v-carousel>
                      </v-col>
                      <v-col cols="12">
                        <!-- Comments Section -->
                        <v-card class="comment-section">
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
                                          <span class="username">{{ comment.user_id }}</span>
                                          <p class="message">{{ comment.content }}</p>
                                        </div>
                                        <div class="comment-actions">
                                          <span class="timestamp">{{ formatDate(comment.created_at) }}</span>
                                          <!-- <v-btn text x-small class="like-btn" @click="toggleLike(comment)">
                                            <v-icon small :color="comment.isLiked ? 'red' : ''">
                                              {{ comment.isLiked ? 'mdi-heart' : 'mdi-heart-outline' }}
                                            </v-icon>
                                            <span>{{ comment.likes || 0 }}</span>
                                          </v-btn> -->
                                        </div>
                                      </div>
                                    </div>
                                  </v-list-item-content>
                                </v-list-item>
                              </template>
                              <v-alert v-else type="info" text>No comments yet</v-alert>
                              

                              <!-- Add Comment Input -->
                              <v-divider class="comment-divider"/>
                              <div class="comment-input-wrapper">
                                <v-avatar size="32" class="user-avatar">
                                  <v-img :src="currentUserAvatar || 'default-avatar.png'" />
                                </v-avatar>
                                <v-text-field
                                  v-model="newComment"
                                  placeholder="Add a comment..."
                                  dense
                                  hide-details
                                  class="comment-input"
                                  @keyup.enter="postComment"
                                >
                                  <template v-slot:append>
                                    <v-icon 
                                      class="emoji-btn"
                                      @click="toggleEmojiPicker"
                                    >
                                      mdi-emoticon-outline
                                    </v-icon>
                                    <v-btn
                                      icon
                                      small
                                      color="primary"
                                      outlined
                                      class="send-btn ml-2"
                                      :disabled="!newComment.trim() || loadingComment"
                                      @click="postComment"
                                      :style="{ borderRadius: '5px' }"
                                    >
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
                  <v-card outlined>
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
                            <v-carousel-item
                              v-for="(photo, index) in data.photos"
                              :key="index"
                              :src="decodeURIComponent(photo)"
                              reverse-transition="fade-transition"
                              transition="fade-transition"
                            >
                              <v-img 
                                :src="photo"
                                height="500"
                                width="100%"
                                cover
                                class="d-flex align-center justify-center"
                              ></v-img>
                            </v-carousel-item>
                          </v-carousel>
                        </v-card-text>
                      </v-col>

                      <v-col cols="6">
                        <v-card-title class="text-h5 font-weight-medium">Activity SOG</v-card-title>
                        <v-card-text>
                          <div style="max-height: 500px; overflow-y: auto;">
                            <v-simple-table dense class="elevation-1" style="padding: 5px;">
                              <template v-slot:default>
                                <thead>
                                  <tr>
                                    <th>No</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Notes</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="(item, index) in activitySogs" :key="item.id">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.description }}</td>
                                    <td>{{ item.notes }}</td>
                                  </tr>
                                </tbody>
                              </template>
                            </v-simple-table>
                          </div>
                        </v-card-text>
                      </v-col>
                    </v-row>

                    <v-divider></v-divider>

                    <!-- Activity SIO -->
                    <v-row>
                      <v-col cols="12">
                        <v-card-title class="d-flex justify-space-between">
                          <h3 class="text-h4 font-weight-medium">Activity SIO</h3>
                        </v-card-title>
                        <div class="activities-container" style="padding: 20px">
                          <v-row>
                            <v-col 
                              v-for="(activity, index) in activitySios" 
                              :key="index"
                              cols="12"
                              sm="6"
                              md="4"
                              lg="3"
                            >
                              <v-card
                                class="mx-auto"
                                outlined
                                hover
                                @click="openImagePreview(activity)"
                              >
                                <v-img
                                  :src="activity.photo"
                                  height="150"
                                  contain
                                ></v-img>
                                <v-card-title class="text-subtitle-1 justify-center" style="padding-bottom: 0;">
                                  {{ activity.name }}
                                </v-card-title>
                                <v-card-text class="text-subtitle-2 text-center" style="padding-top: 0;">
                                  {{ activity.description }}
                                </v-card-text>
                              </v-card>
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
            <v-img
              :src="previewImage"
              max-height="700"
              contain
              class="transparent"
            ></v-img>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import { getById } from '@/api/activityService';
  import { createComment, getByActivityId } from '@/api/commentService';

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
        comments: [],
        dialog: false,
        previewImage: '',
        previewTitle: '',
        newComment: '',
        showAllComments: false,
        currentUserAvatar: null,
        showEmojiPicker: false,
        loadingComment: false,
      };
    },
  
    computed: {
      hasCoordinates() {
        const { latitude, longitude } = this.data.outlet || {};
        return !!(latitude && longitude);
      },

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

      currentUser() {
        return this.$store.state.user;
      },
    },
  
    mounted() {
      this.fetchData(this.id);
      this.getComment();
    },
  
    methods: {
      // Comment Methods
      async postComment() {
        if (this.newComment.trim()) {
          this.loadingComment = true;
          const comment = {
            activity_id: parseInt(this.id),
            outlet_id: parseInt(this.data.outlet?.id),
            content: this.newComment,
            is_liked: false,
          };

          try {
            const response = await createComment(comment);
            if(response.statusCode === 200) {
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
        
        switch(label) {
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

      openImagePreview(activity) {
        this.previewImage = activity.photo;
        this.previewTitle = activity.name;
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
          this.activitySios = response.data.activitySios;
          this.activitySogs = response.data.activitySogs;
        } catch (error) {
          Vue.prototype.$toast.error(error.response?.data?.message || "Failed to load data");
        } finally {
          this.loading = false;
        }
      },

      handleBack() {
        this.$router.back();
      },

      handleSwitchChange(data, isActive) {
        if(isActive) {
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
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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
  </style>