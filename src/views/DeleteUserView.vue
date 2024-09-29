<template>
  <div class="delete-user-view">
    <Header title="Delete Users" />
    <div class="content">
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
  margin-left: 2%;
  margin-top: 60px; /* Adjust based on your header height */
}

h2 {
  margin-bottom: 20px;
}
@media (max-width: 768px) {
  .content {
    margin-left: 0;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .content {
    margin-top: 80px;
    margin-left: 10%; /* Increase top margin for smaller screens */
  }

  h2 {
    font-size: 1.5rem; /* Reduce heading size for mobile */
    margin-bottom: 15px;
  }
}

</style>

