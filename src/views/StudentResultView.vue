<template>
    <div class="student-result-view">
      <Header title="Quizela✨" />
      <div class="content">
        <StudentResult />
      </div>
    </div>
</template>

<script>
import Header from '../components/HeaderComponent.vue';
import StudentResult from '../components/StudentResult.vue';

export default {
  components: {
    Header,
    StudentResult,
  },
};
</script>

<style scoped>
.student-result-view {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 20px;
  margin-top: 60px; /* Adjust this value based on your header height */
}

@media (max-width: 768px) {
  .content {
    padding: 10px;
  }
}
</style>
