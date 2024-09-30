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
    <div v-else class="row">
      <div v-for="quiz in assignedQuizzes" :key="quiz.id" class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">{{ getQuizTitle(quiz.quiz_id) }}</h5>
            <span :class="getStatusBadgeClass(quiz)" class="badge">{{ getStatus(quiz) }}</span>
          </div>
          <div class="card-body">
            <ul class="list-unstyled">
              <li><i class="bi bi-clock me-2"></i>Duration: {{ quiz.duration }} minutes</li>
              <li><i class="bi bi-calendar-event me-2"></i>Scheduled: {{ formatDate(quiz.scheduled_at) }}</li>
              <li><i class="bi bi-calendar-check me-2"></i>Deadline: {{ formatDate(quiz.deadline_at) }}</li>
            </ul>
          </div>
          <div class="card-footer bg-white border-top-0">
            <button 
              v-if="!isDeadlinePassed(quiz)" 
              class="btn btn-outline-primary w-100"
              @click="attemptQuiz(quiz)"
            >
              <i class="bi bi-pencil-square me-2"></i>Attempt Quiz
            </button>
            <p v-else class="text-muted mb-0">
              <i class="bi bi-exclamation-circle me-2"></i>Deadline passed
            </p>
          </div>
        </div>
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

    const getStatusBadgeClass = (quiz) => {
      if (isDeadlinePassed(quiz)) {
        return 'bg-danger'; // Red color for passed deadline
      } else if (isQuizAvailable(quiz)) {
        return 'bg-success'; // Green color for available quizzes
      } else {
        return 'bg-secondary'; // Grey color for other statuses (e.g., upcoming)
      }
    };

    const isQuizAvailable = (quiz) => {
      const now = new Date();
      const scheduledDate = new Date(quiz.scheduled_at);
      const deadlineDate = new Date(quiz.deadline_at);
      return now >= scheduledDate && now < deadlineDate;
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
      getStatusBadgeClass,
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

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.badge {
  font-size: 0.8rem;
}

.bg-danger {
  background-color: #dc3545 !important;
}

.bg-success {
  background-color: #28a745 !important;
}

.bg-secondary {
  background-color: #6c757d !important;
}
</style>