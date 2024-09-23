import Vue from 'vue';
import axios from "axios";
import VueAxios from "vue-axios";

const baseURL = 'http://localhost:3000';

const ApiServices = {
  init() {
    Vue.use(VueAxios, axios);
    axios.defaults.baseURL = baseURL;
    axios.defaults.headers.common["Content-Type"] = "application/json";
  },

  async GetRequest(url) {
    try {
      const response = await axios({
        method: "GET",
        url: url,
        headers: { Authorization: "Bearer " + localStorage.getItem("jwtToken") }
      });
      return response.data; // Return the response data directly
    } catch (error) {
      console.error('GET request failed:', error);
      throw new Error('Error fetching data.'); // Throw an error to be handled in the calling function
    }
  },

  async PostRequest(url, data) {
    try {
      const response = await axios({
        method: "POST",
        url: url,
        data: data, // Include the data in the request
        headers: { Authorization: "Bearer " + localStorage.getItem("jwtToken") }
      });
      return response.data; // Return the response data directly
    } catch (error) {
      console.error('POST request failed:', error);
      throw new Error('Error posting data.'); // Throw an error to be handled in the calling function
    }
  }
};

export default ApiServices;
