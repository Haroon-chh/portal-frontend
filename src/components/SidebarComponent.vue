<template>
  <aside :class="{ 'is-expanded': isExpanded }" class="sidebar">
    <div class="logo"></div>

    <button class="menu-toggle" @click="toggleMenu">
      <span class="material-icons">{{ isExpanded ? 'keyboard_double_arrow_left' : 'keyboard_double_arrow_right' }}</span>
    </button>

    <nav class="menu">
      <!-- Admin-specific options -->
      <router-link to="/dashboard" class="menu-item">
        <span class="material-icons">dashboard</span>
        <span v-if="isExpanded" class="text">Dashboard</span>
      </router-link>

      <router-link v-if="authUserRole === 'admin' && authUserPermissions.addManagers" to="/dashboard/add-manager" class="menu-item">
        <span class="material-icons">person_add</span>
        <span v-if="isExpanded" class="text">Add Manager</span>
      </router-link>

      <router-link v-if="authUserRole === 'admin' && authUserPermissions.assignRoles" to="/dashboard/assign-roles" class="menu-item">
        <span class="material-icons">assignment_ind</span>
        <span v-if="isExpanded" class="text">Assign Roles</span>
      </router-link>

      <router-link v-if="authUserRole === 'admin' && authUserPermissions.viewQuizzesResults" to="/dashboard/view-results" class="menu-item">
        <span class="material-icons">bar_chart</span>
        <span v-if="isExpanded" class="text">View Results</span>
      </router-link>
      
      <router-link v-if="authUserRole === 'admin' && authUserPermissions.assignQuizzesToStudents" to="/dashboard/assign-quizzes" class="menu-item">
        <span class="material-icons">quiz</span>
        <span v-if="isExpanded" class="text">Assign Quizzes</span>
      </router-link>


      <!-- Manager-specific options -->
      <router-link v-if="authUserRole === 'manager' && authUserPermissions.assignQuizzesToStudents" to="/dashboard/assign-quizzes" class="menu-item">
        <span class="material-icons">quiz</span>
        <span v-if="isExpanded" class="text">Assign Quizzes</span>
      </router-link>
      <router-link v-if="authUserRole === 'manager' && authUserPermissions.viewStudentDetails" to="/dashboard/student-details" class="menu-item">
        <span class="material-icons">groups</span>
        <span v-if="isExpanded" class="text">Student Details</span>
      </router-link>

      <!-- Student-specific options -->
      <router-link v-if="authUserRole === 'student' && authUserPermissions.assignedQuizzes" to="/student/assigned-quizzes" class="menu-item">
        <span class="material-icons">assignment</span>
        <span v-if="isExpanded" class="text">Assigned Quizzes</span>
      </router-link>
      <router-link v-if="authUserRole === 'student' && authUserPermissions.quizResults" to="/student/quiz-results" class="menu-item">
        <span class="material-icons">show_chart</span>
        <span v-if="isExpanded" class="text">Quiz Results</span>
      </router-link>

      

      <div class="logout-container">
        <button class="btn btn-danger logout-button" @click="logout">
          <span class="material-icons">logout</span>
          <span v-if="isExpanded">Logout</span>
        </button>
      </div>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'SidebarComponent',
  data() {
    return {
      isExpanded: false,
      authUserRole: '',      // Store user role
      authUserPermissions: {} // Store user permissions
    };
  },
  created() {
    const authUser = JSON.parse(localStorage.getItem('authUser'));

    if (authUser && authUser.authorization) {
      this.authUserRole = authUser.authorization.role;
      this.authUserPermissions = authUser.authorization.permissions;
    }
  },
  methods: {
    toggleMenu() {
      this.isExpanded = !this.isExpanded;
    },
    logout() {
      let authUser = JSON.parse(localStorage.getItem('authUser'));

      if (authUser) {
        authUser.lastLogin = new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });

        let users = JSON.parse(localStorage.getItem('users')) || [];
        let foundUserIndex = users.findIndex(user => user.email === authUser.email);

        if (foundUserIndex !== -1) {
          users[foundUserIndex].lastLogin = authUser.lastLogin;
          localStorage.setItem('users', JSON.stringify(users));
        }

        localStorage.setItem("authUser", JSON.stringify(null));
      }

      this.$router.push('/login');
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
