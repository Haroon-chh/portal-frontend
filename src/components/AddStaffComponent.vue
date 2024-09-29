<template>
    <div class="container mt-5">
      <h2 class="mb-4 text-center">
        <span class="material-icons">person_add</span>
        Add Manager/Supervisor
      </h2>
      
      <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
  
      <form @submit.prevent="addPerson" class="p-4 border rounded shadow-sm form-body">
        <div class="form-group mb-4 position-relative">
          <span class="material-icons form-icon">person</span>
          <label for="name" class="form-label">Name</label>
          <input v-model="person.name" id="name" type="text" class="form-control pl-5" placeholder="Enter name" required>
        </div>
  
        <div class="form-group mb-4 position-relative">
          <span class="material-icons form-icon">email</span>
          <label for="email" class="form-label">Email</label>
          <input v-model="person.email" id="email" type="email" class="form-control pl-5" placeholder="Enter email" required>
        </div>
  
        <div class="form-group mb-4 position-relative">
          <span class="material-icons form-icon">work</span>
          <label for="role" class="form-label">Role</label>
          <select v-model="person.role" id="role" class="form-control pl-5" required>
            <option value="">Select a role</option>
            <option value="manager">Manager</option>
            <option value="supervisor">Supervisor</option>
          </select>
        </div>
  
        <button type="submit" class="btn btn-primary w-100">Add Person</button>
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

  const person = ref({
    name: '',
    email: '',
    role: '',
  });

  const showSuccess = ref(false);
  const showError = ref(false);
  const successMessage = ref('');
  const errorMessage = ref('');

  const clearForm = () => {
    person.value.name = '';
    person.value.email = '';
    person.value.role = '';
  };

  const addPerson = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        console.error('No access token found');
        return;
      }

      let apiUrl;
      if (person.value.role === 'manager') {
        apiUrl = `${process.env.VUE_APP_API_URL}/add-manager`;
      } else if (person.value.role === 'supervisor') {
        apiUrl = `${process.env.VUE_APP_API_URL}/add-supervisor`;
      } else {
        throw new Error('Invalid role selected');
      }

      const response = await axios.post(apiUrl, {
        name: person.value.name,
        email: person.value.email,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 && response.data) {
        successMessage.value = response.data.message;
        showSuccess.value = true;
        clearForm();

        setTimeout(() => {
          showSuccess.value = false;
        }, 5000);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error adding person:', error);
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
        errorMessage.value = '';
      }, 5000);
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
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
  
  select.form-control {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='%23888' d='M0 2l4 4 4-4z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 8px 8px;
  }
  </style>
