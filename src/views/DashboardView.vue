<template>
    <div>
      <component :is="getComponentByRole()" />
    </div>
  </template>
  
  <script>
  import StudentComponent from '../components/StudentComponent.vue';
  import ManagerComponent from '../components/ManagerComponent.vue';
  import AdminComponent from '../components/AdminComponent.vue';
  
  export default {
    name: 'DashboardView',
    components: {
      StudentComponent,
      ManagerComponent,
      AdminComponent,
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
        // Fetch the user from local storage (or from your mock server if API is available)
        const storedUser = JSON.parse(localStorage.getItem('AuthUser'));
        if (storedUser) {
          this.user = storedUser;
        } else {
          // If no user is found, redirect to login page or handle error
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
  