<template>
            <Header title="Quizela✨" />

    <div class="add-manager-view">
        <button @click="goBack" class="btn btn-secondary mb-4 back-button ms-5">
          <span class="material-icons">arrow_back</span> Back
        </button>
        <div class="add-forms-container">
          <div class="form-wrapper">
            <AddManagerComponent />
          </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/HeaderComponent.vue';
import AddManagerComponent from '@/components/AddStaffComponent.vue';

export default {
    name: 'AddFormsView',
    components: {
        AddManagerComponent,
        Header
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
    margin-top: 5%;
}

.back-button {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 2rem;
}

.add-forms-container {
    display: flex;
    justify-content: center;
    width: 100%;
}

.form-wrapper {
    flex: 1;
    max-width: 600px;
    padding: 1.5rem;
    background-color: #266084cb;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

@media (max-width: 991.98px) {
    .form-wrapper {
        width: 100%;
    }
}
</style>

 

  