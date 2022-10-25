import axios from 'axios';
//http://localhost:7000/api/v1/
//https://intense-peak-92208.herokuapp.com/api/v1/
const instance = axios.create({
  baseURL: 'https://tame-cyan-goldfish-hose.cyclic.app/api/v1/',
  withCredentials: true,
});

export default instance;
