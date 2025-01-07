<template>
    <v-data-table :headers="headers" :items="items" :search="search" :sort-by="sortBy" :sort-desc="sortDesc"
        :loading="loading" class="elevation-1">
        <template v-slot:top>
            <v-text-field v-model="search" label="Search" class="mx-4" />
        </template>
    </v-data-table>
</template>

<script>
import { getDashboardBatchTarget } from "@/api/dashboardService";
import { mapGetters } from "vuex";
export default {
  name: "DashboardBatchTarget",
  data() {
    return {
      headers: [
        { text: 'Regional', value: 'batch_target_regional' },
        { text: 'AMO', value: 'batch_target_amo' },
        { text: 'Brand', value: 'batch_target_brand' },
        { text: 'SIO Type', value: 'batch_target_sio_type' },
        { text: 'Brand Type SIO', value: 'batch_target_brand_type_sio' },
        { text: 'AMO Brand Type', value: 'batch_target_amo_brand_type' },
        { text: 'Allocation HO', value: 'batch_target_allocation_ho' },
        { text: 'Actual', value: 'actual_outlet' },
      ],
      items: [],
      search: '',
      sortBy: 'name',
      sortDesc: false,
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['getCodeBatch'])
  },
  mounted() {
    this.getBatchTarget();
  },  
  methods: {
    async getBatchTarget() {
      const codeBatch = this.getCodeBatch.code_batch;
      const batchTarget = await getDashboardBatchTarget(codeBatch);
      this.items = batchTarget.data;
    }
  },
};
</script>
