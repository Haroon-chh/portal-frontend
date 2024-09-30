<template>
  <div class="header">     
    <Header title="Dashboard" />
  </div>
  <div class="content">
    <component :is="getComponentByRole()" v-if="!isAttemptQuizRoute" />
    <router-view v-if="isAttemptQuizRoute"></router-view>
  </div>
</template>

<script>
import StudentComponent from '../components/StudentComponent.vue';
import ManagerComponent from '../components/ManagerComponent.vue';
import AdminComponent from '../components/AdminComponent.vue';
import Header from '../components/HeaderComponent.vue';

export default {
  name: 'DashboardView',
  components: {
    StudentComponent,
    ManagerComponent,
    AdminComponent,
    Header
  },
  data() {
    return {
      userRole: null,
    };
  },
  mounted() {
    this.fetchUserRole();
  },
  computed: {
    isAttemptQuizRoute() {
      return this.$route.name === 'AttemptQuiz';
    }
  },
  methods: {
    fetchUserRole() {
      // Fetch the user role from local storage
      const storedUserRole = localStorage.getItem('userRole'); // Get the role as a string
      if (storedUserRole) {
        this.userRole = storedUserRole; // Directly assign the string
      } else {
        // In case the user role is missing, redirect to login page
        this.$router.push('/login');
      }
    },
    getComponentByRole() {
      if (this.userRole) {
        // Return the component based on the user role
        switch (this.userRole) {
          case 'student':
            return 'StudentComponent';
          case 'manager':
            return 'ManagerComponent';
          case 'admin':
            return 'AdminComponent';
          default:
            return null;
        }
      }
      return null;
    },
  },
};
</script>

<style scoped>
.header {
  margin-bottom: 5%;
}
.content {
  padding: 20px;
  margin-left: 2%;
  margin-top: 60px; /* Adjust based on your header height */
}

/* Media queries for mobile view */
@media screen and (max-width: 768px) {
  .content {
    padding: 10px;
    margin-left: 0;
    margin-top: 40px;
  }
}

@media (max-width: 1200px) {
  .header {
    margin-bottom: 13%;
  }
  .content {
    margin-top: 13%;
  }
}

@media (max-width: 480px) {
  .header {
    margin-bottom: 15%;
  }
  .content {
    margin-left: 15%;
  }
}

</style>
