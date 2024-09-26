<template>
    <div class="set-password-view">
      <SetPasswordComponent />
    </div>
  </template>
  
  <script>
  import SetPasswordComponent from '@/components/SetPasswordComponent.vue';
  
  export default {
    components: {
      SetPasswordComponent
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