<template>
  <div class="add-manager-view">
    <AddManagerComponent />
  </div>
</template>

<script>
import AddManagerComponent from '@/components/AddManagerComponent.vue';

export default {
  name: 'AddManagerView',
  components: {
    AddManagerComponent
  }
};
</script>

<style scoped>
.add-manager-view {
        margin-top: 10%;
    }
  /* Add any specific styling for the view if needed */

</style>

