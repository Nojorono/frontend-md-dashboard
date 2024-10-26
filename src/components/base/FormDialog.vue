<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEdit ? "Edit Item" : "Add New Item" }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-for="field in fields"
            :key="field.name"
            v-model="item[field.name]"
            :label="field.label"
            :type="field.type"
            required
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="saveItem">{{ isEdit ? "Save" : "Add" }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "FormDialog",
    props: {
      dialog: Boolean,
      fields: Array, // Array of field definitions { name, label, type }
      isEdit: Boolean,
      item: Object, // Object to bind form values to
    },
    methods: {
      closeDialog() {
        this.$emit("close");
      },
      saveItem() {
        if (this.$refs.form.validate()) {
          this.$emit("save", this.item);
          this.closeDialog();
        }
      },
    },
  };
</script>
