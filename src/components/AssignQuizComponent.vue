<template>
  <div class="container mt-4">
    <h2 class="mb-4"><span class="material-icons">assignment</span> Assign Quiz to Students</h2>
    
    <div class="row">
      <div v-for="student in students" :key="student.id" class="col-12 col-sm-6 col-md-4 mb-4">
        <div class="card p-3 mb-2 student-card">
          <h5>{{ student.name }}</h5>
          <p class="mb-1">Email: {{ student.email }}</p>
          <div class="mb-3">
            <label for="quizSelect" class="form-label">Select Quiz</label>
            <select v-model="selectedQuiz[student.id]" class="form-select">
              <option value="">Choose a quiz</option>
              <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
                {{ quiz.title }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="durationSelect" class="form-label">Select Duration</label>
            <select v-model="selectedDuration[student.id]" class="form-select">
              <option value="">Choose duration</option>
              <option v-for="duration in durations" :key="duration" :value="duration">
                {{ duration }} minutes
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="deadline" class="form-label">Deadline</label>
            <input type="datetime-local" v-model="selectedDeadline[student.id]" class="form-control mb-2">
          </div>
          <button class="btn btn-primary" @click="confirmAssign(student.id)" :disabled="!isAssignmentValid(student.id)">
            Assign Quiz
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Modal -->
    <div v-if="showConfirmModal" class="modal" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Assignment</h5>
            <button type="button" class="btn-close" @click="showConfirmModal = false"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to assign this quiz?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showConfirmModal = false">Cancel</button>
            <button type="button" class="btn btn-primary" @click="assignQuiz">Confirm</button>
          </div>
        </div>
      </div>
    </div>

    <SuccessPopupComponent :show="showSuccess" :message="successMessage" />
    <ErrorPopupComponent :show="showError" :message="errorMessage" />
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
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
    const selectedQuiz = reactive({});
    const selectedDuration = reactive({});
    const selectedDeadline = reactive({});
    const showSuccess = ref(false);
    const showError = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');
    const showConfirmModal = ref(false);
    const currentStudentId = ref(null);
    const durations = [4, 20, 30];

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

    const isAssignmentValid = (studentId) => {
      return selectedQuiz[studentId] && selectedDuration[studentId] && selectedDeadline[studentId];
    };

    const confirmAssign = (studentId) => {
      currentStudentId.value = studentId;
      showConfirmModal.value = true;
    };

    const assignQuiz = async () => {
      const studentId = currentStudentId.value;
      const data = {
        quiz_id: selectedQuiz[studentId],
        assigned_to: studentId,
        duration: selectedDuration[studentId],
        deadline_at: new Date(selectedDeadline[studentId]).toISOString(),
      };

      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/assign-quiz`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        successMessage.value = response.data.message || 'Quiz assigned successfully!';
        showSuccess.value = true;
        // Reset the form for this student
        selectedQuiz[studentId] = '';
        selectedDuration[studentId] = '';
        selectedDeadline[studentId] = '';
      } catch (error) {
        console.error('Error assigning quiz:', error);
        showError.value = true;
        errorMessage.value = 'Failed to assign quiz. Please try again later.';
      } finally {
        showConfirmModal.value = false;
      }
    };

    onMounted(() => {
      fetchStudents();
      fetchQuizzes();
    });

    return {
      students,
      quizzes,
      selectedQuiz,
      selectedDuration,
      selectedDeadline,
      showSuccess,
      showError,
      successMessage,
      errorMessage,
      showConfirmModal,
      durations,
      isAssignmentValid,
      confirmAssign,
      assignQuiz,
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.material-icons {
  vertical-align: middle;
  margin-right: 5px;
}
</style>