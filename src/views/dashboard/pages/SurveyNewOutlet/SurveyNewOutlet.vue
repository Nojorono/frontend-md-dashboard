<template>
  <v-card
    class="v-card--material v-card v-sheet theme--light v-card--material--has-heading elevation-2"
  >
    <v-container fluid class="pa-4">
      <v-row class="px-4 py-2" align="center">
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
            @change="handleFilterChange"
            @click:clear="filter.area = ''"
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
            @click:clear="filter.area = ''"
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>Area not found</v-list-item-content>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="4" class="d-flex justify-end">
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
            @click:clear="filter.brand = ''"
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
            @click:clear="filter.sio_type = ''"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="1" class="d-flex justify-end">
          <v-btn
            fab
            color="primary"
            class=""
            :loading="loading"
            @click="fetchData"
          >
            <v-icon size="24">mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <div class="rounded-lg">
        <v-data-table
          :headers="tableHeaders"
          :items="tableData"
          :server-items-length="totalItems"
          :loading="loading"
          :options.sync="options"
          hide-default-footer
          class="small-table"
          @update:options="fetchData"
        >
          <template v-slot:top>
            <v-row class="px-4 py-2" align="center">
              <v-col cols="4">
                <v-text-field
                  v-model="search"
                  label="Search"
                  dense
                  outlined
                  hide-details
                  clearable
                  prepend-inner-icon="mdi-magnify"
                  @click:append="handleSearch"
                />
              </v-col>
              <v-spacer></v-spacer>
              <v-btn color="primary" class="text-none" @click="openHandleAdd">
                <v-icon left>mdi-plus</v-icon>
                Add New
              </v-btn>
            </v-row>
          </template>

          <template v-slot:item="{ item, index }">
            <tr>
              <td>
                {{ (options.page - 1) * options.itemsPerPage + index + 1 }}
              </td>
              <td>
                <v-chip small :color="getStatusColor(item.is_approved)" text-color="white">
                  {{ getStatusLabelOption(item.is_approved) }}
                </v-chip>
              </td>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      class="text-truncate"
                      style="max-width: 150px; display: inline-block"
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
                      style="max-width: 150px; display: inline-block"
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
                      style="max-width: 150px; display: inline-block"
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
                      style="max-width: 150px; display: inline-block"
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
                      style="max-width: 150px; display: inline-block"
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
                      style="max-width: 150px; display: inline-block"
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
                      style="max-width: 150px; display: inline-block"
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
                      style="max-width: 150px; display: inline-block"
                      v-on="on"
                    >
                      {{ item?.cycle }}
                    </span>
                  </template>
                  <span>{{ item?.cycle }}</span>
                </v-tooltip>
              </td>
              <td v-if="item.is_approved === 0">
                <v-btn
                  small
                  color="primary"
                  class="mr-2"
                  fab
                  @click="openHandleUpdate(item)"
                >
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn small color="warning" fab @click="handleDetail(item.id)">
                  <v-icon small>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  small
                  color="error"
                  fab
                  @click="openConfirmDeleteDialog(item)"
                >
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>

        <v-row justify="center" class="py-3">
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
      </div>

      <!-- Dialogs -->
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
import ConfirmDeleteDialog from "@/components/base/ConfirmDeleteDialog.vue";
import Vue from "vue";
import {
  createData,
  updateData,
  getAll,
  deleteData,
} from "@/api/surveyService";
import FormSurveyNewOutlet from "@/views/dashboard/pages/SurveyNewOutlet/components/FormSurveyNewOutlet.vue";
import { mapGetters } from "vuex";

export default {
  name: "SurveyNewOutlet",
  components: {
    FormSurveyNewOutlet,
    ConfirmDeleteDialog,
  },
  data() {
    return {
      tableHeaders: [
        {
          text: "No",
          value: "number",
          sortable: false,
          class: "text-left",
          width: "5%",
        },
        { text: "Status", value: "is_approved", sortable: true },
        { text: "Region", value: "region", sortable: true },
        { text: "Area", value: "area", sortable: true },
        { text: "Address", value: "address_line", sortable: true },
        { text: "Outlet Code", value: "outlet_code", sortable: true },
        { text: "Brand", value: "brand", sortable: true },
        { text: "Sio Type", value: "sio_type", sortable: true },
        { text: "Name", value: "name", sortable: true },
        { text: "Cycle", value: "cycle", sortable: true },
        { text: "Actions", value: "actions", sortable: false, align: "center" },
      ],
      tableData: [],
      regionOptions: [],
      areaOptions: [],
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
      search: "",
      filter: {
        region: "",
        area: "",
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
    activeTab(newValue) {
      if (newValue !== undefined) {
        this.fetchData();
      }
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    getStatusColor(status) {
      if (status === 203) return 'success';
      if (status === 101) return 'warning';
      if (status === 0) return 'warning';
      if (status === 407) return 'error';
      return 'error';
    },
    getStatusLabelOption(status) {
      if (status === 203) return 'Approved';
      if (status === 101) return 'Pending';
      if (status === 407) return 'Pending';
      if (status === 0) return 'Belum Dijalankan';
    },
    handleFilterChange() {
      this.options.page = 1;
      this.fetchData();
    },
    async handleDetail(id) {
      await this.$router.push({
        name: "Detail Survey Outlet",
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
        name: item.name || "",
        batch_code: item.batch_code || "",
        brand: item.brand || "",
        address_line: item.address_line || "",
        sub_district: item.sub_district || "",
        district: item.district || "",
        city_or_regency: item.city_or_regency || "",
        postal_code: item.postal_code || null,
        latitude: item.latitude || "",
        longitude: item.longitude || "",
        outlet_code: item.outlet_code || "",
        sio_type: item.sio_type || "",
        region: item.region || "",
        area: item.area || "",
        cycle: item.cycle || "",
        visit_day: item.visit_day || "",
        odd_even: item.odd_even || "",
        remarks: item.remarks || "",
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
          isActive: this.activeTab,
          filter: this.filter,
        });
        this.tableData = response.data.data;
        this.totalItems = response.data.totalItems;
        this.totalPages = response.data.totalPages;
        this.options.page = response.data.currentPage;
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`);
      } finally {
        this.loading = false;
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
        await deleteData(data.id);
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
};
</script>

<style scoped>
.small-table {
  font-size: 14px;
  border-radius: 8px;
}

.small-table th {
  font-weight: 600 !important;
  background-color: #f5f5f5 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.small-table td {
  padding: 12px !important;
}

.active-tab {
  font-weight: 600;
}

.v-data-table ::v-deep .v-data-table__wrapper {
  border-radius: 8px;
}

.v-btn.v-btn--fab.v-size--small {
  width: 32px;
  height: 32px;
}
</style>
