<template>
  <div>
    <h2>Welcome Student</h2>
    <StudentQuizesComponent />
  </div>
</template>

<script>
import StudentQuizesComponent from './StudentQuizesComponent.vue';

export default {
  name: 'StudentComponent',
  components: {
    StudentQuizesComponent,
  },
};
</script>
