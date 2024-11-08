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
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item?.roles }}</td>
          <td>{{ item?.username }}</td>
          <td>{{ item?.email }}</td>
          <td>{{ item?.phone }}</td>
          <td>{{ item?.fullname }}</td>
          <td>{{ item?.region }}</td>
          <td>
            <span
              v-for="(area, index) in item?.area"
              :key="index"
            >
              {{ area }}<span v-if="index < item.area.length - 1">, </span>
            </span>
          </td>
          <td>{{ item?.type_md }}</td>
          <td>{{ item?.status }}</td>
          <td>{{ item?.last_login }}</td>
          <td>
            <v-btn
              outlined
              small
              @click="openHandleUpdate(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
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
    <!-- Import Delete Dialog -->
    <upload-form-dialog
      :dialog="isImportDialogOpen"
      @close="handleImportDialog"
      @upload="handleImportSubmit"
    />
  </v-container>
</template>

<script>
  import { deleteOutlet, getAllOutlets, uploadOutlet } from '@/api/masterOutletService'
  import ConfirmDeleteDialog from '@/components/base/ConfirmDeleteDialog.vue'
  import UploadFormDialog from '@/components/base/UploadFormDialog.vue'
  import Vue from "vue";
  import {createData, updateData} from "@/api/userService";

  export default {
    name: 'MasterOutlet',
    components: {
      ConfirmDeleteDialog,
      UploadFormDialog,
    },
    data () {
      return {
        tableHeaders: [
          {
            text: 'Outlet Code',
            value: 'outlet_code',
          },
          {
            text: 'Name',
            value: 'name',
          },
          {
            text: 'Brand',
            value: 'brand',
          },
          {
            text: 'Unique Name',
            value: 'unique_name',
          },
          {
            text: 'Address',
            value: 'address_line',
          },
          {
            text: 'Sub District',
            value: 'sub_district',
          },
          {
            text: 'District',
            value: 'district',
          },
          {
            text: 'City or Regency',
            value: 'city_or_regency',
          },
          {
            text: 'Postal Code',
            value: 'postal_code',
          },
          {
            text: 'Latitude',
            value: 'latitude',
          },
          {
            text: 'Longitude',
            value: 'longitude',
          },
          {
            text: 'Outlet Type',
            value: 'outlet_type',
          },
          {
            text: 'Region',
            value: 'region',
          },
          {
            text: 'Area',
            value: 'area',
          },
          {
            text: 'Cycle',
            value: 'cycle',
          },
          {
            text: 'Is Active',
            value: 'is_active',
          },
          {
            text: 'Visit Day',
            value: 'visit_day',
          },
          {
            text: 'Odd/Even',
            value: 'odd_even',
          },
          {
            text: 'Photos',
            value: 'photos',
          },
          {
            text: 'Remarks',
            value: 'remarks',
          },
        ],
        tableData: [],
        totalItems: 0,
        options: { page: 1, itemsPerPage: 10 },
        loading: false,
        selectedItem: null,
        isImportDialogOpen: false,
        isFormRoleDialog: false,
        isEdit: false,
        isConfirmDeleteDialogOpen: false,
        search: '',
      }
    },
    computed: {
      regionOptions () {
        return this.tableData.map(r => r.region) // Extract the region names
      },
    },
    created () {
      this.fetchData()
    },
    methods: {
      openHandleAdd() {
        this.isEdit = false;
        this.selectedItem = null;
        this.isFormRoleDialog = true;
      },
      openHandleUpdate(item) {
        this.isEdit = true;
        this.selectedItem = {
          id: item.id,
        }
        this.isFormRoleDialog = true;
      },
      async handleSave(item) {
        try {
          if (this.isEdit) {
            const { id, ...itemWithoutId } = item;
            await updateData(id, itemWithoutId);
            Vue.prototype.$toast.success(`Update data Successfully!`);
          } else {
            await createData(item);
            Vue.prototype.$toast.success(`Create data Successfully!`);
          }
          this.closeFormDialog();
        } catch (error) {
          Vue.prototype.$toast.error(`${error.data.message}`);
          console.error(error);
        } finally {
          await this.fetchData();
        }
      },
      closeFormDialog() {
        this.isFormRoleDialog = false;
      },
      // Fetch all outlets and update tableData
      async fetchData () {
        this.loading = true
        try {
          const response = await getAllOutlets({
            page: this.options.page,
            limit: this.options.itemsPerPage,
            searchTerm: this.search,
          });
          console.log(response.data)
          this.tableData = response.data.data;
          this.totalItems = response.data.totalRecords;
          this.options.page = response.data.currentPage;
        } catch (error) {
          Vue.prototype.$toast.error(`${error.data.message}`)
        } finally {
          this.loading = false
        }
      },
      // IMPORT
      handleImportDialog (e) {
        this.isImportDialogOpen = e
      },
      async handleImportSubmit (data)
      {
        this.loading = true
        try {
          await uploadOutlet(data);
          await this.fetchOutlets()
        } catch (error) {
          Vue.prototype.$toast.error(`${error.data.message}`)
        } finally {
          this.loading = false
        }
      },
      handleSearch() {
        this.options.page = 1;
        this.fetchData();
      },
      openConfirmDeleteDialog(item) {
        this.selectedItem = item;
        this.isConfirmDeleteDialogOpen = true;
      },
      closeConfirmDeleteDialog() {
        this.isConfirmDeleteDialogOpen = false;
      },
      async handleDelete() {
        this.loading = true;
        const data = this.selectedItem;
        try {
          await deleteOutlet(data.id);
          Vue.prototype.$toast.success(`Deleted ${data.username} successfully!`);
        } catch (error) {
          Vue.prototype.$toast.error(`${error.data?.message}`);
          console.error(error);
        } finally {
          this.loading = false;
          this.closeConfirmDeleteDialog();
          this.fetchData();
        }
      },
    },
  }
</script>
