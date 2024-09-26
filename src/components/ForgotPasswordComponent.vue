<template>
    <div class="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <div class="card shadow-sm" style="max-width: 400px;">
        <div class="card-body p-4">
          <h2 class="card-title text-center mb-4">{{ isEmailVerified ? 'Reset Password' : 'Forgot Password' }}</h2>
          
          <form v-if="!isEmailVerified" @submit.prevent="verifyEmail">
            <div class="mb-3">
              <label for="email" class="form-label">Email address</label>
              <input
                type="email"
                id="email"
                v-model="email"
                required
                class="form-control"
              />
            </div>
            <button type="submit" class="btn btn-primary w-100">Verify Email</button>
          </form>
  
          <form v-else @submit.prevent="resetPassword">
            <div class="mb-3">
              <label for="password" class="form-label">New Password</label>
              <input
                type="password"
                id="password"
                v-model="password"
                required
                class="form-control"
              />
            </div>
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                required
                class="form-control"
              />
            </div>
            <button type="submit" class="btn btn-primary w-100">Reset Password</button>
          </form>
        </div>
      </div>
      <ErrorPopup :show="showError" :message="errorMessage" />
      <SuccessPopup :show="showSuccess" :message="successMessage" />
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import ApiService from '../services/ApiServices';
  import ErrorPopup from './ErrorPopup.vue';
  import SuccessPopup from './SuccessPopup.vue';
  
  export default {
    components: {
      ErrorPopup,
      SuccessPopup
    },
    setup() {
      const email = ref('');
      const password = ref('');
      const confirmPassword = ref('');
      const isEmailVerified = ref(false);
      const showError = ref(false);
      const errorMessage = ref('');
      const showSuccess = ref(false);
      const successMessage = ref('');
  
      const verifyEmail = async () => {
        showError.value = false;
        showSuccess.value = false;
  
        try {
          // This is where you'd call your API to verify the email
          // For now, we'll just simulate a successful response
          const response = await ApiService.PostRequest('/verify-email', { email: email.value });
          
          if (response.status === 200) {
            isEmailVerified.value = true;
            successMessage.value = 'Email verified. Please set your new password.';
            showSuccess.value = true;
          } else {
            errorMessage.value = 'Email verification failed. Please try again.';
            showError.value = true;
          }
        } catch (error) {
          console.error('Error occurred', error);
          errorMessage.value = 'An error occurred while verifying the email.';
          showError.value = true;
        }
      };
  
      const resetPassword = async () => {
        showError.value = false;
        showSuccess.value = false;
  
        if (password.value !== confirmPassword.value) {
          errorMessage.value = 'Passwords do not match';
          showError.value = true;
          return;
        }
  
        try {
          // This is where you'd call your API to reset the password
          // For now, we'll just simulate a successful response
          const response = await ApiService.PostRequest('/reset-password', {
            email: email.value,
            password: password.value
          });
  
          if (response.status === 200) {
            successMessage.value = 'Password reset successfully';
            showSuccess.value = true;
            // You might want to redirect to login page after a short delay
          } else {
            errorMessage.value = 'Password reset failed. Please try again.';
            showError.value = true;
          }
        } catch (error) {
          console.error('Error occurred', error);
          errorMessage.value = 'An error occurred while resetting the password.';
          showError.value = true;
        }
      };
  
      return {
        email,
        password,
        confirmPassword,
        isEmailVerified,
        verifyEmail,
        resetPassword,
        showError,
        errorMessage,
        showSuccess,
        successMessage
      };
    }
  };
  </script>
  
  <style scoped>
  /* Custom styles can be added here if needed */
  </style>