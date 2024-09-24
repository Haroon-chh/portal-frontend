<template>
    <div class="headerr">
      <h1>{{ title }}</h1>
      <!-- Add any additional components or dashboard content here -->
    </div>
  </template>
  
  <script>
  export default {
    name: 'HeaderComponent',
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
    background-color: #218837df;
    display: block;
    margin: 0;
    position: fixed;
    top: 0;
    overflow: hidden;
    padding: 5px;
    z-index: 2;
  }
  @media (max-width: 815px) {
    .headerr{
        width: 95%;
    }
    h1{
        margin: auto;
        position: relative;
        top: 15%;
    }
  }


  
  h1 {
    text-align: center;
    color: rgb(232, 243, 233);
  }
  </style>
  