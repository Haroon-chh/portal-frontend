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
  @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

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
    z-index: 10;
  }

  .header-content {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 20px;
  }

  h1 {
    font-family: 'Pacifico', cursive;  /* Added Pacifico font */
    text-align: center;
    color: rgb(232, 243, 233);
    margin: 0;
    flex-grow: 1;
    margin-left: 7%;
  }

  .profile-component {
    margin-left: 20px;
  }

  @media (max-width: 815px) {
    .headerr {
      width: 95%;
    }

    .header-content {
      justify-content: center;
      align-items: center;
      vertical-align: middle;
    }


    .profile-component {
      margin-left: 0;
      margin-top: 10px;
      position: absolute;
      right: 5%;
      overflow: visible;
    }
  }
  </style>
