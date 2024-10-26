// Auth Management Service
import axiosInstance from '@/api/index';

export const Login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  }catch(error) {
    return error.response
  }
};

export const validateToken = async (token) => {
  try {
    const response = await axiosInstance.post('/auth/validate-token', {
      token
    });
    return response.data;
  }catch(error) {
    return error.response
  }
};

export const getUsers = async () => {
  const response = await axiosInstance.get('/users');
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axiosInstance.post('/users', userData);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await axiosInstance.put(`/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  await axiosInstance.delete(`/users/${userId}`);
};
