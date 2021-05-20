import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://intense-peak-92208.herokuapp.com/api/v1/',
  withCredentials: true,
});

export default instance;
