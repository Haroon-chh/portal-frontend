<template>
  <div class="signup-body">
    <div class="signup-card">
      <div class="col-lg-12 form-container d-flex flex-column justify-content-center">
        <div class="card-body p-4">
          <h1 class="text-center app-name mb-3">Quizela✨</h1>
          <p class="text-center h2 fw-semibold mb-2 mt-2">Registeration Form</p>
          <form class="mx-1 mx-md-4" @submit.prevent="register">
            <!-- First Name and Last Name Fields -->
            <div class="d-flex flex-row align-items-center mt-3 mb-4 pb-2 form-outline">
              <i class="material-icons me-3">person</i>
              <div class="form-outline flex-fill mb-0">
                <input 
                  type="text" 
                  v-model="firstName" 
                  id="firstName"
                  class="form-control" 
                  required 
                  placeholder=""
                />
                <label class="form-label" for="firstName">First Name</label>
              </div>
            </div>
            <div class="d-flex flex-row align-items-center mb-4 pb-2 form-outline">
              <i class="material-icons me-3">person</i>
              <div class="form-outline flex-fill mb-0">
                <input 
                  type="text" 
                  v-model="lastName" 
                  id="lastName"
                  class="form-control" 
                  required 
                  placeholder=""
                />
                <label class="form-label" for="lastName">Last Name</label>
              </div>
            </div>
  
            <!-- Email Field -->
            <div class="d-flex flex-row align-items-center mb-4 pb-2 form-outline">
              <i class="material-icons me-3">email</i>
              <div class="form-outline flex-fill mb-0">
                <input 
                  type="email" 
                  v-model="email" 
                  id="email"
                  class="form-control" 
                  required 
                  placeholder=""
                />
                <label class="form-label" for="email">Email</label>
              </div>
            </div>
  
            <!-- Phone Number Field -->
            <div class="d-flex flex-row align-items-center mb-4 pb-2 form-outline">
              <i class="material-icons me-3">phone</i>
              <div class="form-outline flex-fill mb-0">
                <input 
                  type="tel" 
                  v-model="phone" 
                  id="phone"
                  class="form-control" 
                  required 
                  placeholder=""
                />
                <label class="form-label" for="phone">Phone Number</label>
              </div>
            </div>
  
            <!-- CV Upload -->
            <div class="d-flex flex-row align-items-center mb-4 pb-2 form-outline">
              <i class="material-icons me-3">file_upload</i>
              <div class="form-outline flex-fill mb-0">
                <input 
                  type="file" 
                  @change="handleFileUpload" 
                  id="cv"
                  class="form-control" 
                  required
                  placeholder=""
                />
                <label class="form-label" for="cv">Upload CV</label>
              </div>
            </div>
            <!-- Submit Button -->
            <div class="d-flex justify-content-center mx-4 mt-4">
              <button type="submit" class="btn btn-primary btn-lg">Register</button>
            </div>
          </form>
          <p class="already-user">Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
    <ErrorPopup :show="showError" :message="errorMessage" />
    <SuccessPopup :show="showSuccess" :message="successMessage" />
  </div>
</template>

<script>
import { ref } from 'vue';
import SuccessPopup from '../components/SuccessPopup.vue'; // Update the path as necessary
import ErrorPopup from '../components/ErrorPopup.vue'; // Update the path as necessary

export default {
  components: {
    SuccessPopup,
    ErrorPopup,
  },
  setup() {
    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const phone = ref('');
    const attachment = ref(null);
    const successMessage = ref('');
    const errorMessage = ref('');
    const showSuccess = ref(false);
    const showError = ref(false);

    const handleFileUpload = (event) => {
      attachment.value = event.target.files[0];
    };

    const clearForm = () => {
      firstName.value = '';
      lastName.value = '';
      email.value = '';
      phone.value = '';
      attachment.value = null;
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    };

    const register = async () => {
      const name = `${firstName.value} ${lastName.value}`;
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email.value);
      formData.append('phone', phone.value);
      formData.append('attachment', attachment.value);

      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/apply`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          successMessage.value = data.message;
          showSuccess.value = true;
          clearForm(); // Clear the form after successful submission
          setTimeout(() => {
            showSuccess.value = false;
          }, 2000);
        } else {
          // Handle validation errors
          const validatorErrors = data['validator object'] || {};
          errorMessage.value = validatorErrors.email ? validatorErrors.email[0] : 'Registration failed. Please try again.';
          showError.value = true;
          setTimeout(() => {
            showError.value = false;
          }, 2000);
        }
      } catch (error) {
        console.error('Registration error:', error);
        errorMessage.value = 'An error occurred during registration.';
        showError.value = true;
        setTimeout(() => {
          showError.value = false;
        }, 2000);
      }
    };

    return {
      firstName,
      lastName,
      email,
      phone,
      handleFileUpload,
      register,
      successMessage,
      errorMessage,
      showSuccess,
      showError,
    };
  }
};
</script>


<style scoped>
.signup-body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(../assets/educational_background.jpg);
  background-size: cover;
}

.signup-card {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.7);
  min-width: 55%;
  display: flex;
  overflow: hidden;
  background-color: rgba(255, 253, 253, 0.674);
  color: black;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.card-body {
  padding: 2rem;
}

.form-outline {
  position: relative;
  margin-bottom: 1.5rem;
}

.icon-size {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  vertical-align: middle;
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
  left: 5px;
  background-color: rgba(255, 255, 255, 0);
  padding: 0 5px;
  color: rgb(67, 66, 66);
  transition: 0.3s ease all;
  pointer-events: none;
  font-size: 14px;
}

.form-control:focus ~ .form-label,
.form-control:not(:placeholder-shown) ~ .form-label {
  top: -25px;
  left: 0;
  font-size: 16px;
  color: black;
  background-color: rgba(255, 255, 255, 0);
  font-weight:500;
}

.already-user {
  display: block;
  left: 60%;
  top: 90%;
  color: black;
}

@media (max-width: 768px) {
  .signup-card {
    max-width: 100%;
  }

  .already-user {
    display: block;
    top: 82%;
    left: 40%;
  }
}

.error-message {
  color: red;
  margin-bottom: 1rem;
  text-align: center;
}
.app-name {
  font-family: 'Pacifico', cursive; /* If you want to use a fancy font */
  color: #074972; /* Use your app's primary color */
  font-size: 2.5rem;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}
</style>
