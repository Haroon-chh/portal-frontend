<template>
    <div class="login-view-container">
      <Login />
    </div>
  </template>
  
  <script>
  import Login from '../components/LoginComponent.vue';
  
  export default {
    components: {
      Login,
    },
  };
  </script>
  
  <style scoped>
  .login-view-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  </style>
  