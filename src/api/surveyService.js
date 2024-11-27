// src/services/MasterRoleService.js

import axiosInstance from '@/api/index';

// Function to get all active outlets
export const getAll = async (params) => {
  try {
    const response = await axiosInstance.get('/survey', {
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
    const response = await axiosInstance.get(`/survey/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to create
export const createData = async (data) => {
  try {
    const response = await axiosInstance.post('/survey', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to update
export const updateData = async (id, data) => {
  try {
    const response = await axiosInstance.post(`/survey/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to delete
export const deleteData = async (id) => {
  try {
    const response = await axiosInstance.delete(`/survey/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
