<template>
  <div v-if="!hideSidebar">
      <Sidebar />
    </div>

    <div :class="{ 'main-content': !hideSidebar }">
      <router-view></router-view>
    </div>
</template>

<script>
import Sidebar from '@/components/SidebarComponent.vue';
export default {
  name: 'App',
  components: {
    Sidebar
  },
  computed: {
    hideSidebar() {
      // Check the current route and hide sidebar on Login or Signup
      const routeName = this.$route.name;
      return routeName === 'login' || routeName === 'registration';
    },
  },
};

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
