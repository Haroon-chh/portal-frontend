<template>
    <div class="container mt-4">
      <h2 class="text-center">Students List</h2>
  
      <!-- Cards for Students -->
      <div class="row">
        <div class="col-md-12" v-if="filteredStudents.length">
          <div class="card mb-3" v-for="student in filteredStudents" :key="student.id">
            <div class="card-body d-flex flex-column justify-content-between">
              <!-- Student Data -->
              <div class="row text-center">
                <div class="col-12 col-md-4">
                  <strong>Name</strong>
                  <div>{{ student.name }}</div>
                </div>
                <div class="col-12 col-md-4">
                  <strong>Email</strong>
                  <div>{{ student.email }}</div>
                </div>
                <div class="col-12 col-md-4">
                  <strong>Phone</strong>
                  <div>{{ student.phone }}</div>
                </div>
              </div>
  
              <!-- Action Button to View Results -->
              <div class="d-flex justify-content-center mt-3">
                <button
                  class="btn btn-primary"
                  @click="viewResults(student.id)"
                >
                  View Results
                </button>
              </div>
            </div>
          </div>
        </div>
        <p v-else>No students found.</p>
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
              @click.prevent="link.url && fetchStudents(link.url)"
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
        students: [],
        pagination: {},
        errorMessage: '',
        successMessage: '',
        showSuccessPopup: false,
      };
    },
    computed: {
      filteredStudents() {
        return this.students; // You can apply any filtering if needed
      },
    },
    mounted() {
      this.fetchStudents('https://28f0-139-135-54-19.ngrok-free.app/api/students');
    },
    methods: {
      // Fetch students from the API
      async fetchStudents(url) {
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
          this.students = data.data;
          this.pagination = data;
        } catch (error) {
          this.errorMessage = `Error fetching students: ${error.message}`;
          console.error('Error:', error);
        }
      },
  
      // Navigate to view results for the selected student
      viewResults(studentId) {
        // Logic to view results, e.g., routing or fetching student results
        console.log(`Viewing results for student ID: ${studentId}`);
        // You can navigate to another route or open a modal to show results
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
  
  /* On small screens, make buttons stack vertically with same width */
  @media (max-width: 767.98px) {
    .btn {
      width: 100%;
    }
  }
  
  /* For better alignment on all screen sizes */
  .row.text-center > .col-12 {
    margin-bottom: 10px;
  }
  </style>
  