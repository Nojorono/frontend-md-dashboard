<template>
  <v-container fluid>
    <v-data-table
      class="v-card--material v-card v-sheet theme--light v-card--material--has-heading"
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
        </v-row>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item?.name }}</td>
          <td>{{ item?.description }}</td>
          <td>
            <v-icon
              v-if="item?.is_active === 1"
              color="green"
            >
              mdi-check
            </v-icon>
            <v-icon
              v-else
              color="red"
            >
              mdi-close
            </v-icon>
          </td>
          <td>
            <v-icon
              v-if="item?.is_mobile === 1"
              color="green"
            >
              mdi-check
            </v-icon>
            <v-icon
              v-else
              color="red"
            >
              mdi-close
            </v-icon>
          </td>
          <td>
            <v-icon
              v-if="item?.is_web === 1"
              color="green"
            >
              mdi-check
            </v-icon>
            <v-icon
              v-else
              color="red"
            >
              mdi-close
            </v-icon>
          </td>
          <td>
            <div>
              <v-chip
                v-for="(menu, index) in item?.menus"
                :key="index"
                small
                outlined
                class="ma-1"
              >
                {{ menu.name }}
              </v-chip>
            </div>
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
    <form-role
      :dialog="isFormRoleDialog"
      :is-edit="isEdit"
      :item="selectedItem"
      @close="closeFormDialog"
      @save="handleSave"
    />
  </v-container>
</template>

<script>
  import ConfirmDeleteDialog from '@/components/base/ConfirmDeleteDialog.vue'
  import { createData, deleteData, getAll, updateData } from '@/api/masterRoleService'
  import FormRole from '@/views/dashboard/pages/RoleMaster/FormRole.vue'
  import Vue from "vue";

  export default {
    name: "MasterRoles",
    components: { ConfirmDeleteDialog, FormRole },
    data() {
      return {
        tableHeaders: [
          { text: "Name", value: "name" },
          { text: "Description", value: "description" },
          { text: "Status", value: "is_active" },
          { text: "Mobile", value: "is_mobile" },
          { text: "Dashboard", value: "is_web" },
          { text: "Menu", value: "menus" },
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
      };
    },

    created() {
      this.fetchData();
    },
    methods: {
      handleSearch() {
        this.options.page = 1;
        this.fetchData();
      },
      // ADD OR UPDATE
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
      async handleSave (item) {
        this.loading = true
        if (this.isEdit) {
          this.tableData[this.selectedItem.index] = item;
          try {
            const { id, ...itemWithoutId } = item;
            const data = await updateData(id, itemWithoutId)
            if (data.statusCode === 200) {
              Vue.prototype.$toast.success(`Update data Successfully!`)
            }
          } catch (e) {
            Vue.prototype.$toast.error(`${e.data.message}`)
          } finally {
            this.closeFormDialog();
            await this.fetchData();
          }
        } else {
          try {
            const data = await createData(item);
            if (data.statusCode === 200) {
              Vue.prototype.$toast.success(`Create data Successfully!`)
            }
          } catch (e) {
            Vue.prototype.$toast.error(`${e.data.message}`)
          } finally {
            this.closeFormDialog();
            await this.fetchData();
          }
        }
        this.loading = false;
      },
      closeFormDialog() {
        this.isFormRoleDialog = false;
      },
      // Fetch all data and update tableData
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
          console.error("Error fetching :", error);
          Vue.prototype.$toast.error(`${error.data.message}`)
        } finally {
          this.loading = false;
        }
      },
      // DELETE
      openConfirmDeleteDialog(index) {
        this.selectedItem = {
          index: index,
          data: this.tableData[index]
        };
        this.isConfirmDeleteDialogOpen = true;
      },
      closeConfirmDeleteDialog() {
        this.isConfirmDeleteDialogOpen = false;
      },
      async handleDelete() {
        this.loading = true;
        const itemToDelete = this.selectedItem;
        try {
          await deleteData(itemToDelete.data.id);
          this.tableData.splice(itemToDelete.index, 1);
          Vue.prototype.$toast.success(`Delete data ${itemToDelete.data.name} Successfully!`)
        } catch (error) {
          console.error("Error deleting outlet:", error);
          Vue.prototype.$toast.error(`${error.data.message}`)
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>
