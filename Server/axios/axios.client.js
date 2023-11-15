import axios from 'axios';

// Create an instance of axios with default properties
const axiosClient = axios.create({
  headers: {
    Accept: 'application/json',
    'Accept-Encoding': 'identity'
  }
});

export default axiosClient;
