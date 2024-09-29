<template>
  <div class="delete-user-view">
    <Header />
    <div class="content">
      <h2>Delete User</h2>
      <DeleteStudentComponent />
    </div>
  </div>
</template>

<script>
import Header from '@/components/HeaderComponent.vue';
import DeleteStudentComponent from '@/components/DeleteStudentComponent.vue';

export default {
  name: 'DeleteUserView',
  components: {
    Header,
    DeleteStudentComponent
  }
}
</script>

<style scoped>
.delete-user-view {
  width: 100%;
}

.content {
  padding: 20px;
  margin-top: 60px; /* Adjust based on your header height */
}

h2 {
  margin-bottom: 20px;
}
</style>

