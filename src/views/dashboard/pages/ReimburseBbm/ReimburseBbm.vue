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
            <v-col cols="7" class="d-flex align-center">
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
                :items="getAreaOptions"
                clearable
                dense
                outlined
                hide-details
                class="mr-4"
                @change="handleFilterChange"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>Area not found</v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
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
            <v-col cols="1" class="d-flex justify-end">
              <v-btn
                icon
                color="primary"
                class="mr-2"
                :loading="loading"
                @click="fetchData"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </template>

        <template v-slot:item="{ item, index }">
          <tr>
            <td>{{ (options.page - 1) * options.itemsPerPage + index + 1 }}</td>
            <td>{{ item?.user_region }}</td>
            <td>{{ item?.user_area[0] }}</td>
            <td>
              <v-chip
                small
                label
                text-color="white"
                :color="item?.status === 'On Time' ? 'primary' : 'warning'"
              >
                <div class="d-flex flex-column">
                  <div class="d-flex align-center">
                    <v-icon small class="mr-1">mdi-account</v-icon>
                    {{ item?.user_email }}
                  </div>
                </div>
              </v-chip>
            </td>
            <td class="font-weight-medium">{{ formatDate(item?.date_in) }}</td>
            <td class="font-weight-medium">
              <button @click="openPhoto(item?.photo_in)">
                <img
                  :src="item?.photo_in"
                  alt="Photo In"
                  style="width: 100px; height: 100px"
                />
              </button>
            </td>
            <td class="font-weight-medium">{{ item?.kilometer_in }}</td>
            <td class="font-weight-medium">{{ formatDate(item?.date_out) }}</td>
            <td class="font-weight-medium">
              <button @click="openPhoto(item?.photo_out)">
                <img
                  :src="item?.photo_out"
                  alt="Photo Out"
                  style="width: 100px; height: 100px"
                />
              </button>
            </td>
            <td class="font-weight-medium">{{ item?.kilometer_out }}</td>
            <td class="font-weight-medium">{{ item?.total_kilometer }}</td>
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
} from "@/api/reimburseBbmService";
import FormCallPlan from "@/views/dashboard/pages/CallPlan/components/FormCallPlan.vue";
import Vue from "vue";
import { mapGetters } from "vuex";

export default {
  name: "ReimburseBbm",
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
          width: "5%",
        },
        {
          text: "Region",
          value: "region",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "12%",
        },
        {
          text: "Area",
          value: "area",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "10%",
        },
        {
          text: "User",
          value: "user_name",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "12%",
        },
        {
          text: "Date In",
          value: "date_in",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "15%",
        },
        {
          text: "Photo In",
          value: "photo_in",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "5%",
        },
        {
          text: "Kilometer In",
          value: "kilometer_in",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "8%",
        },
        {
          text: "Date Out",
          value: "date_out",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "15%",
        },
        {
          text: "Photo Out",
          value: "photo_out",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "5%",
        },
        {
          text: "Kilometer Out",
          value: "kilometer_out",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "8%",
        },
        {
          text: "Total Kilometer",
          value: "total_kilometer",
          sortable: false,
          class: "text-left font-weight-bold",
          width: "15%",
        },
        // {
        //   text: "Description",
        //   value: "description",
        //   sortable: false,
        //   class: "text-left font-weight-bold",
        //   width: "15%",
        // },
        // {
        //   text: "Status",
        //   value: "status",
        //   sortable: false,
        //   class: "text-left font-weight-bold",
        //   width: "10%",
        // },
        // {
        //   text: "Actions",
        //   value: "actions",
        //   sortable: false,
        //   class: "text-center font-weight-bold",
        // },
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
      status: "",
      statusUpdate: "",
      statusUpdateItem: null,
      menu: false,
      filter: {
        region: "",
        area: "",
      },
    };
  },
  computed: {
    ...mapGetters(["getUser", "getRegionOptions", "getAreaOptions"]),
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
    openPhoto(photo) {
      window.open(photo, "_blank");
    },
    openMap(latitude, longitude) {
      window.open(
        `https://maps.google.com/?q=${latitude},${longitude}`,
        "_blank"
      );
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    formatTime(time) {
      if (!time) return "";
      return new Date(time).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
    handleFilterChange() {
      this.options.page = 1;
      this.fetchData();
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
