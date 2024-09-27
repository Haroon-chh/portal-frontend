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
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        applications: [],
        pagination: {},
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
            console.error('Response not OK. Status:', response.status, 'Body:', errorBody);
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          this.applications = data.data;
          this.pagination = data;
        } catch (error) {
          console.error('Error fetching applications:', error);
        }
      },
      async acceptApplication(applicationId) {
        try {
          const accessToken = localStorage.getItem('access_token');
          if (!accessToken) {
            console.error('No access token found');
            return;
          }
  
          const response = await fetch(`http://192.168.15.156:8080/api/accept-application/${applicationId}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          this.applications = this.applications.map((app) =>
            app.id === applicationId ? { ...app, accepted: 1 } : app
          );
        } catch (error) {
          console.error('Error accepting application:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .card {
    margin-bottom: 15px;
    border: 1px solid #ddd;
  }
  
  .card-body {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .d-flex {
    display: flex;
  }
  
  .justify-content-between {
    justify-content: space-between;
  }
  
  .justify-content-center {
    justify-content: center;
  }
  
  .text-center {
    text-align: center;
  }
  
  .mt-2 {
    margin-top: 0.5rem;
  }
  
  .mt-3 {
    margin-top: 1rem;
  }
  
  .flex-grow-1 {
    flex-grow: 1;
  }
  </style>
  