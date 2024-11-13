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
              class="small-table"
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
                        @click="openImportDialog()"
                      >
                        <v-icon>mdi-plus-box-multiple</v-icon>
                        <span class="mx-1">Import</span>
                      </v-btn>
<!--                      <v-btn-->
<!--                        color="primary"-->
<!--                        @click="openHandleAdd"-->
<!--                      >-->
<!--                        <v-icon>mdi-plus-box-multiple</v-icon>-->
<!--                        <span class="mx-1">Export</span>-->
<!--                      </v-btn>-->
<!--                      <v-btn-->
<!--                        color="primary"-->
<!--                        @click="openHandleAdd"-->
<!--                      >-->
<!--                        <v-icon>mdi-plus-box-multiple</v-icon>-->
<!--                        <span class="mx-1">Add</span>-->
<!--                      </v-btn>-->
                    </div>
                  </v-col>
                </v-row>
              </template>
              <template v-slot:item="{ item, index }">
                <tr>
                  <td>{{ (options.page - 1) * options.itemsPerPage + index + 1 }}</td>
                  <td>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <span
                          v-bind="attrs"
                          class="text-truncate"
                          style="max-width: 150px; display: inline-block;"
                          v-on="on"
                        >
                          {{ item?.region }}
                        </span>
                      </template>
                      <span>{{ item?.region }}</span>
                    </v-tooltip>
                  </td>
                  <td>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <span
                          v-bind="attrs"
                          class="text-truncate"
                          style="max-width: 150px; display: inline-block;"
                          v-on="on"
                        >
                          {{ item?.area }}
                        </span>
                      </template>
                      <span>{{ item?.area }}</span>
                    </v-tooltip>
                  </td>
                  <td>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <span
                          v-bind="attrs"
                          class="text-truncate"
                          style="max-width: 150px; display: inline-block;"
                          v-on="on"
                        >
                          {{ item?.address_line }}
                        </span>
                      </template>
                      <span>{{ item?.address_line }}</span>
                    </v-tooltip>
                  </td>
                  <td>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <span
                          v-bind="attrs"
                          class="text-truncate"
                          style="max-width: 150px; display: inline-block;"
                          v-on="on"
                        >
                          {{ item?.outlet_code }}
                        </span>
                      </template>
                      <span>{{ item?.outlet_code }}</span>
                    </v-tooltip>
                  </td>
                  <td>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <span
                          v-bind="attrs"
                          class="text-truncate"
                          style="max-width: 150px; display: inline-block;"
                          v-on="on"
                        >
                          {{ item?.name }}
                        </span>
                      </template>
                      <span>{{ item?.name }}</span>
                    </v-tooltip>
                  </td>
                  <td>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <span
                          v-bind="attrs"
                          class="text-truncate"
                          style="max-width: 150px; display: inline-block;"
                          v-on="on"
                        >
                          {{ item?.brand }}
                        </span>
                      </template>
                      <span>{{ item?.brand }}</span>
                    </v-tooltip>
                  </td>
                  <td>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <span
                          v-bind="attrs"
                          class="text-truncate"
                          style="max-width: 150px; display: inline-block;"
                          v-on="on"
                        >
                          {{ item?.outlet_type }}
                        </span>
                      </template>
                      <span>{{ item?.outlet_type }}</span>
                    </v-tooltip>
                  </td>
                  <td>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <span
                          v-bind="attrs"
                          class="text-truncate"
                          style="max-width: 150px; display: inline-block;"
                          v-on="on"
                        >
                          {{ item?.cycle }}
                        </span>
                      </template>
                      <span>{{ item?.cycle }}</span>
                    </v-tooltip>
                  </td>
                  <td>
                    <v-btn
                      outlined
                      small
                      color="warning"
                      @click="handleDetail(item.id)"
                    >
                      <v-icon>mdi-details</v-icon>
                      detail
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
      <import-outlet
        :dialog="isImportDialogOpen"
        @close="closeImportDialog"
        @upload="handleImportSubmit"
      />
    </v-container>
  </v-card>
</template>

<script>
  import { deleteOutlet, getAllOutlets, uploadOutlet } from '@/api/masterOutletService'
  import ConfirmDeleteDialog from '@/components/base/ConfirmDeleteDialog.vue'
  import Vue from "vue";
  import {createData, updateData} from "@/api/userService";
  import ImportOutlet from "@/views/dashboard/pages/OutletMaster/components/ImportOutlet.vue";

  export default {
    name: 'MasterOutlet',
    components: {
      ImportOutlet,
      ConfirmDeleteDialog,
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
          { text: 'No', value: 'number', sortable: false, class: 'text-left', width: '5%' },
          {
            text: 'Region',
            value: 'region',
          },
          {
            text: 'Area',
            value: 'area',
          },
          {
            text: 'Address',
            value: 'address_line',
          },
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
            text: 'Outlet Sio Type',
            value: 'outlet_type',
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
        return this.tableData.map(r => r.region)
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
    mounted () {
      this.fetchData()
    },
    methods: {
      async handleDetail(id) {
        await this.$router.push({
          name: 'Outlet Detail',
          params: { id },
        });
      },
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
      openImportDialog () {
        this.isImportDialogOpen = true
      },
      closeImportDialog () {
        this.isImportDialogOpen = false
      },
      async handleImportSubmit (data)
      {
        this.loading = true
        try {
          await uploadOutlet(data);
          Vue.prototype.$toast.success(`Upload data Successfully!`);
        } catch (error) {
          Vue.prototype.$toast.error(`${error.data.message}`)
        } finally {
          this.loading = false
          await this.fetchData()
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
          await this.fetchData();
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

.small-table {
  font-size: 12px;
}

.small-table th,
.small-table td {
  padding: 4px 8px;
  height: 30px;
}

.small-table th {
  font-weight: bold;
}

.small-table td {
  font-weight: normal;
}
</style>
