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
          <!-- Outlet Information Header -->
          <v-card-title
            style="display: grid;"
            class="text-h3 font-weight-bold text-center mb-0"
          >
            {{ data.name || 'Outlet Detail' }}
            <v-card-subtitle class="text-caption grey--text text-center mb-4">
              {{ data.address_line }}, {{ data.sub_district }} - {{ data.region }}
            </v-card-subtitle>
            <v-row>
              <v-col
                cols="12"
                class="d-flex justify-space-between align-center"
              >
                <v-switch
                  v-model="data.is_active"
                  :label="data.is_active ? 'Active' : 'Inactive'"
                  :color="data.is_active ? 'green' : 'red'"
                  @change="handleSwitchChange(data, data.is_active)"
                ></v-switch>
                <div><strong>Remarks :</strong> {{ data.remarks || 'None' }}</div>
              </v-col>
            </v-row>
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
                        <td>{{ value }}</td>
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
                        <td>{{ value }}</td>
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
              <v-col cols="6">
                <v-card outlined>
                  <v-card-title class="d-flex justify-space-between">
                    <h3 class="text-h3 font-weight-medium mb-3">
                      Photos
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
                            v-for="(photo, index) in data.photos"
                            :key="index"
                            :src="`${decodeURIComponent(photo)}`"
                            reverse-transition="fade-transition"
                            transition="fade-transition"
                          />
                        </v-carousel>
                      </template>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card outlined>
                  <v-card-title class="d-flex justify-space-between">
                    <h3 class="text-h3 font-weight-medium mb-3">
                      Activity
                    </h3>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <!-- Activity List -->
                    <v-list dense>
                      <v-list-item v-for="(activity, index) in activities" :key="index">
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-bold">
                            {{ activity.text }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{ formatDate(activity.timestamp) }}
                          </v-list-item-subtitle>

                          <!-- Comments Section -->
                          <v-list dense>
                            <v-list-item
                              v-for="(comment, commentIndex) in visibleComments(activity)"
                              :key="commentIndex"
                            >
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-icon small class="mr-2">mdi-account</v-icon> {{ comment.user }}
                                </v-list-item-title>
                                <v-list-item-subtitle>{{ comment.text }}</v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>

                            <!-- Expand Comments Button -->
                            <v-btn
                              v-if="activity.comments.length > 2"
                              text
                              @click="toggleComments(index)"
                            >
                              {{ activity.showAllComments ? 'Show less comments' : 'Show more comments' }}
                            </v-btn>
                          </v-list>

                          <!-- Add Comment -->
                          <v-row class="mt-2">
                            <v-col cols="9">
                              <v-text-field
                                v-model="activity.newComment"
                                label="Add a comment"
                                outlined
                                dense
                                clearable
                              ></v-text-field>
                            </v-col>
                            <v-col cols="3">
                              <v-btn
                                color="primary"
                                @click="addComment(index)"
                                :disabled="!activity.newComment"
                              >
                                Add Comment
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
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
  </v-container>
</template>

<script>
import { getOutletById } from '@/api/masterOutletService';
import Vue from 'vue';

export default {
  name: 'OutletDetail',
  data() {
    return {
      id: this.$route.params.id,
      data: {},
      loading: false,
      activities: [
        {
          text: "Activity 1",
          timestamp: new Date(),
          comments: [
            { user: "Admin", text: "Welcome back!" },
            { user: "User1", text: "Thanks!" },
            { user: "User2", text: "Good to see you!" },
            { user: "User3", text: "Happy to be here!" },
          ],
          newComment: "",
          showAllComments: false,
        },
        {
          text: "Activity 2",
          timestamp: new Date(),
          comments: [
            { user: "Admin", text: "Profile updated successfully" },
          ],
          newComment: "",
          showAllComments: false,
        },
      ],
    };
  },

  computed: {
    outletDetailsLeft() {
      return {
        "Outlet Code": this.data.outlet_code,
        "Brand": this.data.brand,
        "Type": this.data.outlet_type,
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
    addComment(activityIndex) {
      const activity = this.activities[activityIndex];
      if (activity.newComment.trim()) {
        activity.comments.push({
          user: "User",
          text: activity.newComment,
        });
        activity.newComment = "";
      }
    },
    toggleActivity(activityIndex) {
      const activity = this.activities[activityIndex];
      activity.showAllComments = !activity.showAllComments;
    },
    toggleComments(activityIndex) {
      const activity = this.activities[activityIndex];
      activity.showAllComments = !activity.showAllComments;
    },
    visibleComments(activity) {
      return activity.showAllComments
        ? activity.comments
        : activity.comments.slice(0, 2);
    },
    formatDate(date) {
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
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
    handleBack(){
      this.$router.back();
    },
    handleSwitchChange(data, isActive) {
      console.log(data, isActive);
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
</style>
