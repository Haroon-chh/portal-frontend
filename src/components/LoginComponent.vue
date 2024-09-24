<template>
    <div class="login-body p-0">
      <div class="login-card row">
        <div class="col-lg-7 form-container d-flex flex-column justify-content-center p-0">
          <div class="card-body p-5">
            <p class="text-center h2 fw-semibold mb-4 mx-1 mx-md-4 mt-2">Login as a User</p>
            <form class="mx-1 mx-md-4" @submit.prevent="login">
              <div class="d-flex flex-row align-items-center mb-4 mt-5 pb-2 form-outline">
                <img src="../assets/email-icon.png" alt="Email Icon" class="icon-size">
                <input type="email" v-model="email" class="form-control" autocomplete="email" placeholder=" " required />
                <label class="form-label" for="email">Your Email</label>
              </div>
              <div class="d-flex flex-row align-items-center mb-2 mt-0 form-outline">
                <img src="../assets/password-icon.png" alt="Lock Icon" class="icon-size">
                <input type="password" v-model="password" class="form-control" placeholder=" " minlength="8" required />
                <label class="form-label" for="password">Password</label>
              </div>
              <div class="forgot-password mb-5">
                <a href="#" class="text-white">Forgot password?</a>
              </div>
              <div class="d-flex justify-content-center mb-3 mb-lg-4">
                <button type="submit" class="btn btn-light btn-lg">
                  Login <img src="../assets/login-icon.png" alt="">
                </button>
              </div>
            </form>
          </div>
        </div>
        <div class="col image-container d-flex justify-content-center align-items-center">

          <div class="text-center text-black w-100 h-100 p-4 d-flex flex-column justify-content-center">
            <img src="../assets/child_read.png" alt="" class="w-75  d-flex flex-column justify-content-center m-auto">

            <button class="btn btn-light border d-flex align-items-center justify-content-center shadow-sm my-3 px-1 w-100">
              <img src="../assets/google-icon.png" width="35px" alt="Google" class="p-1">
              <span>Login with Google</span>
            </button>
  
            <button class="btn btn-primary border d-flex align-items-center justify-content-center shadow-sm my-3 px-1 w-100">
              <img src="../assets/fb-icon.png" width="35px" alt="Facebook" class="p-1">
              <span>Login with Facebook</span>
            </button>
  
            <hr>
            <p class="mt-2 pt-2">Not a user? <router-link to="/registration" class="btn btn-primary">Sign Up</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'; // If you're using Vuex for state management
import ApiServices from '@/services/ApiServices'; // Import the ApiServices

const email = ref('');
const password = ref('');
const router = useRouter();
const store = useStore(); // Vuex store

const login = async () => {
  try {
    // Call the API to authenticate and get the response with JWT, role, and permissions
    const response = await ApiServices.PostRequest('/login', {
      email: email.value,
      password: password.value
    });

    if (response.message === "success" && response.authorisation) {
      // Store the JWT token in sessionStorage
      sessionStorage.setItem('jwtToken', response.authorisation.token);

      // Store the role and permissions in localStorage
      localStorage.setItem('userRole', JSON.stringify(response.role));
      localStorage.setItem('userPermissions', JSON.stringify(response.permission));

      // Store the entire user data in localStorage as 'authUser'
      localStorage.setItem('authUser', JSON.stringify(response));

      // Optional: Store user in Vuex state if needed
      store.commit('setUser', response);

      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      alert('Invalid credentials. Please try again.');
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    alert('An error occurred. Please try again later.');
  }
};
</script>

  
  <style scoped>
  /* Styles moved here */
  
  .login-body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0%;
    background-image: url(../assets/educational_background.jpg);
    background-size: cover;
  }
  
  .login-card {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.7);
    width: 50%;
    display: flex;
    overflow: hidden;
    background-color: rgba(189, 185, 185, 0.3);
    color: black;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .card-body {
    padding: 2rem;
    background-color: rgba(129, 134, 129, 0.2);
  }
  
  .image-container {
    background-color: #DFF4FF;
    width: 40%;
  }
  
  .form-outline {
    position: relative;
    margin-bottom: 1.5rem;
  }
  
  .icon-size {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    vertical-align: center;
  }
  
  .form-control {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #070707;
    border-radius: 6px;
    outline: none;
    background-color: transparent;
    color: white;
  }
  
  .form-control:focus {
    border-color: #306de7;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  
  .form-label {
    position: absolute;
    top: 20%;
    left: 40px;
    background-color: rgba(255, 255, 255, 0);
    padding: 0 5px;
    color:white;
    transition: 0.3s ease all;
    pointer-events: none;
    font-size: 14px;
  }
  
  .form-control:focus ~ .form-label,
  .form-control:not(:placeholder-shown) ~ .form-label {
    top: -25px;
    left: 25px;
    font-size: 16px;
    color:black;
    background-color: rgba(255, 255, 255, 0);
  }
  
  .forgot-password {
    text-align: right;
    font-size: 0.8rem;
  }
  
  .not-user {
    display: none;
    top: 78%;
    left: 35%;
  }
  
  @media (max-width: 815px) {
    .image-container {
      display: none !important;
    }
    .login-card {
      max-width: 100%;
    }
    .not-user {
      display: block;
    }
    .login-body {
      background-size: cover;
    }
  }
  </style>
