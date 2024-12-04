<template>
  <v-card class="v-card--material v-card v-sheet theme--light v-card--material--has-heading">
    <v-container fluid>
      <v-col cols="4">
        <v-tabs
          v-model="activeTab"
          dark
          grow
          class="rounded"
        >
          <v-tab
            v-for="tab in tabs"
            :key="tab.name"
            active-class="primary"
          >
            {{ tab.label }}
          </v-tab>
        </v-tabs>
      </v-col>

<!--      <v-icon-->
<!--        color="primary"-->
<!--        size="2rem"-->
<!--        :loading="loading"-->
<!--        @click="fetchData"-->
<!--      >-->
<!--        mdi-refresh-->
<!--      </v-icon>-->
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
                        @click="openHandleAdd"
                      >
                        <v-icon>mdi-plus-box-multiple</v-icon>
                        <span class="mx-1">Add</span>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </template>
              <template v-slot:item="{ item, index }">
                <tr>
                  <td>{{ (options.page - 1) * options.itemsPerPage + index + 1 }}</td>
                  <td>
                    <span>{{ item?.region }}</span>
                  </td>
                  <td>
                    <span>{{ item?.area }}</span>
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
                    <span>{{ item?.outlet_code }}</span>
                  </td>
                  <td>
                    <span>{{ item?.brand }}</span>
                  </td>
                  <td>
                    <span>{{ item?.sio_type }}</span>
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
                    <span>{{ item?.cycle }}</span>
                  </td>
                  <td>
                    <v-btn
                      outlined
                      small
                      @click="openHandleUpdate(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      outlined
                      small
                      color="warning"
                      @click="handleDetail(item.id)"
                    >
                      <v-icon>mdi-details</v-icon>
                      detail
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
          tab 1
        </v-tab-item>

        <!-- Tab 2: Settings -->
        <v-tab-item>
          tab 2
        </v-tab-item>
      </v-tabs-items>
      <!-- Confirm Delete Dialog -->
      <confirm-delete-dialog
        :dialog="isConfirmDeleteDialogOpen"
        @confirm="handleDelete"
        @close="closeConfirmDeleteDialog"
      />
      <form-survey-new-outlet
        :dialog="isFormRoleDialog"
        :is-edit="isEdit"
        :item="selectedItem"
        @close="closeFormDialog"
        @save="handleSave"
      />
    </v-container>
  </v-card>
</template>

<script>
import { deleteOutlet } from '@/api/masterOutletService'
import ConfirmDeleteDialog from '@/components/base/ConfirmDeleteDialog.vue'
import Vue from "vue";
import {createData, updateData, getAll} from "@/api/surveyService";
import FormSurveyNewOutlet from "@/views/dashboard/pages/SurveyNewOutlet/components/FormSurveyNewOutlet.vue";

export default {
  name: 'SurveyNewOutlet',
  components: {
    FormSurveyNewOutlet,
    ConfirmDeleteDialog,
  },
  data () {
    return {
      activeTab: 0,
      tabs: [
        { name: 'On Progress', label: 'On Progress', value: 0 },
        { name: 'Approved', label: 'Approved', value: 1 },
        { name: 'Rejected', label: 'Rejected', value: 2 },
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
          text: 'Brand',
          value: 'brand',
        },
        {
          text: 'Sio Type',
          value: 'sio_type',
        },
        {
          text: 'Name',
          value: 'name',
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
      page: 1,
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
    activeTab(newValue) {
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
        id: item.id || 0,
        name: item.name || '',
        batch_code: item.batch_code || '',
        brand: item.brand || '',
        address_line: item.address_line || '',
        sub_district: item.sub_district || '',
        district: item.district || '',
        city_or_regency: item.city_or_regency || '',
        postal_code: item.postal_code || null,
        latitude: item.latitude || '',
        longitude: item.longitude || '',
        outlet_code: item.outlet_code || '',
        sio_type: item.sio_type || '',
        region: item.region || '',
        area: item.area || '',
        cycle: item.cycle || '',
        visit_day: item.visit_day || '',
        odd_even: item.odd_even || '',
        remarks: item.remarks || '',
        photos: item.photos || [],
        outlet_id: item.outlet_id || null,
        is_approved: item.is_approved || 0,
      };
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
        const response = await getAll({
          page: this.options.page,
          limit: this.options.itemsPerPage,
          searchTerm: this.search,
          isActive: this.activeTab,
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
        Vue.prototype.$toast.success(`Deleted ${data.name} successfully!`);
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
