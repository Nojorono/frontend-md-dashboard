<template>
  <v-container fluid>
    <v-data-table
      class="v-card--material v-card v-sheet theme--light v-card--material--has-heading elevation-2"
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
          class="justify-space-between align-center px-4 py-2"
        >
          <v-col
            cols="12"
            sm="6"
            md="4"
          >
            <v-text-field
              v-model="search"
              label="Search"
              dense
              outlined
              hide-details
              clearable
              prepend-inner-icon="mdi-magnify"
              @input="debounceSearch"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="4"
            class="d-flex justify-end"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="primary"
                  class="mr-4"
                  :loading="loading"
                  v-bind="attrs"
                  v-on="on"
                  @click="fetchData"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>Refresh Data</span>
            </v-tooltip>

            <v-btn
              color="primary"
              dark
              class="px-4"
              @click="openHandleAdd"
            >
              <v-icon left>mdi-plus</v-icon>
              Add Role
            </v-btn>
          </v-col>
        </v-row>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item?.name }}</td>
          <td>{{ item?.description }}</td>
          <td>
            <v-chip
              small
              :color="item?.is_active === 1 ? 'success' : 'error'"
              text-color="white"
            >
              {{ item?.is_active === 1 ? 'Active' : 'Inactive' }}
            </v-chip>
          </td>
          <td>
            <v-chip
              small
              :color="item?.is_mobile === 1 ? 'success' : 'error'"
              text-color="white"
            >
              {{ item?.is_mobile === 1 ? 'Yes' : 'No' }}
            </v-chip>
          </td>
          <td>
            <v-chip
              small
              :color="item?.is_web === 1 ? 'success' : 'error'"
              text-color="white"
            >
              {{ item?.is_web === 1 ? 'Yes' : 'No' }}
            </v-chip>
          </td>
          <td>
            <div class="menu-chips">
              <v-chip
                v-for="(menu, index) in item?.menus"
                :key="index"
                small
                class="ma-1"
                outlined
                color="primary"
              >
                {{ menu.title }}
              </v-chip>
            </div>
          </td>
          <td>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  color="primary"
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="openHandleUpdate(item)"
                >
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Edit Role</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  color="error"
                  v-bind="attrs"
                  v-on="on"
                  @click="openConfirmDeleteDialog(item)"
                >
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Delete Role</span>
            </v-tooltip>
          </td>
        </tr>
      </template>

      <template v-slot:no-data>
        <v-alert
          type="info"
          class="ma-4"
        >
          No roles found
        </v-alert>
      </template>

      <template v-slot:progress>
        <v-overlay
          :value="loading"
          absolute
          color="white"
        >
          <v-progress-circular
            indeterminate
            color="primary"
          />
        </v-overlay>
      </template>
    </v-data-table>

    <!-- Confirm Delete Dialog -->
    <confirm-delete-dialog
      :dialog="isConfirmDeleteDialogOpen"
      :item-name="selectedItem?.data?.name"
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
import Vue from "vue"
import { debounce } from 'lodash'

export default {
  name: "MasterRoles",
  components: { ConfirmDeleteDialog, FormRole },
  
  data() {
    return {
      tableHeaders: [
        { text: "Name", value: "name", sortable: false },
        { text: "Description", value: "description", sortable: false },
        { text: "Status", value: "is_active", sortable: false },
        { text: "Mobile Access", value: "is_mobile", sortable: false },
        { text: "Dashboard Access", value: "is_web", sortable: false },
        { text: "Assigned Menus", value: "menus", sortable: false },
        { text: "Actions", value: "actions", sortable: false, align: 'center' }
      ],
      tableData: [],
      totalItems: 0,
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: ['name'],
        sortDesc: [false]
      },
      loading: false,
      selectedItem: null,
      isFormRoleDialog: false,
      isEdit: false,
      isConfirmDeleteDialogOpen: false,
      search: '',
    }
  },

  created() {
    this.fetchData()
    this.debounceSearch = debounce(this.handleSearch, 500)
  },

  methods: {
    handleSearch() {
      this.options.page = 1
      this.fetchData()
    },

    // ADD OR UPDATE
    openHandleAdd() {
      this.isEdit = false
      this.selectedItem = null
      this.isFormRoleDialog = true
    },

    openHandleUpdate(item) {
      this.isEdit = true
      this.selectedItem = item
      this.isFormRoleDialog = true
    },

    async handleSave(item) {
      this.loading = true
      try {
        if (this.isEdit) {
          const { id, ...itemWithoutId } = item
          const response = await updateData(id, itemWithoutId)
          if (response.statusCode === 200) {
            Vue.prototype.$toast.success('Role updated successfully')
          }
        } else {
          const response = await createData(item)
          if (response.statusCode === 200) {
            Vue.prototype.$toast.success('Role created successfully')
          }
        }
        await this.fetchData()
      } catch (error) {
        Vue.prototype.$toast.error(error.data?.message || 'An error occurred')
      } finally {
        this.closeFormDialog()
        this.loading = false
      }
    },

    closeFormDialog() {
      this.isFormRoleDialog = false
      this.selectedItem = null
    },

    async fetchData() {
      this.loading = true
      try {
        const response = await getAll({
          page: this.options.page,
          limit: this.options.itemsPerPage,
          searchTerm: this.search,
          sortBy: this.options.sortBy[0],
          sortDesc: this.options.sortDesc[0]
        })
        this.tableData = response.data.data
        this.totalItems = response.data.totalRecords
      } catch (error) {
        console.error("Error fetching roles:", error)
        Vue.prototype.$toast.error(error.data?.message || 'Failed to fetch roles')
      } finally {
        this.loading = false
      }
    },

    // DELETE
    openConfirmDeleteDialog(item) {
      this.selectedItem = {
        index: this.tableData.indexOf(item),
        data: item
      }
      this.isConfirmDeleteDialogOpen = true
    },

    closeConfirmDeleteDialog() {
      this.isConfirmDeleteDialogOpen = false
      this.selectedItem = null
    },

    async handleDelete() {
      this.loading = true
      try {
        await deleteData(this.selectedItem.data.id)
        Vue.prototype.$toast.success(`Role "${this.selectedItem.data.name}" deleted successfully`)
        await this.fetchData()
      } catch (error) {
        console.error("Error deleting role:", error)
        Vue.prototype.$toast.error(error.data?.message || 'Failed to delete role')
      } finally {
        this.closeConfirmDeleteDialog()
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.menu-chips {
  max-height: 100px;
  overflow-y: auto;
}

.v-data-table ::v-deep .v-data-table__wrapper {
  overflow-x: auto;
}

.v-data-table ::v-deep tbody tr:hover {
  background-color: #f5f5f5 !important;
}
</style>
