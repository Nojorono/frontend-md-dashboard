<template>
  <v-container fluid>
    <v-card
      class="v-card--material v-card v-sheet theme--light v-card--material--has-heading"
      style="padding: 20px; border-radius: 20px"
    >
      <v-data-table
        :headers="tableHeaders"
        :items="tableData"
        :server-items-length="totalItems"
        :loading="loading"
        :items-per-page="-1"
        hide-default-footer
        class="small-table"
        @update:options="fetchData(id)"
      >
        <template v-slot:top>
          <v-row
            class="justify-space-between"
            style="align-items: baseline"
          >
            <v-col
              cols="1"
              style="display: flex; justify-content: center; align-items: center; padding-right: unset; padding-left: 10px"
            >
              <div class="mr-3">
                <v-btn
                  small
                  fab
                  outlined
                  color="primary"
                  @click="handleBack"
                >
                  <v-icon>mdi-backburger</v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="search"
                label="Search"
                class="mx-5"
                clearable
                append-icon="mdi-magnify"
                @click:append="handleSearch"
                @click:clear="handleClear"
              />
            </v-col>
            <v-col cols="2">
              <div
                class="d-flex justify-space-between"
                style="align-self: center;"
              >
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
        <template v-slot:item="{ item, index }">
          <tr>
            <td>{{ index + 1 }}</td>
            <td>{{ item.regional }}</td>
            <td>{{ item.amo }}</td>
            <td>{{ item.brand_type_sio }}</td>
            <td>{{ item.amo_brand_type }}</td>
            <td>{{ item.allocation_ho }}</td>
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
import {createData, deleteData, getAllTarget, updateData} from '@/api/batchService'


export default {
  name: 'BatchTarget',
  components: {
    FormCallPlanSchedule,
    ConfirmDeleteDialog,
  },
  data() {
    return {
      id: this.$route.params.id,
      tableHeaders: [
        { text: 'No', value: 'No', sortable: false, class: 'text-left', width: '5%' },
        { text: 'REGIONAL', value: 'regional', sortable: false, class: 'text-left', width: '7%' },
        { text: 'AMO', value: 'amo', sortable: false, class: 'text-left', width: '7%' },
        { text: 'BRAND TYPE SIO', value: 'brand_type_sio', sortable: false, class: 'text-left', width: '15%' },
        { text: 'AMO BRAND TYPE', value: 'amo_brand_type', sortable: false, class: 'text-left', width: '20%' },
        { text: 'ALLOCATION HO', value: 'allocation_ho', sortable: false, class: 'text-left', width: '5%' },
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
  mounted() {
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
      this.selectedItem = item
      this.isFormRoleDialog = true
    },
    async handleSave(item) {
      try {
        if (this.isEdit) {
          const { id, ...itemWithoutId } = item
          const res = await updateData(id, itemWithoutId)
          if (res.statusCode === 200){
            Vue.prototype.$toast.success(`Update data Successfully!`)
            this.closeFormDialog()
          }
        } else {
          const res = await createData(item)
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
    async fetchData(id) {
      this.loading = true
      try {
        const response = await getAllTarget(id);
        this.tableData = response.data.data;
        this.totalItems = response.data.totalItems;
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
        await deleteData(data.id)
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
  },
}
</script>

<style scoped>
.small-table {
  font-size: 12px;
}

.small-table th,
.small-table td {
  padding: 4px 8px;
  height: 30px;
}

.small-table th {
  font-weight: bold;
}

.small-table td {
  font-weight: normal;
}
</style>
