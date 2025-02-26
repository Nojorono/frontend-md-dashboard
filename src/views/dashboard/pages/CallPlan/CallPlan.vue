<template>
  <v-container fluid>
    <v-card
      class="v-card--material v-card v-sheet theme--light elevation-2"
      style="padding: 24px; border-radius: 16px; background: #ffffff"
    >
      <v-data-table
        :headers="tableHeaders"
        :items="tableData"
        :server-items-length="totalItems"
        :loading="loading"
        :options.sync="options"
        hide-default-footer
        class="rounded-lg"
        @update:options="fetchData"
      >
        <template v-slot:top>
          <v-row class="px-4 py-3" align="center">
            <v-col cols="4" class="d-flex gap-4">
              <v-autocomplete
                v-model="filter.region"
                item-text="name"
                item-value="name"
                label="Region"
                :items="getRegionOptions"
                clearable
                dense
                outlined
                hide-details
                class="mr-3"
                @change="handleRegionChange"
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
                @change="handleAreaChange"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>Area not found</v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
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
                @click:clear="search = ''"
              />
            </v-col>
            <v-col cols="4">
              <div class="d-flex justify-end align-center">
                <v-btn
                  icon
                  color="primary"
                  class="mr-4"
                  :loading="loading"
                  @click="fetchData"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
                <v-btn
                  color="primary"
                  class="text-none px-6"
                  elevation="1"
                  @click="openHandleAdd"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Add New
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </template>

        <template v-slot:item="{ item, index }">
          <tr>
            <td class="text-center">
              {{ (options.page - 1) * options.itemsPerPage + index + 1 }}
            </td>
            <td>
              <span class="font-weight-medium">{{ item?.code_batch }}</span>
            </td>
            <td>{{ item?.region }}</td>
            <td>{{ item?.area }}</td>
            <td>
              <div class="d-flex justify-center">
                <v-btn
                  small
                  color="warning"
                  class="mr-2"
                  fab
                  @click="handleSchedule(item)"
                >
                  <v-icon small>mdi-calendar-arrow-right</v-icon>
                </v-btn>
                <v-btn
                  small
                  color="primary"
                  class="mr-2"
                  fab
                  @click="openHandleUpdate(item)"
                >
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  small
                  color="error"
                  fab
                  @click="openConfirmDeleteDialog(item)"
                >
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
        </template>

        <template v-slot:loading>
          <v-skeleton-loader type="table-row" class="my-2" />
        </template>

        <template v-slot:no-data>
          <div class="text-center py-6">
            <v-icon size="64" color="grey lighten-1"> mdi-database-off </v-icon>
            <div class="text-subtitle-1 grey--text mt-2">No data available</div>
          </div>
        </template>
      </v-data-table>

      <v-row justify="center" class="pt-4">
        <v-pagination
          v-model="page"
          :length="totalPages"
          :total-visible="7"
          next-icon="mdi-menu-right"
          prev-icon="mdi-menu-left"
          color="primary"
          @input="onPageChange"
        />
      </v-row>
    </v-card>

    <!-- Confirm Delete Dialog -->
    <confirm-delete-dialog
      :dialog="isConfirmDeleteDialogOpen"
      @confirm="handleDelete"
      @close="closeConfirmDeleteDialog"
    />

    <!-- Create & Update Dialog -->
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
} from "@/api/callPlanService";
import FormCallPlan from "@/views/dashboard/pages/CallPlan/components/FormCallPlan.vue";
import Vue from "vue";
import { mapGetters } from "vuex";

export default {
  name: "CallPlan",
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
          align: "center",
          sortable: false,
          width: "5%",
        },
        {
          text: "Code Batch",
          value: "code_batch",
          sortable: false,
          width: "15%",
        },
        { text: "Region", value: "region", sortable: false, width: "20%" },
        { text: "Area", value: "area", sortable: false, width: "15%" },
        { text: "Actions", value: "actions", align: "center", sortable: false },
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
      filter: {
        area: "",
        region: ""
      }
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
    async handleSave(item) {
      try {
        let res;
        if (this.isEdit) {
          const { id, ...itemWithoutId } = item;
          res = await updateData(id, itemWithoutId);
        } else {
          res = await createData(item);
        }

        if (res.statusCode === 200 || res.statusCode === 201) {
          Vue.prototype.$toast.success(
            `${this.isEdit ? "Update" : "Create"} data Successfully!`
          );
          this.closeFormDialog();
        }
      } catch (error) {
        Vue.prototype.$toast.error(error?.data?.message || "An error occurred");
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
    async handleRegionChange(value) {
      this.options.page = 1;
      this.filter.region = value;
      this.filter.area = "";
      await this.fetchData();
    },
    async handleAreaChange(value) {
      this.options.page = 1;
      this.filter.area = value;
      await this.fetchData();
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
        this.tableData = response.data.data;
        this.totalItems = response.data.totalItems;
        this.totalPages = response.data.totalPages;
        this.options.page = response.data.currentPage;
      } catch (error) {
        Vue.prototype.$toast.error(
          error?.data?.message || "Failed to fetch data"
        );
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    openConfirmDeleteDialog(data) {
      this.selectedItem = data;
      this.isConfirmDeleteDialogOpen = true;
    },
    async handleSchedule(item) {
      await this.$router.push({
        name: "Call Plan Schedule",
        params: { id: item.id, region: item.region, area: item.area },
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
        Vue.prototype.$toast.error(error?.data?.message || "Failed to delete");
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
.v-data-table {
  border-radius: 8px;
  overflow: hidden;
}

.v-data-table >>> thead th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
}

.v-data-table >>> tbody td {
  font-size: 0.875rem;
}

.v-btn {
  text-transform: none;
}

.v-btn.v-btn--fab.v-size--small {
  width: 32px;
  height: 32px;
}
</style>
