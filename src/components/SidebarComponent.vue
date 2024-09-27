<template>
  <aside :class="{ 'is-expanded': isExpanded }" class="sidebar">
    <div class="logo"></div>

    <button class="menu-toggle" @click="toggleMenu">
      <span class="material-icons">{{ isExpanded ? 'keyboard_double_arrow_left' : 'keyboard_double_arrow_right' }}</span>
    </button>

    <nav class="menu">
      <!-- Common option for all roles -->
      <router-link to="/dashboard" class="menu-item">
        <span class="material-icons">dashboard</span>
        <span v-if="isExpanded" class="text">Dashboard</span>
      </router-link>

      <!-- Admin-specific options -->
      <template v-if="authUserRole === 'admin'">
        <router-link to="/dashboard/add-manager" class="menu-item">
          <span class="material-icons">person_add</span>
          <span v-if="isExpanded" class="text">Add Manager</span>
        </router-link>
        <router-link to="/dashboard/assign-roles" class="menu-item">
          <span class="material-icons">assignment_ind</span>
          <span v-if="isExpanded" class="text">Assign Roles</span>
        </router-link>
        <router-link to="/view-results" class="menu-item">
          <span class="material-icons">bar_chart</span>
          <span v-if="isExpanded" class="text">View Results</span>
        </router-link>
        <router-link to="/dashboard/assign-quizzes" class="menu-item">
          <span class="material-icons">quiz</span>
          <span v-if="isExpanded" class="text">Assign Quizzes</span>
        </router-link>
      </template>

      <!-- Manager-specific options -->
      <template v-if="authUserRole === 'manager'">
        <router-link to="/dashboard/assign-quizzes" class="menu-item">
          <span class="material-icons">quiz</span>
          <span v-if="isExpanded" class="text">Assign Quizzes</span>
        </router-link>
        <router-link to="/dashboard/student-details" class="menu-item">
          <span class="material-icons">groups</span>
          <span v-if="isExpanded" class="text">Student Details</span>
        </router-link>
      </template>

      <!-- Student-specific options -->
      <template v-if="authUserRole === 'student'">
        <router-link to="/student/assigned-quizzes" class="menu-item">
          <span class="material-icons">assignment</span>
          <span v-if="isExpanded" class="text">Assigned Quizzes</span>
        </router-link>
        <router-link to="/student/quiz-results" class="menu-item">
          <span class="material-icons">show_chart</span>
          <span v-if="isExpanded" class="text">Quiz Results</span>
        </router-link>
      </template>
    </nav>

    <div class="logout-container">
      <button class="btn btn-danger logout-button" @click="logout">
        <span class="material-icons">logout</span>
        <span v-if="isExpanded">Logout</span>
      </button>
    </div>

    <!-- Add these lines for the popup components -->
    <SuccessPopup :show="showSuccessPopup" :message="successMessage" @close="showSuccessPopup = false" />
    <ErrorPopup :show="showErrorPopup" :message="errorMessage" @close="showErrorPopup = false" />
  </aside>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import SuccessPopup from '@/components/SuccessPopup.vue';
import ErrorPopup from '@/components/ErrorPopup.vue';

export default {
  name: 'SidebarComponent',
  components: {
    SuccessPopup,
    ErrorPopup
  },
  data() {
    return {
      isExpanded: false,
      showSuccessPopup: false,
      showErrorPopup: false,
      successMessage: '',
      errorMessage: ''
    };
  },
  computed: {
    ...mapGetters(['getUserRole']),
    authUserRole() {
      return this.getUserRole;
    }
  },
  methods: {
    ...mapActions(['logoutUser']),

    toggleMenu() {
      this.isExpanded = !this.isExpanded;
    },
    async logout() {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await this.axios.post('https://28f0-139-135-54-19.ngrok-free.app/api/logout', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Check the response's "message" field directly instead of data.message
    if (response.data && response.data.message === "Successfully logged out") {
      // Call the logoutUser action to clear Vuex state and local storage
      await this.logoutUser();
      this.successMessage = 'Successfully logged out';
      this.showSuccessPopup = true;

      setTimeout(() => {
        this.$router.push('/login');
      }, 2000); // Redirect after 2 seconds
    } else {
      throw new Error('Logout failed');
    }
  } catch (error) {
    console.error('Error during logout:', error.message);
    this.errorMessage = 'An error occurred during logout. Please try again.';
    this.showErrorPopup = true;
  }
}

  }
};
</script>


<style scoped>
/* Basic Variables */
:root {
  --sidebar-width: 200px;
  --collapsed-width: 60px;
  --dark-color: #2c3e50;
  --light-color: #ecf0f1;
  --primary-color: #3498db;
}

/* Sidebar Styling */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background-color: #02141d;
  color: #ecf0f1;
  width: 60px;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  z-index: 1000;
}

.sidebar.is-expanded {
  width: 170px;
}

.logo {
  margin-bottom: 2rem;
}

.logo img {
  width: 40px;
}

.menu-toggle {
  background: none;
  border: none;
  color: #ecf0f1;
  font-size: 24px;
  cursor: pointer;
  margin-bottom: 2rem;
}

.menu {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  text-decoration: none;
  color: #ecf0f1;
  transition: background-color 0.3s ease;
  width: 100%;
  justify-content: center;
}

.menu-item:hover {
  background-color:#3498db;
}

.menu-item .material-icons {
  font-size: 24px;
}

.menu-item .text {
  margin-left: 10px;
}

.sidebar.is-expanded .menu-item {
  justify-content: flex-start;
}

.sidebar.is-expanded .menu-item .material-icons {
  margin-right: 10px;
}

.logout-container {
  padding: 1rem;
  margin-top: auto; /* Pushes the logout button to the bottom */
}

.logout-button {
  display: flex;
  align-items: center;
  background-color: #e74c3c;
  color: #ecf0f1;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  width: 100%;
  justify-content: center;
}

.logout-button .material-icons {
  font-size: 24px;
}

.logout-button:hover {
  background-color: #c0392b;
}

.sidebar.is-expanded .logout-button {
  justify-content: flex-start;
}

.sidebar.is-expanded .logout-button .material-icons {
  margin-right: 10px;
}
</style>
