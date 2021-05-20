import axios from 'axios';
// https://just-ask-it.herokuapp.com/api/v1/
// http://localhost:7000/api/v1/
const instance = axios.create({
  baseURL: 'https://just-ask-it.herokuapp.com/api/v1/',
  withCredentials: true,
});

export default instance;
