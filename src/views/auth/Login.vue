<template>
  <v-app>
    <v-container
      fluid
      fill-height
    >
      <v-row>
        <v-col
          class="img-filled"
          cols="6"
          md="6"
        >
          <v-img
            :src="imagePath"
            cover
            class="responsive-cover-img"
            style="border-radius: 20px;"
          />
        </v-col>
        <v-col
          justify="center"
          class="login-filled"
          style="justify-content: center; align-content: center; text-align: -webkit-center;"
        >
          <v-card
            class="elevation-12"
            style="padding: 10px; max-width: 600px; border-radius: 20px;"
          >
            <v-card-title
              class="headline text-center black--text"
              style="padding: 10px; justify-content: center;"
            >
              <v-img
                :src="imagePathLogo"
                max-width="250"
                max-height="100"
              />
            </v-card-title>
            <v-card-text>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
              >
                <v-text-field
                  v-model="email"
                  :rules="[rules.required, rules.email]"
                  label="Email"
                  prepend-icon="mdi-email"
                  required
                  class="black--text"
                  outlined
                />
                <v-text-field
                  v-model="password"
                  :rules="[rules.required]"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-icon="mdi-lock"
                  required
                  class="black--text"
                  outlined
                />
                <v-btn
                  :disabled="!valid"
                  color="primary"
                  large
                  block
                  @click="handleLogin"
                >
                  Login
                </v-btn>
              </v-form>
              <v-row justify="end" class="mt-3">
                <v-col cols="auto" class="text-center">
                  <router-link to="/forgot-password" class="forgot-password-link">
                    Forgot Password?
                  </router-link>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
  import { mapActions } from 'vuex';
  import { Login } from '@/api/authService'
  import Vue from "vue";
  import loginImage from '@/assets/login-nna.png';


  export default {
    name: 'Login',
    data() {
      return {
        imagePathLogo: '/logo-nna.png',
        imagePath: loginImage,
        email: '',
        password: '',
        valid: false,
        showPassword: false,
        rules: {
          required: value => !!value || 'Required.',
          email: value => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
        },
      };
    },
    methods: {
      ...mapActions(['login', 'showLoading', 'hideLoading']),
      togglePassword() {
        this.showPassword = !this.showPassword; // Toggle the visibility
      },

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
                await this.$router.push('/');
              }, 2000);
            }
          } catch (error) {
            Vue.prototype.$toast.error(`${error.response.data.message}`)
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
.responsive-cover-img {
  height: 96vh; /* Set a default height */
}

@media (max-width: 768px) { /* Adjust height for tablets and smaller screens */
  .responsive-cover-img {
    display: none;
  }
  .img-filled{
    display: none;
  }
}

@media (max-width: 480px) { /* Adjust height for mobile devices */
  .responsive-cover-img {
    display: none;
  }
  .img-filled{
    display: none;
  }
}
.v-input--is-focused .v-input__control {
  border-color: #3f51b5; /* Adjust border color on focus */
}

.v-input--is-focused .v-input__slot {
  background-color: rgba(255, 255, 255, 0.1); /* Adjust background color on focus */
}

.forgot-password-link {
  font-size: 14px;
  color: #3f51b5; /* Use a soft, primary color */
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
}

.forgot-password-link:hover {
  color: #1a237e; /* Darken the color on hover */
  text-decoration: underline;
}
</style>
