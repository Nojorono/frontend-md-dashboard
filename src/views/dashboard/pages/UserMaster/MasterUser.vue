<template>
  <v-container fluid>
    <v-card
      style="padding: 20px; border-radius: 20px"
      class="v-card--material v-card v-sheet theme--light v-card--material--has-heading"
    >
      <v-data-table
        :headers="tableHeaders"
        :items="tableData"
        :server-items-length="totalItems"
        :loading="loading"
        :options.sync="options"
        hide-default-footer
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
              <div class="d-flex justify-space-between">
                <v-icon
                  style="
                width: 40px; border-radius: 50%;"
                  color="primary"
                  size="2rem"
                  :loading="loading"
                  @click="fetchData"
                >
                  mdi-refresh
                </v-icon>
                <v-btn
                  color="primary"
                  style="margin: unset!important;"
                  @click="openHandleAdd"
                >
                  <v-icon>mdi-plus-box-multiple</v-icon>
                  <span class="mx-1">Add</span>
                </v-btn>
              </div>
            </v-col>
            <v-col
              cols="6"
              style="display: flex; justify-content: flex-end; align-items: center; padding-right: unset; padding-left: 10px"
            >
              <div class="d-flex justify-end">
                <v-autocomplete
                  item-text="name"
                  item-value="name"
                  label="Region"
                  v-model="filter.region"
                  :items="regionOptions"
                  :disabled="regionOptions.length <= 1"
                  clearable
                  @change="handleRegionChange"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-content>Region not found</v-list-item-content>
                    </v-list-item>
                  </template>
                </v-autocomplete>
                <v-autocomplete
                  item-text="name"
                  item-value="name"
                  label="Area"
                  v-model="filter.area"
                  :items="areaOptions"
                  clearable
                  :disabled="!filter.region"
                  @change="handleAreaChange"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-content>Area not found</v-list-item-content>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </div>
            </v-col>
          </v-row>
        </template>
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item?.roles }}</td>
            <td>{{ item?.username }}</td>
            <td>{{ item?.email }}</td>
            <td>{{ item?.phone }}</td>
            <td>{{ item?.fullname }}</td>
            <td>{{ item?.region }}</td>
            <td>
              <span
                v-for="(area, index) in item?.area"
                :key="index"
              >
                {{ area }}<span v-if="index < item.area.length - 1">, </span>
              </span>
            </td>
            <td>{{ item?.type_md }}</td>
            <td>{{ item?.status }}</td>
            <td>{{ item?.last_login }}</td>
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
        class="py-5"
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

    <!-- Confirm Delete Dialog -->
    <confirm-delete-dialog
      :dialog="isConfirmDeleteDialogOpen"
      @confirm="handleDelete"
      @close="closeConfirmDeleteDialog"
    />
    <!-- Create & Update Dialog -->
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
  import { getOutletRegion, getOutletArea } from "@/api/masterOutletService";
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
        { text: 'Roles', value: 'roles', class: 'text-left', width: '5%' },
        { text: 'Username', value: 'username', class: 'text-left', width: '5%' },
        { text: 'Email', value: 'email', class: 'text-left', width: '10%' },
        { text: 'Phone', value: 'phone', class: 'text-left', width: '5%' },
        { text: 'Full Name', value: 'fullname', class: 'text-left', width: '10%' },
        { text: 'Region', value: 'region', class: 'text-left', width: '5%' },
        { text: 'Area', value: 'area', class: 'text-left', width: '5%' },
        { text: 'Type MD', value: 'type_md', class: 'text-left', width: '10%' },
        { text: 'Status', value: 'is_active', class: 'text-left', width: '10%' },
        { text: 'Last Login', value: 'last_login', class: 'text-left', width: '5%' },
        { text: 'Actions', value: 'actions', sortable: false, class: 'text-center', width: '15%' },
      ],
      tableData: [],
      totalItems: 0,
      totalPages: 0,
      page: 1, // Current page number
      options: { page: 1, itemsPerPage: 10 },
      loading: false,
      selectedItem: null,
      isFormRoleDialog: false,
      isEdit: false,
      isConfirmDeleteDialogOpen: false,
      search: '',
      regionOptions: [],
      areaOptions: [],
      filter: {
        region: '',
        area: '',
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
    ...mapGetters(['getUser']),
  },

  mounted() {
    this.fetchRegion();
    this.fetchArea();
  },

  methods: {
    async fetchArea() {
      this.loading = true;
      try {
        const response = await getOutletArea();
        if (Array.isArray(this.getUser.area) && this.getUser.area.length > 0) {
          this.areaOptions = response.data.filter(
            (area) => this.getUser.area.includes(area)
          );
        } else {
          this.areaOptions = response.data;
        }
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchRegion() {
      this.loading = true;
      try {
        const response = await getOutletRegion();
        if (this.getUser.region) {
          this.regionOptions = response.data.filter(
            (region) => region === this.getUser.region
          );
        } else {
          this.regionOptions = response.data;
        }

        if (this.regionOptions.length > 0) {
          this.filter.region = this.regionOptions[0];
          this.handleRegionChange(this.filter.region);
        }
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        this.loading = false;
      }
    },
    handleRegionChange(value) {
      this.options.page = 1;
      this.filter.region = value;

      if (!value) {
        this.filter.area = '';
      }
      this.fetchData();
    },
    handleAreaChange(value) {
      this.options.page = 1;
      this.filter.area = value;
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
    async fetchData() {
      this.loading = true;
      try {
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
        Vue.prototype.$toast.error(`${error.data?.message}`);
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
    },
    async handleDelete() {
      this.loading = true;
      const data = this.selectedItem;
      try {
        await deleteData(data.id);
        Vue.prototype.$toast.success(`Deleted ${data.email} successfully!`);
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
/* Add any scoped styles here */
</style>
