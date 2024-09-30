<template>
  <div class="attempt-quiz-view">
    <button @click="goBack" class="back-button">
      <span class="material-icons">arrow_back</span>
      <span class="button-text">Back to Dashboard</span>
    </button>
    <AttemptQuizComponent :quizId="quizId" :assignmentId="assignmentId" />
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AttemptQuizComponent from '@/components/AttemptQuizComponent.vue';

export default {
  name: 'AttemptQuizView',
  components: {
    AttemptQuizComponent
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const quizId = ref(parseInt(route.params.quizId));
    const assignmentId = ref(parseInt(route.query.assignmentId));

    const goBack = () => {
      router.push({ name: 'Dashboard' });
    };

    return {
      quizId,
      assignmentId,
      goBack
    };
  }
};
</script>

<style scoped>
.attempt-quiz-view {
  width: 100%;
  padding: 20px;
  position: relative;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background-color: #2980b9;
}

.back-button .material-icons {
  margin-right: 5px;
  font-size: 20px;
}

.button-text {
  font-weight: 500;
}

.back-button:hover {
  background-color: #e0e0e0;
}

/* Media queries for mobile view */
@media screen and (max-width: 768px) {
  .attempt-quiz-view {
    padding: 10px;
  }

  .back-button {
    font-size: 14px;
    padding: 8px 12px;
  }
}
</style>
