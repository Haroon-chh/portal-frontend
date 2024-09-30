<template>
  <div class="container mt-4">
    <h2 class="mb-4">My Assigned Quizzes</h2>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="!isLoggedIn" class="alert alert-warning">
      Please log in to view your assigned quizzes.
    </div>
    <div v-else-if="assignedQuizzes.length === 0" class="alert alert-info">
      No quizzes have been assigned to you yet.
    </div>
    <div v-else class="list-group">
      <div v-for="quiz in assignedQuizzes" :key="quiz.id" class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between align-items-center">
          <h5 class="mb-1">{{ getQuizTitle(quiz.quiz_id) }}</h5>
          <span :class="getStatusClass(quiz)">{{ getStatus(quiz) }}</span>
        </div>
        <p class="mb-1">Duration: {{ quiz.duration }} minutes</p>
        <p class="mb-1">Scheduled: {{ formatDate(quiz.scheduled_at) }}</p>
        <p class="mb-1">Deadline: {{ formatDate(quiz.deadline_at) }}</p>
        <button 
          v-if="!isDeadlinePassed(quiz)" 
          class="btn btn-primary mt-2"
          @click="attemptQuiz(quiz)"
        >
          Attempt Quiz
        </button>
      </div>
    </div>
    <ErrorPopupComponent :show="showError" :message="errorMessage" @close="closeErrorPopup" />
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import moment from 'moment';
import ErrorPopupComponent from './ErrorPopup.vue';

export default {
  name: 'StudentQuizesComponent',
  components: {
    ErrorPopupComponent,
  },
  setup() {
    const store = useStore();
    const assignedQuizzes = ref([]);
    const quizzes = ref({});
    const loading = ref(true);
    const showError = ref(false);
    const errorMessage = ref('');

    const loggedUser = computed(() => store.getters.getLoggedUser);
    const isLoggedIn = computed(() => !!loggedUser.value && !!loggedUser.value.id);

    const fetchAssignedQuizzes = async () => {
      if (!isLoggedIn.value) {
        console.error('User not logged in');
        return;
      }

      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/assigned-quizzes/${loggedUser.value.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        assignedQuizzes.value = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
      } catch (error) {
        console.error('Error fetching assigned quizzes:', error);
        showError.value = true;
        errorMessage.value = 'Failed to fetch assigned quizzes. Please try again later.';
      }
    };

    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/quizzes`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });

        console.log('Quizzes response:', response.data); // Log the response for debugging

        if (response.data && response.data.data) {
          if (Array.isArray(response.data.data)) {
            quizzes.value = response.data.data.reduce((acc, quiz) => {
              if (quiz && quiz.id && quiz.title) {
                acc[quiz.id] = quiz.title;
              }
              return acc;
            }, {});
          } else if (typeof response.data.data === 'object') {
            // If the data is an object, use it directly
            quizzes.value = response.data.data;
          } else {
            console.error('Unexpected quizzes data format:', response.data.data);
            showError.value = true;
            errorMessage.value = 'Received unexpected quiz data format. Please try again later.';
          }
        } else {
          console.error('No quizzes data in the response:', response.data);
          showError.value = true;
          errorMessage.value = 'No quiz data received. Please try again later.';
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        showError.value = true;
        errorMessage.value = 'Failed to fetch quiz details. Please try again later.';
      }
    };

    const getQuizTitle = (quizId) => {
      if (quizzes.value && quizzes.value[quizId]) {
        return quizzes.value[quizId];
      } else {
        console.warn(`Quiz title not found for id: ${quizId}`);
        return `Quiz ${quizId}`;
      }
    };

    const formatDate = (date) => {
      return moment(date).format('MMMM D, YYYY h:mm A');
    };

    const isDeadlinePassed = (quiz) => {
      return moment().isAfter(moment(quiz.deadline_at));
    };

    const getStatus = (quiz) => {
      if (isDeadlinePassed(quiz)) {
        return 'Deadline Passed';
      } else if (moment().isBefore(moment(quiz.scheduled_at))) {
        return 'Scheduled';
      } else {
        return 'Available';
      }
    };

    const getStatusClass = (quiz) => {
      const status = getStatus(quiz);
      switch (status) {
        case 'Deadline Passed':
          return 'text-danger';
        case 'Scheduled':
          return 'text-primary';
        case 'Available':
          return 'text-success';
        default:
          return '';
      }
    };

    const attemptQuiz = (quiz) => {
      console.log('Attempting quiz:', quiz);
    };

    const closeErrorPopup = () => {
      showError.value = false;
      errorMessage.value = '';
    };

    const fetchData = async () => {
      loading.value = true;
      if (isLoggedIn.value) {
        await Promise.all([fetchAssignedQuizzes(), fetchQuizzes()]);
      } else {
        console.error('User not logged in');
      }
      loading.value = false;
    };

    onMounted(fetchData);

    watch(loggedUser, (newUser) => {
      if (newUser && newUser.id) {
        fetchData();
      }
    });

    return {
      assignedQuizzes,
      loading,
      isLoggedIn,
      getQuizTitle,
      formatDate,
      isDeadlinePassed,
      getStatus,
      getStatusClass,
      attemptQuiz,
      showError,
      errorMessage,
      closeErrorPopup,
    };
  },
};
</script>

<style scoped>
.list-group-item {
  transition: background-color 0.3s;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}
</style>