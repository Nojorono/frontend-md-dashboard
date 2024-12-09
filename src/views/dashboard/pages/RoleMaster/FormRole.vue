<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEdit ? "Edit Item" : "Add New Item" }}</span>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="form"
          v-model="formValid"
        >
          <!-- menus Input -->
          <div>
            <v-btn
              small
              color="secondary"
              @click="toggleSelectAll"
            >
              {{ selectAll ? 'Deselect All' : 'Select All' }}
            </v-btn>

            <v-autocomplete
              v-model="itemData.menus"
              :items="mappedMenuOptions"
              item-text="title"
              item-value="path"
              label="Menus"
              clearable
              small-chips
              multiple
              return-object
            >
              <template v-slot:selection="{ item }">
                <v-chip small>
                  {{ item.title }}
                </v-chip>
              </template>
              
              <template v-slot:item="{ item }">
                <v-list-item-icon v-if="item.icon">
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.path }}</v-list-item-subtitle>
                </v-list-item-content>
              </template>

              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-content>Menus not found</v-list-item-content>
                </v-list-item>
              </template>
            </v-autocomplete>
          </div>
          <!-- Name Input -->
          <v-text-field
            v-model="itemData.name"
            :rules="nameRules"
            label="Name"
            required
          />

          <!-- Description Input -->
          <v-text-field
            v-model="itemData.description"
            :rules="descriptionRules"
            label="Description"
            required
          />

          <!-- is_active Switch -->
          <v-switch
            v-model="itemData.is_active"
            label="Is Active"
          />

          <!-- is_mobile Switch -->
          <v-switch
            v-model="itemData.is_mobile"
            label="Is Mobile"
          />

          <!-- is_web Switch -->
          <v-switch
            v-model="itemData.is_web"
            label="Is Web"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="green darken-1"
          text
          :disabled="!formValid"
          @click="saveItem"
        >
          {{ isEdit ? "Save" : "Add" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "FormRole",
  props: {
    dialog: Boolean,
    isEdit: Boolean,
    item: Object,
  },
  data() {
    return {
      itemData: {
        menus: [],
        name: '',
        description: '',
        is_active: true,
        is_mobile: false,
        is_web: false,
      },
      formValid: false,
      selectAll: false,
      menusOptions: [],
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => v.length >= 2 || "Name must be at less 2 characters",
        (v) => v.length <= 20 || "Name must be less than 20 characters"
      ],
      descriptionRules: [
        (v) => !!v || "Description is required",
        (v) => v.length <= 255 || "Description must be less than 255 characters"
      ],
    };
  },
  computed: {
    mappedMenuOptions() {
      const flattenMenus = (routes, parentPath = '') => {
        return routes.reduce((acc, route) => {
          if (route.meta?.hideInMenu) return acc;
          
          const currentPath = parentPath ? `${parentPath}${route.path}` : route.path;
          
          // Only add menu item if path doesn't already exist
          if (!acc.some(item => item.path === currentPath)) {
            acc.push({
              title: route.name || route.meta?.title || route.path,
              path: currentPath,
              icon: route.meta?.icon
            });
          }
          
          if (route.children) {
            acc.push(...flattenMenus(route.children, currentPath));
          }
          
          return acc;
        }, []);
      };

      return flattenMenus(this.menusOptions);
    }
  },
  watch: {
    item: {
      immediate: true,
      handler(newItem) {
        if (newItem) {
          this.itemData = {
            ...newItem,
            is_active: newItem.is_active === 1,
            is_mobile: newItem.is_mobile === 1,
            is_web: newItem.is_web === 1,
          };
        } else {
          this.resetForm();
        }
      },
    },
  },
  created() {
    this.loadMenuOptions();
  },
  methods: {
    toggleSelectAll() {
      if (this.selectAll) {
        this.itemData.menus = [];
      } else {
        this.itemData.menus = [...this.mappedMenuOptions];
      }
      this.selectAll = !this.selectAll;
    },
    loadMenuOptions() {
      const rootRoute = this.$router.options.routes.find(route => route.path === '/');
      if (rootRoute && rootRoute.children) {
        this.menusOptions = rootRoute.children.filter(route => !route.meta?.hideInMenu);
      }
    },
    resetForm() {
      this.itemData = {
        name: '',
        description: '',
        is_active: true,
        is_mobile: false,
        is_web: false,
        menus: []
      };
      this.formValid = false;
      this.selectAll = false;
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },
    closeDialog() {
      this.resetForm();
      this.$emit("close");
    },
    saveItem() {
      if (this.$refs.form.validate()) {
        const formattedData = {
          ...this.itemData,
          is_active: this.itemData.is_active ? 1 : 0,
          is_mobile: this.itemData.is_mobile ? 1 : 0,
          is_web: this.itemData.is_web ? 1 : 0,
        };
        this.$emit("save", formattedData);
        this.closeDialog();
      }
    },
  }
}

</script>
