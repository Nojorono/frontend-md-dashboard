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
      hide-default-footer
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
      <!-- Mapping Item Properties -->
      <template v-slot:item="{ item, index }">
        <tr>
          <td>{{ (options.page - 1) * options.itemsPerPage + index + 1 }}</td>
          <td>{{ item?.code_batch }}</td>
          <td>{{ item?.region }}</td>
          <td>{{ item?.area }}</td>
          <td class="d-flex" style="align-items: center">
            <v-btn
              class="mx-1"
              color="warning"
              outlined
              small
              @click="handleSchedule(item.id)"
            >
              <v-icon>mdi-calendar-arrow-right</v-icon>
            </v-btn>
            <v-btn
              class="mx-1"
              outlined
              small
              @click="openHandleUpdate(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              class="mx-1"
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
      class="py-3"
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

    <!-- Confirm Delete Dialog -->
    <confirm-delete-dialog
      :dialog="isConfirmDeleteDialogOpen"
      @confirm="handleDelete"
      @close="closeConfirmDeleteDialog"
    />
    <!-- Create & Update Dialog -->
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
  import { createData, deleteData, updateData, getAll } from '@/api/callPlanService'
  import FormCallPlan from '@/views/dashboard/pages/CallPlan/components/FormCallPlan.vue'
  import Vue from "vue";

  export default {
    name: 'CallPlan',
    components: {
      FormCallPlan,
      ConfirmDeleteDialog,
    },
    data() {
      return {
        refreshDataTrigger : false,
        tableHeaders: [
          { text: 'No', value: 'number', sortable: false, class: 'text-left', width: '5%' },
          { text: 'Code Batch', value: 'code_batch', class: 'text-left', width: '15%' },
          { text: 'Region', value: 'region', class: 'text-left', width: '20%' },
          { text: 'Area', value: 'area', class: 'text-left', width: '15%' },
          { text: 'Actions', value: 'actions', sortable: false, class: 'text-center' },
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
    methods: {
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
          this.tableData = response.data.data;
          this.totalItems = response.data.totalItems;
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
      async handleSchedule(id) {
        await this.$router.push({
          name: 'Call Plan Schedule',
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
          await this.fetchData()
          Vue.prototype.$toast.success(`Deleted Area ${data.area} successfully!`)
        } catch (error) {
          Vue.prototype.$toast.error(`${error.data.message}`)
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
