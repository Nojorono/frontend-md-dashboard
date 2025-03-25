<template>
  <v-card class="v-card--material v-card v-sheet theme--light v-card--material--has-heading">
    <v-card-subtitle>Interactive map showing all outlet locations with filtering capabilities</v-card-subtitle>
    
    <v-row>
      <v-col cols="8">
        <div id="map" style="height: 600px; border-radius: 8px;" />
      </v-col>
      <v-col cols="4">
        <v-card class="pa-4" outlined>
          <v-card-title class="subtitle-1">Filter Options</v-card-title>
          
          <v-autocomplete
            v-model="filter.region"
            :items="getRegionOptions"
            item-text="name"
            item-value="name"
            label="Filter by Region"
            clearable
            dense
            outlined
            @click:clear="filter.area = ''"
            @change="filterMarkers"
          />

          <v-autocomplete
            v-model="filter.area"
            :items="filteredAreaOptions"
            :disabled="!filter.region"
            item-text="area"
            item-value="area"
            label="Filter by Area"
            clearable
            dense
            outlined
            @change="filterMarkers"
          />
          
          <v-autocomplete
            v-model="filter.brand"
            :items="getBrandOptions"
            item-text="brand"
            item-value="brand"
            label="Filter by Brand"
            clearable
            dense
            outlined
            @change="filterMarkers"
          />
          
          <v-autocomplete
            v-model="filter.sio_type"
            :items="getSioTypeOptions"
            item-text="name"
            item-value="name"
            label="Filter by SIO Type"
            clearable
            dense
            outlined
            @change="filterMarkers"
          />

          <v-card-text class="pt-4">
            <div class="subtitle-2 mb-2">Display description:</div>
            <v-chip small class="mr-2 mb-2" color="primary">
              <v-icon left small>mdi-map-marker</v-icon>
              Single Outlet
            </v-chip>
            <v-chip small class="mr-2 mb-2" color="warning">
              <v-icon left small>mdi-hexagon</v-icon>
              Cluster
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card-text class="text-center caption grey--text">
      <v-icon small class="mr-1">mdi-information</v-icon>
      Click on markers to view outlet details. Use the cluster feature to manage dense areas.
    </v-card-text>
  </v-card>
</template>

<script>
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet.markercluster';
  import 'leaflet.markercluster/dist/MarkerCluster.css';
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
  import { getAllOutletByFilter } from '@/api/dashboardService';
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'LeafletMap',
    data() {
      return {
        markersData: [],
        markersLayer: L.markerClusterGroup({
          maxClusterRadius: 15,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: true,
          zoomToBoundsOnClick: true
        }),
        map: null,
        filter: {
          region: '',
          area: '',
          brand: '',
          sio_type: '',
        },
      };
    },
    computed: {
      ...mapGetters(["getUser", "getRegionOptions", "getAreaOptions", "getBrandOptions", "getSioTypeOptions", "getLoading"]),
      ...mapActions(["showLoading", "hideLoading"]),
      filteredAreaOptions() {
        if (!this.filter.region) return this.getAreaOptions;

        const selectedRegion = this.getRegionOptions.find(
          (region) => region.name === this.filter.region
        );

        if (!selectedRegion) return this.getAreaOptions;

        return this.getAreaOptions.filter(
          (area) => area.region_id === selectedRegion.id
        );
      },
    },
    mounted() {
      this.initMap();
    },
    methods: {
      initMap() {
        // Initialize map centered on Indonesia
        this.map = L.map('map', {
          zoomControl: true,
          minZoom: 4,
          maxZoom: 18
        }).setView([-2.5489, 119.0149], 5);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        this.map.addLayer(this.markersLayer);
        this.fetchData();
      },

      async fetchData() {
        this.$store.dispatch('showLoading');
        try {
          const response = await getAllOutletByFilter({
            filter: this.filter,
          });
          this.markersData = response.data.data;
          this.addMarkersToMap(this.markersData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          this.$store.dispatch('hideLoading');
        }
      },

      addMarkersToMap() {
        this.markersLayer.clearLayers();
        this.markersData.forEach(({ latitude, longitude, region, area, brand, sio_type, color }) => {
          const marker = L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: 'mdi-icon',
              html: `<span class="mdi mdi-map-marker" style="font-size: 32px; color: ${color || '#1976D2'};"></span>`,
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            })
          }).bindPopup(`
            <div class="popup-content">
              <h3>${brand}</h3>
              <p><strong>Type:</strong> ${sio_type}</p>
              <p><strong>Region:</strong> ${region}</p>
              <p><strong>Area:</strong> ${area}</p>
            </div>
          `, {
            maxWidth: 300,
            className: 'custom-popup'
          });
          this.markersLayer.addLayer(marker);
        });
      },

      filterMarkers() {
        this.markersLayer.clearLayers();
        this.fetchData();
      },
    },
  };
</script>

<style scoped>
  #map {
    width: 100%;
    height: 100%;
    border: 1px solid #e0e0e0;
  }

  ::v-deep .custom-popup .leaflet-popup-content-wrapper {
    border-radius: 8px;
    padding: 8px;
  }

  ::v-deep .popup-content h3 {
    margin: 0 0 8px 0;
    color: #1976D2;
  }

  ::v-deep .popup-content p {
    margin: 4px 0;
  }
</style>
