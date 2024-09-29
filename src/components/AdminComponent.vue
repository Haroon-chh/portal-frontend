<template>
  <div class="applications-container">
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

<style scoped>
.applications-container {
  margin-left: 5%;
}
</style>
