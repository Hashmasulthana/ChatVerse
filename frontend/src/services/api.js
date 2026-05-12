import axios from "axios";

const API = axios.create({

  baseURL:
  "https://chatverse-q7ve.onrender.com/api",

});

export default API;