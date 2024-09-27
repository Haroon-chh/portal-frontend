import Vue from 'vue';
import axios from "axios";
import VueAxios from "vue-axios";

const baseURL = 'https://28f0-139-135-54-19.ngrok-free.app/api';

const ApiServices = {
  init() {
    Vue.use(VueAxios, axios);
    axios.defaults.baseURL = baseURL;
    axios.defaults.headers.common["Content-Type"] = "application/json";
  },

  async GetRequest(endpoint, params) {
    try {
      const response = await axios.get(`${baseURL}${endpoint}`, { params });
      return response.data;
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  },

  async PostRequest(endpoint, data) {
    try {
      const response = await axios.post(`${baseURL}${endpoint}`, data, {
        headers: { 
          "Content-Type": "multipart/form-data",
        }
      });
      return response.data;  // Return just the response data
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  }
};

export default ApiServices;
