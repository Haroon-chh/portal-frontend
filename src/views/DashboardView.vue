<template>
  <div class="header">     
         <Header title="Welcome to Dashboard" />
      </div>
    <div>
        <component :is="getComponentByRole()" />
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
    methods: {
      fetchUserRole() {
        // Fetch the user role from local storage
        const storedUserRoles = JSON.parse(localStorage.getItem('userRole'));
        if (storedUserRoles && Array.isArray(storedUserRoles)) {
          this.userRole = storedUserRoles;
        } else {
          // In case the user role is missing, redirect to login page
          this.$router.push('/login');
        }
      },
      getComponentByRole() {
        if (this.userRole && this.userRole.length > 0) {
          // Return the first role's component for simplicity
          switch (this.userRole[0]) {
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
  .header{
    margin-bottom: 5%;
  }
  </style>