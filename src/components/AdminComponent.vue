<template>
  <div class="admin-component">
    <div class="welcome-section">
      <span class="material-icons">admin_panel_settings</span>
      <h2 class="mb-1">Welcome Admin</h2>
    </div>
    <ApplicationsComponent />
  </div>
</template>

<script>
import ApplicationsComponent from './ApplicationsComponent.vue';

export default {
  name: 'AdminComponent',
  components: {
    ApplicationsComponent
  }
};
</script>

<style scoped>
.admin-component {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 10px;
}

.welcome-section {
  display: flex;
  align-items: center;
}

.material-icons {
  font-size: 36px;
  margin-right: 10px;
  color: #074972;
}

h2 {
  font-size: 24px;
  color: #074972;
}

/* Ensure ApplicationsComponent is also centered if needed */
.applications-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
