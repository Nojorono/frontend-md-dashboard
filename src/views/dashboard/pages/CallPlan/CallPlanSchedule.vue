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
      @update:options="fetchData(id)"
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
            <v-btn
              small
              fab
              outlined
              color="primary"
              @click="handleBack"
            >
              <v-icon>mdi-backburger</v-icon>
            </v-btn>
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
                @click="fetchData(id)"
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
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.email }}</td>
          <td>
            <span>
              {{ item.outlet_code }}
            </span>
            <span>
              {{ item.outlet_name }}
            </span>
          </td>
          <td>{{ item.code_call_plan }}</td>
          <td>{{ item.start_plan }}</td>
          <td>{{ item.end_plan }}</td>
          <td>{{ item.notes }}</td>
          <td>{{ item.status }}</td>
          <td>{{ item.created_by }}</td>
          <td class="d-flex">
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

    <!-- Confirm Delete Dialog -->
    <confirm-delete-dialog
      :dialog="isConfirmDeleteDialogOpen"
      @confirm="handleDelete"
      @close="closeConfirmDeleteDialog"
    />
    <!-- Create & Update Dialog -->
    <form-call-plan-schedule
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
import FormCallPlanSchedule from "@/views/dashboard/pages/CallPlan/components/FromCallPlanSchedule.vue";
import {
  geListSchedule,
  createScheduleData,
  updateScheduleData,
  deleteScheduleData
} from '@/api/callPlanService'

export default {
  name: 'CallPlanSchedule',
  components: {
    FormCallPlanSchedule,
    ConfirmDeleteDialog,
  },
  data() {
    return {
      id: this.$route.params.id,
      tableHeaders: [
        { text: 'User', value: 'email', class: 'text-left', width: '10%' },
        { text: 'Outlet', value: 'outlet_code', class: 'text-left', width: '20%' },
        { text: 'Code Call Plan', value: 'code_call_plan', class: 'text-left', width: '15%' },
        { text: 'Start Plan', value: 'start_plan', class: 'text-left', width: '10%' },
        { text: 'End Plan', value: 'end_plan', class: 'text-left', width: '10%' },
        { text: 'Notes', value: 'notes', class: 'text-left', width: '10%' },
        { text: 'Status', value: 'notes', class: 'text-left', width: '5%' },
        { text: 'Created By', value: 'created_by', class: 'text-left', width: '10%' },
        { text: 'Actions', value: 'actions', sortable: false, class: 'text-center', width: '10%' },
      ],
      tableData: [],
      totalItems: 0,
      loading: false,
      selectedItem: null,
      isFormRoleDialog: false,
      isEdit: false,
      isConfirmDeleteDialogOpen: false,
      search: '',
      options: { page: 1, itemsPerPage: 10 },
    }
  },
  methods: {
    handleBack(){
      this.$router.back();
    },
    openHandleAdd() {
      this.isEdit = false
      this.selectedItem = null
      this.isFormRoleDialog = true
    },
    openHandleUpdate(item) {
      this.isEdit = true
      this.selectedItem = {
        id: item.id,
        notes: item.notes,
        end_plan: item.end_plan,
        start_plan: item.start_plan,
        outlet_id: [item.outlet_id],
        user_id: item.user_id,
      }
      this.isFormRoleDialog = true
    },
    async handleSave(item) {
      try {
        if (this.isEdit) {
          const { id, ...itemWithoutId } = item
          const res = await updateScheduleData(id, itemWithoutId)
          if (res.statusCode === 200){
            Vue.prototype.$toast.success(`Update data Successfully!`)
            this.closeFormDialog()
          }
        } else {
          const res = await createScheduleData(item)
          if (res.statusCode === 200){
            Vue.prototype.$toast.success(`Create data Successfully!`)
            this.closeFormDialog()
          }
        }
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`)
        console.error(error)
      } finally {
        await this.fetchData(this.id)
      }
    },
    closeFormDialog() {
      this.isFormRoleDialog = false
      this.isEdit = false
    },
    handleSearch() {
      this.options.page = 1;
      this.fetchData(this.id);
    },
    async fetchData(id) {
      this.loading = true
      try {
        const response = await geListSchedule(id, {
          page: this.options.page,
          limit: this.options.itemsPerPage,
          searchTerm: this.search,
        });
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
    closeConfirmDeleteDialog() {
      this.isConfirmDeleteDialogOpen = false
    },
    async handleDelete() {
      this.loading = true
      const data = this.selectedItem
      try {
        await deleteScheduleData(data.id)
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
