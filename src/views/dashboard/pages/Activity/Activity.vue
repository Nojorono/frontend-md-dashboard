<template>
  <v-container fluid>
    <v-card
      class="v-card--material v-card v-sheet theme--light elevation-4"
      style="
        padding: 24px;
        border-radius: 16px;
        background: linear-gradient(to right, #ffffff, #f8f9fa);
      "
    >
      <v-data-table
        :headers="tableHeaders"
        :items="tableData"
        :server-items-length="totalItems"
        :loading="loading"
        :options.sync="options"
        hide-default-footer
        class=""
        style="border-radius: 8px"
        @update:options="fetchData"
      >
        <template v-slot:top>
          <v-row class="justify-space-between align-center px-4 py-3">
            <v-col cols="4" class="d-flex align-center">
              <v-autocomplete
                v-model="filter.region"
                item-text="name"
                item-value="name"
                label="Region"
                :items="getRegionOptions"
                clearable
                dense
                outlined
                class="mr-4"
                hide-details
                @change="handleFilterChange"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>Region not found</v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>
              <v-autocomplete
                v-model="filter.area"
                item-text="area"
                item-value="area"
                label="Area"
                :disabled="!filter.region"
                :items="filteredAreaOptions"
                clearable
                dense
                outlined
                hide-details
                @change="handleFilterChange"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>Area not found</v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="7">
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
                  @change="handleFilterChange"
                >
                </v-autocomplete>
                <v-autocomplete
                  v-model="filter.sio_type"
                  :items="getSioTypeOptions"
                  item-text="name"
                  item-value="name"
                  label="Sio Type"
                  class="mr-4"
                  clearable
                  dense
                  outlined
                  hide-details
                  @change="handleFilterChange"
                >
                </v-autocomplete>
                <v-autocomplete
                  v-model="filter.status"
                  :items="statusOptions"
                  label="Status"
                  clearable
                  dense
                  outlined
                  hide-details
                  :item-text="(item) => getStatusLabelOption(item.value)"
                  item-value="value"
                  @change="handleFilterChange"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-content
                        >Status not found</v-list-item-content
                      >
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </div>
            </v-col>
            <v-col cols="1" class="d-flex justify-end">
              <v-btn
                fab
                color="primary"
                class="ml-2"
                :loading="loading"
                @click="fetchData"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="justify-space-between align-center px-4 mb-4">
            <v-col cols="3">
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
          </v-row>
        </template>

        <template v-slot:item="{ item, index }">
          <tr>
            <td>{{ (options.page - 1) * options.itemsPerPage + index + 1 }}</td>
            <td>
              <v-chip
                :color="item?.outlet_name ? 'primary' : 'warning'"
                small
                label
                text-color="white"
              >
                {{ item?.outlet_name ? "Existing" : "New" }}
              </v-chip>
            </td>
            <td class="font-weight-medium">{{ item?.code_batch }}</td>
            <td class="font-weight-medium">{{ item?.user_name }}</td>
            <td class="font-weight-medium">
              {{ item?.outlet_name || item?.survey_name }}
            </td>
            <td>{{ item?.region }}</td>
            <td>{{ item?.area }}</td>
            <td>{{ item?.brand }}</td>
            <td>{{ item?.type_sio }}</td>
            <td>
              <v-chip
                :color="getStatusColor(item?.status)"
                small
                label
                text-color="white"
              >
                {{ getStatusLabel(item) }}
              </v-chip>
            </td>
            <td>
              <v-chip
                :color="
                  item?.status_approval === 0
                    ? 'warning'
                    : item?.status_approval === 101
                    ? 'info'
                    : 'success'
                "
                small
                label
                text-color="white"
              >
                <v-icon left small>
                  {{
                    item?.status_approval === 0
                      ? "mdi-alert-circle"
                      : item?.status_approval === 101
                      ? "mdi-sync"
                      : "mdi-check-circle"
                  }}
                </v-icon>
                {{
                  item?.status_approval === 0
                    ? "Perlu Verifikasi"
                    : item?.status_approval === 101
                    ? "Proses HO"
                    : "Approved"
                }}
              </v-chip>
            </td>
            <td>{{ formatDateTime(item?.start_time) }}</td>
            <td>{{ formatDateTime(item?.end_time) }}</td>
            <td>
              <div class="d-flex align-center">
                <v-btn
                  color="warning"
                  outlined
                  small
                  class="mr-2"
                  @click="handleDetail(item.id)"
                >
                  <v-icon small class="mr-1">mdi-calendar-arrow-right</v-icon>
                  Detail
                </v-btn>

                <v-menu offset-y :close-on-content-click="false">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      outlined
                      small
                      v-bind="attrs"
                      v-on="on"
                      :disabled="
                        !(
                          ((getUser?.roles === 'ADMIN' ||
                            getUser?.roles === 'NASIONAL' ||
                            getUser?.roles === 'SUPER-ADMIN') &&
                            item?.status_approval === 101) ||
                          ((getUser?.roles === 'SUPER-ADMIN' ||
                            getUser?.roles === 'AMO' ||
                            getUser?.roles === 'REGIONAL') &&
                            item?.status_approval === 0)
                        )
                      "
                    >
                      <v-icon small>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <template
                      v-if="
                        (getUser?.roles === 'ADMIN' ||
                          getUser?.roles === 'NASIONAL' ||
                          getUser?.roles === 'SUPER-ADMIN') &&
                        item?.status_approval === 101
                      "
                    >
                      <v-list-item
                        v-for="(status, index) in statusLevel2Options"
                        :key="index"
                        @click="updateStatus(item, status.value)"
                      >
                        <v-list-item-icon class="mr-2">
                          <v-icon small :color="getStatusColor(status.value)">
                            mdi-circle-small
                          </v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                          {{getStatusLabelOption(status.value)}}
                          </v-list-item-title>
                      </v-list-item>
                    </template>
                    <template
                      v-else-if="
                        (getUser?.roles === 'SUPER-ADMIN' || getUser?.roles === 'AMO' || 
                          getUser?.roles === 'REGIONAL') &&
                        item?.status_approval === 0
                      "
                    >
                      <v-list-item
                        v-for="(status, index) in statusLevel1Options"
                        :key="index"
                        @click="updateStatus(item, status.value)"
                        class="cursor-pointer"
                      >
                        <v-list-item-icon class="mr-2">
                          <v-icon small :color="getStatusColor(status.value)">
                            mdi-circle-small
                          </v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>{{
                          getStatusLabelOption(status.value)
                        }}</v-list-item-title>
                      </v-list-item>
                    </template>
                    <template v-else>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title
                            class="text-caption text-center grey--text"
                          >
                            No actions available
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-list>
                </v-menu>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>

      <v-row justify="center" class="pt-4">
        <v-pagination
          v-model="page"
          :length="totalPages"
          :total-visible="7"
          color="primary"
          next-icon="mdi-menu-right"
          prev-icon="mdi-menu-left"
          @input="onPageChange"
        />
      </v-row>
    </v-card>

    <confirm-delete-dialog
      :dialog="isConfirmDeleteDialogOpen"
      @confirm="handleDelete"
      @close="closeConfirmDeleteDialog"
    />

    <form-call-plan
      :dialog="isFormRoleDialog"
      :is-edit="isEdit"
      :item="selectedItem"
      :refresh="refreshDataTrigger"
      @close="closeFormDialog"
      @save="handleSave"
    />
  </v-container>
</template>

<script>
import ConfirmDeleteDialog from "@/components/base/ConfirmDeleteDialog.vue";
import {
  createData,
  deleteData,
  updateData,
  getAll,
  updateStatusApproval,
} from "@/api/activityService";
import FormCallPlan from "@/views/dashboard/pages/CallPlan/components/FormCallPlan.vue";
import Vue from "vue";
import { mapGetters } from "vuex";
import {
  EXISTING_SURVEY_STATUS,
  NEW_SURVEY_STATUS,
  STATUS_COLORS,
} from "@/constants/status";

export default {
  name: "Activity",
  components: {
    FormCallPlan,
    ConfirmDeleteDialog,
  },
  data() {
    return {
      refreshDataTrigger: false,
      tableHeaders: [
        {
          text: "No",
          value: "number",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "2%",
        },
        {
          text: "Type",
          value: "type",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "5%",
        },
        {
          text: "Code Batch",
          value: "code_batch",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "6%",
        },
        {
          text: "MD",
          value: "user_name",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "6%",
        },
        {
          text: "Outlet Name",
          value: "outlet_name",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "10%",
        },
        {
          text: "Region",
          value: "region",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "6%",
        },
        {
          text: "Area",
          value: "area",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "6%",
        },
        {
          text: "Brand",
          value: "brand",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "6%",
        },
        {
          text: "Type SIO",
          value: "type_sio",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "15%",
        },
        {
          text: "Status",
          value: "status",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "11%",
        },
        {
          text: "Status Approval",
          value: "status_approval",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "5%",
        },
        {
          text: "Start Time",
          value: "start_time",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "15%",
        },
        {
          text: "End Time",
          value: "end_time",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "15%",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          class: "text-center font-weight-bold",
        },
      ],
      tableData: [],
      totalItems: 0,
      totalPages: 0,
      page: 1,
      options: { page: 1, itemsPerPage: 10 },
      loading: false,
      selectedItem: null,
      isFormRoleDialog: false,
      isEdit: false,
      isConfirmDeleteDialogOpen: false,
      search: "",
      regionOptions: [],
      areaOptions: [],
      statusOptions: [
        { value: 101 }, // STATUS_HO_PROCESSING
        { value: 401 }, // STATUS_TEMP_CLOSED
        { value: 402 }, // STATUS_PERM_CLOSED
        { value: 403 }, // STATUS_NOT_FOUND
        { value: 404 }, // STATUS_REJECTED
        { value: 406 }, // STATUS_PIC_REJECTED
        { value: 407 }, // STATUS_HO_REJECTED
        { value: 200 }, // STATUS_VISITED
        { value: 201 }, // STATUS_COMPLETED
        { value: 202 }, // STATUS_OUTLET_AGREED
        { value: 203 }, // STATUS_APPROVED
      ],
      statusLevel1Options: [{ value: 101 }, { value: 406 }],
      statusLevel2Options: [{ value: 203 }, { value: 407 }],
      status: "",
      statusUpdate: "",
      statusUpdateItem: null,
      menu: false,
      filter: {
        region: "",
        area: "",
        status: "",
        brand: "",
        sio_type: "",
      },
    };
  },
  computed: {
    ...mapGetters([
      "getUser",
      "getRegionOptions",
      "getAreaOptions",
      "getBrandOptions",
      "getSioTypeOptions",
    ]),
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

  methods: {
    handleFilterChange() {
      this.options.page = 1;
      this.fetchData();
    },
    getStatusLabel(item) {
      return item?.outlet_id
        ? EXISTING_SURVEY_STATUS[item?.status]
        : NEW_SURVEY_STATUS[item?.status];
    },
    getStatusLabelOption(value) {
      return EXISTING_SURVEY_STATUS[value]
        ? EXISTING_SURVEY_STATUS[value]
        : NEW_SURVEY_STATUS[value];
    },
    getStatusColor(status) {
      return STATUS_COLORS[status];
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    formatDateTime(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
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
      this.selectedItem = item;
      this.isFormRoleDialog = true;
    },
    async handleStatusUpdate(item, status) {
      this.statusUpdateItem = item;
      this.statusUpdate = status;
    },
    async handleSave(item) {
      try {
        if (this.isEdit) {
          const { id, ...itemWithoutId } = item;
          const res = await updateData(id, itemWithoutId);
          if (res.statusCode === 200) {
            Vue.prototype.$toast.success(`Update data Successfully!`);
            this.closeFormDialog();
          }
        } else {
          const res = await createData(item);
          if (res.statusCode === 200) {
            Vue.prototype.$toast.success(`Create data Successfully!`);
            this.closeFormDialog();
          }
        }
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`);
        console.error(error);
      } finally {
        await this.fetchData();
      }
    },
    closeFormDialog() {
      this.isFormRoleDialog = false;
      this.isEdit = false;
    },
    handleSearch() {
      this.options.page = 1;
      this.fetchData();
    },
    handleClearSearch() {
      this.search = "";
      this.options.page = 1;
      this.fetchData();
    },
    async fetchData() {
      this.loading = true;
      try {
        if (this.getRegionOptions.length === 1) {
          this.filter.region = this.getRegionOptions[0].name;
        }
        if (this.getAreaOptions.length === 1) {
          this.filter.area = this.getAreaOptions[0].area;
        }
        const response = await getAll({
          page: this.options.page,
          limit: this.options.itemsPerPage,
          searchTerm: this.search,
          filter: this.filter,
        });
        this.tableData = response.data.result;
        this.totalItems = response.data.totalRecords;
        this.totalPages = response.data.totalPages;
        this.options.page = response.data.currentPage;
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`);
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    openConfirmDeleteDialog(data) {
      this.selectedItem = data;
      this.isConfirmDeleteDialogOpen = true;
    },
    async handleDetail(id) {
      await this.$router.push({
        name: "Detail Activity",
        params: { id },
      });
    },
    closeConfirmDeleteDialog() {
      this.isConfirmDeleteDialogOpen = false;
    },
    async handleDelete() {
      this.loading = true;
      const data = this.selectedItem;
      try {
        await deleteData(data.id);
        Vue.prototype.$toast.success(`Deleted Area ${data.area} successfully!`);
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`);
        console.error(error);
      } finally {
        this.loading = false;
        this.closeConfirmDeleteDialog();
        await this.fetchData();
      }
    },
    async updateStatus(item, status) {
      try {
        const labelStatus = this.getStatusLabelOption(status);
        const result = await this.$swal.fire({
          title: `${labelStatus}`,
          text: `You want to update this status to ${labelStatus}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, update it!",
        });

        if (result.isConfirmed) {
          const data = {
            status_approval: status,
          };
          const res = await updateStatusApproval(item.id, data);

          if (res.statusCode === 200) {
            this.$toast.success(`Update status Successfully!`);
            await this.fetchData();
          }
        }
      } catch (error) {
        await this.$swal({
          title: "Error!",
          text: error.data.message || "Something went wrong!",
          icon: "error",
        });
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.v-data-table ::v-deep tbody tr:hover {
  background-color: #f5f5f5 !important;
}

.v-data-table ::v-deep .v-data-table__wrapper {
  border-radius: 8px;
}

.v-btn {
  text-transform: none;
}

.v-chip {
  font-weight: 500;
}
</style>
