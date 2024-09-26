<template>
    <div class="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <div class="card shadow-sm" style="max-width: 400px;">
        <div class="card-body p-4">
          <h2 class="card-title text-center mb-4">Forgot Password</h2>
          
          <div v-if="emailFromUrl" class="alert alert-info mb-3">
            Resetting password for: {{ emailFromUrl }}
          </div>
          
          <form @submit.prevent="sendResetLink">
            <div class="mb-3">
              <label for="email" class="form-label">Email address</label>
              <input
                type="email"
                id="email"
                v-model="email"
                required
                class="form-control"
                :readonly="!!emailFromUrl"
              />
            </div>
            <button type="submit" class="btn btn-primary w-100">Send Reset Link</button>
          </form>
        </div>
      </div>
      <!-- Error and Success Popups -->
      <ErrorPopup :show="showError" :message="errorMessage" @close="showError = false" />
      <SuccessPopup :show="showSuccess" :message="successMessage" @close="showSuccess = false" />
    </div>
  </template>
  
  <script>
  import { ref, inject, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import ErrorPopup from './ErrorPopup.vue';
  import SuccessPopup from './SuccessPopup.vue';
  
  export default {
    components: {
      ErrorPopup,
      SuccessPopup
    },
    setup() {
      const axios = inject('axios');  // Axios injected for HTTP requests
      const route = useRoute();
      const email = ref('');  // Email input
      const emailFromUrl = ref('');  // Email extracted from URL
      const showError = ref(false);  // Controls visibility of error popup
      const errorMessage = ref('');  // Holds error message content
      const showSuccess = ref(false);  // Controls visibility of success popup
      const successMessage = ref('');  // Holds success message content
  
      onMounted(() => {
        // Extract email from URL parameters
        const urlEmail = route.query.email;
        if (urlEmail) {
          emailFromUrl.value = decodeURIComponent(urlEmail);
          email.value = emailFromUrl.value;
        }
      });

      const sendResetLink = async () => {
        // Reset visibility for error and success popups
        showError.value = false;
        showSuccess.value = false;
  
        try {
          // Make POST request to /forgot-password with email
          const response = await axios.post('http://192.168.15.156:8080/api/forgot-password', { email: email.value });
          
          // Check if reset link was successfully sent
          if (response.data && response.data.message === "Reset link sent successfully") {
            successMessage.value = 'Reset link sent successfully. Please check your email.';
            showSuccess.value = true;
          } else {
            throw new Error('Unexpected response from server');
          }
        } catch (error) {
          // Handle error if validation error or other issue occurs
          console.error('Error occurred', error);
          if (error.response && error.response.data && error.response.data.message) {
            errorMessage.value = error.response.data.message;
          } else {
            errorMessage.value = 'An error occurred while sending the reset link. Please try again.';
          }
          showError.value = true;
        }
      };
  
      return {
        email,
        emailFromUrl,
        sendResetLink,
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
    background-image: url('../assets/educational_background.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .card {
    border: none;
    background-color: rgba(255, 255, 255, 0.8);
  }
  
  .card-body {
    padding: 2rem;
  }
  
  .form-control:focus {
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  
  .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
    border-color: #0056b3;
  }
  </style>
