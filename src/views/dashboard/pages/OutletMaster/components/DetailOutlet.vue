<template>
  <v-container fluid>
    test wkwkwk
  </v-container>
</template>

<script>
import { getAll } from '@/api/masterRoleService'
import Vue from "vue";

export default {
  name: "OutletDetail",
  components: {  },
  data() {
    return {
      tableHeaders: [
        { text: "Name", value: "name" },
        { text: "Description", value: "description" },
        { text: "Status", value: "is_active" },
        { text: "Mobile", value: "is_mobile" },
        { text: "Dashboard", value: "is_web" },
        { text: "Menu", value: "menus" },
      ],
      tableData: [],
      totalItems: 0,
      options: { page: 1, itemsPerPage: 10 },
      loading: false,
      selectedItem: null,
      isFormRoleDialog: false,
      isEdit: false,
      isConfirmDeleteDialogOpen: false,
      search: '',
    };
  },

  created() {
    this.fetchData();
  },
  methods: {
    // Fetch data
    async fetchData() {
      this.loading = true;
      try {
        const response = await getAll({
          page: this.options.page,
          limit: this.options.itemsPerPage,
          searchTerm: this.search,
        });
        this.tableData = response.data.data;
        this.totalItems = response.data.totalRecords;
      } catch (error) {
        console.error("Error fetching :", error);
        Vue.prototype.$toast.error(`${error.data.message}`)
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
