<template>
    <div class="container mt-4">
      <h2>Student Applications</h2>
  
      <!-- Cards for Applications -->
      <div class="row">
        <div class="col-md-12" v-if="filteredApplications.length">
          <div class="card mb-3" v-for="application in filteredApplications" :key="application.id">
            <div class="card-body d-flex flex-column justify-content-between">
              <!-- Headers in one line -->
              <div class="d-flex justify-content-between">
                <div class="flex-grow-1 text-center"><strong>Name</strong></div>
                <div class="flex-grow-1 text-center"><strong>Email</strong></div>
                <div class="flex-grow-1 text-center"><strong>Phone</strong></div>
              </div>
  
              <!-- Data aligned below headers -->
              <div class="d-flex justify-content-between mt-2">
                <div class="flex-grow-1 text-center">{{ application.name }}</div>
                <div class="flex-grow-1 text-center">{{ application.email }}</div>
                <div class="flex-grow-1 text-center">{{ application.phone }}</div>
              </div>
  
              <!-- Action Buttons in the center at the bottom -->
              <div class="d-flex justify-content-center mt-3 gap-3">
                <a :href="application.attachment" target="_blank" class="btn btn-primary mr-2">View Attachment</a>
                <button
                  class="btn btn-success"
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
  /* Additional styling remains unchanged */
  </style>
