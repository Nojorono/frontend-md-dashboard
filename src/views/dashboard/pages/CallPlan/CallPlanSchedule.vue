<template>
  <v-container fluid>
    <v-btn
      style="margin: unset!important;"
      small
      fab
      outlined
      color="secondary"
      @click="handleBack"
    >
      <v-icon>mdi-step-backward</v-icon>
    </v-btn>
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
      :loading="loading"
      :search="search"
      @update:="fetchData"
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
            <v-btn
              color="secondary"
              small
              :loading="loading"
              @click="refreshData"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <!-- Mapping Item Properties -->
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.callPlanUser?.email }}</td>
          <td>
            <span>
              {{ item.callPlanOutlet?.outlet_code }}
            </span>
            <span>
              {{ item.callPlanOutlet?.name }}
            </span>
          </td>
          <td>{{ item.code_call_plan }}</td>
          <td>{{ item.start_plan }}</td>
          <td>{{ item.end_plan }}</td>
          <td>{{ item.notes }}</td>
          <td>{{ item.status }}</td>
          <td>{{ item.created_by }}</td>
          <td>
            <v-btn
              small
              @click="openHandleUpdate(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              small
              color="error"
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
import ConfirmDeleteDialog from '@/components/base/ConfirmDeleteDialog.vue'
import {
  geListSchedule,
  createScheduleData,
  updateScheduleData,
  deleteScheduleData
} from '@/api/callPlanService'
import Vue from "vue";
import FormCallPlanSchedule from "@/views/dashboard/pages/CallPlan/components/FromCallPlanSchedule.vue";

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
        { text: 'Outlet', value: 'outlet_code', class: 'text-left', width: '10%' },
        { text: 'Code Call Plan', value: 'code_call_plan', class: 'text-left', width: '15%' },
        { text: 'Start Plan', value: 'start_plan', class: 'text-left', width: '10%' },
        { text: 'End Plan', value: 'end_plan', class: 'text-left', width: '10%' },
        { text: 'Notes', value: 'notes', class: 'text-left', width: '15%' },
        { text: 'Status', value: 'notes', class: 'text-left', width: '15%' },
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
    }
  },
  watch: {
    '$route.params.id': {
      handler(newId) {
        this.fetchData(newId); // Fetch data again if the id changes
      },
    },
  },
  created() {
    this.fetchData(this.$route.params.id);
  },
  methods: {
    handleBack(){
      this.$router.back();
    },
    refreshData(){
      this.fetchData(this.$route.params.id);
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
        outlet_id: item.outlet_id,
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
          }

        } else {
          const res = await createScheduleData(item)
          if (res.statusCode === 200){
            Vue.prototype.$toast.success(`Create data Successfully!`)
          }
        }
        await this.fetchData(this.$route.params.id)
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`)
        console.error(error)
      } finally {
        this.closeFormDialog(this.$route.params.id)
      }
    },
    closeFormDialog() {
      this.isFormRoleDialog = false
      this.isEdit = false
    },
    async fetchData(id) {
      this.loading = true
      try {
        const response = await geListSchedule(id)
        this.tableData = response.data
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
