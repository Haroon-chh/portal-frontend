<template>
  <div class="student-component">
    <div class="welcome-section">
      <span class="material-icons">school</span>
      <h2>Welcome Student</h2>
    </div>
    <StudentQuizesComponent />
  </div>
</template>

<script>
import StudentQuizesComponent from './StudentQuizesComponent.vue';

export default {
  name: 'StudentComponent',
  components: {
    StudentQuizesComponent
  }
}
</script>

<style scoped>
.student-component {
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

/* Ensure StudentQuizesComponent is also centered if needed */
.student-quizes-component {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
