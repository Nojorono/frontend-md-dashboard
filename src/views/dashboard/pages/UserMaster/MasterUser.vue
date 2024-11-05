<template>
  <v-container fluid>
    <v-data-table
      :headers="tableHeaders"
      :items="tableData"
      :server-items-length="totalItems"
      :loading="loading"
      :options.sync="options"
      :search="search"
      style="padding: 20px; border-radius: 20px"
      @update:options="fetchData"
    >
      <template v-slot:top>
        <v-row
          class="justify-space-between"
          style="align-items: baseline"
        >
          <v-col
            cols="4"
          >
            <v-text-field
              rounded
              v-model="search"
              label="Search"
              class="mx-4"
              outlined
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
              {{ area.name }}<span v-if="index < item.area.length - 1">, </span>
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
      snackbar: { open: false, type: 'info', message: 'info' },
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
      options: { page: 1, itemsPerPage: 10 },
      loading: false,
      selectedItem: null,
      isFormRoleDialog: false,
      isEdit: false,
      isConfirmDeleteDialogOpen: false,
      search: '',
    }
  },

  watch: {
    options: {
      handler() {
        this.fetchData();
      },
      deep: true,
    },
  },

  created() {
    this.fetchData();
  },

  methods: {
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
        });
        this.tableData = response.data.data;
        this.totalItems = response.data.totalRecords;
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`);
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
      console.log(data)
      try {
        await deleteData(data.id);
        Vue.prototype.$toast.success(`Deleted ${data.username} successfully!`);
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`);
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
/* Add any scoped styles here */
</style>
