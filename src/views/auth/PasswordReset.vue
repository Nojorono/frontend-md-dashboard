<template>
  <v-app>
    <v-container fill-height>
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          md="6"
          lg="5"
        >
          <v-card class="elevation-12 reset-password-card">
            <v-card-title class="my-3 text-center headline primary--text">
              Reset Password
            </v-card-title>
            <v-card-text>
              <p class="mb-4">
                Enter your new password below.
              </p>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
              >
                <template>
                  <v-text-field
                    v-model="password"
                    :rules="[rules.required, rules.password]"
                    label="New Password"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-icon="mdi-lock"
                    required
                    outlined
                  >
                    <template v-slot:append-outer>
                      <!-- Eye icon to toggle password visibility -->
                      <v-icon
                        class="cursor-pointer"
                        @click="togglePassword"
                      >
                        {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
                      </v-icon>
                    </template>
                  </v-text-field>
                </template>
                <template>
                  <v-text-field
                    v-model="confirmPassword"
                    :rules="[rules.required, matchPassword]"
                    label="Confirm Password"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-icon="mdi-lock"
                    required
                    outlined
                  >
                    <template v-slot:append-outer>
                      <!-- Eye icon to toggle password visibility -->
                      <v-icon
                        class="cursor-pointer"
                        @click="togglePassword"
                      >
                        {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
                      </v-icon>
                    </template>
                  </v-text-field>
                </template>
                <v-btn
                  :disabled="!valid"
                  color="primary"
                  large
                  block
                  class="mt-4"
                  @click="handleResetPassword"
                >
                  Update Password
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { ResetPassword } from '@/api/authService';

export default {
  name: 'ResetPassword',
  data() {
    return {
      password: '',
      confirmPassword: '',
      showPassword: false,
      valid: false,
      rules: {
        required: value => !!value || 'Required.',
        password: value =>
          value.length >= 8 || 'Password must be at least 8 characters.',
      },
    };
  },
  computed: {
    matchPassword() {
      return value => value === this.password || 'Passwords must match.';
    },
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword; // Toggle the visibility
    },
    async handleResetPassword() {
      const token = this.$route.query.token;
      if (!token) {
        this.$toast.error('Reset token is missing or invalid.');
        return;
      }
      try {
        const res = await ResetPassword(token, this.password);
        if (res.statusCode === 200) {
          this.$toast.success('Password reset successfully!');
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
        }
      } catch (error) {
        console.error(error);
        this.$toast.error('An error occurred. Please try again.');
      }
    },
  },
};
</script>

<style scoped>
.reset-password-card {
  padding: 20px;
  max-width: 550px;
  border-radius: 15px;
}

.reset-password-card .v-card-title {
  font-size: 24px;
  font-weight: 600;
  color: #3f51b5; /* Primary color */
}

p.text-center {
  font-size: 16px;
  color: #666;
}
</style>
