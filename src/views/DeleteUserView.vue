<template>
  <div class="delete-user-view">
    <Header title="Delete Users" />
    <div class="content">
      <div class="user-type-selector mb-4">
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="userTypeOptions" id="studentOption" value="student" v-model="selectedUserType">
          <label class="form-check-label fw-bold fs-5" for="studentOption">Students</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="userTypeOptions" id="managerOption" value="manager" v-model="selectedUserType">
          <label class="form-check-label fw-bold fs-5" for="managerOption">Managers</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="userTypeOptions" id="supervisorOption" value="supervisor" v-model="selectedUserType">
          <label class="form-check-label fw-bold fs-5" for="supervisorOption">Supervisors</label>
        </div>
      </div>

      <DeleteStudentComponent v-if="selectedUserType === 'student'" />
      <DeleteManagerComponent v-if="selectedUserType === 'manager'" />
      <DeleteSupervisorComponent v-if="selectedUserType === 'supervisor'" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Header from '@/components/HeaderComponent.vue';
import DeleteStudentComponent from '@/components/DeleteStudentComponent.vue';
import DeleteManagerComponent from '@/components/DeleteManagerComponent.vue';
import DeleteSupervisorComponent from '@/components/DeleteSupervisorComponent.vue';

export default {
  name: 'DeleteUserView',
  components: {
    Header,
    DeleteStudentComponent,
    DeleteManagerComponent,
    DeleteSupervisorComponent
  },
  setup() {
    const selectedUserType = ref('student'); // Default to student

    return {
      selectedUserType
    };
  }
}
</script>

<style scoped>
.delete-user-view {
  width: 100%;
}

.content {
  padding: 20px;
  margin-left: 2%;
  margin-top: 60px; /* Adjust based on your header height */
}

.user-type-selector {
  display: flex;
  justify-content: center;
  gap: 20px;
}

@media (max-width: 768px) {
  .content {
    margin-left: 0;
    padding: 15px;
  }

  .user-type-selector {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .content {
    margin-top: 80px;
  }
}
</style>

