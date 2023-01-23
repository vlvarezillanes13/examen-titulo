import axios from "axios";

export const instanceAxiosApi = axios.create({
  baseURL: "https://localhost:7120/api",
});



export const instanceAxiosPropia = axios.create({
    baseURL: "http://localhost:3000/api",
  });