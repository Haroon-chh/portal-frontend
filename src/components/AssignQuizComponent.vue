<template>
  <div class="container mt-4">
    <h2 class="mb-4"><span class="material-icons">assignment</span> Assign Quiz to Students</h2>
    
    <!-- Search bar -->
    <div class="mb-4 search-container">
      <div class="input-group">
        <span class="input-group-text">
          <span class="material-icons">search</span>
        </span>
        <input 
          v-model="searchQuery" 
          @input="handleSearch"
          type="text" 
          class="form-control form-control-sm" 
          placeholder="Search student by name..."
        >
      </div>
    </div>
    
    <div class="row">
      <div v-for="student in paginatedStudents" :key="student.id" class="col-12 col-sm-6 col-md-4 mb-4">
        <div class="card p-3 mb-2 student-card">
          <h5>{{ student.name }}</h5>
          <p class="mb-1">Email: {{ student.email }}</p>
          <div class="text-center">
            <button class="btn btn-primary btn-md" @click="openAssignModal(student)">
              Assign Quiz
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="d-flex justify-content-center mt-4">
      <button class="btn btn-outline-primary me-2" @click="prevPage" :disabled="currentPage === 1">
        Previous
      </button>
      <span class="align-self-center mx-2">Page {{ currentPage }} of {{ totalPages }}</span>
      <button class="btn btn-outline-primary ms-2" @click="nextPage" :disabled="currentPage === totalPages">
        Next
      </button>
    </div>

    <!-- Assign Quiz Modal -->
    <div v-if="showAssignModal" class="modal" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Assign Quiz to {{ selectedStudent.name }}</h5>
            <button type="button" class="btn-close" @click="closeAssignModal"></button>
          </div>
          <div class="modal-body">
            <p><strong>Email:</strong> {{ selectedStudent.email }}</p>
            <p><strong>Phone:</strong> {{ selectedStudent.phone }}</p>
            <div class="mb-3">
              <label for="quizSelect" class="form-label">Select Quiz</label>
              <select v-model="selectedQuiz" class="form-select">
                <option value="">Choose a quiz</option>
                <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
                  {{ quiz.title }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="durationSelect" class="form-label">Select Duration</label>
              <select v-model="selectedDuration" class="form-select">
                <option value="">Choose duration</option>
                <option v-for="duration in durations" :key="duration" :value="duration">
                  {{ duration }} minutes
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="deadline" class="form-label">Deadline</label>
              <input type="datetime-local" v-model="selectedDeadline" class="form-control">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeAssignModal">Cancel</button>
            <button type="button" class="btn btn-success" @click="assignQuiz" :disabled="!isAssignmentValid">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>

    <SuccessPopupComponent :show="showSuccess" :message="successMessage" />
    <ErrorPopupComponent :show="showError" :message="errorMessage" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import moment from 'moment';
import SuccessPopupComponent from './SuccessPopup.vue';
import ErrorPopupComponent from './ErrorPopup.vue';

export default {
  name: 'AssignQuizComponent',
  components: {
    SuccessPopupComponent,
    ErrorPopupComponent,
  },
  setup() {
    const students = ref([]);
    const quizzes = ref([]);
    const showSuccess = ref(false);
    const showError = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');
    const showAssignModal = ref(false);
    const selectedStudent = ref({});
    const selectedQuiz = ref('');
    const selectedDuration = ref('');
    const selectedDeadline = ref(moment().add(1, 'hour').format('YYYY-MM-DDTHH:mm'));
    const durations = [4, 20, 30];
    const currentPage = ref(1);
    const itemsPerPage = 12;
    const searchQuery = ref('');

    const filteredStudents = computed(() => {
      if (searchQuery.value) {
        return students.value.filter(student => 
          student.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }
      return students.value;
    });

    const totalPages = computed(() => Math.ceil(filteredStudents.value.length / itemsPerPage));

    const paginatedStudents = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredStudents.value.slice(start, end);
    });

    const handleSearch = () => {
      currentPage.value = 1; // Reset to first page when searching
    };

    const isAssignmentValid = computed(() => {
      return selectedQuiz.value && selectedDuration.value && selectedDeadline.value;
    });

    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/students`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        students.value = response.data.data;
      } catch (error) {
        console.error('Error fetching students:', error);
        showError.value = true;
        errorMessage.value = 'Failed to fetch students. Please try again later.';
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
        quizzes.value = response.data.data;
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        showError.value = true;
        errorMessage.value = 'Failed to fetch quizzes. Please try again later.';
      }
    };

    const openAssignModal = (student) => {
      selectedStudent.value = student;
      showAssignModal.value = true;
    };

    const closeAssignModal = () => {
      showAssignModal.value = false;
      selectedQuiz.value = '';
      selectedDuration.value = '';
      selectedDeadline.value = '';
    };

    const assignQuiz = async () => {
      const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
      const deadlineTime = moment(selectedDeadline.value).format('YYYY-MM-DD HH:mm:ss');

      const data = {
        quiz_id: parseInt(selectedQuiz.value),
        assigned_to: parseInt(selectedStudent.value.id),
        duration: parseInt(selectedDuration.value),
        scheduled_at: currentTime,
        deadline_at: deadlineTime,
      };

    //   console.log('Sending data:', data);  // Log the data being sent

      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/assign-quiz`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        successMessage.value = response.data.message || 'Quiz scheduled successfully!';
        showSuccess.value = true;
        setTimeout(() => {
          showSuccess.value = false;
        }, 3000);
        closeAssignModal();
      } catch (error) {
        console.error('Error assigning quiz:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);  // Log the error response
          errorMessage.value = error.response.data.message || 'Failed to assign quiz. Please check your input and try again.';
        } else {
          errorMessage.value = 'Failed to assign quiz. Please try again later.';
        }
        showError.value = true;
        setTimeout(() => {
          showError.value = false;
        }, 3000);
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    onMounted(() => {
      fetchStudents();
      fetchQuizzes();
    });

    return {
      paginatedStudents,
      quizzes,
      showSuccess,
      showError,
      successMessage,
      errorMessage,
      showAssignModal,
      selectedStudent,
      selectedQuiz,
      selectedDuration,
      selectedDeadline,
      durations,
      currentPage,
      totalPages,
      isAssignmentValid,
      openAssignModal,
      closeAssignModal,
      assignQuiz,
      prevPage,
      nextPage,
      searchQuery,
      handleSearch,
    };
  },
};
</script>

<style scoped>
.student-card {
  border: 1px solid #ced4da;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
}

.student-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.material-icons {
  vertical-align: middle;
  margin-right: 5px;
}

.search-container {
  max-width: 400px;
  margin-left: auto;
}

.input-group-text {
  background-color: #f8f9fa;
  border-right: none;
}

.form-control {
  border-left: none;
}

.form-control:focus {
  box-shadow: none;
  border-color: #ced4da;
}

.material-icons {
  font-size: 20px;
  color: #6c757d;
}
</style>