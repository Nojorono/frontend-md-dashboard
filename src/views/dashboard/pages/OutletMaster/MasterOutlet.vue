<template>
  <v-card class="v-card--material v-card v-sheet theme--light v-card--material--has-heading elevation-2">
    <v-container fluid class="pa-4">
      <v-row class="mb-4" align="center">
        <v-col cols="4">
          <v-tabs
            v-model="activeTab"
            dark
            grow
            class="rounded-lg elevation-1"
            background-color="primary lighten-1"
          >
            <v-tab
              v-for="tab in tabs"
              :key="tab.name"
              active-class="active-tab"
              class="text-subtitle-1 font-weight-medium"
            >
              {{ tab.label }}
            </v-tab>
          </v-tabs>
        </v-col>

        <v-col cols="6">
          <div class="d-flex justify-end align-center">
            <v-autocomplete
                v-model="filter.region"
                :items="getRegionOptions" 
                item-text="name"
                item-value="name"
                label="Region"
                clearable
                dense
                outlined
                hide-details
                class="mr-4"
                @change="handleRegionChange"
                @click:clear="clearRegionFilter"
              >
              </v-autocomplete>
              <v-autocomplete
                v-model="filter.area"
                :items="getAreaOptions"
                item-text="name"
                item-value="name"
                label="Area"
                :disabled="!filter.region"
                clearable
                dense
                outlined
                hide-details
                small-chips
                deletable-chips
                @change="handleAreaChange"
                @click:clear="clearAreaFilter"
              >
              </v-autocomplete>
          </div>
        </v-col>
        <v-btn
          fab
          small
          color="primary"
          class="mx-2 align-self-center"
          :loading="loading"
          @click="fetchData"
        >
          <v-icon size="24">mdi-refresh</v-icon>
        </v-btn>
      </v-row>
      <v-row align="center" style="margin-top: -10px; margin-bottom: 5px;">
        <v-col cols="4">
          <v-text-field
            v-model="search"
            label="Search"
            dense
            outlined
            hide-details
            clearable
            prepend-inner-icon="mdi-magnify"
            @keyup.enter="handleSearch"
            @click:clear="handleClearSearch"
          />
        </v-col>
        <v-col cols="6">
          <div class="d-flex justify-end align-center">
            <v-autocomplete
                v-model="filter.brand"
                :items="getBrandOptions" 
                item-text="brand"
                item-value="brand"
                label="Brand"
                clearable
                dense
                outlined
                hide-details
                class="mr-4"
                @change="handleBrandChange"
                @click:clear="clearBrandFilter"
              >
              </v-autocomplete>
              <v-autocomplete
                v-model="filter.sio_type"
                :items="getSioTypeOptions"
                item-text="name"
                item-value="name"
                label="Sio Type"
                clearable
                dense
                outlined
                hide-details
                @change="handleSioTypeChange"
                @click:clear="clearSioTypeFilter"
              >
              </v-autocomplete>
          </div>
        </v-col>
        <v-spacer></v-spacer>
        <v-btn
          v-if="activeTab === 1"
          color="primary"
          class="text-none"
          @click="openImportDialog()"
        >
          <v-icon left>mdi-plus-box-multiple</v-icon>
          Import
        </v-btn>
      </v-row>
      <!-- Tab Content -->
      <v-tabs-items v-model="activeTab">
        <v-tab-item>
          <div class="rounded-lg">
            <v-data-table
              :headers="tableHeaders"
              :items="tableData"
              :server-items-length="totalItems"
              :loading="loading"
              :options.sync="options"
              :search="search"
              hide-default-footer
              class="small-table"
              @update:options="fetchData"
            >

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
                      small
                      color="warning"
                      class="text-none px-2"
                      @click="handleDetail(item.id)"
                    >
                      <v-icon small left>mdi-details</v-icon>
                      Detail
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
          </div>
        </v-tab-item>

        <!-- Tab 2: Settings -->
        <v-tab-item>
          <div class="rounded-lg">
            <v-data-table
              :headers="tableHeaders"
              :items="tableData"
              :server-items-length="totalItems"
              :loading="loading"
              :options.sync="options"
              :search="search"
              hide-default-footer
              class="small-table"
              @update:options="fetchData"
            >
              <template v-slot:top>
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
                          {{ item?.sio_type }}
                        </span>
                      </template>
                      <span>{{ item?.sio_type }}</span>
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
                      small
                      color="warning"
                      class="text-none px-2"
                      @click="handleDetail(item.id)"
                    >
                      <v-icon small left>mdi-details</v-icon>
                      Detail
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
          </div>
        </v-tab-item>
      </v-tabs-items>

      <!-- Confirm Delete Dialog -->
      <confirm-delete-dialog
        :dialog="isConfirmDeleteDialogOpen"
        @confirm="handleDelete"
        @close="closeConfirmDeleteDialog"
      />

      <!-- Import Dialog -->
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
  import { mapGetters } from "vuex";
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
        activeTab: 1,
        tabs: [
          { name: 'Non Active', label: 'Non Active', value: 0 },
          { name: 'Active', label: 'Active', value: 1 },
        ],
        tableHeaders: [
          { text: 'No', value: 'number', sortable: false, class: 'text-left', width: '5%' },
          {
            text: 'Region',
            value: 'region',
            sortable: false,
          },
          {
            text: 'Area',
            value: 'area',
            sortable: false,
          },
          {
            text: 'Address',
            value: 'address_line',
            sortable: false,
          },
          {
            text: 'Outlet Code',
            value: 'outlet_code',
            sortable: false,
          },
          {
            text: 'Name',
            value: 'name',
            sortable: false,
          },
          {
            text: 'Brand',
            value: 'brand',
            sortable: false,
          },
          {
            text: 'Outlet Sio Type',
            value: 'outlet_type',
            sortable: false,
          },
          {
            text: 'Cycle',
            value: 'cycle',
            sortable: false,
          },
          {
            text: 'Action',
            value: 'Action',
            sortable: false,
          },
        ],
        tableData: [],
        totalItems: 0,
        totalPages: 0,
        page: 1,
        options: { page: 1, itemsPerPage: 10 },
        loading: false,
        selectedItem: null,
        isImportDialogOpen: false,
        isFormRoleDialog: false,
        isEdit: false,
        isConfirmDeleteDialogOpen: false,
        search: '',
        regionOptions: [],
        areaOptions: [],
        filter: {
          region: '',
          area: '',
          brand: '',
          sio_type: '',
        },
      }
    },
    computed: {
      ...mapGetters(['getUser','getAreaOptions', 'getRegionOptions', 'getBrandOptions', 'getSioTypeOptions']),
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
      activeTab() {
        this.options.page = 1;
        this.page = 1;
        this.fetchData();
      },
    },
    mounted () {
      this.fetchData()
    },
    methods: {

    clearBrandFilter() {
      this.filter.brand = '';
      this.fetchData();
    },

    clearSioTypeFilter() {
      this.filter.sio_type = '';
      this.fetchData();
    },

    clearRegionFilter() {
      this.filter.region = '';
      this.filter.area = '';
      this.fetchData();
    },

    clearAreaFilter() {
      this.filter.area = '';
      this.fetchData();
    },

    handleBrandChange(value) {
      this.options.page = 1;
      this.filter.brand = value;
      this.fetchData();
    },

    handleSioTypeChange(value) {
      this.options.page = 1;
      this.filter.sio_type = value;
      this.fetchData();
    },

    async handleRegionChange(value) {
      this.options.page = 1;
      this.filter.region = value;
      this.filter.area = '';
      await this.fetchData();
    },

    async handleAreaChange(value) {
      this.options.page = 1;
      this.filter.area = value;
      await this.fetchData();
    },
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
        } finally {
          await this.fetchData();
        }
      },
      closeFormDialog() {
        this.isFormRoleDialog = false;
      },
      async fetchData () {
        this.loading = true
        try {
          if (this.getRegionOptions.length === 1) {
          this.filter.region = this.getRegionOptions[0];
        }
        if (this.getAreaOptions.length === 1) {
          this.filter.area = this.getAreaOptions[0];
        }
          const response = await getAllOutlets({
            page: this.options.page,
            limit: this.options.itemsPerPage,
            searchTerm: this.search,
            isActive: this.activeTab,
            filter: this.filter,
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
      handleClearSearch() {
        this.search = '';
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
.active-tab {
  background-color: #1976d2 !important;
  color: white !important;
  font-weight: 500 !important;
}

.small-table {
  font-size: 13px;
  border-radius: 8px;
}

.small-table th,
.small-table td {
  padding: 8px 16px;
  height: 40px;
}

.small-table th {
  font-weight: 500;
  background-color: #f5f5f5;
}

.small-table td {
  font-weight: normal;
}

.v-data-table ::v-deep .v-data-table__wrapper {
  border-radius: 8px;
}

.v-btn {
  text-transform: none !important;
  letter-spacing: 0.5px;
}
</style>
