import axios from 'axios';
// https://just-ask-it.herokuapp.com/api/v1/
// http://localhost:7000/api/v1/
const token = localStorage.getItem('jwt');
console.log(token);
const config = {
  baseURL: 'https://just-ask-it.herokuapp.com/api/v1/',
  withCredentials: true,
  headers: {
    authorization: token ? `Bearer ${token}` : '',
  },
};
const instance = axios.create(config);

export default instance;
