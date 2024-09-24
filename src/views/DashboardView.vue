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
        user: null,
      };
    },
    mounted() {
      this.fetchUser();
    },
    methods: {
      fetchUser() {
        // Fetch the authenticated user from local storage
        const storedUser = JSON.parse(localStorage.getItem('authUser'));
        if (storedUser) {
          this.user = storedUser;
        } else {
          // In case the user data is missing, redirect to login page
          this.$router.push('/login');
        }
      },
      getComponentByRole() {
        if (this.user && this.user.authorization.role) {
          switch (this.user.authorization.role) {
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
  