import axios from "axios";

export const instanceMiddleware = axios.create({
    baseURL: 'https://localhost:7120/api'
})

export const instanceMiddlewareApi = axios.create({
    baseURL: '/api'
})