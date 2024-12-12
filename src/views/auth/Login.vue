<template>
  <v-app>
    <v-container fluid fill-height class="login-container">
      <v-row>
        <v-col class="img-filled" cols="6" md="6">
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
            class="elevation-12 login-card"
            style="padding: 20px; max-width: 600px; border-radius: 20px;"
          >
            <v-card-title
              class="headline text-center black--text"
              style="padding: 20px; justify-content: center;"
            >
              <v-img
                :src="imagePathLogo"
                max-width="250"
                max-height="100"
                class="mb-4"
              />
             
            </v-card-title>
            <v-card-text>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
                @submit.prevent="handleLogin"
              >
                <v-text-field
                  v-model="email"
                  :rules="[rules.required, rules.email]"
                  label="Email"
                  prepend-icon="mdi-email"
                  required
                  class="black--text input-field"
                  outlined
                  dense
                  autocomplete="email"
                  @keyup.enter="handleLogin"
                />
                <v-text-field
                  v-model="password"
                  :rules="[rules.required, rules.minLength]"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  required
                  class="black--text input-field"
                  outlined
                  dense
                  autocomplete="current-password"
                  @click:append="togglePassword"
                  @keyup.enter="handleLogin"
                />
                <v-btn
                  :disabled="!valid"
                  :loading="loading"
                  color="primary"
                  large
                  block
                  class="mt-4 login-btn"
                  @click="handleLogin"
                >
                  <v-icon left>mdi-login</v-icon>
                  Login
                </v-btn>
              </v-form>
              <v-row justify="space-between" align="center" class="mt-4">
                <v-col cols="auto">
                  <v-checkbox
                    v-model="rememberMe"
                    label="Remember me"
                    class="mt-0"
                    hide-details
                  />
                </v-col>
                <v-col cols="auto">
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
      rememberMe: false,
      loading: false,
      rules: {
        required: value => !!value || 'This field is required',
        email: value => {
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return pattern.test(value) || 'Please enter a valid email address'
        },
        minLength: v => v.length >= 6 || 'Password must be at least 6 characters'
      },
    };
  },
  async mounted() {
    this.checkRememberedCredentials();
  },
  methods: {
    ...mapActions(['login', 'showLoading', 'hideLoading']),
    
    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    async initializeApp() {
      try {
        await Promise.all([
          this.$store.dispatch('fetchBrandOptions'),
          this.$store.dispatch('fetchSioTypeOptions'),
          this.$store.dispatch('fetchRegionOptions'),
          this.$store.dispatch('fetchAreaOptions')
        ]);
      } catch (error) {
        Vue.prototype.$toast.error('Failed to initialize application');
      }
    },

    checkRememberedCredentials() {
      const savedEmail = localStorage.getItem('rememberedEmail');
      if (savedEmail) {
        this.email = savedEmail;
        this.rememberMe = true;
      }
    },

    saveCredentials() {
      if (this.rememberMe) {
        localStorage.setItem('rememberedEmail', this.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
    },

    async handleLogin() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      this.showLoading();

      try {
        const response = await Login(this.email, this.password);
        
        if (response.data.statusCode === 404) {
          Vue.prototype.$toast.error(response.data.message);
          return;
        }

        if (response.statusCode === 200) {
          this.saveCredentials();
          Vue.prototype.$toast.success('Login Successful! Redirecting...');
          await this.login({ 
            token: response.data.accessToken, 
            user: response.data.user 
          });
          await this.initializeApp();
          setTimeout(() => {
            this.$router.push('/');
          }, 1500);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
        Vue.prototype.$toast.error(errorMessage);
      } finally {
        this.loading = false;
        this.hideLoading();
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-card {
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
}

.welcome-text {
  color: #1a237e;
  font-size: 24px;
  margin-bottom: 20px;
}

.input-field {
  margin-bottom: 16px;
}

.login-btn {
  text-transform: none;
  font-size: 16px;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.responsive-cover-img {
  height: 96vh;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .responsive-cover-img,
  .img-filled {
    display: none;
  }
  
  .login-filled {
    width: 100%;
  }
}

.v-input--is-focused .v-input__control {
  border-color: #3f51b5;
}

.v-input--is-focused .v-input__slot {
  background-color: rgba(255, 255, 255, 0.1);
}

.forgot-password-link {
  font-size: 14px;
  color: #3f51b5;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.forgot-password-link:hover {
  color: #1a237e;
  text-decoration: underline;
}
</style>
