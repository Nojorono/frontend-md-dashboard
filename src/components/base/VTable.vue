<template>
  <base-material-card
    :color="color"
    :icon="icon"
    :title="title"
    class="mt-1"
  >
    <!-- Search, Filter -->
    <v-row class="justify-space-between d-flex">
      <v-col
        cols="6"
      >
        <v-btn
          color="primary"
          @click="refreshTable"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
      <v-col
        v-if="isSearch"
        cols="3"
      >
        <v-text-field
          v-model="searchQuery"
          label="Search"
          prepend-icon="mdi-magnify"
          clearable
          @input="applyFilters"
        />
      </v-col>
      <v-col
        v-if="isFilter"
        cols="3"
      >
        <v-select
          v-model="selectedFilter"
          :items="filters"
          label="Filter by Region"
          clearable
          @change="applyFilters"
        />
      </v-col>
    </v-row>

    <!-- Table Section with Skeleton Loader -->
    <v-simple-table v-if="!localLoading">
      <thead>
        <tr>
          <th
            v-for="header in headers"
            :key="header.value"
            class="header-cell"
          >
            <div class="header-text">
              <span class="font-weight-bold">{{ header.text }}</span>
            </div>
          </th>
          <th
            class="header-cell"
          >
            <div
              class="header-text"
              style="justify-content: center!important;"
            >
              <span class="font-weight-bold">Actions</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in paginatedData"
          :key="index"
        >
          <template v-for="(value, key) in row">
            <td
              v-if="key !== 'id'"
              :key="key"
            >
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <span
                    class="table-cell"
                    v-on="on"
                  >
                    <!-- Check if value is 1 or 0 to display an icon, else show the truncated value -->
                    <template v-if="value === 1">
                      <span class="icon-button success-icon">
                        <v-icon>mdi-check</v-icon> <!-- Icon for 1 -->
                      </span>
                    </template>
                    <template v-else-if="value === 0">
                      <span class="icon-button error-icon">
                        <v-icon>mdi-close</v-icon> <!-- Icon for 0 -->
                      </span>
                    </template>
                    <template v-else>
                      {{ truncatedValue(value) }} <!-- Default behavior for other values -->
                    </template>
                  </span>
                </template>
                <span>{{ value }}</span>
              </v-tooltip>
            </td>
          </template>
          <td class="text-right">
            <v-btn
              icon
              @click="$emit('edit', index);"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              @click="$emit('delete', index)"
            >
              <v-icon color="red">
                mdi-delete
              </v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>

    <!-- Skeleton Loader while loading -->
    <!-- Loading Progress Bar -->
    <template v-else>
      <v-progress-linear
        :loading="loading"
        indeterminate
        color="primary"
        class="mb-4"
      />
      <v-skeleton-loader
        type="table"
        :loading="loading"
        width="100%"
        class="my-3"
      />
    </template>


    <!-- Pagination Section -->
    <v-pagination
      v-model="page"
      :length="pageCount"
      total-visible="7"
      @input="changePage"
    />
  </base-material-card>
</template>

<script>

  export default {
    name: 'VTable',
    props: {
      headers: {
        type: Array,
        required: true,
      },
      rows: {
        type: Array,
        required: true,
      },
      title: {
        type: String,
        default: 'Advanced Table',
      },
      color: {
        type: String,
        default: 'primary',
      },
      dark: {
        type: Boolean,
        default: false,
      },
      isFilter: {
        type: Boolean,
        default: false,
      },
      isSearch: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      icon: {
        type: String,
        default: 'mdi-table',
      },
      filterFlag: {
        type: String,
        default: '',
      },
      filters: {
        type: Array,
        default: () => [],
      },
    },
    data () {
      return {
        searchQuery: '',
        selectedFilter: null,
        page: 1,
        itemsPerPage: 10,
      }
    },
    computed: {
      localLoading: {
        get () {
          return this.loading
        },
        set (value) {
          this.$emit('update:loading', value)
        },
      },
      filteredData () {
        let data = this.rows

        if (this.searchQuery) {
          data = data.filter((row) =>
            Object.values(row)
              .join(' ')
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()),
          )
        }
        if (this.selectedFilter) {
          data = data.filter((row) => row[this.filterFlag] === this.selectedFilter)
        }
        return data
      },
      paginatedData () {
        const start = (this.page - 1) * this.itemsPerPage
        const end = this.page * this.itemsPerPage
        return this.filteredData.slice(start, end)
      },
      pageCount () {
        return Math.ceil(this.filteredData.length / this.itemsPerPage)
      },
    },
    methods: {
      applyFilters () {
        this.page = 1
      },
      changePage (newPage) {
        this.page = newPage  // Set the page to the selected one
      },
      // Refresh table data
      refreshTable () {
        this.$emit('refresh')  // Emit an event to refresh the data
      },
      truncatedValue (value) {
        if (value === null || value === undefined) {
          return '' // Return an empty string for null or undefined values
        } else {
          // Limit the value to a specific length
          const maxLength = 20 // Set your desired max length
          return value.length > maxLength ? value.substring(0, maxLength) + '...' : value
        }
      },
    },
  }
</script>

<style>
.table-cell {
  display: inline-block; /* Ensure the tooltip works well */
  max-width: 150px; /* You can adjust this as needed */
  white-space: nowrap; /* Prevent text from wrapping */
  overflow: hidden; /* Hide overflow */
  text-overflow: ellipsis; /* Show ellipsis for overflow */
}

.header-cell {
  /* Optional: Set minimum width to avoid collapsing */
  min-width: 150px;
}

.header-text {
  /* Flexbox to manage text alignment */
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Center align if needed */
  white-space: nowrap; /* Prevent wrapping */
  overflow: hidden; /* Hide overflow */
  text-overflow: ellipsis; /* Show ellipsis for overflow */
  width: 100%; /* Make sure it uses the full width */
}
</style>
