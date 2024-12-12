<template>
  <v-container fluid>
    <v-card
      class="v-card--material v-card v-sheet theme--light v-card--material--has-heading"
      style="padding: 20px; border-radius: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
    >
      <v-data-table
        :headers="tableHeaders"
        :items="tableData"
        :server-items-length="totalItems"
        :loading="loading"
        :items-per-page="-1"
        hide-default-footer
        class="small-table"
        :search="search"
        @update:options="fetchData(id)"
      >
        <template v-slot:top>
          <v-row
            class="justify-space-between align-center px-4 py-2"
          >
            <v-col
              cols="1"
              class="d-flex justify-center align-center"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    fab
                    outlined
                    color="primary"
                    v-bind="attrs"
                    v-on="on"
                    @click="handleBack"
                    class="elevation-2"
                  >
                    <v-icon>mdi-backburger</v-icon>
                  </v-btn>
                </template>
                <span>Go Back</span>
              </v-tooltip>
            </v-col>

            <v-col cols="5">
              <v-text-field
                v-model="search"
                label="Search"
                dense
                outlined
                clearable
                hide-details
                append-icon="mdi-magnify"
                @click:append="handleSearch"
                @click:clear="handleClear"
                @keyup.enter="handleSearch"
              />
            </v-col>

            <v-col cols="2">
              <div class="d-flex justify-end align-center">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      fab
                      small
                      color="primary"
                      class="mr-4"
                      :loading="loading"
                      v-bind="attrs"
                      v-on="on"
                      @click="fetchData(id)"
                    >
                      <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                  </template>
                  <span>Refresh Data</span>
                </v-tooltip>

                <v-btn
                  color="primary"
                  class="px-4"
                  elevation="2"
                  @click="openHandleAdd"
                >
                  <v-icon left>mdi-plus-box-multiple</v-icon>
                  Add New Target
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </template>

        <template v-slot:item="{ item, index }">
          <tr :class="{'grey lighten-5': index % 2 === 0}">
            <td class="text-center">{{ index + 1 }}</td>
            <td>{{ item.regional }}</td>
            <td>{{ item.amo }}</td>
            <td>{{ item.brand_type_sio }}</td>
            <td>{{ item.amo_brand_type }}</td>
            <td class="text-right">{{ item.allocation_ho }}</td>
            <td>
              <div class="d-flex justify-center">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      fab
                      small
                      class="mr-2"
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                      @click="openHandleUpdate(item)"
                    >
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Edit</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      fab
                      small
                      color="error"
                      v-bind="attrs"
                      v-on="on"
                      @click="openConfirmDeleteDialog(item)"
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Delete</span>
                </v-tooltip>
              </div>
            </td>
          </tr>
        </template>

        <template v-slot:no-data>
          <v-alert
            type="info"
            class="ma-4"
            outlined
          >
            No data available
          </v-alert>
        </template>

        <template v-slot:loading>
          <v-skeleton-loader
            v-for="n in 5"
            :key="n"
            type="list-item-avatar-three-line"
            class="my-2"
          />
        </template>
      </v-data-table>
    </v-card>

    <!-- Confirm Delete Dialog -->
    <confirm-delete-dialog
      :dialog="isConfirmDeleteDialogOpen"
      :item="selectedItem"
      title="Delete Target"
      :message="`Are you sure you want to delete target for ${selectedItem?.amo_brand_type}?`"
      @confirm="handleDelete"
      @close="closeConfirmDeleteDialog"
    />

    <!-- Create & Update Dialog -->
    <form-batch-target
      :dialog="isFormRoleDialog"
      :is-edit="isEdit"
      :item="selectedItem"
      @close="closeFormDialog"
      @save="handleSave"
    />
  </v-container>
</template>

<script>
import Vue from "vue";
import ConfirmDeleteDialog from '@/components/base/ConfirmDeleteDialog.vue'
import {
  createBatchTarget,
  deleteBatchTarget,
  getAllTarget,
  updateBatchTarget,
} from '@/api/batchService'
import FormBatchTarget from "@/views/dashboard/pages/Batch/components/FormBatchTarget.vue";
import { debounce } from 'lodash';

export default {
  name: 'BatchTarget',
  components: {
    FormBatchTarget,
    ConfirmDeleteDialog,
  },
  data() {
    return {
      id: this.$route.params.id,
      tableHeaders: [
        { text: 'No', value: 'No', sortable: false, align: 'center', width: '5%' },
        { text: 'REGIONAL', value: 'regional', sortable: false, align: 'left', width: '7%' },
        { text: 'AMO', value: 'amo', sortable: false, align: 'left', width: '10%' },
        { text: 'BRAND TYPE SIO', value: 'brand_type_sio', sortable: false, align: 'left', width: '15%' },
        { text: 'AMO BRAND TYPE', value: 'amo_brand_type', sortable: false, align: 'left', width: '20%' },
        { text: 'ALLOCATION HO', value: 'allocation_ho', sortable: false, align: 'right', width: '10%' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'center', width: '10%' },
      ],
      tableData: [],
      totalItems: 0,
      loading: false,
      selectedItem: null,
      isFormRoleDialog: false,
      isEdit: false,
      isConfirmDeleteDialogOpen: false,
      search: '',
      options: {
        page: 1,
        itemsPerPage: -1,
      },
    }
  },
  created() {
    this.debouncedSearch = debounce(this.handleSearch, 500);
    this.fetchData(this.id);
  },
  watch: {
    search() {
      this.debouncedSearch();
    }
  },
  methods: {
    handleBack(){
      this.$router.back();
    },
    openHandleAdd() {
      this.isEdit = false
      this.selectedItem = {
        batch_id: this.id,
        regional: '',
        amo: '',
        brand_type_sio: '',
        amo_brand_type: '',
        allocation_ho: 0,
      }
      this.isFormRoleDialog = true
    },
    openHandleUpdate(item) {
      this.isEdit = true
      this.selectedItem = { ...item }
      this.isFormRoleDialog = true
    },
    async handleSave(item) {
      try {
        this.loading = true
        if (this.isEdit) {
          const { id, ...itemWithoutId } = item
          const res = await updateBatchTarget(id, itemWithoutId)
          if (res.statusCode === 200){
            Vue.prototype.$toast.success(`Target updated successfully!`)
            this.closeFormDialog()
          }
        } else {
          const res = await createBatchTarget(item)
          if (res.statusCode === 200){
            Vue.prototype.$toast.success(`New target created successfully!`)
            this.closeFormDialog()
          }
        }
      } catch (error) {
        Vue.prototype.$toast.error(error.data?.message || 'An error occurred')
        console.error(error)
      } finally {
        this.loading = false
        await this.fetchData(this.id)
      }
    },
    closeFormDialog() {
      this.isFormRoleDialog = false
      this.isEdit = false
      this.selectedItem = null
    },
    handleSearch() {
      this.options.page = 1;
      this.fetchData(this.id);
    },
    handleClear() {
      this.search = '';
      this.options.page = 1;
      this.fetchData(this.id);
    },
    async fetchData(id) {
      this.loading = true
      try {
        const response = await getAllTarget(id);
        this.tableData = response.data.data;
        this.totalItems = response.data.totalItems;
      } catch (error) {
        Vue.prototype.$toast.error(error.data?.message || 'Failed to fetch data')
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    openConfirmDeleteDialog(data) {
      this.selectedItem = data
      this.isConfirmDeleteDialogOpen = true
    },
    closeConfirmDeleteDialog() {
      this.isConfirmDeleteDialogOpen = false
      this.selectedItem = null
    },
    async handleDelete() {
      this.loading = true
      try {
        await deleteBatchTarget(this.selectedItem.id)
        Vue.prototype.$toast.success(`Target deleted successfully!`)
        await this.fetchData(this.id);
      } catch (error) {
        Vue.prototype.$toast.error(error.data?.message || 'Failed to delete target')
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
.small-table {
  font-size: 13px;
}

.small-table ::v-deep th {
  font-weight: 600 !important;
  background-color: #f5f5f5 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.small-table ::v-deep td {
  padding: 8px 16px !important;
  height: 48px !important;
}

.small-table ::v-deep .v-data-table__wrapper {
  border-radius: 8px;
}

.v-btn {
  text-transform: none;
}

.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15) !important;
}
</style>
