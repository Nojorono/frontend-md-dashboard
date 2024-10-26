<template>
  <v-container fluid>
    <base-material-snackbar
      v-model="snackbar.open"
      :type="snackbar.type"
      v-bind="{ top: true, right: true }"
    >
      <span class="font-weight-bold">&nbsp;{{ snackbar.message }}&nbsp;</span>
    </base-material-snackbar>
    <v-row class="justify-end">
      <v-col cols="1" style="max-width: none!important;">
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

    <v-data-table
      :headers="tableHeaders"
      :items="tableData"
      :server-items-length="totalItems"
      :loading="loading"
      :options.sync="options"
      @update:options="fetchData"
      :search="search"
    >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Search"
          class="mx-4"
          @input="fetchData"
        ></v-text-field>
      </template>
      <template v-slot:item.actions="{ item, index }">
        <v-btn small @click="openHandleUpdate(index)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn small @click="openConfirmDeleteDialog(index)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
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
  import ConfirmDeleteDialog from '@/components/base/ConfirmDeleteDialog.vue'
  import { createData, deleteData, updateData, getAll } from '@/api/userService'
  import BaseMaterialSnackbar from '@/components/base/MaterialSnackbar.vue'
  import FormUser from '@/views/dashboard/pages/UserMaster/component/FormUser.vue'

  export default {
    name: 'MasterUser',
    components: {
      FormUser,
      BaseMaterialSnackbar,
      ConfirmDeleteDialog,
    },
    data() {
      return {
        snackbar: {
          open: false,
          type: 'info',
          message: 'info',
        },
        tableHeaders: [
          { text: 'Roles', value: 'roles', class: 'text-left',  width: '5%' },
          { text: 'Username', value: 'username', class: 'text-left', width: '5%' },
          { text: 'Email', value: 'email', class: 'text-left', width: '10%' },
          { text: 'Phone', value: 'phone', class: 'text-left', width: '5%' },
          { text: 'Full Name', value: 'fullname', class: 'text-left', width: '10%' },
          { text: 'Region', value: 'region', class: 'text-left', width: '5%' },
          { text: 'Area', value: 'area', class: 'text-left', width: '5%' },
          { text: 'Type MD', value: 'type_md', class: 'text-left', width: '10%' },
          { text: 'Status', value: 'is_active', class: 'text-left', width: '10%' },
          { text: 'Last Login', value: 'last_login', class: 'text-left', width: '5%' },
          { text: 'Actions', value: 'actions', sortable: false, class: 'text-center',  width: '15%' },
        ],
        tableData: [],
        totalItems: 0,
        options: {
          page: 1,
          itemsPerPage: 10,
        },
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
          this.fetchData()
        },
        deep: true,
      },
    },

    created() {
      this.fetchData()
    },

    methods: {
      openHandleAdd() {
        this.isEdit = false
        this.selectedItem = null
        this.isFormRoleDialog = true
      },
      openHandleUpdate(index) {
        this.isEdit = true
        this.selectedItem = { ...this.tableData[index] }
        this.isFormRoleDialog = true
      },
      async handleSave(item) {
        try {
          if (this.isEdit) {
            const { id, ...itemWithoutId } = item
            await updateData(id, itemWithoutId)
            this.snackbar.message = 'Update data Successfully!'
          } else {
            await createData(item)
            this.snackbar.message = 'Create data Successfully!'
          }
          this.snackbar.open = true
          await this.fetchData()
        } catch (error) {
          this.snackbar.open = true
          this.snackbar.type = 'error'
          this.snackbar.message = 'Error saving data!'
          console.error(error)
        } finally {
          this.closeFormDialog()
        }
      },
      closeFormDialog() {
        this.isFormRoleDialog = false
      },
      async fetchData() {
        this.loading = true
        try {
          const response = await getAll({
            page: this.options.page,
            limit: this.options.itemsPerPage,
            searchTerm: this.search,
          })
          this.tableData = response.data.data
          this.totalItems = response.data.totalRecords
        } catch (error) {
          this.snackbar.open = true
          this.snackbar.type = 'error'
          this.snackbar.message = 'Error fetching data!'
          console.error(error)
        } finally {
          this.loading = false
        }
      },
      openConfirmDeleteDialog(index) {
        this.selectedItem = { index, data: this.tableData[index] }
        this.isConfirmDeleteDialogOpen = true
      },
      closeConfirmDeleteDialog() {
        this.isConfirmDeleteDialogOpen = false
      },
      async handleDelete() {
        this.loading = true
        const { index, data } = this.selectedItem
        try {
          await deleteData(data.id)
          this.tableData.splice(index, 1)
          this.snackbar.open = true
          this.snackbar.type = 'success'
          this.snackbar.message = `Deleted ${data.username} successfully!`
        } catch (error) {
          this.snackbar.open = true
          this.snackbar.type = 'error'
          this.snackbar.message = 'Error deleting user!'
          console.error(error)
        } finally {
          this.loading = false
          this.closeConfirmDeleteDialog()
        }
      },
    },
  }
</script>

<style scoped>
/* Add any scoped styles here */
</style>
