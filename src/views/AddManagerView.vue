<template>
    <div class="add-manager-view">
        <button @click="goBack" class="btn btn-secondary mb-4 back-button ms-5">
          <span class="material-icons">arrow_back</span> Back
        </button>
        <div class="add-forms-container">
          <div class="form-wrapper">
            <AddManagerComponent />
          </div>
          <div class="form-wrapper">
            <AddSupervisorComponent />
          </div>
        </div>
    </div>
</template>

<script>
import AddManagerComponent from '@/components/AddManagerComponent.vue';
import AddSupervisorComponent from '@/components/AddSupervisorComponent.vue';

export default {
    name: 'AddFormsView',
    components: {
        AddManagerComponent,
        AddSupervisorComponent
    },
    methods: {
        goBack() {
            this.$router.push('/dashboard');
        }
    }
};
</script>

<style scoped>
.add-manager-view {
    width: 100%;
    padding: 1rem;
}

.back-button {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 2rem;
}

.add-forms-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 2rem;
    width: 100%;
}

.form-wrapper {
    flex: 1;
    max-width: 600px;
    padding: 1.5rem;
    border: 1px solid #5c7bd1;
    border-radius: 8px;
    background-color: #8093a9;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 991.98px) {
    .add-forms-container {
        flex-direction: column;
        align-items: center;
    }

    .form-wrapper {
        width: 100%;
        margin-bottom: 2rem;
    }
}
</style>

 

  