<template>
  <div>
    <AttemptQuizComponent :quizId="quizId" :assignmentId="assignmentId" />
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import AttemptQuizComponent from '@/components/AttemptQuizComponent.vue';

export default {
  name: 'AttemptQuizView',
  components: {
    AttemptQuizComponent
  },
  setup() {
    const route = useRoute();
    const quizId = ref(parseInt(route.params.quizId));
    const assignmentId = ref(parseInt(route.query.assignmentId));

    return {
      quizId,
      assignmentId
    };
  }
};
</script>

<style scoped>
.attempt-quiz-view {
  width: 100%;
  margin-top: 5%;
}

.content {
  padding: 20px;
  margin-left: 2%;
  margin-top: 60px; /* Adjust based on your header height */
}

/* Media queries for mobile view */
@media screen and (max-width: 768px) {
  .attempt-quiz-view {
    margin-top: 10%;
  }

  .content {
    padding: 10px;
    margin-left: 0;
    margin-top: 40px;
  }
}
</style>
