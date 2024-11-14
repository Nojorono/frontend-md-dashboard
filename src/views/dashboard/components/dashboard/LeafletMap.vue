<template>
  <v-card class="v-card--material v-card v-sheet theme--light v-card--material--has-heading">
    <div
      id="map"
      style="height: 500px;"
    />
  </v-card>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { getAllOutlets } from '@/api/masterOutletService';

export default {
  name: 'LeafletMap',
  data() {
    return {
      markersData: [], // Holds raw data from API
      markersLayer: L.markerClusterGroup(), // Layer for marker clustering
      map: null, // Holds the map instance
    };
  },
  async created() {
    await this.fetchData();
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      // Initialize map centered on Indonesia
      this.map = L.map('map').setView([-2.5489, 118.0149], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
      this.map.addLayer(this.markersLayer);
    },

    async fetchData() {
      try {
        const {data} = await getAllOutlets({page: 1, limit: 10, searchTerm: ''});
        this.markersData = data.data;
        this.addMarkersToMap(this.markersData); // Initially show all markers
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },

    addMarkersToMap(data) {
      console.log(data)
      const dummyData = [
        {
          latitude: -6.1751,   // Jakarta, Indonesia
          longitude: 106.8650,
          name: "Jakarta Mall",
          code_outlet: "JKT001",
          area: "shop",
          color: 'blue'
        },
        {
          latitude: -7.2504,   // Surabaya, Indonesia
          longitude: 112.7688,
          name: "Surabaya Plaza",
          code_outlet: "SBY002",
          area: "shop",
          color: 'blue'
        },
        {
          latitude: -8.4095,   // Bali, Indonesia
          longitude: 115.1889,
          name: "Bali Resort",
          code_outlet: "BALI003",
          area: "restaurant",
          color: 'blue'
        },
        {
          latitude: -6.9024,   // Medan, Indonesia
          longitude: 107.6241,
          name: "Medan Hospital",
          code_outlet: "MDN004",
          area: "hospital",
          color: 'blue'
        },
        {
          latitude: -3.2140,   // Makassar, Indonesia
          longitude: 119.4321,
          name: "Makassar Mall",
          code_outlet: "MKS005",
          area: "shop",
          color: 'blue'
        },
        {
          latitude: -3.2141,   // Makassar, Indonesia
          longitude: 119.4321,
          name: "Makassar Mall",
          code_outlet: "MKS005",
          area: "shop",
          color: 'blue'
        },
        {
          latitude: -7.5700,   // Yogyakarta, Indonesia
          longitude: 110.3602,
          name: "Yogyakarta Hotel",
          code_outlet: "YOG006",
          area: "restaurant",
          color: 'blue'
        },
        {
          latitude: -6.8890,   // Bandung, Indonesia
          longitude: 107.6104,
          name: "Bandung Office",
          code_outlet: "BDG007",
          area: "office",
          color: 'blue'
        },
        {
          latitude: -6.5000,   // Palembang, Indonesia
          longitude: 104.7500,
          name: "Palembang Hospital",
          code_outlet: "PLG008",
          area: "hospital",
          color: 'blue'
        },
        {
          latitude: -8.3405,   // Lombok, Indonesia
          longitude: 116.4133,
          name: "Lombok Resort",
          code_outlet: "LOM009",
          area: "restaurant",
          color: 'blue'
        },
      ];
      this.markersLayer.clearLayers();
      dummyData.forEach(({latitude, longitude, name, code_outlet, area, color}) => {
        const marker = L.marker([latitude, longitude], {
          icon: L.divIcon({
            className: 'mdi-icon',
            html: `<span class="mdi mdi-map-marker-outline" style="font-size: 32px; color: ${color};"></span>`,  // mdi-map-marker-outline icon with dynamic color
            iconSize: [32, 32],  // Size of the icon
            iconAnchor: [16, 32],  // Anchor point of the icon
            popupAnchor: [0, -32], // Popup position
          })
        }).bindPopup(`<b>${name}</b><br>${code_outlet}`);
        marker.category = area;
        this.markersLayer.addLayer(marker);
      });
    },

    filterMarkers(event) {
      const selectedCategory = event.target.value;
      const filteredData = selectedCategory === 'all'
        ? this.markersData
        : this.markersData.filter(item => item.category === selectedCategory);
      this.addMarkersToMap(filteredData);
    },
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
