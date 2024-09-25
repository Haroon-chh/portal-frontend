<template>
  <div class="signup-body">
    <div class="signup-card">
      <div class="col-lg-12 form-container d-flex flex-column justify-content-center">
        <div class="card-body p-4">
          <p class="text-center h2 fw-semibold mb-4 mx-1 mx-md-4 mt-2">Register Form</p>
          <form class="mx-1 mx-md-4" @submit.prevent="register">
            <!-- First Name and Last Name Fields -->
            <div class="d-flex flex-row align-items-center mt-5 mb-4 pb-2 form-outline">
              <input 
                type="text" 
                v-model="firstName" 
                class="form-control" 
                placeholder="" 
                required 
              />
              <label class="form-label">First Name</label>
            </div>
            <div class="d-flex flex-row align-items-center mb-4 pb-2 form-outline">
              <input 
                type="text" 
                v-model="lastName" 
                class="form-control" 
                placeholder="" 
                required 
              />
              <label class="form-label">Last Name</label>
            </div>
  
            <!-- Email Field -->
            <div class="d-flex flex-row align-items-center mb-4 pb-2 form-outline">
              <input 
                type="email" 
                v-model="email" 
                class="form-control" 
                placeholder="" 
                required 
              />
              <label class="form-label">Email</label>
            </div>
  
            <!-- Phone Number Field -->
            <div class="d-flex flex-row align-items-center mb-4 pb-2 form-outline">
              <select v-model="countryCode" class="form-control" style="width: 30%;" required>
                <option value="+1">+1 (USA)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+91">+91 (India)</option>
                <!-- Add more country codes as needed -->
              </select>
              <input 
                type="tel" 
                v-model="phoneNumber" 
                class="form-control" 
                placeholder="" 
                required 
                minlength="7"
                maxlength="11"
                pattern="[0-9]{7,11}"
                style="width: 70%;"
              />
              <label class="form-label">Phone Number</label>
            </div>
  
            <!-- CV Upload -->
            <div class="d-flex flex-row align-items-center mb-4 pb-2 form-outline">
              <input 
                type="file" 
                @change="handleFileUpload" 
                class="form-control" 
              />
              <label class="form-label">Upload CV</label>
            </div>
  
            <!-- Submit Button -->
            <div class="d-flex justify-content-center mx-4 mt-4">
              <button type="submit" class="btn btn-light btn-lg">Register</button>
            </div>
          </form>
          <p class="already-user">Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const countryCode = ref('+1');
    const phoneNumber = ref('');
    const cvFile = ref(null);

    const handleFileUpload = (event) => {
      cvFile.value = event.target.files[0];
    };

    const register = () => {
      if (!firstName.value || !lastName.value || !email.value || !phoneNumber.value) {
        alert('All fields are required.');
        return;
      }

      let users = JSON.parse(localStorage.getItem('users')) || [];
      let emailExists = users.some(user => user.email === email.value);

      if (emailExists) {
        alert('Email already exists.');
        return;
      }

      let newUser = {
        id: users.length + 1,
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phoneNumber: `${countryCode.value}${phoneNumber.value}`,
        cv: cvFile.value ? cvFile.value.name : '',
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      alert('Registration successful!');
      // Redirect to login page if needed
      // this.$router.push('/login');
    };

    return {
      firstName,
      lastName,
      email,
      countryCode,
      phoneNumber,
      handleFileUpload,
      register,
    };
  },
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
  background-color: rgba(189, 185, 185, 0.3);
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
  color:white;
  transition: 0.3s ease all;
  pointer-events: none;
  font-size: 14px;
}

.form-control:focus ~ .form-label,
.form-control:not(:placeholder-shown) ~ .form-label {
  top: -25px;
  left: 0;
  font-size: 16px;
  color:black;
  background-color: rgba(255, 255, 255, 0);
}

.already-user {
  display: block;
  left: 60%;
  top: 90%;
  color: black;
}

@media (max-width: 768px) {
  .image-container {
    display: none important;
  }
  
  .signup-card {
    max-width: 100%;
  }

  .already-user {
    display: block;
    top: 82%;
    left: 40%;
  }
}
</style>
  