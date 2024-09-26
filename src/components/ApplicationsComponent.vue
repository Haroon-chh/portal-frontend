<template>
    <div class="container mt-4">
      <h2>Student Applications</h2>
  
      <!-- Table of Applications -->
      <table class="table table-bordered mt-3" v-if="applications.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Attachment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="application in filteredApplications" :key="application.id">
            <td>{{ application.id }}</td>
            <td>{{ application.name }}</td>
            <td>{{ application.email }}</td>
            <td>{{ application.phone }}</td>
            <td><a :href="application.attachment" target="_blank">View Attachment</a></td>
            <td>
              <button 
                class="btn btn-success" 
                @click="acceptApplication(application.id)" 
                :disabled="application.accepted"
              >
                Accept
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <p v-else>No applications found.</p>
  
      <!-- Pagination -->
      <nav v-if="pagination.links && pagination.links.length > 3">
        <ul class="pagination justify-content-center">
          <li v-for="link in pagination.links" 
              :key="link.label" 
              :class="['page-item', { active: link.active, disabled: !link.url }]">
            <a class="page-link" 
               href="#" 
               @click.prevent="link.url && fetchApplications(link.url)" 
               v-html="link.label"></a>
          </li>
        </ul>
      </nav>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        applications: [], // Holds all applications
        pagination: {},   // Holds pagination data
      };
    },
    computed: {
      // Filter applications where accepted is 0
      filteredApplications() {
        return this.applications.filter(application => application.accepted === 0);
      }
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

          console.log('Fetching applications from:', url);
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            }
          });

          if (!response.ok) {
            const errorBody = await response.text();
            console.error('Response not OK. Status:', response.status, 'Body:', errorBody);
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log('Received data:', data);
          this.applications = data.data;       // Store application data
          this.pagination = data;              // Store pagination data

          console.log('Fetched applications:', this.applications);
          console.log('Pagination data:', this.pagination);
        } catch (error) {
          console.error('Error fetching applications:', error);
          if (error.response) {
            console.error('Response:', await error.response.text());
          }
        }
      },
      // Accept application
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
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          // Update the accepted status of the application in local state
          this.applications = this.applications.map(app =>
            app.id === applicationId ? { ...app, accepted: 1 } : app
          );
        } catch (error) {
          console.error('Error accepting application:', error);
          // Handle error, e.g., show an error message to the user
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    margin-top: 20px;
  }
  </style>
