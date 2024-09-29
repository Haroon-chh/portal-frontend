<template>
  <div>
    <h2 class="mb-4">Student Applications</h2>
    <div class="mb-3">
      <input v-model="searchTerm" @input="searchApplications" class="form-control" type="text" placeholder="Search applications...">
    </div>
    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    
    <div class="card-columns">
      <div v-for="application in applications" :key="application.id" class="card mb-4">
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

    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: !pagination.prev_page_url }">
          <a class="page-link" href="#" @click.prevent="fetchApplications(pagination.prev_page_url)">Previous</a>
        </li>
        <li class="page-item" v-for="link in pagination.links" :key="link.label" :class="{ active: link.active, disabled: !link.url }">
          <a class="page-link" href="#" @click.prevent="fetchApplications(link.url)" v-html="link.label"></a>
        </li>
        <li class="page-item" :class="{ disabled: !pagination.next_page_url }">
          <a class="page-link" href="#" @click.prevent="fetchApplications(pagination.next_page_url)">Next</a>
        </li>
      </ul>
    </nav>

    <AcceptPopup v-if="showSuccessPopup" :message="successMessage" @close="showSuccessPopup = false" />
    <ErrorPopup v-if="showErrorPopup" :message="errorMessage" @close="showErrorPopup = false" />
  </div>
</template>

<script>
import axios from 'axios';
import AcceptPopup from '../components/SuccessPopup.vue';
import ErrorPopup from '../components/ErrorPopup.vue';

export default {
  components: {
    AcceptPopup,
    ErrorPopup,
  },
  data() {
    return {
      applications: [],
      pagination: {},
      errorMessage: '',
      successMessage: '',
      showSuccessPopup: false,
      showErrorPopup: false,
    };
  },
  methods: {
    async fetchApplications(url = null) {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error('No access token found');
          return;
        }

        const apiUrl = url || `${process.env.VUE_APP_API_URL}/applications`;

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });

        this.applications = response.data.data.data || [];
        this.pagination = response.data.data;
      } catch (error) {
        this.errorMessage = `Error fetching applications: ${error.message}`;
        this.showErrorPopup = true;
        console.error('Error:', error);
      }
    },
    async viewCV(applicationId) {
      const application = this.applications.find(app => app.id === applicationId);
      if (application && application.attachment) {
        window.open(application.attachment, '_blank');
      }
    },
    async acceptApplication(applicationId) {
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

        this.successMessage = response.data.message;
        this.showSuccessPopup = true;
        this.fetchApplications();
      } catch (error) {
        this.errorMessage = `Error accepting application: ${error.message}`;
        this.showErrorPopup = true;
        console.error('Error:', error);
      }
    },
    async rejectApplication(applicationId) {
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

        this.successMessage = response.data.message;
        this.showSuccessPopup = true;
        this.fetchApplications();
      } catch (error) {
        this.errorMessage = `Error rejecting application: ${error.message}`;
        this.showErrorPopup = true;
        console.error('Error:', error);
      }
    },
  },
  created() {
    this.fetchApplications();
  },
};
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
</style>
