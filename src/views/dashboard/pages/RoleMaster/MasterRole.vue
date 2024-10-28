<template>
  <v-container fluid>
    <base-material-snackbar
      v-model="snackbar.open"
      :type="snackbar.type"
      v-bind="{
        ['top']: true,
        ['right']: true
      }"
    ><span class="font-weight-bold">&nbsp;{{ snackbar.message }}&nbsp;</span>
    </base-material-snackbar>
    <v-row class="justify-end">
      <v-col
        cols="1"
        style="max-width: none!important;"
      >
        <v-btn
          color="primary"
          style="margin: unset!important;"
          @click="openHandleAdd"
        >
          <v-icon>mdi-plus-box-multiple</v-icon>
          <span class="mx-1">Add</span>
        </v-btn>
      </v-col>
    </v-row>
    <advanced-table
      :headers="tableHeaders"
      :rows="tableData"
      title="Master Roles Table"
      color="success"
      dark
      icon="mdi-application-cog"
      :is-search="true"
      :loading="loading"
      :filter-flag="filterFlag"
      @delete="openConfirmDeleteDialog"
      @refresh="fetchData"
      @edit="openHandleUpdate"
    />
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
  import AdvancedTable from "@/components/base/VTable.vue";
  import ConfirmDeleteDialog from '@/components/base/ConfirmDeleteDialog.vue'
  import { createData, deleteData, getAll, updateData } from '@/api/masterRoleService'
  import FormRole from '@/views/dashboard/pages/RoleMaster/FormRole.vue'
  import BaseMaterialSnackbar from '@/components/base/MaterialSnackbar.vue'

  export default {
    name: "MasterRoles",
    components: { BaseMaterialSnackbar, ConfirmDeleteDialog, AdvancedTable, FormRole },
    data() {
      return {
        snackbar: {
          open : false,
          type: 'info',
          message: 'info',
        },
        tableHeaders: [
          { text: "Name", value: "name" },
          { text: "Description", value: "description" },
          { text: "Mobile", value: "is_mobile" },
          { text: "Web", value: "is_web" },
          { text: "Status", value: "is_active" },
        ],
        tableData: [],
        filterData: [],
        filterFlag: "is_active",
        isConfirmDeleteDialogOpen: false,
        isImportDialogOpen: false,
        loading: false,
        selectedItem: null,
        isFormRoleDialog: false,
        isEdit: false,
      };
    },

    created() {
      this.fetchData();
    },
    methods: {
      // ADD OR UPDATE
      openHandleAdd() {
        this.isEdit = false;
        this.selectedItem = null;
        this.isFormRoleDialog = true;
      },
      openHandleUpdate(index) {
        this.isEdit = true;
        this.selectedItem = { ...this.tableData[index] };
        this.isFormRoleDialog = true;
      },
      async handleSave (item) {
        if (this.isEdit) {
          this.tableData[this.selectedItem.index] = item;
          try {
            const { id, ...itemWithoutId } = item;
            const data = await updateData(id, itemWithoutId)
            if (data.statusCode === 200) {
              this.snackbar.open = true;
              this.snackbar.type = 'success';
              this.snackbar.message = 'Update data Successfully!';
            }
          } catch (e) {
            this.snackbar.open = true;
            this.snackbar.type = 'error';
            this.snackbar.message = 'Update data Error!';
          } finally {
            this.closeFormDialog();
            await this.fetchData();
          }
        } else {
          try {
            const data = await createData(item);
            if (data.statusCode === 200) {
              this.snackbar.open = true;
              this.snackbar.type = 'success';
              this.snackbar.message = 'Create data Successfully!';
            }
          } catch (e) {
            this.snackbar.open = true;
            this.snackbar.type = 'error';
            this.snackbar.message = 'Create data Error!';
          } finally {
            this.closeFormDialog();
            await this.fetchData();
          }
        }
        this.closeFormDialog();
      },
      closeFormDialog() {
        this.isFormRoleDialog = false;
      },
      // Fetch all data and update tableData
      async fetchData() {
        this.loading = true;
        try {
          const response = await getAll();
          this.tableData = response.data.data;
        } catch (error) {
          console.error("Error fetching :", error);
          this.snackbar.open = true;
          this.snackbar.type = 'error';
          this.snackbar.message = 'Error fetching!';
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
        console.log(itemToDelete)
        try {
          await deleteData(itemToDelete.data.id);
          this.tableData.splice(itemToDelete.index, 1);
          this.snackbar.open = true;
          this.snackbar.type = 'success';
          this.snackbar.message = `Delete data ${itemToDelete.data.name} Successfully!`;
        } catch (error) {
          console.error("Error deleting outlet:", error);
          this.snackbar.open = true;
          this.snackbar.type = 'error';
          this.snackbar.message = 'Error deleting outlet!';
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>
