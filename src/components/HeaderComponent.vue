<template>
    <div class="headerr">
      <div class="header-content">
        <h1>{{ title }}</h1>
        <ProfileComponent class="profile-component" />
      </div>
    </div>
  </template>

  <script>
  import ProfileComponent from './ProfileComponent.vue';

  export default {
    name: 'HeaderComponent',
    components: {
      ProfileComponent
    },
    props: {
      title: {
        type: String,
        required: true, // Makes sure that the title prop is provided
      }
    }
  };
  </script>

  <style scoped>
  .headerr {
    width: 100%;
    height: 10%;
    background-color: #074972df;
    display: block;
    margin: 0;
    position: fixed;
    top: 0;
    overflow: hidden;
    padding: 5px;
    z-index: 2;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 20px;
  }

  h1 {
    text-align: center;
    color: rgb(232, 243, 233);
    margin: 0;
    flex-grow: 1;
  }

  .profile-component {
    margin-left: 20px;
  }

  @media (max-width: 815px) {
    .headerr {
      width: 95%;
    }

    .header-content {
      flex-direction: column;
      justify-content: center;
    }

    h1 {
      margin-bottom: 10px;
    }

    .profile-component {
      margin-left: 0;
      margin-top: 10px;
    }
  }
  </style>
