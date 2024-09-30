<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header" @click="toggleDropdown">
        <h2 class="mb-0 d-flex justify-content-between align-items-center">
          <span>
            <span class="material-icons">assignment</span> Assigned Quizzes
          </span>
          <span class="material-icons">{{ isExpanded ? 'expand_less' : 'expand_more' }}</span>
        </h2>
      </div>
      
      <div v-if="isExpanded" class="card-body">
        <div v-if="loading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else>
          <div v-for="(quizGroup, index) in groupedAssignedQuizzes" :key="index" class="mb-4">
            <div class="card">
              <div class="card-header" @click="toggleGroup(index)">
                <h5 class="mb-0 d-flex justify-content-between align-items-center">
                  {{ quizGroup.title }}
                  <span class="material-icons">{{ quizGroup.expanded ? 'expand_less' : 'expand_more' }}</span>
                </h5>
              </div>
              <div v-if="quizGroup.expanded" class="card-body">
                <div v-for="assignment in quizGroup.assignments" :key="assignment.id" class="mb-3 p-3 border rounded d-flex flex-column align-items-start">
                  <h6>Assigned to: {{ getStudentName(assignment.assigned_to) }}</h6>
                  <p class="mb-1">Duration: {{ assignment.duration }} minutes</p>
                  <p class="mb-1">Scheduled: {{ formatDate(assignment.scheduled_at) }}</p>
                  <p class="mb-1">Deadline: {{ formatDate(assignment.deadline_at) }}</p>
                  <p class="mb-1">
                    Status: 
                    <span :class="getStatusClass(assignment)">
                      {{ getStatus(assignment) }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ErrorPopupComponent :show="showError" :message="errorMessage" @close="closeErrorPopup" />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';
import moment from 'moment';
import ErrorPopupComponent from './ErrorPopup.vue';

export default {
  name: 'AssignedQuizAdminComponent',
  components: {
    ErrorPopupComponent,
  },
  setup() {
    const assignedQuizzes = ref([]);
    const students = ref({});
    const quizzes = ref({});
    const loading = ref(true);
    const expandedGroups = ref({});
    const isExpanded = ref(false);
    const showError = ref(false);
    const errorMessage = ref('');

    const toggleDropdown = () => {
      isExpanded.value = !isExpanded.value;
      if (isExpanded.value && assignedQuizzes.value.length === 0) {
        fetchData();
      }
    };

    const fetchData = async () => {
      loading.value = true;
      try {
        await Promise.all([fetchAssignedQuizzes(), fetchStudents(), fetchQuizzes()]);
      } catch (error) {
        console.error('Error fetching data:', error);
        showError.value = true;
        errorMessage.value = 'Failed to fetch data. Please try again later.';
      } finally {
        loading.value = false;
      }
    };

    const fetchAssignedQuizzes = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/assigned-quizzes`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        assignedQuizzes.value = response.data.data;
      } catch (error) {
        console.error('Error fetching assigned quizzes:', error);
        showError.value = true;
        errorMessage.value = 'Failed to fetch assigned quizzes. Please try again later.';
        setTimeout(() => {
          showError.value = false;
          errorMessage.value = '';
        }, 5000);
        throw error;
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/students`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        students.value = response.data.data.reduce((acc, student) => {
          acc[student.id] = student.name;
          return acc;
        }, {});
      } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
      }
    };

    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/quizzes`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        quizzes.value = response.data.data.reduce((acc, quiz) => {
          acc[quiz.id] = quiz.title;
          return acc;
        }, {});
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        throw error;
      }
    };

    const groupedAssignedQuizzes = computed(() => {
      const grouped = {};
      assignedQuizzes.value.forEach(assignment => {
        const quizTitle = quizzes.value[assignment.quiz_id] || `Quiz ${assignment.quiz_id}`;
        if (!grouped[quizTitle]) {
          grouped[quizTitle] = {
            title: quizTitle,
            assignments: [],
            expanded: expandedGroups.value[quizTitle] || false
          };
        }
        grouped[quizTitle].assignments.push(assignment);
      });
      return Object.values(grouped);
    });

    const toggleGroup = (index) => {
      const group = groupedAssignedQuizzes.value[index];
      group.expanded = !group.expanded;
      expandedGroups.value[group.title] = group.expanded;
    };

    const getStudentName = (id) => {
      return students.value[id] || `Student ${id}`;
    };

    const formatDate = (date) => {
      return moment(date).format('MMMM D, YYYY h:mm A');
    };

    const getStatus = (assignment) => {
      const now = moment();
      const deadline = moment(assignment.deadline_at);
      if (now.isAfter(deadline)) {
        return 'Expired';
      } else if (now.isBefore(moment(assignment.scheduled_at))) {
        return 'Scheduled';
      } else {
        return 'In Progress';
      }
    };

    const getStatusClass = (assignment) => {
      const status = getStatus(assignment);
      switch (status) {
        case 'Expired':
          return 'text-danger';
        case 'Scheduled':
          return 'text-primary';
        case 'In Progress':
          return 'text-success';
        default:
          return '';
      }
    };

    const closeErrorPopup = () => {
      showError.value = false;
      errorMessage.value = '';
    };

    return {
      groupedAssignedQuizzes,
      loading,
      toggleGroup,
      getStudentName,
      formatDate,
      getStatus,
      getStatusClass,
      isExpanded,
      toggleDropdown,
      showError,
      errorMessage,
      closeErrorPopup,
    };
  },
};
</script>

<style scoped>
.card-header {
  cursor: pointer;
}

.card-header:hover {
  background-color: #f8f9fa;
}

.material-icons {
  vertical-align: middle;
  margin-right: 5px;
}
</style>