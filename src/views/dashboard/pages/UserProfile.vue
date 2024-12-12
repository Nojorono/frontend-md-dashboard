<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
      >
        <base-material-card class="elevation-10" color="primary">
          <template v-slot:heading>
            <div class="display-2 font-weight-light white--text">
              Edit Profile
            </div>
            <div class="subtitle-1 font-weight-light white--text">
              Complete your profile information
            </div>
          </template>

          <v-form>
            <v-container class="py-8">
              <v-row>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    label="Role"
                    :value="user.roles"
                    disabled
                    outlined
                    dense
                    prepend-icon="mdi-shield-account"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="user.username"
                    label="Username"
                    outlined
                    dense
                    prepend-icon="mdi-account"
                    :rules="[v => !!v || 'Username is required']"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="user.email"
                    label="Email Address"
                    outlined
                    dense
                    prepend-icon="mdi-email"
                    :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="user.fullname"
                    label="Full Name"
                    outlined
                    dense
                    prepend-icon="mdi-account-card-details"
                    :rules="[v => !!v || 'Full name is required']"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="user.region"
                    label="Region"
                    outlined
                    dense
                    prepend-icon="mdi-map-marker"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="user.about"
                    label="About Me"
                    outlined
                    auto-grow
                    rows="3"
                    prepend-icon="mdi-text"
                    hint="Tell us about yourself"
                    persistent-hint
                  />
                </v-col>

                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    color="primary"
                    class="mr-0"
                    @click="updateProfile"
                    :loading="loading"
                    rounded
                    elevation="2"
                  >
                    <v-icon left>
                      mdi-content-save
                    </v-icon>
                    Update Profile
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <base-material-card
          class="v-card-profile elevation-10"
          avatar="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg"
        >
          <v-card-text class="text-center">
            <h6 class="text-h5 mb-2 primary--text">
              User Details
            </h6>
            <h4 class="text-h4 font-weight-medium mb-3 black--text">
              {{ user.fullname || 'Your Name' }}
            </h4>
            <p class="body-1 grey--text text--darken-1">
              {{ user.about || "Add a bio to tell people about yourself..." }}
            </p>
            <v-btn
              color="primary"
              rounded
              class="px-5 mt-3"
              elevation="2"
            >
              <v-icon left>
                mdi-account-plus
              </v-icon>
              Follow
            </v-btn>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      user: {
        roles: '',
        username: '',
        email: '',
        fullname: '',
        region: '',
        about: '',
      },
    };
  },
  mounted() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      this.user = { ...storedUser, about: 'Tell us about yourself...' };
    }
  },
  methods: {
    async updateProfile() {
      this.loading = true;
      try {
        // You can add logic here to save updates to the user's profile
        localStorage.setItem('user', JSON.stringify(this.user));
        this.$vuetify.snackbar = {
          value: true,
          color: 'success',
          text: 'Profile updated successfully!'
        };
      } catch (error) {
        this.$vuetify.snackbar = {
          value: true,
          color: 'error',
          text: 'Failed to update profile'
        };
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.v-card-profile {
  transition: all 0.3s ease;
}
.v-card-profile:hover {
  transform: translateY(-5px);
}
</style>
