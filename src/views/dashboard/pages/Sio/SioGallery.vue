<template>
  <v-container fluid>
    <v-card
      class="v-card--material v-card v-sheet theme--light v-card--material--has-heading"
      style="padding: 20px; border-radius: 20px"
    >
      <v-row>
        <v-col cols="5">
          <v-btn small fab outlined color="primary" @click="handleBack">
            <v-icon>mdi-backburger</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="4">
          <h3>{{ sioName }}</h3>
        </v-col>
        <v-col cols="3">
          <div class="d-flex justify-end">
            <v-icon
              style="width: 40px; border-radius: 50%; margin-right: 1rem"
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
          <v-row class="align-center" style="align-items: baseline">
            <v-col cols="12"> </v-col>
          </v-row>
        </template>
        <!-- Mapping Item Properties -->
        <template v-slot:item="{ item, index }">
          <tr>
            <td>{{ (options.page - 1) * options.itemsPerPage + index + 1 }}</td>
            <td>{{ item?.name }}</td>
            <td>
              <v-img
                :src="item?.photo"
                width="100"
                height="100"
                style="object-fit: cover"
              />
            </td>
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
    <form-sio-gallery
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
import {
  createGallery,
  deleteGallery,
  getGallery,
  updateGallery,
} from "@/api/sioService";
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import FormSioGallery from "@/views/dashboard/pages/Sio/components/FormSioGallery.vue";

export default {
  name: "SioGallery",
  components: { FormSioGallery, ConfirmDeleteDialog },
  data() {
    return {
      sioId: parseInt(this.$route.params.id, 10),
      sioName: this.$route.params.name,
      tableHeaders: [
        { text: "No", value: "no" },
        { text: "Name", value: "name" },
        { text: "Photo", value: "photo" },
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
  mounted() {
    
  },
  methods: {
    ...mapActions(["showLoading", "hideLoading"]),
    onPageChange(newPage) {
      this.page = newPage;
    },
    handleSearch() {
      this.options.page = 1;
      this.fetchData();
    },
    openHandleAdd() {
      this.isEdit = false;
      this.selectedItem = {
        sio_type_id: this.sioId,
      };
      this.isFormRoleDialog = true;
    },
    openHandleUpdate(item) {
      this.isEdit = true;
      this.selectedItem = {
        id: item.id,
        photo: item.photo,
        name: item.name,
      };
      this.isFormRoleDialog = true;
    },
    async handleSave(formData) {
      this.showLoading();
      try {
        if (this.isEdit) {
          const id = formData.get('id');
          const res = await updateGallery(id, formData);
          if (res.statusCode === 200) {
            Vue.prototype.$toast.success(`Update data Successfully!`);
            this.closeFormDialog();
          }
        } else {
          const res = await createGallery(formData);
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
        const response = await getGallery({
          sioTypeId: this.sioId,
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
        await deleteGallery(data.id);
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
    handleBack() {
      this.$router.back();
    },
  },
};
</script>
