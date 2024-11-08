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
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Edit Profile
            </div>
            <div class="subtitle-1 font-weight-light">
              Complete your profile
            </div>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    label="Role (disabled)"
                    :value="user.roles"
                    disabled
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="user.username"
                    class="purple-input"
                    label="User Name"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="user.email"
                    label="Email Address"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="user.fullname"
                    label="Full Name"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="user.region"
                    label="Region"
                    class="purple-input"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="user.about"
                    class="purple-input"
                    label="About Me"
                  />
                </v-col>

                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    color="success"
                    class="mr-0"
                    @click="updateProfile"
                  >
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
          class="v-card-profile"
          avatar="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg"
        >
          <v-card-text class="text-center">
            <h6 class="display-1 mb-1 grey--text">
              User Details
            </h6>
            <h4 class="display-2 font-weight-light mb-3 black--text">
              {{ user.fullname }}
            </h4>
            <p class="font-weight-light grey--text">
              {{ user.about || "Add a bio..." }}
            </p>
            <v-btn
              color="success"
              rounded
              class="mr-0"
            >
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
    updateProfile() {
      // You can add logic here to save updates to the user's profile
      localStorage.setItem('user', JSON.stringify(this.user));
      alert("Profile updated successfully!");
    },
  },
};
</script>

<style scoped>
.purple-input .v-input__control .v-input__slot {
  background-color: #f3e5f5;
}
</style>
