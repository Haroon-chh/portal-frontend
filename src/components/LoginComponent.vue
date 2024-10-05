<template>
  <div class="login-body container-fluid d-flex align-items-center justify-content-center min-vh-100 p-0">
    <div class="login-card row mx-0 w-100">
      <div class="col-lg-7 form-container d-flex flex-column justify-content-center p-0">
        <div class="card-body p-4 p-md-5">
          <p class="text-center h2 fw-semibold mb-4 mx-1 mx-md-4 mt-2">Login as a User</p>
          <form class="mx-1 mx-md-4" @submit.prevent="login">
            <div class="d-flex flex-row  pb-2 mt-5 pt-2  form-outline">
              <img src="../assets/email-icon.png" alt="Email Icon" class="icon-size">
              <input type="email" v-model="email" class="form-control" autocomplete="email" placeholder=" " required />
              <label class="form-label" for="email">Your Email</label>
            </div>
            <div class="d-flex flex-row mt-2 pt-2 pb-2  form-outline">
              <img src="../assets/password-icon.png" alt="Lock Icon" class="icon-size">
              <input type="password" v-model="password" class="form-control" placeholder=" " minlength="8" required />
              <label class="form-label" for="password">Password</label>
            </div>
            <div class="forgot-password mb-5">
              <router-link to="/forgot-password" class="text-white">Forgot password?</router-link>
            </div>
            <div class="d-flex justify-content-center mb-3 mb-lg-4">
              <button type="submit" class="btn btn-light btn-lg">
                Login <img src="../assets/login-icon.png" alt="">
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="col-lg-5 image-container d-flex justify-content-center align-items-center">
        <div class="text-center text-black w-100 h-100 p-4 d-flex flex-column justify-content-center">
          <img src="../assets/child_read.png" alt="" class="w-75 d-flex flex-column justify-content-center m-auto">
          <h2 class="app-name mt-3 mb-4">Quizela✨</h2>
          <button class="btn btn-light border d-flex align-items-center justify-content-center shadow-sm my-3 px-1 w-100">
            <img src="../assets/google-icon.png" width="35px" alt="Google" class="p-1">
            <span>Login with Google</span>
          </button>
          <button class="btn btn-primary border d-flex align-items-center justify-content-center shadow-sm my-3 px-1 w-100">
            <img src="../assets/fb-icon.png" width="35px" alt="Facebook" class="p-1">
            <span>Login with Facebook</span>
          </button>
          <hr>
          <p class="mt-2 pt-2 me-1">Apply as student<router-link to="/registration" class="btn btn-primary ms-2">Apply</router-link></p>
        </div>
      </div>
    </div>
    <ErrorPopupComponent :show="showError" :message="errorMessage" />
  </div>
</template>

<script setup>
import { ref, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'; 
import ApiServices from '@/services/ApiServices'; 
import ErrorPopup from './ErrorPopup.vue';

const ErrorPopupComponent = defineComponent(ErrorPopup);

const email = ref('');
const password = ref('');
const router = useRouter();
const store = useStore(); 

const showError = ref(false);
const errorMessage = ref('');

const login = async () => {
  try {
    const response = await ApiServices.PostRequest('/login', {
      email: email.value,
      password: password.value
    });

    // Log the full response for debugging
    console.log('Login response:', response);

    if (response && response.message === "success" && response.data) {
      // Dispatch the entire userData instead of individual properties
      await store.dispatch('loginUser', response); // Pass the whole response object

      // Redirect to the dashboard
      router.push('/dashboard');
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('Error during login:', error);
    if (error.response && error.response.status === 401) {
      errorMessage.value = error.response.data.message || 'Invalid credentials';
    } else {
      errorMessage.value = 'An error occurred. Please try again later.';
    }
    showError.value = true;
    setTimeout(() => {
      showError.value = false;
    }, 5000);
  }
};


</script>


<style scoped>
.login-body {
  background-image: url(../assets/educational_background.jpg);
  background-size: cover;
  background-position: center;
}

.login-card {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.7);
  max-width: 1000px;
  background-color: rgba(189, 185, 185, 0.4);
  color: black;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.form-container {
  background-color: rgba(129, 134, 129, 0.2);
}

.image-container {
  background-color: #DFF4FF;
}

.form-outline {
  position: relative;
  margin-bottom: 1.5rem;
}

.icon-size {
  width: 20px;
  height: 20px;
  margin-right: 10px;
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
  top: 26%;
  left: 40px;
  background-color: rgba(255, 255, 255, 0);
  padding: 0 5px;
  color: white;
  transition: 0.3s ease all;
  pointer-events: none;
  font-size: 14px;
}

.form-control:focus ~ .form-label,
.form-control:not(:placeholder-shown) ~ .form-label {
  top: -20px;
  left: 25px;
  font-size: 16px;
  color: black;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0);
}

.forgot-password {
  text-align: right;
  font-size: 0.8rem;
}

@media (max-width: 991px) {
  .login-card {
    max-width: 100%;
  }
  .image-container {
    display: none !important;
  }
  .form-container {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .card-body {
    padding: 2rem 1rem;
  }
}

.app-name {
  font-family: 'Pacifico', cursive; /* If you want to use a fancy font */
  color: #074972; /* Use your app's primary color */
  font-size: 2.5rem;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}
</style>
