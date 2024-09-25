import Vue from 'vue';
import axios from "axios";
import VueAxios from "vue-axios";

const baseURL = 'http://192.168.15.156:8080/api';

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
