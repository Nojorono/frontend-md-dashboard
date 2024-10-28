<template>
  <v-container fluid fill-height class="dark-theme">
    <v-row justify="center" align="center" style="justify-content: center">
      <v-col cols="12" md="4">
        <v-card class="elevation-12" color="grey darken-3" style="padding: 10px">
          <v-card-title class="headline text-center black--text" style="padding: 10px">
            Login
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="email"
                :rules="[rules.required, rules.email]"
                label="Email"
                prepend-icon="mdi-email"
                required
                class="black--text"
                outlined
              ></v-text-field>
              <v-text-field
                v-model="password"
                :rules="[rules.required]"
                label="Password"
                type="password"
                prepend-icon="mdi-lock"
                required
                class="black--text"
                outlined
              ></v-text-field>
              <v-btn
                :disabled="!valid"
                @click="handleLogin"
                color="grey darken-1"
                large
                block
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex';
  import { Login } from '@/api/authService'
  import Vue from "vue";

  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
        valid: false,
        rules: {
          required: value => !!value || 'Required.',
          email: value => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
        },
      };
    },
    methods: {
      ...mapActions(['login', 'showLoading', 'hideLoading']),

      async handleLogin() {
        this.snackbar = false
        if (this.email !== '' || this.password !== '') {
          this.showLoading();
          try {
            const response = await Login(this.email, this.password);
            if (response.data.statusCode === 404 ){
              this.hideLoading();
              Vue.prototype.$toast.error(`${response.data.message}`)
            }
            if (response.statusCode === 200){
              Vue.prototype.$toast.success('Login Successfully!')
              await this.login({ token : response.data.accessToken, user: response.data.user });
              setTimeout(async () => {
                await this.$router.push('/');  // Redirect to the homepage or any route after 5 seconds
              }, 4000);
            }
          } catch (error) {
            console.log(error)
          } finally {
            this.hideLoading();
          }
        }else{
          this.hideLoading();
          Vue.prototype.$toast.error(`Login failed. Please check your credentials.`)
        }
      },
    },
  };
</script>

<style scoped>
.dark-theme {
  background-color: #121212; /* Dark background color */
  color: white; /* Text color for dark mode */
}

.v-card {
  border-radius: 8px; /* Optional: Add rounded corners */
}

/* Style for outlined text fields to fit dark mode */
.v-input--is-focused .v-input__control {
  border-color: #3f51b5; /* Adjust border color on focus */
}

.v-input--is-focused .v-input__slot {
  background-color: rgba(255, 255, 255, 0.1); /* Adjust background color on focus */
}
</style>
