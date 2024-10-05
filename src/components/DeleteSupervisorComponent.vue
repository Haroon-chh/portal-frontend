<template>
  <div>
    <h2 class="mb-4"><span class="material-icons">supervisor_account</span> Delete Supervisor</h2>
    
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
          placeholder="Search supervisor by name..."
        >
      </div>
    </div>
    
    <div class="row">
      <div class="col-12 col-sm-6 col-md-4 mb-4" v-for="supervisor in paginatedSupervisors" :key="supervisor.id">
        <div class="card p-3 mb-2 supervisor-card">
          <h5>{{ supervisor.name }}</h5>
          <p class="mb-1">Email: {{ supervisor.email }}</p>
          <div class="text-center">
            <button class="btn btn-danger btn-md" @click="confirmDelete(supervisor.id)">
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
        v-if="currentPage > 1" 
        @click="currentPage--" 
        class="btn btn-outline-primary me-2"
      >
        <span class="material-icons">navigate_before</span> Previous
      </button>
      <span class="mx-2">Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        v-if="currentPage < totalPages" 
        @click="currentPage++" 
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
              <p class="text-center fw-bold">Are you sure you want to delete this supervisor?</p>
            </div>
            <div class="modal-footer d-flex justify-content-center">
              <button @click="deleteSupervisor" class="btn btn-danger me-2">
                <span class="material-icons text-white">delete_forever</span> Yes, Delete
              </button>
              <button @click="showConfirm = false" class="btn btn-secondary">
                <span class="material-icons text-white">cancel</span> Cancel
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
  name: 'DeleteSupervisorComponent',
  components: {
    SuccessPopupComponent,
    ErrorPopupComponent,
  },
  setup() {
    const supervisors = ref([]);
    const showSuccess = ref(false);
    const showError = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');
    const showConfirm = ref(false);
    const supervisorIdToDelete = ref(null);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const itemsPerPage = 12;

    const filteredSupervisors = computed(() => {
      if (!supervisors.value) return []; // Return empty array if supervisors is undefined
      if (searchQuery.value) {
        return supervisors.value.filter(supervisor => 
          supervisor.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }
      return supervisors.value;
    });

    const totalPages = computed(() => Math.ceil((filteredSupervisors.value?.length || 0) / itemsPerPage));

    const paginatedSupervisors = computed(() => {
      if (!filteredSupervisors.value) return []; // Return empty array if filteredSupervisors is undefined
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredSupervisors.value.slice(start, end);
    });

    const handleSearch = () => {
      currentPage.value = 1; // Reset to first page when searching
    };

    const fetchSupervisors = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error('No access token found');
          return;
        }

        const response = await axios.get(`${process.env.VUE_APP_API_URL}/supervisors`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });

        if (response.data && Array.isArray(response.data.data)) {
          supervisors.value = response.data.data;
        } else {
          console.error('Unexpected response format:', response.data);
          supervisors.value = [];
        }
      } catch (error) {
        console.error('Error fetching supervisors:', error);
        showError.value = true;
        errorMessage.value = `Error fetching supervisors: ${error.message}`;
        setTimeout(() => {
          showError.value = false;
          errorMessage.value = '';
        }, 3000);
        supervisors.value = []; // Set to empty array on error
      }
    };

    const confirmDelete = (id) => {
      supervisorIdToDelete.value = id;
      showConfirm.value = true;
    };

    const deleteSupervisor = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error('No access token found');
          return;
        }

        const response = await axios.post(`${process.env.VUE_APP_API_URL}/delete-supervisor/${supervisorIdToDelete.value}`, {}, {
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
          // Refresh the supervisor list
          fetchSupervisors();
        }
      } catch (error) {
        console.error('Error deleting supervisor:', error);
        showError.value = true;
        errorMessage.value = `Error deleting supervisor: ${error.message}`;
        setTimeout(() => {
          showError.value = false;
          errorMessage.value = '';
        }, 3000);
      } finally {
        showConfirm.value = false; // Hide confirmation popup
      }
    };

    onMounted(() => {
      fetchSupervisors();
    });

    return {
      paginatedSupervisors,
      showSuccess,
      showError,
      successMessage,
      errorMessage,
      showConfirm,
      confirmDelete,
      deleteSupervisor,
      searchQuery,
      handleSearch,
      currentPage,
      totalPages,
    };
  },
};
</script>

<style scoped>
.supervisor-card {
  border: 1px solid #ced4da;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
}

.supervisor-card:hover {
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

  .supervisor-card {
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