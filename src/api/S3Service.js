// src/services/MasterRoleService.js

import axiosInstance from '@/api/index';

// Function to get all active outlets
export const getAll = async (params) => {
  try {
    const response = await axiosInstance.get('/sio', {
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to get a single outlet by ID
export const getById = async (id) => {
  try {
    const response = await axiosInstance.get(`/sio/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to create
export const uploadImageS3 = async (data) => {
  try {
    const response = await axiosInstance.post('/images/upload', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to update
export const updateData = async (id, data) => {
  try {
    const response = await axiosInstance.post(`/sio/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to delete
export const deleteImageS3 = async (key) => {
  try {
    const response = await axiosInstance.delete(`/images/delete`, {
      data : {
        key: key
      }
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
