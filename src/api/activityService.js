// src/services/MasterRoleService.js

import axiosInstance from '@/api/index';

// Function to get all active outlets
export const getAllActivity = async () => {
  try {
    const response = await axiosInstance.get('/activity');
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAll = async (params) => {
  try {
    const response = await axiosInstance.get('/activity', {
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
    const response = await axiosInstance.get(`/activity/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to create
export const createData = async (data) => {
  try {
    const response = await axiosInstance.post('/activity', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to update
export const updateData = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/activity/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateStatusApproval = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/activity/status/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to delete
export const deleteData = async (id) => {
  try {
    const response = await axiosInstance.delete(`/activity/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
