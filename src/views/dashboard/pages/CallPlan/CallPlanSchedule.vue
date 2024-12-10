<template>
  <v-container fluid>
    <v-card
      class="v-card--material v-card v-sheet theme--light v-card--material--has-heading"
      style="padding: 24px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
    >
      <v-data-table
        :headers="tableHeaders"
        :items="tableData"
        :server-items-length="totalItems"
        :loading="loading"
        :options.sync="options"
        hide-default-footer
        @update:options="fetchData(id)"
      >
        <template v-slot:top>
          <v-row
            class="justify-space-between align-center px-4 py-2"
          >
            <v-col
              cols="1"
              class="d-flex justify-center align-center pr-0 pl-2"
            >
              <v-btn
                small
                fab
                outlined
                color="primary"
                class="elevation-1"
                @click="handleBack"
              >
                <v-icon>mdi-backburger</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-autocomplete
                item-text="email"
                item-value="id"
                label="Select User"
                :items="userOptions"
                clearable
                return-object
                outlined
                dense
                hide-details
                class="custom-select"
                @change="onUserChange"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content class="text-center">User not found</v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="search"
                label="Search"
                class="mx-5"
                clearable
                outlined
                dense
                hide-details
                append-icon="mdi-magnify"
                @click:append="handleSearch"
                @click:clear="handleClear"
              />
            </v-col>
            <v-col cols="2">
              <div class="d-flex justify-space-between align-center">
                <v-btn
                  icon
                  color="primary"
                  class="mr-4 elevation-1"
                  :loading="loading"
                  @click="fetchData(id)"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
                <v-btn
                  color="primary"
                  class="text-none px-4"
                  elevation="1"
                  @click="openHandleAdd"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Add New
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </template>

        <template v-slot:item="{ item, index }">
          <tr>
            <td class="text-center">{{ (options.page - 1) * options.itemsPerPage + index + 1 }}</td>
            <td>
              <v-chip
                small
                :color="item.type === 0 ? 'primary' : 'warning'"
                text-color="white"
              >
                {{ item.type === 0 ? 'Visit Outlet' : 'Survey Outlet' }}
              </v-chip>
            </td>
            <td>
              <span class="font-weight-medium">{{ item.email }}</span>
            </td>
            <td>
              <div class="d-flex flex-column">
                <span class="font-weight-medium">
                  {{ item.outlet_code ? item.outlet_code : item.survey_outlet_code }}
                </span>
                <span class="caption grey--text">
                  {{ item.outlet_name ? item.outlet_name : item.survey_outlet_name }}
                </span>
              </div>
            </td>
            <td>
              <span class="font-weight-medium">{{ item.code_call_plan }}</span>
            </td>
            <td>
              <v-chip
                small
                outlined
                color="primary"
              >
                {{ item.day_plan | formatDate }}
              </v-chip>
            </td>
            <td>{{ item.notes }}</td>
            <td>
              <v-chip
                small
                :color="getStatusColor(item.status)"
                text-color="white"
              >
                {{ getStatusLabel(item) }}
              </v-chip>
            </td>
            <td>
              <div class="d-flex justify-center">
                <v-btn
                  small
                  color="primary"
                  class="mr-2"
                  fab
                  elevation="1"
                  @click="openHandleUpdate(item)"
                >
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  small
                  color="error"
                  fab
                  elevation="1"
                  @click="openConfirmDeleteDialog(item)"
                >
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
        </template>

        <template v-slot:loading>
          <v-skeleton-loader
            type="table-row"
            class="my-2"
          />
        </template>

        <template v-slot:no-data>
          <div class="text-center py-6">
            <v-icon
              size="64"
              color="grey lighten-1"
            >
              mdi-database-off
            </v-icon>
            <div class="text-subtitle-1 grey--text mt-2">
              No data available
            </div>
          </div>
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
          next-icon="mdi-menu-right"
          prev-icon="mdi-menu-left"
          color="primary"
          @input="onPageChange"
        />
      </v-row>
    </v-card>

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
import { getAllMdRole } from "@/api/userService";
import { EXISTING_SURVEY_STATUS, NEW_SURVEY_STATUS, STATUS_COLORS } from '@/constants/status';


export default {
  name: 'CallPlanSchedule',
  components: {
    FormCallPlanSchedule,
    ConfirmDeleteDialog,
  },
  data() {
    return {
      id: this.$route.params.id,
      region: this.$route.params.region,
      area: this.$route.params.area,
      tableHeaders: [
        { text: 'No', value: 'No', sortable: false, align: 'center', width: '5%' },
        { text: 'Type', value: 'type', sortable: false, align: 'left', width: '10%' },
        { text: 'User', value: 'email', sortable: false, align: 'left', width: '10%' },
        { text: 'Outlet', value: 'outlet_code', sortable: false, align: 'left', width: '10%' },
        { text: 'Code Call Plan', value: 'code_call_plan', sortable: false, align: 'left', width: '10%' },
        { text: 'Day Plan', value: 'day_plan', sortable: false, align: 'left', width: '10%' },
        { text: 'Notes', value: 'notes', sortable: false, align: 'left', width: '10%' },
        { text: 'Status', value: 'status', align: 'left', width: '5%' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'center', width: '10%' },
      ],
      tableData: [],
      userOptions: [],
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
      userId: null,
    }
  },
  computed :{
    userLogin() {
      return this.$store.getters.getUser
    }
  },
  watch: {
    page(value) {
      this.options.page = value;
      this.fetchData(this.id);
    },
    itemsPerPage(value) {
      this.options.itemsPerPage = value;
      this.fetchData(this.id);
    },
  },
  mounted() {
    this.fetchUsers()
  },
  methods: {
    getStatusColor(status) {
      return STATUS_COLORS[status];
    },
    getStatusLabel(item) {
      return item?.type === 0 ? EXISTING_SURVEY_STATUS[item?.status] : NEW_SURVEY_STATUS[item?.status];
    },
    onPageChange(newPage) {
      this.page = newPage;
    },
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
        day_plan: item.day_plan,
        outlet_id: [item.outlet_id],
        user_id: item.user_id,
        survey_outlet_id: item.survey_outlet_id,
        type: item.type,
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
    handleClear() {
      this.search = '';
      this.options.page = 1;
      this.fetchData(this.id);
    },
    async fetchUsers () {
      const response = await getAllMdRole(this.region , this.area)
      this.userOptions = response.data
    },
    async fetchData(id) {
      this.loading = true
      try {
        const response = await geListSchedule(id, {
          page: this.options.page,
          limit: this.options.itemsPerPage,
          searchTerm: this.search,
          userId: this.userId
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
    closeConfirmDeleteDialog() {
      this.isConfirmDeleteDialogOpen = false
    },
    async handleDelete() {
      this.loading = true
      const data = this.selectedItem
      try {
        await deleteScheduleData(data.id)
        Vue.prototype.$toast.success(`Deleted ${data.email} successfully!`)
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`)
        console.error(error)
      } finally {
        this.loading = false
        this.closeConfirmDeleteDialog()
        await this.fetchData(this.id);
      }
    },
    onUserChange(user) {
      if (user) {
        this.userId = user.id;
        this.fetchData(this.id);
      } else {
        this.userId = null
        this.fetchData(this.id);
      }
    }
  },
}
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
  overflow: hidden;
}

.v-data-table >>> thead th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
}

.v-data-table >>> tbody td {
  font-size: 0.875rem;
}

.v-btn {
  text-transform: none;
}

.v-btn.v-btn--fab.v-size--small {
  width: 32px;
  height: 32px;
}

.custom-select >>> .v-input__slot {
  min-height: 40px !important;
}
</style>
