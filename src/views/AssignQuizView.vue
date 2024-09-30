<template>
    <Header title="Assign Quiz" />
  <div class="assign-quiz-view">
    <div class="content">
      <AssignQuizComponent />
      
      <!-- Added AssignedQuizAdminComponent -->
      <div class="mt-5">
        <AssignedQuizAdminComponent />
      </div>
    </div>
    </div>
    
</template>

<script>
import AssignQuizComponent from '../components/AssignQuizComponent.vue';
import AssignedQuizAdminComponent from '../components/AssignedQuizAdminComponent.vue';
import Header from '../components/HeaderComponent.vue';

export default {
  name: 'AssignQuizView',
  components: {
    AssignQuizComponent,
    AssignedQuizAdminComponent,
    Header
  },
};
</script>

<style scoped>
.assign-quiz-view {
  width: 100%;
  margin-top: 5%;
}

.content {
  padding: 20px;
  margin-left: 2%;
  margin-top: 60px; /* Adjust based on your header height */
}

h1, h2 {
  color: #333;
  text-align: center;
}

/* Media queries for mobile view */
@media screen and (max-width: 768px) {
  .assign-quiz-view {
    margin-top: 10%;
  }

  .content {
    padding: 10px;
    margin-left: 0;
    margin-top: 40px;
  }

  h1, h2 {
    font-size: 24px;
  }
}

@media screen and (max-width: 480px) {
  .assign-quiz-view {
    margin-top: 15%;
    margin-left: 8%;
  }

  .content {
    padding: 5px;
  }

  h1, h2 {
    font-size: 20px;
  }
}
</style>
