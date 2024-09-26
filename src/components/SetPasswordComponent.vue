<template>
    <div class="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <div class="card shadow-sm" >
        <div class="card-body p-4">
          <h2 class="card-title text-center mb-4">Set Your Password</h2>
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
            <button type="submit" class="btn btn-primary w-100">Set Password</button>
          </form>
        </div>
      </div>
      <ErrorPopup :show="showError" :message="errorMessage" />
      <SuccessPopup :show="showSuccess" :message="successMessage" />
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import ApiService from '../services/ApiServices';
  import ErrorPopup from './ErrorPopup.vue';
  import SuccessPopup from './SuccessPopup.vue';
  
  export default {
    components: {
      ErrorPopup,
      SuccessPopup
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
  
      const setPassword = async () => {
        showError.value = false;
        showSuccess.value = false;
  
        if (password.value !== confirmPassword.value) {
          errorMessage.value = 'Passwords do not match';
          showError.value = true;
          return;
        }
  
        const token = route.query.token;
  
        if (!token) {
          errorMessage.value = 'Invalid or missing token';
          showError.value = true;
          return;
        }
  
        try {
          const response = await ApiService.PostRequest('/set-password', {
            token: token,
            password: password.value
          });
  
          if (response.status === 200) {
            successMessage.value = 'Password set successfully';
            showSuccess.value = true;
            // Redirect to login page after a short delay
            setTimeout(() => {
              router.push('/login');
            }, 2000);
          } else {
            errorMessage.value = 'Unexpected response: ' + response.message;
            showError.value = true;
          }
        } catch (error) {
          console.error('Error occurred', error);
          if (error.response && error.response.data && error.response.data.message) {
            errorMessage.value = error.response.data.message;
          } else {
            errorMessage.value = 'An error occurred while setting the password';
          }
          showError.value = true;
        }
      };
  
      return {
        password,
        confirmPassword,
        setPassword,
        showError,
        errorMessage,
        showSuccess,
        successMessage
      };
    }
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