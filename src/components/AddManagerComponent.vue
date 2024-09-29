<template>
    <div class="container mt-5">
      <h2 class="mb-4 text-center">Add Manager</h2>
      
      <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
  
      <form @submit.prevent="addManager" class="p-4 border rounded shadow-sm form-body">
        <div class="form-group mb-4 position-relative">
          <span class="material-icons form-icon">person</span>
          <label for="name" class="form-label">Name</label>
          <input v-model="manager.name" id="name" type="text" class="form-control pl-5" placeholder="Enter name" required>
        </div>
  
        <div class="form-group mb-4 position-relative">
          <span class="material-icons form-icon">email</span>
          <label for="email" class="form-label">Email</label>
          <input v-model="manager.email" id="email" type="email" class="form-control pl-5" placeholder="Enter email" required>
        </div>
  
        <button type="submit" class="btn btn-primary w-100">Add Manager</button>
      </form>
  
      <SuccessPopupComponent :show="showSuccess" :message="successMessage" />
      <ErrorPopupComponent :show="showError" :message="errorMessage" />
    </div>
  </template>
  
  <script setup>
  import { ref, defineComponent } from 'vue';
  import axios from 'axios';
  import SuccessPopup from './SuccessPopup.vue';
  import ErrorPopup from './ErrorPopup.vue';

  const SuccessPopupComponent = defineComponent(SuccessPopup);
  const ErrorPopupComponent = defineComponent(ErrorPopup);

  const manager = ref({
    name: '',
    email: '',
  });

  const showSuccess = ref(false);
  const showError = ref(false);
  const successMessage = ref('');
  const errorMessage = ref('');

  const addManager = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        console.error('No access token found');
        return;
      }

      const apiUrl = `${process.env.VUE_APP_API_URL}/add-manager`;

      const response = await axios.post(apiUrl, manager.value, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 && response.data) {
        successMessage.value = response.data.message;
        showSuccess.value = true;
        manager.value.name = '';
        manager.value.email = '';

        setTimeout(() => {
          showSuccess.value = false;
        }, 5000);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error adding manager:', error);
      if (error.response && error.response.status === 400) {
        const validationErrors = error.response.data["validation errors"];
        if (validationErrors && validationErrors.email) {
          errorMessage.value = validationErrors.email[0];
        } else {
          errorMessage.value = `Error: ${error.message}`;
        }
      } else {
        errorMessage.value = `Error: ${error.message}`;
      }
      showError.value = true;
      setTimeout(() => {
        showError.value = false;
      }, 5000);
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 500px;
  }
  
  .form-body {
    background-color: #f9f9f9;
    animation: slideDown 0.5s ease-in-out;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .position-relative {
    position: relative;
  }
  
  .form-label {
    font-weight: bold;
  }
  
  .form-icon {
    position: absolute;
    top: 70%;
    left: 10px;
    transform: translateY(-50%);
    color: #888;
  }
  
  .form-control {
    padding-left: 40px;
  }
  
  .form-control:focus {
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  </style>
