<template>
  <v-card class="v-card--material v-card v-sheet theme--light v-card--material--has-heading">
    <v-container fluid>
      <v-row style="height: 70px">
        <v-col cols="3">
          <v-tabs
            v-model="activeTab"
            dark
            grow
            class="rounded"
          >
            <v-tab
              v-for="tab in tabs"
              :key="tab.name"
              active-class="active-tab"
            >
              {{ tab.label }}
            </v-tab>
          </v-tabs>
        </v-col>
        <v-icon
          color="primary"
          size="2rem"
          :loading="loading"
          @click="fetchData"
        >
          mdi-refresh
        </v-icon>
      </v-row>

      <!-- Tab Content -->
      <v-tabs-items v-model="activeTab">
        <!-- Tab 1: Outlet Table -->
        <v-tab-item>
          <v-card style="box-shadow: unset;">
            <v-data-table
              :headers="tableHeaders"
              :items="tableData"
              :server-items-length="totalItems"
              :loading="loading"
              :options.sync="options"
              :search="search"
              hide-default-footer
              style="padding: 6px; border-radius: 20px"
              @update:options="fetchData"
            >
              <template v-slot:top>
                <v-row
                  class="justify-space-between"
                  style="align-items: baseline"
                >
                  <v-col
                    cols="4"
                    style="display: flex; justify-content: center; align-items: center; padding-right: unset; padding-left: 10px"
                  >
                    <v-text-field
                      v-model="search"
                      label="Search"
                      class="mx-5"
                      clearable
                      append-icon="mdi-magnify"
                      @click:append="handleSearch"
                    />
                  </v-col>
                  <v-col>
                    <div class="d-flex justify-end">
                      <v-btn
                        color="primary"
                        @click="openHandleAdd"
                      >
                        <v-icon>mdi-plus-box-multiple</v-icon>
                        <span class="mx-1">Import</span>
                      </v-btn>
                      <v-btn
                        color="primary"
                        @click="openHandleAdd"
                      >
                        <v-icon>mdi-plus-box-multiple</v-icon>
                        <span class="mx-1">Export</span>
                      </v-btn>
                      <v-btn
                        color="primary"
                        @click="openHandleAdd"
                      >
                        <v-icon>mdi-plus-box-multiple</v-icon>
                        <span class="mx-1">Add</span>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </template>
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item?.outlet_code }}</td>
                  <td>{{ item?.name }}</td>
                  <td>{{ item?.brand }}</td>
                  <td>{{ item?.unique_name }}</td>
                  <td>{{ item?.address_line }}</td>
                  <td>{{ item?.sub_district }}</td>
                  <td>{{ item?.district }}</td>
                  <td>{{ item?.city_or_regency }}</td>
                  <td>{{ item?.postal_code }}</td>
                  <td>{{ item?.outlet_type }}</td>
                  <td>{{ item?.region }}</td>
                  <td>{{ item?.area }}</td>
                  <td>{{ item?.cycle }}</td>
                  <td>
                    <v-btn
                      outlined
                      small
                      @click="openHandleUpdate(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      color="error"
                      outlined
                      small
                      @click="openConfirmDeleteDialog(item)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
            <v-row
              justify="center"
              class="py-3"
            >
              <v-pagination
                v-model="page"
                :length="totalPages"
                :total-visible="7"
                next-icon="mdi-menu-right"
                prev-icon="mdi-menu-left"
                @input="onPageChange"
              />
            </v-row>
          </v-card>
        </v-tab-item>

        <!-- Tab 2: Settings -->
        <v-tab-item>
          <v-card>
            <v-text-field>
              test
            </v-text-field>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
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
  </v-card>
</template>

<script>
  import { deleteOutlet, getAllOutlets, uploadOutlet } from '@/api/masterOutletService'
  import ConfirmDeleteDialog from '@/components/base/ConfirmDeleteDialog.vue'
  import UploadFormDialog from '@/components/base/UploadFormDialog.vue'
  import Vue from "vue";
  import {createData, updateData} from "@/api/userService";

  export default {
    name: 'MasterOutlet',
    components: {
      ConfirmDeleteDialog,
      UploadFormDialog,
    },
    data () {
      return {
        activeTab: 0,
        tabs: [
          { name: 'Active', label: 'Active' },
          { name: 'Non Active', label: 'Non Active' },
          // Add more tabs here
        ],
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
            text: 'Action',
            value: 'Action',
          },
        ],
        tableData: [],
        totalItems: 0,
        totalPages: 0,
        page: 1, // Current page number
        options: { page: 1, itemsPerPage: 10 },
        loading: false,
        selectedItem: null,
        isImportDialogOpen: false,
        isFormRoleDialog: false,
        isEdit: false,
        isConfirmDeleteDialogOpen: false,
        search: '',
      }
    },
    computed: {
      regionOptions () {
        return this.tableData.map(r => r.region) // Extract the region names
      },
    },
    watch: {
      page(value) {
        this.options.page = value;
        this.fetchData();
      },
      itemsPerPage(value) {
        this.options.itemsPerPage = value;
        this.fetchData();
      },
    },
    created () {
      this.fetchData()
    },
    methods: {
      onPageChange(newPage) {
        this.page = newPage;
      },
      openHandleAdd() {
        this.isEdit = false;
        this.selectedItem = null;
        this.isFormRoleDialog = true;
      },
      openHandleUpdate(item) {
        this.isEdit = true;
        this.selectedItem = {
          id: item.id,
        }
        this.isFormRoleDialog = true;
      },
      async handleSave(item) {
        try {
          if (this.isEdit) {
            const { id, ...itemWithoutId } = item;
            await updateData(id, itemWithoutId);
            Vue.prototype.$toast.success(`Update data Successfully!`);
          } else {
            await createData(item);
            Vue.prototype.$toast.success(`Create data Successfully!`);
          }
          this.closeFormDialog();
        } catch (error) {
          Vue.prototype.$toast.error(`${error.data.message}`);
          console.error(error);
        } finally {
          await this.fetchData();
        }
      },
      closeFormDialog() {
        this.isFormRoleDialog = false;
      },
      // Fetch all outlets and update tableData
      async fetchData () {
        this.loading = true
        try {
          const response = await getAllOutlets({
            page: this.options.page,
            limit: this.options.itemsPerPage,
            searchTerm: this.search,
          });
          this.tableData = response.data.data;
          this.totalItems = response.data.totalItems;
          this.totalPages = response.data.totalPages;
          this.options.page = response.data.currentPage;
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
      },
      handleSearch() {
        this.options.page = 1;
        this.fetchData();
      },
      openConfirmDeleteDialog(item) {
        this.selectedItem = item;
        this.isConfirmDeleteDialogOpen = true;
      },
      closeConfirmDeleteDialog() {
        this.isConfirmDeleteDialogOpen = false;
      },
      async handleDelete() {
        this.loading = true;
        const data = this.selectedItem;
        try {
          await deleteOutlet(data.id);
          Vue.prototype.$toast.success(`Deleted ${data.username} successfully!`);
        } catch (error) {
          Vue.prototype.$toast.error(`${error.data?.message}`);
          console.error(error);
        } finally {
          this.loading = false;
          this.closeConfirmDeleteDialog();
          this.fetchData();
        }
      },
    },
  }
</script>

<style scoped>
/* Customize the active tab style */
.active-tab {
  background-color: #4caf50 !important; /* Green background for active tab */
  color: #fff !important; /* White text for active tab */
  font-weight: bold; /* Bold text for active tab */
}
</style>
