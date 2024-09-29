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
  
      <AcceptPopup v-if="showSuccessPopup" :message="successMessage" @close="showSuccessPopup = false" />
      <ErrorPopup v-if="showErrorPopup" :message="errorMessage" @close="showErrorPopup = false" />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import AcceptPopup from '../components/SuccessPopup.vue';
  import ErrorPopup from '../components/ErrorPopup.vue';
  
  export default {
    components: {
      AcceptPopup,
      ErrorPopup,
    },
    data() {
      return {
        manager: {
          name: '',
          email: '',
        },
        successMessage: '',
        errorMessage: '',
        showSuccessPopup: false,
        showErrorPopup: false,
      };
    },
    methods: {
      async addManager() {
        try {
          const accessToken = localStorage.getItem('access_token');
          if (!accessToken) {
            console.error('No access token found');
            return;
          }
  
          const apiUrl = `${process.env.VUE_APP_API_URL}/add-manager`;
  
          const response = await axios.post(apiUrl, this.manager, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (response.status === 200) {
            this.successMessage = response.data.message;
            this.showSuccessPopup = true;
            this.manager.name = '';
            this.manager.email = '';
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            const validationErrors = error.response.data["validation errors"];
            if (validationErrors && validationErrors.email) {
              this.errorMessage = validationErrors.email[0];
            } else {
              this.errorMessage = `Error: ${error.message}`;
            }
          } else {
            this.errorMessage = `Error: ${error.message}`;
          }
          this.showErrorPopup = true;
          console.error('Error:', error);
        }
      },
    },
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
      transform: translateY(-20px);
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
    top: 50%;
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
  