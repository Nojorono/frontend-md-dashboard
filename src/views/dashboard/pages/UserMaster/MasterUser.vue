<template>
  <v-container fluid>
    <v-card
      class="v-card--material v-card v-sheet theme--light elevation-4"
      style="padding: 24px; border-radius: 16px; background: linear-gradient(to right, #ffffff, #f8f9fa)"
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
          <v-row
            class="justify-space-between align-center px-4 py-3"
          >
            <v-col
              cols="4"
              class="d-flex align-center"
            >
              <v-text-field
                v-model="search"
                label="Search"
                dense
                outlined
                hide-details
                clearable
                append-icon="mdi-magnify"
                class="mr-4"
                @click:append="handleSearch"
                @keyup.enter="handleSearch"
              />
            </v-col>
            <v-col cols="4" class="d-flex align-center">
              <v-autocomplete
                v-model="filter.region"
                :items="getRegionOptions" 
                item-text="name"
                item-value="name"
                label="Region"
                :loading="regionLoading"
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
                :loading="areaLoading"
                clearable
                dense
                outlined
                hide-details
                multiple
                small-chips
                deletable-chips
                @change="handleAreaChange"
                @click:clear="clearAreaFilter"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="4" class="d-flex justify-end align-center">
              <v-btn
                icon
                color="primary"
                class="mr-2"
                :loading="loading"
                @click="fetchData"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn
                color="primary"
                class="text-none"
                @click="openHandleAdd"
              >
                <v-icon left>mdi-plus</v-icon>
                Add User
              </v-btn>
            </v-col>
          </v-row>
        </template>

        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item?.roles }}</td>
            <td class="font-weight-medium">{{ item?.username }}</td>
            <td>{{ item?.email }}</td>
            <td>{{ item?.phone }}</td>
            <td>{{ item?.fullname }}</td>
            <td>
              <v-chip
                v-if="item?.region"
                small
                label
                color="primary"
                class="white--text"
              >
                {{ item?.region }}
              </v-chip>
            </td>
            <td>
              <v-chip
                v-for="(area, index) in item?.area"
                :key="index"
                class="mr-1 mb-1"
                small
                label
                color="secondary"
                outlined
              >
                {{ area }}
              </v-chip>
            </td>
            <td>{{ item?.type_md }}</td>
            <td>
              <v-chip
                :color="item?.is_active ? 'success' : 'error'"
                small
                label
                text-color="white"
              >
                {{ item?.is_active ? 'Active' : 'Inactive' }}
              </v-chip>
            </td>
            <td>{{ formatDate(item?.last_login) }}</td>
            <td class="text-center d-flex justify-center">
              <v-btn
                small
                fab
                color="primary"
                class="mr-2"
                @click="openHandleUpdate(item)"
              >
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                small
                fab
                color="error"
                @click="openConfirmDeleteDialog(item)"
              >
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>

        <template v-slot:no-data>
          <v-alert
            type="info"
            class="ma-2"
          >
            No data available
          </v-alert>
        </template>
      </v-data-table>

      <v-row
        justify="center"
        class="pt-4"
      >
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

    <form-user
      :dialog="isFormRoleDialog"
      :is-edit="isEdit"
      :item="selectedItem"
      @close="closeFormDialog"
      @save="handleSave"
    />
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import ConfirmDeleteDialog from '@/components/base/ConfirmDeleteDialog.vue';
import { createData, deleteData, updateData, getAll } from '@/api/userService';
import FormUser from '@/views/dashboard/pages/UserMaster/component/FormUser.vue';
import Vue from "vue";

export default {
  name: 'MasterUser',
  components: {
    FormUser,
    ConfirmDeleteDialog,
  },
  data() {
    return {
      tableHeaders: [
        { text: 'Roles', value: 'roles', sortable: false, class: 'text-left font-weight-bold', width: '8%' },
        { text: 'Username', value: 'username', sortable: false, class: 'text-left font-weight-bold', width: '10%' },
        { text: 'Email', value: 'email', sortable: false, class: 'text-left font-weight-bold', width: '15%' },
        { text: 'Phone', value: 'phone', sortable: false, class: 'text-left font-weight-bold', width: '10%' },
        { text: 'Full Name', value: 'fullname', sortable: false, class: 'text-left font-weight-bold', width: '15%' },
        { text: 'Region', value: 'region', sortable: false, class: 'text-left font-weight-bold', width: '8%' },
        { text: 'Area', value: 'area', sortable: false, class: 'text-left font-weight-bold', width: '10%' },
        { text: 'Type MD', value: 'type_md', sortable: false, class: 'text-left font-weight-bold', width: '8%' },
        { text: 'Status', value: 'is_active', sortable: false, class: 'text-left font-weight-bold', width: '8%' },
        { text: 'Last Login', value: 'last_login', sortable: false, class: 'text-left font-weight-bold', width: '12%' },
        { text: 'Actions', value: 'actions', sortable: false, class: 'text-center font-weight-bold', width: '10%' },
      ],
      tableData: [],
      totalItems: 0,
      totalPages: 0,
      page: 1,
      options: { page: 1, itemsPerPage: 10 },
      loading: false,
      regionLoading: false,
      areaLoading: false,
      selectedItem: null,
      isFormRoleDialog: false,
      isEdit: false,
      isConfirmDeleteDialogOpen: false,
      search: '',
      filter: {
        region: '',
        area: [],
      },
    }
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

  computed: {
    ...mapGetters(['getRegionOptions', 'getAreaOptions']),
  },

  mounted() {
    
  },

  methods: {
    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    clearRegionFilter() {
      this.filter.region = '';
      this.filter.area = [];
      this.fetchData();
    },

    clearAreaFilter() {
      this.filter.area = [];
      this.fetchData();
    },

    async handleRegionChange(value) {
      this.regionLoading = true;
      try {
        this.options.page = 1;
        this.filter.region = value;
        this.filter.area = [];
        await this.fetchData();
      } finally {
        this.regionLoading = false;
      }
    },

    async handleAreaChange(value) {
      this.areaLoading = true;
      try {
        this.options.page = 1;
        this.filter.area = value;
        await this.fetchData();
      } finally {
        this.areaLoading = false;
      }
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
        username: item.username,
        user_role_id: item.user_role_id,
        fullname: item.fullname,
        email: item.email,
        phone: item.phone,
        type_md: item.type_md,
        area: item.area,
        region: item.region,
        valid_from: item.valid_from,
        valid_to: item.valid_to,
      };
      this.isFormRoleDialog = true;
    },

    async handleSave(item) {
      try {
        if (this.isEdit) {
          const { id, ...itemWithoutId } = item;
          await updateData(id, itemWithoutId);
          Vue.prototype.$toast.success("User updated successfully");
        } else {
          await createData(item);
          Vue.prototype.$toast.success("User created successfully");
        }
        this.closeFormDialog();
        await this.fetchData();
      } catch (error) {
        Vue.prototype.$toast.error(error.data?.message || "An error occurred");
        console.error(error);
      }
    },

    closeFormDialog() {
      this.isFormRoleDialog = false;
      this.isEdit = false;
      this.selectedItem = null;
    },

    async fetchData() {
      this.loading = true;
      try {
        if (this.getRegionOptions.length === 1) {
          this.filter.region = this.getRegionOptions[0];
        }
        if (this.getAreaOptions.length === 1) {
          this.filter.area = this.getAreaOptions[0];
        }
        const response = await getAll({
          page: this.options.page,
          limit: this.options.itemsPerPage,
          searchTerm: this.search,
          filter: {
            region: this.filter.region,
            area: this.filter.area,
          },
        });
        
        this.tableData = response.data.data;
        this.totalItems = response.data.totalItems;
        this.totalPages = response.data.totalPages;
        this.options.page = response.data.currentPage;
      } catch (error) {
        Vue.prototype.$toast.error(error.data?.message || "Failed to fetch data");
        console.error(error);
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
      this.selectedItem = null;
    },

    async handleDelete() {
      if (!this.selectedItem) return;
      
      this.loading = true;
      try {
        await deleteData(this.selectedItem.id);
        Vue.prototype.$toast.success(`User ${this.selectedItem.email} deleted successfully`);
        await this.fetchData();
      } catch (error) {
        Vue.prototype.$toast.error(error.data?.message || "Failed to delete user");
        console.error(error);
      } finally {
        this.loading = false;
        this.closeConfirmDeleteDialog();
      }
    },
  },
}
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

.v-autocomplete ::v-deep .v-select__selections {
  max-height: 48px;
  overflow-y: auto;
}
</style>
