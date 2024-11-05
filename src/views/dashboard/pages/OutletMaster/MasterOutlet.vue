<template>
  <v-container fluid>
    <v-row class="justify-end">
      <v-col
        cols="1"
        style="max-width: none!important;"
      >
        <v-btn
          color="primary"
          style="margin: unset!important;"
          @click="handleImportDialog(true)"
        >
          <v-icon>mdi-file-import</v-icon>
          <span class="mx-1">Import</span>
        </v-btn>
      </v-col>
      <v-col
        cols="1"
        style="max-width: none!important;"
      >
        <v-btn
          color="primary"
          style="margin: unset!important;"
        >
          <v-icon>mdi-file-export</v-icon>
          <span class="mx-1">Export</span>
        </v-btn>
      </v-col>
    </v-row>
    <advanced-table
      :headers="tableHeaders"
      :rows="tableData"
      title="Master Outlet Table"
      color="success"
      dark
      icon="mdi-application-cog"
      :is-filter="true"
      :is-search="true"
      :filters="regionOptions"
      :loading="loading"
      :filter-flag="filterFlag"
      @delete="openConfirmDeleteDialog"
      @refresh="fetchOutlets"
    />
    <!-- Confirm Delete Dialog -->
    <confirm-delete-dialog
      :dialog="isConfirmDeleteDialogOpen"
      @confirm="handleDelete"
      @close="closeConfirmDeleteDialog"
    />
    <!-- Import Delete Dialog -->
    <upload-form-dialog
      :dialog="isImportDialogOpen"
      @close="handleImportDialog"
      @upload="handleImportSubmit"
    />
  </v-container>
</template>

<script>
  import AdvancedTable from '@/components/base/VTable.vue'
  import { deleteOutlet, getAllOutlets, uploadOutlet } from '@/api/masterOutletService'
  import ConfirmDeleteDialog from '@/components/base/ConfirmDeleteDialog.vue'
  import UploadFormDialog from '@/components/base/UploadFormDialog.vue'
  import Vue from "vue";

  export default {
    name: 'MasterOutlet',
    components: {
      ConfirmDeleteDialog,
      AdvancedTable,
      UploadFormDialog,
    },
    data () {
      return {
        tableHeaders: [
          {
            text: 'Outlet Code',
            value: 'outlet_code',
          },
          {
            text: 'Name',
            value: 'name',
          },
          {
            text: 'Brand',
            value: 'brand',
          },
          {
            text: 'Unique Name',
            value: 'unique_name',
          },
          {
            text: 'Address',
            value: 'address_line',
          },
          {
            text: 'Sub District',
            value: 'sub_district',
          },
          {
            text: 'District',
            value: 'district',
          },
          {
            text: 'City or Regency',
            value: 'city_or_regency',
          },
          {
            text: 'Postal Code',
            value: 'postal_code',
          },
          {
            text: 'Latitude',
            value: 'latitude',
          },
          {
            text: 'Longitude',
            value: 'longitude',
          },
          {
            text: 'Outlet Type',
            value: 'outlet_type',
          },
          {
            text: 'Region',
            value: 'region',
          },
          {
            text: 'Area',
            value: 'area',
          },
          {
            text: 'Cycle',
            value: 'cycle',
          },
          {
            text: 'Is Active',
            value: 'is_active',
          },
          {
            text: 'Visit Day',
            value: 'visit_day',
          },
          {
            text: 'Odd/Even',
            value: 'odd_even',
          },
          {
            text: 'Photos',
            value: 'photos',
          },
          {
            text: 'Remarks',
            value: 'remarks',
          },
        ],
        tableData: [],
        availableRegion: [],
        filterFlag: 'region',
        isConfirmDeleteDialogOpen: false,
        isImportDialogOpen: false,
        loading: false,
        selectedItem: null,
      }
    },
    computed: {
      regionOptions () {
        return this.tableData.map(r => r.region) // Extract the region names
      },
    },
    created () {
      this.fetchOutlets()
    },
    methods: {
      // Fetch all outlets and update tableData
      async fetchOutlets () {
        this.loading = true
        try {
          const response = await getAllOutlets()
          this.tableData = response.data.data
        } catch (error) {
          Vue.prototype.$toast.error(`${error.data.message}`)
        } finally {
          this.loading = false
        }
      },
      // IMPORT
      handleImportDialog (e) {
        this.isImportDialogOpen = e
      },
      async handleImportSubmit (data)
      {
        this.loading = true
        try {
          await uploadOutlet(data);
          await this.fetchOutlets()
        } catch (error) {
          Vue.prototype.$toast.error(`${error.data.message}`)
        } finally {
          this.loading = false
        }
      }
,
      // DELETE
      openConfirmDeleteDialog (index) {
        this.selectedItem = {
          index: index,
          data: this.tableData[index],
        }
        this.isConfirmDeleteDialogOpen = true
      },
      closeConfirmDeleteDialog () {
        this.isConfirmDeleteDialogOpen = false
      },
      async handleDelete () {
        this.loading = true
        const itemToDelete = this.selectedItem
        try {
          await deleteOutlet(itemToDelete.data.id)
          this.tableData.splice(itemToDelete.index, 1)
          await this.fetchOutlets()
        } catch (error) {
          Vue.prototype.$toast.error(`${error.data.message}`)
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>
