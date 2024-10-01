<template>
  <div class="container mt-4">
    <h2 class="mb-4"><span class="material-icons">assessment</span> Quiz Results</h2>

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
          placeholder="Search by quiz or student name..."
        >
      </div>
    </div>

    <!-- Results Table -->
    <div class="table-responsive">
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th>Quiz Name</th>
            <th>Student Name</th>
            <th>Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in paginatedResults" :key="result.id" :class="{ 'table-light': index % 2 === 0 }">
            <td>{{ getQuizName(result.quiz_id) }}</td>
            <td>{{ getStudentName(result.student_id) }}</td>
            <td>{{ result.score }}%</td>
            <td>
              <button class="btn btn-primary btn-sm" @click="showDetails(result)">
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav aria-label="Page navigation" v-if="totalPages > 1">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
        </li>
        <li class="page-item" v-for="page in displayedPages" :key="page" :class="{ active: page === currentPage }">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>

    <!-- Details Modal -->
    <div class="modal fade" id="detailsModal" tabindex="-1" aria-labelledby="detailsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="detailsModalLabel">Quiz Result Details</h5>
            <button type="button" class="btn-close" @click="hideModal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedResult">
            <div class="row">
              <div class="col-md-6">
                <p><strong>Quiz:</strong> {{ getQuizName(selectedResult.quiz_id) }}</p>
                <p><strong>Student:</strong> {{ getStudentName(selectedResult.student_id) }}</p>
                <p><strong>Score:</strong> {{ selectedResult.score }}%</p>
              </div>
            </div>
            <div class="mt-3">
              <h6>Recording:</h6>
              <video 
                v-if="selectedResult && selectedResult.videoUrl" 
                :src="selectedResult.videoUrl"
                controls 
                class="w-100"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="hideModal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <SuccessPopup :show="showSuccess" :message="successMessage" @close="showSuccess = false" />
    <ErrorPopup :show="showError" :message="errorMessage" @close="showError = false" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import SuccessPopup from './SuccessPopup.vue';
import ErrorPopup from './ErrorPopup.vue';

export default {
  name: 'StudentResultComponent',
  components: {
    SuccessPopup,
    ErrorPopup,
  },
  setup() {
    const results = ref([]);
    const students = ref([]);
    const quizzes = ref([]);
    const showSuccess = ref(false);
    const showError = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');
    const searchQuery = ref('');
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const selectedResult = ref(null);

    const filteredResults = computed(() => {
      if (searchQuery.value) {
        return results.value.filter(result => 
          getQuizName(result.quiz_id).toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          getStudentName(result.student_id).toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }
      return results.value;
    });

    const totalPages = computed(() => Math.ceil(filteredResults.value.length / itemsPerPage));

    const paginatedResults = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredResults.value.slice(start, end);
    });

    const displayedPages = computed(() => {
      const range = [];
      const delta = 2;
      for (let i = Math.max(2, currentPage.value - delta); i <= Math.min(totalPages.value - 1, currentPage.value + delta); i++) {
        range.push(i);
      }
      if (currentPage.value - delta > 2) range.unshift("...");
      if (currentPage.value + delta < totalPages.value - 1) range.push("...");
      range.unshift(1);
      if (totalPages.value !== 1) range.push(totalPages.value);
      return range;
    });

    const handleSearch = () => {
      currentPage.value = 1;
    };

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    const getHeaders = () => {
      return {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      };
    };

    const getRecordingUrl = (filename) => {
      return `${process.env.VUE_APP_API_URL}/recording?filename=${filename}`;
    };

    const fetchRecording = async (filename) => {
      try {
        const headers = getHeaders();
        const response = await axios.get(getRecordingUrl(filename), {
          headers,
          responseType: 'blob',
        });
        return URL.createObjectURL(new Blob([response.data], { type: 'video/webm' }));
      } catch (error) {
        console.error('Error fetching recording:', error);
        showError.value = true;
        errorMessage.value = `Error fetching recording: ${error.message}`;
        return null;
      }
    };

    const showDetails = async (result) => {
      selectedResult.value = result;
      if (result.recording) {
        const videoUrl = await fetchRecording(result.recording);
        if (videoUrl) {
          selectedResult.value.videoUrl = videoUrl;
        }
      }
      const modal = document.getElementById('detailsModal');
      modal.style.display = 'block';
      modal.classList.add('show');
      document.body.classList.add('modal-open');
    };

    const hideModal = () => {
      if (selectedResult.value && selectedResult.value.videoUrl) {
        URL.revokeObjectURL(selectedResult.value.videoUrl);
      }
      selectedResult.value = null;
      const modal = document.getElementById('detailsModal');
      modal.style.display = 'none';
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
    };

    const getQuizName = (quizId) => {
      const quiz = quizzes.value.find(q => q.id === quizId);
      return quiz ? quiz.title : 'Unknown Quiz';
    };

    const getStudentName = (studentId) => {
      const student = students.value.find(s => s.id === studentId);
      return student ? student.name : 'Unknown Student';
    };

    const fetchData = async () => {
      try {
        const headers = getHeaders();
        const [resultsResponse, studentsResponse, quizzesResponse] = await Promise.all([
          axios.get(`${process.env.VUE_APP_API_URL}/view-results`, { headers }),
          axios.get(`${process.env.VUE_APP_API_URL}/students`, { headers }),
          axios.get(`${process.env.VUE_APP_API_URL}/quizzes`, { headers }),
        ]);

        results.value = resultsResponse.data.data;
        students.value = studentsResponse.data.data;
        quizzes.value = quizzesResponse.data.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        showError.value = true;
        errorMessage.value = `Error fetching data: ${error.message}`;
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      paginatedResults,
      showSuccess,
      showError,
      successMessage,
      errorMessage,
      searchQuery,
      handleSearch,
      currentPage,
      totalPages,
      displayedPages,
      changePage,
      getQuizName,
      getStudentName,
      showDetails,
      hideModal,
      selectedResult,
      getRecordingUrl,
    };
  },
};
</script>

<style scoped>
.table {
  background-color: white;
}

.table th, .table td {
  border: none;
}

.table-hover tbody tr:hover {
  background-color: #f1f3f5;
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

/* Modal styles */
.modal-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.modal-footer {
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
}

.modal-body {
  padding: 20px;
}

.modal-content {
  border-radius: 0.3rem;
}

.btn-close:focus {
  box-shadow: none;
}

/* Add these new styles for the video player */
video {
  max-height: 400px;
  object-fit: contain;
  background-color: #000;
}
</style>