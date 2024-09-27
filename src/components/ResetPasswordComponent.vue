<template>
    <div class="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h2 class="card-title text-center mb-4">Set Your Password</h2>
  
          <!-- Display email if it exists -->
          <div v-if="email" class="alert alert-info text-center">
            Setting password for: {{ email }}
          </div>
  
          <!-- Token verification status -->
          <div v-if="isTokenVerified">
            <form @submit.prevent="setPassword">
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
              <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span v-else>Set Password</span>
              </button>
            </form>
          </div>
  
          <!-- Show error message if token is invalid -->
          <div v-else-if="!isTokenVerified && tokenChecked" class="alert alert-danger text-center">
            Invalid or expired token.
          </div>
        </div>
      </div>
      <ErrorPopup :show="showError" :message="errorMessage" />
      <SuccessPopup :show="showSuccess" :message="successMessage" />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import ErrorPopup from './ErrorPopup.vue';
  import SuccessPopup from './SuccessPopup.vue';
  
  export default {
    components: {
      ErrorPopup,
      SuccessPopup,
    },
    setup() {
      const route = useRoute();
      const router = useRouter();
      const password = ref('');
      const confirmPassword = ref('');
      const showError = ref(false);
      const errorMessage = ref('');
      const showSuccess = ref(false);
      const successMessage = ref('');
      const isLoading = ref(false);
      const email = ref(''); // Email extracted from URL
      const isTokenVerified = ref(false); // Status of token verification
      const tokenChecked = ref(false); // Flag to check if token verification is completed
  
      // Extract email and token from query params on component mount
      onMounted(async () => {
        email.value = route.query.email;
        const token = route.query.token;
  
        if (!token || !email.value) {
          errorMessage.value = 'Invalid or missing token or email';
          showError.value = true;
          return;
        }
  
        // Call the verifyToken function to check token validity
        await verifyToken(token, email.value);
      });
  
      const verifyToken = async (token, email) => {
        try {
          const response = await fetch(`${process.env.VUE_APP_API_URL}/verify-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token,
              email,
            }),
          });
  
          const data = await response.json();
          tokenChecked.value = true;
  
          if (response.ok) {
            isTokenVerified.value = true;
          } else {
            errorMessage.value = data.message || 'Invalid or expired token';
            showError.value = true;
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          errorMessage.value = 'An error occurred during token verification';
          showError.value = true;
        }
      };
  
      const setPassword = async () => {
        showError.value = false;
        showSuccess.value = false;
        isLoading.value = true;
  
        if (password.value !== confirmPassword.value) {
          errorMessage.value = 'Passwords do not match';
          showError.value = true;
          isLoading.value = false;
          return;
        }
  
        const token = route.query.token;
  
        try {
          const response = await fetch(`${process.env.VUE_APP_API_URL}/reset-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token,
              email: email.value,
              password: password.value,
              password_confirmation: confirmPassword.value,
            }),
          });
  
          const data = await response.json();
  
          if (response.ok) {
            successMessage.value = 'Password set successfully';
            showSuccess.value = true;
            setTimeout(() => {
              router.push('/login');
            }, 2000);
          } else {
            errorMessage.value = data.message || 'Unexpected response';
            showError.value = true;
          }
        } catch (error) {
          console.error('Error occurred', error);
          errorMessage.value = 'An error occurred while setting the password';
          showError.value = true;
        } finally {
          isLoading.value = false;
        }
      };
  
      return {
        password,
        confirmPassword,
        setPassword,
        showError,
        errorMessage,
        showSuccess,
        successMessage,
        isLoading,
        email,
        isTokenVerified,
        tokenChecked,
      };
    },
  };
  </script>
  
  <style scoped>
  .bg-light {
    background-image: url(../assets/educational_background.jpg);
    background-size: cover;
    background-position: center;
  }
  
  .card {
    width: 100%;
    max-width: 400px;
    background-color: rgba(255, 255, 255, 0.8);
  }
  </style>
