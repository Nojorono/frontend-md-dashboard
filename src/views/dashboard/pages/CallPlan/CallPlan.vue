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
        :options.sync="options"
        :search="search"
        hide-default-footer
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
              <v-autocomplete
                item-text="name"
                item-value="name"
                label="Region"
                :items="regionOptions"
                clearable
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
                :items="areaOptions"
                clearable
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
                class="mx-5"
                clearable
                append-icon="mdi-magnify"
                @click:append="handleSearch"
              />
            </v-col>
            <v-col cols="4">
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
            <td
              class="d-flex"
              style="align-items: center"
            >
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
    </v-card>

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
  import {getOutletArea, getOutletRegion} from "@/api/masterOutletService";
  import {mapGetters} from "vuex";

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
          { text: 'Code Batch', value: 'code_batch', sortable: false, class: 'text-left', width: '15%' },
          { text: 'Region', value: 'region', sortable: false, class: 'text-left', width: '20%' },
          { text: 'Area', value: 'area', sortable: false, class: 'text-left', width: '15%' },
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
        regionOptions: [],
        areaOptions: [],
      }
    },
    computed: {
      ...mapGetters(['getUser']),
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
    mounted() {
      this.fetchRegion();
      this.fetchArea();
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
      async fetchArea() {
        this.loading = true;
        try {
          const response = await getOutletArea();
          // Check if user area array is defined and not empty; if so, filter based on areas
          if (Array.isArray(this.getUser.area) && this.getUser.area.length > 0) {
            this.areaOptions = response.data.filter(
              (area) => this.getUser.area.includes(area)
            );
          } else {
            this.areaOptions = response.data;
          }
        } catch (error) {
          console.error("Error fetching :", error);
        } finally {
          this.loading = false;
        }
      },
      async fetchRegion() {
        this.loading = true;
        try {
          const response = await getOutletRegion();
          if (this.getUser.region) {
            this.regionOptions = response.data.filter(
              (region) => region === this.getUser.region
            );
          } else {
            this.regionOptions = response.data; // No filtering if region is undefined
          }
        } catch (error) {
          console.error("Error fetching :", error);
        } finally {
          this.loading = false;
        }
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
    },
  }
</script>

<style scoped>
/* Add any scoped styles here */
</style>
