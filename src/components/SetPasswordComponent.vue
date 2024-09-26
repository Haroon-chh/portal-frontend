<template>
    <div class="set-password-container">
      <h2>Set Your Password</h2>
      <form @submit.prevent="setPassword">
        <div class="form-group">
          <label for="password">New Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            class="form-control"
          />
        </div>
        <button type="submit" class="btn btn-primary">Set Password</button>
      </form>
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
  .set-password-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .btn-primary {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
  }
  </style>