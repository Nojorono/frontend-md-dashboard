<template>
    <v-dialog
      v-model="dialog"
      max-width="1000"
      persistent
      @click:outside="closeDialog"
    >
      <v-card class="rounded-lg">
        <v-card-title class="primary white--text py-4">
          <v-icon left color="white">{{
           "mdi-calendar-plus"
          }}</v-icon>
          <span class="text-h6">{{
            "Import Schedule Plan"
          }}</span>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-row>
            <v-col cols="12">
              <v-file-input
                v-model="file"
                label="Choose Excel File"
                accept=".xlsx, .xls"
                placeholder="Select an Excel file"
                prepend-icon="mdi-file-excel"
                show-size
                outlined
                dense
                class="rounded-lg"
                :error-messages="fileError"
                @change="validateFile"
              ></v-file-input>
            </v-col>
          </v-row>

          <v-row class="mt-2">
            <v-col cols="12">
              <a href="#" @click="downloadTemplate">Download Template Excel</a>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pb-4 px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="!file"
            @click="handleImport"
          >
            Import
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import Vue from 'vue'
  import { importScheduleData } from '@/api/callPlanService'
  
  export default {
    name: "FormImportSchedule",
    props: {
      dialog: Boolean,
      callPlanId: String,
    },
    data() {
      return {
        file: null,
        fileError: '',
        loading: false
      };
    },
    computed: {
      userLogin() {
        return this.$store.getters.getUser;
      },
    },
    methods: {
      closeDialog() {
        this.$emit('close')
        this.file = null
        this.fileError = ''
      },
      validateFile(file) {
        if (!file) {
          this.fileError = 'Please select a file'
          return
        }
        
        const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
        if (!allowedTypes.includes(file.type)) {
          this.fileError = 'Please upload only Excel files (.xlsx or .xls)'
          this.file = null
          return
        }

        if (file.size > 5000000) { // 5MB limit
          this.fileError = 'File size should not exceed 5MB'
          this.file = null
          return
        }

        this.fileError = ''
      },
      async handleImport() {
        if (!this.file) return

        this.loading = true
        try {
          const res = await importScheduleData({ file: this.file, call_plan_id: this.callPlanId })
          console.log(res)
          // TODO: Implement API call to import excel
          // await importExcel(formData)
          
          Vue.prototype.$toast.success('Data imported successfully!')
          this.$emit('save')
          this.closeDialog()
        } catch (error) {
          Vue.prototype.$toast.error(error.data?.message || 'Failed to import data')
          console.error(error)
        } finally {
          this.loading = false
        }
      },
      downloadTemplate() {
        // TODO: Implement template download
        // window.open('path/to/template.xlsx')
      }
    },
  };
  </script>
  
  <style scoped>
  .v-text-field.rounded-lg >>> .v-input__control .v-input__slot,
  .v-select.rounded-lg >>> .v-input__control .v-input__slot,
  .v-autocomplete.rounded-lg >>> .v-input__control .v-input__slot {
    border-radius: 8px !important;
  }
  
  .v-text-field >>> .v-input__prepend-inner {
    margin-right: 8px;
  }
  
  .v-card-title {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  </style>