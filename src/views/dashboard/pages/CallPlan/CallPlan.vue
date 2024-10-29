<template>
  <v-container fluid>
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

    <v-data-table
      :headers="tableHeaders"
      :items="tableData"
      :server-items-length="totalItems"
      :loading="loading"
      :options.sync="options"
      :search="search"
      @update:options="fetchData"
    >
      <template v-slot:top>
        <v-row class="align-center">
          <v-col>
            <v-text-field
              v-model="search"
              label="Search"
              class="mx-4"
              @input="fetchData"
            />
          </v-col>
          <v-col cols="auto">
            <v-btn color="secondary"
                   small
                   :loading="loading"
                   @click="refreshData">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <!-- Mapping Item Properties -->
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.m_user.email }}</td>
          <td>{{ item.call_plan.code_call_plan }}</td>
          <td>{{ item.call_plan.area }}</td>
          <td>{{ item.call_plan.region }}</td>
          <td>{{ item.call_plan.start_plan }}</td>
          <td>{{ item.call_plan.end_plan }}</td>
          <td>{{ item.call_plan.created_at }}</td>
          <td>{{ item.call_plan.updated_at }}</td>
          <td>
            <v-btn small @click="handleSchedule(item.call_plan.id, item.call_plan.code_call_plan)">
              <v-icon>mdi-calendar-arrow-right</v-icon>
            </v-btn>
            <v-btn small @click="openHandleUpdate(item.call_plan)"><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn small @click="openConfirmDeleteDialog(item.call_plan)"><v-icon>mdi-delete</v-icon></v-btn>
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
          // { text: 'ID', value: 'id', class: 'text-left', width: '5%' },
          { text: 'User', value: 'user_id', class: 'text-left', width: '10%' },
          { text: 'Code Call Plan', value: 'code_call_plan', class: 'text-left', width: '15%' },
          { text: 'Area', value: 'area', class: 'text-left', width: '10%' },
          { text: 'Region', value: 'region', class: 'text-left', width: '10%' },
          { text: 'Start Plan', value: 'start_plan', class: 'text-left', width: '10%' },
          { text: 'End Plan', value: 'end_plan', class: 'text-left', width: '10%' },
          { text: 'Created At', value: 'created_at', class: 'text-left', width: '5%' },
          { text: 'Updated At', value: 'updated_at', class: 'text-left', width: '5%' },
          { text: 'Actions', value: 'actions', sortable: false, class: 'text-center', width: '10%' },
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
    methods: {
      openHandleAdd() {
        this.isEdit = false
        this.selectedItem = null
        this.isFormRoleDialog = true
      },
      async refreshData() {
        await this.fetchData();
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
            await updateData(id, itemWithoutId)
            Vue.prototype.$toast.success(`Update data Successfully!`)
          } else {
            await createData(item)
            Vue.prototype.$toast.success(`Create data Successfully!`)
          }
          await this.fetchData()
        } catch (error) {
          Vue.prototype.$toast.error(`${error.data.message}`)
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
      async handleSchedule(id, code_call_plan) {
        await this.$router.push({
          name: 'Call Plan Schedule',
          params: { id, code_call_plan },
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
          Vue.prototype.$toast.success(`Deleted ${data.username} successfully!`)
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
