<template>
    <div class="container mt-4">
      <h2 class="text-center">Student Applications</h2>
  
      <!-- Cards for Applications -->
      <div class="row">
        <div class="col-md-12" v-if="filteredApplications.length">
          <div class="card mb-3" v-for="application in filteredApplications" :key="application.id">
            <div class="card-body d-flex flex-column justify-content-between">
              <!-- Headers and Data -->
              <div class="row text-center">
                <div class="col-12 col-md-4">
                  <strong>Name</strong>
                  <div>{{ application.name }}</div>
                </div>
                <div class="col-12 col-md-4">
                  <strong>Email</strong>
                  <div>{{ application.email }}</div>
                </div>
                <div class="col-12 col-md-4">
                  <strong>Phone</strong>
                  <div>{{ application.phone }}</div>
                </div>
              </div>
  
              <!-- Action Buttons with Same Width -->
              <div class="d-flex justify-content-center mt-3 gap-3 flex-column flex-md-row">
                <a :href="application.attachment" target="_blank" class="btn btn-primary btn-equal">View Attachment</a>
                <button
                  class="btn btn-success btn-equal"
                  @click="acceptApplication(application.id)"
                  :disabled="application.accepted"
                >
                  {{ application.accepted ? 'Accepted' : 'Accept' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <p v-else>No applications found.</p>
      </div>
  
      <!-- Pagination -->
      <nav v-if="pagination.links && pagination.links.length > 3">
        <ul class="pagination justify-content-center">
          <li
            v-for="link in pagination.links"
            :key="link.label"
            :class="['page-item', { active: link.active, disabled: !link.url }]"
          >
            <a
              class="page-link"
              href="#"
              @click.prevent="link.url && fetchApplications(link.url)"
              v-html="link.label"
            ></a>
          </li>
        </ul>
      </nav>
  
      <!-- Popup Components for Success and Error Messages -->
      <ErrorPopup v-if="errorMessage" :message="errorMessage" @close="clearErrorMessage" />
      <SuccessPop v-if="showSuccessPopup" :message="successMessage" @close="clearSuccessMessage" />
    </div>
  </template>
  
  
  
  
  <script>
// Import ErrorPopup and SuccessPop components
import ErrorPopup from '../components/ErrorPopup.vue';
import SuccessPop from '../components/SuccessPopup.vue';

export default {
  components: {
    ErrorPopup,
    SuccessPop,
  },
  data() {
    return {
      applications: [],
      pagination: {},
      errorMessage: '', // Holds error message for ErrorPopup
      successMessage: '', // Holds success message for SuccessPop
      showSuccessPopup: false,
    };
  },
  computed: {
    filteredApplications() {
      return this.applications.filter((application) => application.accepted === 0);
    },
  },
  mounted() {
    this.fetchApplications('http://192.168.15.156:8080/api/applications');
  },
  methods: {
    // Fetch applications from the API
    async fetchApplications(url) {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error('No access token found');
          return;
        }

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`HTTP error! status: ${response.status} - ${errorBody}`);
        }

        const data = await response.json();
        this.applications = data.data;
        this.pagination = data;
      } catch (error) {
        this.errorMessage = `Error fetching applications: ${error.message}`;
        console.error('Error:', error);
      }
    },

    // Accept application and handle response with SuccessPop and ErrorPopup
    async acceptApplication(applicationId) {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          this.errorMessage = 'No access token found. Please log in again.';
          return;
        }

        const response = await fetch(`http://192.168.15.156:8080/api/accept-application/${applicationId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
        }

        // Set success message from the response and show the popup
        this.successMessage = responseData.message || 'Application accepted successfully';
        this.showSuccessPopup = true;

        // Update the accepted status of the application in local state
        this.applications = this.applications.map((app) =>
          app.id === applicationId ? { ...app, accepted: 1 } : app
        );

        // Refresh the applications list after a short delay
        setTimeout(async () => {
          await this.fetchApplications('http://192.168.15.156:8080/api/applications');
          this.showSuccessPopup = false;
        }, 2000); // Hide popup and refresh after 2 seconds
      } catch (error) {
        this.errorMessage = `Error accepting application: ${error.message}`;
        console.error('Error accepting application:', error);
      }
    },

    clearErrorMessage() {
      this.errorMessage = '';
    },

    clearSuccessMessage() {
      this.showSuccessPopup = false;
    },
  },
};
</script>

  
<style scoped>
/* Ensure container adjusts well for mobile devices */
.container {
  margin-top: 20px;
}

/* Button equal size */
.btn-equal {
  min-width: 150px; /* Same min-width for both buttons */
  text-align: center;
}

/* On small screens, make buttons stack vertically with same width */
@media (max-width: 767.98px) {
  .btn {
    width: 100%;
  }

  .btn-equal + .btn-equal {
    margin-top: 10px;
  }
}

/* For better alignment on all screen sizes */
.row.text-center > .col-12 {
  margin-bottom: 10px;
}
</style>
