<template>
  <div>
    <h2>Welcome Admin</h2>
    <!-- Display ApplicationsComponent -->
    <ApplicationsComponent />
  </div>
</template>

<script>
// Import ApplicationsComponent
import ApplicationsComponent from './ApplicationsComponent.vue';

export default {
  name: 'AdminComponent',
  components: {
    ApplicationsComponent
  }
};
</script>
