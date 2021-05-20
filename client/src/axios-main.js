import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://just-ask-it.herokuapp.com/api/v1/',
  withCredentials: true,
});

export default instance;
