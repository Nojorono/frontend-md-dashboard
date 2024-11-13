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
          </v-card-title>

          <!-- General Information Section -->
          <v-divider class="mb-4" />
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
            <v-row>
              <v-col
                cols="12"
                class="d-flex justify-space-between align-center"
              >
                <v-chip
                  :color="data.is_active ? 'green' : 'red'"
                  outlined
                  class="ma-2"
                >
                  {{ data.is_active ? 'Active' : 'Inactive' }}
                </v-chip>
                <div><strong>Remarks :</strong> {{ data.remarks || 'None' }}</div>
              </v-col>
            </v-row>

            <!-- Location with Map Link -->
            <v-row class="mt-4">
              <v-col cols="12">
                <h3 class="text-h6 font-weight-medium mb-3">
                  Location
                </h3>
                <v-row class="align-center">
                  <v-col cols="6">
                    <p><strong>Latitude:</strong> {{ data.latitude }}</p>
                    <p><strong>Longitude:</strong> {{ data.longitude }}</p>
                  </v-col>
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
              <v-col cols="12">
                <h3 class="text-h6 font-weight-medium mb-3">
                  Photos
                </h3>
                <v-row>
                  <v-col
                    v-for="(photo, index) in data.photos"
                    :key="index"
                    cols="6"
                    md="3"
                  >
                    <img
                      :src="decodeURIComponent(photo)"
                      alt="Outlet Photo"
                      class="rounded"
                      style="width: 100%; height: auto;"
                    >
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- Footer Info -->
          <v-divider class="my-4" />
          <v-card-actions class="justify-end grey--text text--darken-1">
            <div class="mx-2"><strong>Created By:</strong> {{ data.created_by }}</div>
            <div class="mx-2"><strong>Created At:</strong> {{ new Date(data.created_at).toLocaleString() }}</div>
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
    async fetchData(id) {
      this.loading = true;
      try {
        const response = await getOutletById(id);
        console.log(response);
        this.data = response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        Vue.prototype.$toast.error(error.response?.data?.message || "Failed to load data");
      } finally {
        this.loading = false;
      }
    },
    handleBack(){
      this.$router.back();
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
