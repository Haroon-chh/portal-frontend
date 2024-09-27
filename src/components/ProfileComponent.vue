<template>
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle profile-circle rounded-5" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
        {{ userInitials }}
      </button>
      <ul class="dropdown-menu" aria-labelledby="profileDropdown">
        <li><a class="dropdown-item" href="#" @click.prevent="goToProfile">Profile</a></li>
        <li><a class="dropdown-item" href="#" @click.prevent="goToChangePassword">Change Password</a></li>
      </ul>
    </div>
  </template>
  
  <script>
  import { computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const store = useStore();
      const router = useRouter();
  
      const fetchUserProfile = async () => {
        try {
          const accessToken = localStorage.getItem('access_token');
          if (!accessToken) {
            console.error('No access token found');
            return;
          }
  
          const response = await fetch('http://192.168.15.156:8080/api/profile', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            }
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          if (data.message === 'success') {
            store.dispatch('setLoggedUserData', data.data);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
  
      onMounted(fetchUserProfile);
  
      const userInitials = computed(() => {
        const loggedUser = store.getters.getLoggedUser;
        if (loggedUser && loggedUser.name) {
          return loggedUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
        }
        return '';
      });
  
      const goToProfile = () => {
        router.push('/profile');
      };
  
      const goToChangePassword = () => {
        router.push('/change-password');
      };
  
      return {
        userInitials,
        goToProfile,
        goToChangePassword,
      };
    }
  };
  </script>
  
  <style scoped>
  .profile-circle {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    background-color: white;
    color: black;
    border: none;
  }
  </style>