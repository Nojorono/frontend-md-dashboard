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
        hide-default-footer
        @update:options="fetchData"
      >
        <template v-slot:top>
          <v-row class="justify-space-between" style="align-items: baseline">
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
                style="align-self: center"
              >
                <v-icon
                  style="width: 40px; border-radius: 50%"
                  color="primary"
                  size="2rem"
                  :loading="loading"
                  @click="fetchData"
                >
                  mdi-refresh
                </v-icon>
                <v-btn
                  color="primary"
                  style="margin: unset !important"
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
            <td>{{ item?.name }}</td>
            <td class="d-flex" style="align-items: center">
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
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="mx-1"
                    outlined
                    small
                    v-bind="attrs"
                    v-on="on"
                    @click="openSioGallery(item)"
                  >
                    <v-icon>mdi-image</v-icon>
                  </v-btn>
                </template>
                <span>Komponen Sio</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-row justify="center" class="py-3">
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
    <form-sio
      :dialog="isFormRoleDialog"
      :is-edit="isEdit"
      :item="selectedItem"
      @close="closeFormDialog"
      @save="handleSave"
    />
  </v-container>
</template>

<script>
import ConfirmDeleteDialog from "@/components/base/ConfirmDeleteDialog.vue";
import { createData, deleteData, getAll, updateData } from "@/api/sioService";
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import FormSio from "@/views/dashboard/pages/Sio/components/FormSio.vue";

export default {
  name: "MasterSio",
  components: { FormSio, ConfirmDeleteDialog },
  data() {
    return {
      tableHeaders: [
        { text: "No", value: "no" },
        { text: "name", value: "name" },
        { text: "Action", value: "action" },
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
      search: "",
    };
  },
  computed: {
    ...mapGetters(["getUser", "getLoading"]),
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
    getUser(newUser) {
      this.checkUserMenuLoaded(newUser);
    },
    getLoading(state) {
      this.loading = state;
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["showLoading", "hideLoading"]),
    onPageChange(newPage) {
      this.page = newPage;
    },
    openSioGallery(item) {
      this.$router.push({
        name: "Sio Gallery",
        params: { id: item.id, name: item.name },
      });
    },
    handleSearch() {
      this.options.page = 1;
      this.fetchData();
    },
    openHandleAdd() {
      this.isEdit = false;
      this.selectedItem = null;
      this.isFormRoleDialog = true;
    },
    openHandleUpdate(item) {
      this.isEdit = true;
      this.selectedItem = {
        id: item.id,
        component: item.component,
        name: item.name,
      };
      this.isFormRoleDialog = true;
    },
    async handleSave(item) {
      this.showLoading();
      try {
        if (this.isEdit) {
          const { id, ...itemWithoutId } = item;
          const res = await updateData(id, itemWithoutId);
          if (res.statusCode === 200) {
            Vue.prototype.$toast.success(`Update data Successfully!`);
            this.closeFormDialog();
          }
        } else {
          const res = await createData(item);
          if (res.statusCode === 200) {
            Vue.prototype.$toast.success(`Create data Successfully!`);
            this.closeFormDialog();
          }
        }
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`);
        console.error(error);
      } finally {
        this.hideLoading();
        await this.fetchData();
      }
    },
    closeFormDialog() {
      this.isFormRoleDialog = false;
    },
    // Fetch all data and update tableData
    async fetchData() {
      this.loading = true;
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
        this.tableData = response.data.data;
      } catch (error) {
        console.error("Error fetching :", error);
      } finally {
        this.loading = false;
      }
    },
    // DELETE
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
        await deleteData(data.id);
        Vue.prototype.$toast.success(
          `Deleted Code ${data.code_batch} successfully!`
        );
      } catch (error) {
        Vue.prototype.$toast.error(`${error.data.message}`);
        console.error(error);
      } finally {
        this.loading = false;
        this.closeConfirmDeleteDialog();
        await this.fetchData();
      }
    },
  },
};
</script>
