<template>
  <v-app>
    <v-container fill-height>
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          md="8"
          lg="6"
        >
          <v-card class="elevation-12 forgot-password-card">
            <v-card-title class="text-center headline primary--text text-center">
              Forgot Password
            </v-card-title>
            <v-card-text>
              <p class="my-4">
                Enter your email below to receive a password reset link in email.
              </p>
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
                  outlined
                />
                <v-btn
                  :disabled="!valid"
                  color="primary"
                  large
                  block
                  class="mt-4"
                  @click="handleForgotPassword"
                >
                  Send Reset Link
                </v-btn>
              </v-form>
              <v-row
                justify="center"
                class="mt-3"
              >
                <v-col
                  cols="auto"
                  class="text-center"
                >
                  <router-link
                    to="/login"
                    class="back-to-login-link"
                  >
                    Back to Login
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
import { ForgotPassword } from '@/api/authService';

export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      valid: false,
      rules: {
        required: value => !!value || 'Required.',
        email: value => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
      },
    };
  },
  methods: {
    async handleForgotPassword() {
      if (this.email) {
        try {
          const response = await ForgotPassword(this.email);
          if (response.statusCode === 200) {
            this.$toast.success('Password reset link sent to your email.');
          } else {
            this.$toast.error(response.message);
          }
        } catch (error) {
          console.error(error);
          this.$toast.error('An error occurred. Please try again.');
        }
      }
    },
  },
};
</script>

<style scoped>
.forgot-password-card {
  padding: 20px;
  max-width: 550px;
  border-radius: 15px;
}

.forgot-password-card .v-card-title {
  font-size: 24px;
  font-weight: 600;
  color: #3f51b5; /* Primary color for a friendly feel */
}

p.text-center {
  font-size: 16px;
  color: #666;
}

.back-to-login-link {
  font-size: 14px;
  color: #3f51b5;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
}

.back-to-login-link:hover {
  color: #1a237e;
  text-decoration: underline;
}
</style>
