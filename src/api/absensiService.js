// src/services/MasterRoleService.js

import axiosInstance from '@/api/index';

export const getAll = async (params) => {
  try {
    const response = await axiosInstance.get('/absensi', {
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
    const response = await axiosInstance.get(`/absensi/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to create
export const createData = async (data) => {
  try {
    const response = await axiosInstance.post('/absensi', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to update
export const updateData = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/absensi/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateStatus = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/absensi/status/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to delete
export const deleteData = async (id) => {
  try {
    const response = await axiosInstance.delete(`/absensi/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
