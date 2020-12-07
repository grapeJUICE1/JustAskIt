import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:7000/api/v1/answers',
});

export default instance;
