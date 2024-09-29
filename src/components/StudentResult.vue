<template>
  <div class="container mt-4">
    <h2 class="mb-4"><span class="material-icons">school</span> Students List</h2>

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
      <div class="col-12 col-sm-6 col-md-4 mb-4" v-for="student in paginatedStudents" :key="student.id">
        <div class="card p-3 mb-2 student-card">
          <h5>{{ student.name }}</h5>
          <p class="mb-1">Email: {{ student.email }}</p>
          <p class="mb-1">Phone: {{ student.phone }}</p>
          <div class="text-center mt-3">
            <button class="btn btn-primary btn-sm" @click="viewResults(student.id)">
              View Results
            </button>
          </div>
        </div>
      </div>
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

    <SuccessPopup :show="showSuccess" :message="successMessage" />
    <ErrorPopup :show="showError" :message="errorMessage" />
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
    const students = ref([]);
    const showSuccess = ref(false);
    const showError = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');
    const searchQuery = ref('');
    const currentPage = ref(1);
    const itemsPerPage = 12;

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

    const fetchStudents = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error('No access token found');
          return;
        }

        const response = await axios.get(`${process.env.VUE_APP_API_URL}/students`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });

        students.value = response.data.data;
      } catch (error) {
        console.error('Error fetching students:', error);
        showError.value = true;
        errorMessage.value = `Error fetching students: ${error.message}`;
        setTimeout(() => {
          showError.value = false;
        }, 3000);
      }
    };

    const viewResults = (studentId) => {
      // Implement the logic to view results for a specific student
      console.log(`Viewing results for student ID: ${studentId}`);
      // You can navigate to another route or open a modal to show results
    };

    onMounted(() => {
      fetchStudents();
    });

    return {
      paginatedStudents,
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
      viewResults,
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

@media (max-width: 576px) {
  .student-card {
    margin-bottom: 15px;
  }
}
</style>