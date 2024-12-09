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
              <v-autocomplete
                item-text="name"
                item-value="name"
                label="Region"
                :items="getRegionOptions"
                clearable
                dense
                outlined
                class="mr-4"
                hide-details
                return-object
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
                :items="getAreaOptions"
                clearable
                dense
                outlined
                hide-details
                return-object
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
                append-icon="mdi-magnify"
                @click:append="handleSearch"
              />
            </v-col>
            <v-col cols="4" class="d-flex justify-end">
              <v-btn
                icon
                color="primary"
                class="mr-2"
                :loading="loading"
                @click="fetchData"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </template>

        <template v-slot:item="{ item, index }">
          <tr>
            <td>{{ (options.page - 1) * options.itemsPerPage + index + 1 }}</td>
            <td>
              <v-chip
                :color="item?.outlet_name ? 'primary' : 'warning'"
                small
                label
                text-color="white"
              >
                {{ item?.outlet_name ? 'Existing' : 'New' }}
              </v-chip>
            </td>
            <td class="font-weight-medium">{{ item?.outlet_name || item?.survey_name }}</td>
            <td>{{ item?.region }}</td>
            <td>{{ item?.area }}</td>
            <td>{{ item?.brand }}</td>
            <td>{{ item?.type_sio }}</td>
            <td>
              <v-chip
                :color="getStatusColor(item?.status)"
                small
                label
                text-color="white"
              >
              {{ getStatusLabel(item?.status) }}
            </v-chip>
            </td>
            <td>{{ formatDate(item?.created_at) }}</td>
            <td>
              <div class="d-flex align-center">
                <v-btn
                  color="warning"
                  outlined
                  small
                  class="mr-2"
                  @click="handleDetail(item.id)"
                >
                  <v-icon small class="mr-1">mdi-calendar-arrow-right</v-icon>
                  Detail
                </v-btn>

                <v-menu
                  offset-y
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      outlined
                      small
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon small>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item
                      v-for="(status, index) in statusOptions"
                      :key="index"
                      @click="updateStatus(item, status.value)"
                    >
                      <v-list-item-icon class="mr-2">
                        <v-icon small :color="getStatusColor(status.value)">
                          mdi-circle-small
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>{{ status.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </td>
          </tr>
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
  import ConfirmDeleteDialog from '@/components/base/ConfirmDeleteDialog.vue'
  import { createData, deleteData, updateData, getAll } from '@/api/activityService'
  import FormCallPlan from '@/views/dashboard/pages/CallPlan/components/FormCallPlan.vue'
  import Vue from "vue";
  import { mapGetters } from "vuex";
  import { STATUS_LABELS, STATUS_COLORS } from '@/constants/status';

  export default {
    name: 'Activity',
    components: {
      FormCallPlan,
      ConfirmDeleteDialog,
    },
    data() {
      return {
        refreshDataTrigger : false,
        tableHeaders: [
          { text: 'No', value: 'number', sortable: false, class: 'text-left font-weight-bold', width: '5%' },
          { text: 'Type', value: 'type', sortable: false, class: 'text-left font-weight-bold', width: '10%' },
          { text: 'Outlet Name', value: 'outlet_name', sortable: false, class: 'text-left font-weight-bold', width: '20%' },
          { text: 'Region', value: 'region', sortable: false, class: 'text-left font-weight-bold', width: '20%' },
          { text: 'Area', value: 'area', sortable: false, class: 'text-left font-weight-bold', width: '15%' },
          { text: 'Brand', value: 'brand', sortable: false, class: 'text-left font-weight-bold', width: '15%' },
          { text: 'Type SIO', value: 'type_sio', sortable: false, class: 'text-left font-weight-bold', width: '15%' },
          { text: 'Status', value: 'status', sortable: false, class: 'text-left font-weight-bold', width: '15%' },
          { text: 'Created At', value: 'created_at', sortable: false, class: 'text-left font-weight-bold', width: '15%' },
          { text: 'Actions', value: 'actions', sortable: false, class: 'text-center font-weight-bold' },
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
        search: '',
        regionOptions: [],
        areaOptions: [],
        statusOptions: [
          { value: 0, text: 'Pending' },
          { value: 1, text: 'In Progress' },
          { value: 2, text: 'Completed' }
        ],
        status: '',
        statusUpdate: '',
        statusUpdateItem: null,
        menu: false,
      }
    },
    computed: {
      ...mapGetters(['getUser', 'getRegionOptions', 'getAreaOptions']),
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
      getStatusLabel(status) {
        return STATUS_LABELS[status];
      },
      getStatusColor(status) {
        return STATUS_COLORS[status];
      },
      formatDate(date) {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      },
      onPageChange(newPage) {
        this.page = newPage;
      },
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
      async handleStatusUpdate(item, status) {
        this.statusUpdateItem = item
        this.statusUpdate = status
      },
      async handleSave(item) {
        try {
          if (this.isEdit) {
            const { id, ...itemWithoutId } = item
            const res  = await updateData(id, itemWithoutId)
            if (res.statusCode === 200) {
              Vue.prototype.$toast.success(`Update data Successfully!`)
              this.closeFormDialog()
            }
          } else {
            const res = await createData(item)
            if (res.statusCode === 200) {
              Vue.prototype.$toast.success(`Create data Successfully!`)
              this.closeFormDialog()
            }
          }
        } catch (error) {
          Vue.prototype.$toast.error(`${error.data.message}`)
          console.error(error)
        } finally {
          await this.fetchData()
        }
      },
      closeFormDialog() {
        this.isFormRoleDialog = false
        this.isEdit = false
      },
      handleSearch() {
        this.options.page = 1;
        this.fetchData();
      },
      async fetchData() {
        this.loading = true
        try {
          const response = await getAll({
            page: this.options.page,
            limit: this.options.itemsPerPage,
            searchTerm: this.search,
          });
          this.tableData = response.data.result;
          this.totalItems = response.data.totalRecords;
          this.totalPages = response.data.totalPages;
          this.options.page = response.data.currentPage;
        } catch (error) {
          Vue.prototype.$toast.error(`${error.data.message}`)
          console.error(error)
        } finally {
          this.loading = false
        }
      },
      openConfirmDeleteDialog(data) {
        this.selectedItem = data
        this.isConfirmDeleteDialogOpen = true
      },
      async handleDetail(id) {
        await this.$router.push({
          name: 'Detail Activity',
          params: { id },
        });
      },
      closeConfirmDeleteDialog() {
        this.isConfirmDeleteDialogOpen = false
      },
      async handleDelete() {
        this.loading = true
        const data = this.selectedItem
        try {
          await deleteData(data.id)
          Vue.prototype.$toast.success(`Deleted Area ${data.area} successfully!`)
        } catch (error) {
          Vue.prototype.$toast.error(`${error.data.message}`)
          console.error(error)
        } finally {
          this.loading = false
          this.closeConfirmDeleteDialog()
          await this.fetchData()
        }
      },
      updateStatus(item, status) {
        item.status = status;
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
</style>
