<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Student Applications</h2>
      <div class="search-container">
        <div class="input-group">
          <span class="input-group-text">
            <span class="material-icons">search</span>
          </span>
          <input 
            v-model="searchTerm" 
            @input="searchApplications" 
            class="form-control" 
            type="text" 
            placeholder="Search applications..."
          >
        </div>
      </div>
    </div>
    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    
    <div class="card-columns">
      <div v-for="application in filteredApplications" :key="application.id" class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">{{ application.name }}</h5>
          <p class="card-text">Email: {{ application.email }}</p>
          <p class="card-text">Phone: {{ application.phone }}</p>
          <div class="d-flex gap-1 justify-content-center">
            <button @click="viewCV(application.id)" class="btn btn-primary">View CV</button>
            <button @click="acceptApplication(application.id)" class="btn btn-success">Accept</button>
            <button @click="rejectApplication(application.id)" class="btn btn-danger">Reject</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Updated Pagination -->
    <nav aria-label="Page navigation" v-if="pagination.last_page > 1">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
          <a class="page-link" href="#" @click.prevent="fetchApplications(pagination.current_page - 1)">Previous</a>
        </li>
        <li class="page-item" v-for="page in displayedPages" :key="page" :class="{ active: page === pagination.current_page }">
          <a class="page-link" href="#" @click.prevent="page === '...' ? null : fetchApplications(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
          <a class="page-link" href="#" @click.prevent="fetchApplications(pagination.current_page + 1)">Next</a>
        </li>
      </ul>
    </nav>

    <SuccessPopup :show="showSuccess" :message="successMessage" />
    <ErrorPopup :show="showError" :message="errorMessage" />
  </div>
</template>

<script>
import { ref, defineComponent, onMounted, computed } from 'vue';
import axios from 'axios';
import SuccessPopup from '../components/SuccessPopup.vue';
import ErrorPopup from '../components/ErrorPopup.vue';

export default defineComponent({
  name: 'ApplicationsComponent',
  components: {
    SuccessPopup,
    ErrorPopup,
  },
  setup() {
    const applications = ref([]);
    const pagination = ref({});
    const showSuccess = ref(false);
    const showError = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');
    const searchTerm = ref('');

    const filteredApplications = computed(() => {
      if (!searchTerm.value) return applications.value;
      return applications.value.filter(app => 
        app.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });

    const searchApplications = () => {
      // This function is now just a placeholder for future server-side search implementation
      // The actual filtering is done by the computed property
    };

    const fetchApplications = async (page = 1) => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error('No access token found');
          return;
        }

        const apiUrl = `${process.env.VUE_APP_API_URL}/applications?page=${page}`;

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });

        applications.value = response.data.data.data || [];
        pagination.value = response.data.data;
      } catch (error) {
        handleError(error, 'Error fetching applications');
      }
    };

    const viewCV = async (applicationId) => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error('No access token found');
          return;
        }

        const application = applications.value.find(app => app.id === applicationId);
        if (application && application.attachment) {
          const filename = application.attachment.split('/').pop();
          const apiUrl = `${process.env.VUE_APP_API_URL}/attachment?filename=${filename}`;

          const response = await axios.get(apiUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
            responseType: 'blob', // Important: This tells axios to treat the response as binary data
          });

          // Create a Blob from the response data
          const blob = new Blob([response.data], { type: response.headers['content-type'] });

          // Create a link element and trigger the download
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.target = '_blank';
          link.click();

          // Clean up
          window.URL.revokeObjectURL(link.href);
        } else {
          console.error('Application or attachment not found');
        }
      } catch (error) {
        handleError(error, 'Error viewing CV');
      }
    };

    const acceptApplication = async (applicationId) => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error('No access token found');
          return;
        }

        const apiUrl = `${process.env.VUE_APP_API_URL}/accept-application/${applicationId}`;

        const response = await axios.post(apiUrl, {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        successMessage.value = response.data.message;
        showSuccess.value = true;
        fetchApplications();

        setTimeout(() => {
          showSuccess.value = false;
        }, 5000);
      } catch (error) {
        handleError(error, 'Error accepting application');
      }
    };

    const rejectApplication = async (applicationId) => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error('No access token found');
          return;
        }

        const apiUrl = `${process.env.VUE_APP_API_URL}/reject-application/${applicationId}`;

        const response = await axios.post(apiUrl, {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        successMessage.value = response.data.message;
        showSuccess.value = true;
        fetchApplications();

        setTimeout(() => {
          showSuccess.value = false;
        }, 5000);
      } catch (error) {
        handleError(error, 'Error rejecting application');
      }
    };

    const handleError = (error, defaultMessage) => {
      console.error('Error:', error);
      if (error.response && error.response.status === 400) {
        errorMessage.value = error.response.data.message || defaultMessage;
      } else {
        errorMessage.value = `${defaultMessage}: ${error.message}`;
      }
      showError.value = true;
      
      setTimeout(() => {
        showError.value = false;
      }, 5000);
    };

    const displayedPages = computed(() => {
      const current = pagination.value.current_page;
      const last = pagination.value.last_page;
      const range = [];

      if (last <= 7) {
        for (let i = 1; i <= last; i++) {
          range.push(i);
        }
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) {
            range.push(i);
          }
          range.push('...', last);
        } else if (current >= last - 3) {
          range.push(1, '...');
          for (let i = last - 4; i <= last; i++) {
            range.push(i);
          }
        } else {
          range.push(1, '...');
          for (let i = current - 1; i <= current + 1; i++) {
            range.push(i);
          }
          range.push('...', last);
        }
      }

      return range;
    });

    onMounted(() => {
      fetchApplications();
    });

    return {
      applications,
      pagination,
      showSuccess,
      showError,
      successMessage,
      errorMessage,
      fetchApplications,
      viewCV,
      acceptApplication,
      rejectApplication,
      displayedPages,  // Make sure this line is included
      searchTerm,
      searchApplications,
      filteredApplications,
    };
  },
});
</script>

<style scoped>
.card-columns {
  column-count: 3;
}
@media (max-width: 768px) {
  .card-columns {
    column-count: 1;
  }
}
.pagination {
  justify-content: center;
}

.search-container {
  max-width: 300px;
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
