<template>
    <div>
      <h2 class="mb-4"><span class="material-icons">school</span> Delete Student</h2>
      
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
        <div class="col-12 col-sm-6 col-md-4 mb-4" v-for="student in filteredStudents" :key="student.id">
          <div class="card p-3 mb-2 student-card">
            <h5>{{ student.name }}</h5>
            <p class="mb-1">Email: {{ student.email }}</p>
            <p class="mb-2">Phone: {{ student.phone }}</p>
            <div class="text-center">
              <button class="btn btn-danger btn-md " @click="confirmDelete(student.id)">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <SuccessPopupComponent :show="showSuccess" :message="successMessage" />
      <ErrorPopupComponent :show="showError" :message="errorMessage" />
  
      <div class="pagination mt-4 d-flex justify-content-center align-items-center">
        <button 
          v-if="pagination.current_page > 1" 
          @click="fetchStudents(pagination.current_page - 1)" 
          class="btn btn-outline-primary me-2"
        >
          <span class="material-icons">navigate_before</span> Previous
        </button>
        <span class="mx-2">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
        <button 
          v-if="pagination.current_page < pagination.last_page" 
          @click="fetchStudents(pagination.current_page + 1)" 
          class="btn btn-outline-primary ms-2"
        >
          Next <span class="material-icons">navigate_next</span>
        </button>
      </div>
      
      <!-- Confirmation Popup -->
      <transition name="fade">
        <div v-if="showConfirm" class="confirmation-popup">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-body">
                <p class="text-center fw-bold">Are you sure you want to delete this student?</p>
              </div>
              <div class="modal-footer d-flex justify-content-center">
                <button @click="deleteStudent" class="btn btn-danger me-2">
                  <span class="material-icons">delete_forever</span> Yes, Delete
                </button>
                <button @click="showConfirm = false" class="btn btn-secondary">
                  <span class="material-icons">cancel</span> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </template>
  

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import SuccessPopupComponent from './SuccessPopup.vue';
import ErrorPopupComponent from './ErrorPopup.vue';

export default {
  name: 'DeleteStudentComponent',
  components: {
    SuccessPopupComponent,
    ErrorPopupComponent,
  },
  setup() {
    const students = ref([]);
    const pagination = ref({});
    const showSuccess = ref(false);
    const showError = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');
    const showConfirm = ref(false);
    const studentIdToDelete = ref(null);
    const searchQuery = ref('');

    const filteredStudents = computed(() => {
      if (searchQuery.value) {
        return students.value.filter(student => 
          student.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }
      return students.value;
    });

    const handleSearch = () => {
      // If you want to trigger a new API call when searching, uncomment the next line
      // fetchStudents(1, searchQuery.value);
    };

    const fetchStudents = async (page = 1, search = '') => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error('No access token found');
          return;
        }

        const response = await axios.get(`${process.env.VUE_APP_API_URL}/students`, {
          params: {
            page: page,
            search: search
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });

        students.value = response.data.data.data;
        pagination.value = {
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          total: response.data.data.total,
        };
      } catch (error) {
        console.error('Error fetching students:', error);
        showError.value = true;
        errorMessage.value = `Error fetching students: ${error.message}`;
        setTimeout(() => {
          showError.value = false;
          errorMessage.value = '';
        }, 3000);
      }
    };

    const confirmDelete = (id) => {
      studentIdToDelete.value = id;
      showConfirm.value = true;
    };

    const deleteStudent = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error('No access token found');
          return;
        }

        const response = await axios.post(`${process.env.VUE_APP_API_URL}/delete-student/${studentIdToDelete.value}`, {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.message) {
          successMessage.value = response.data.message;
          showSuccess.value = true;
          setTimeout(() => {
            showSuccess.value = false;
            successMessage.value = '';
          }, 3000);
          // Refresh the student list
          fetchStudents(pagination.value.current_page, searchQuery.value);
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        showError.value = true;
        errorMessage.value = `Error deleting student: ${error.message}`;
        setTimeout(() => {
          showError.value = false;
          errorMessage.value = '';
        }, 3000);
      } finally {
        showConfirm.value = false; // Hide confirmation popup
      }
    };

    onMounted(() => {
      fetchStudents();
    });

    return {
      students,
      filteredStudents,
      pagination,
      showSuccess,
      showError,
      successMessage,
      errorMessage,
      showConfirm,
      confirmDelete,
      deleteStudent,
      fetchStudents,
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.confirmation-popup {
  position: fixed;
  height: 20%;
  padding: 2%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%; /* Mobile-friendly */
  max-width: 400px; /* Maximum width for larger screens */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.material-icons {
  vertical-align: middle;
  margin-right: 5px;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .confirmation-popup {
    width: 95%;
  }

  .student-card {
    margin-bottom: 15px;
  }
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