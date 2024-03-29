import axios from 'axios';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';

export function getAPIClient(ctx?: NextPageContext) {
  const { token: token } = parseCookies(ctx);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  api.interceptors.request.use((config) => {
    return config;
  });

  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  return api;
}
