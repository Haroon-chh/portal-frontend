<template>
    <div class="set-password-view">
      <ResetPasswordComponent />
    </div>
  </template>
  
  <script>
  import ResetPasswordComponent from '@/components/ResetPasswordComponent.vue';
  
  export default {
    components: {
      ResetPasswordComponent
    }
  };
  </script>
  
  <style scoped>
  .set-password-view {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
  }
  </style>