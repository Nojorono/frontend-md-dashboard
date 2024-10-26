// src/services/MasterRoleService.js

import axiosInstance from '@/api/index';

// Function to get all active outlets
export const getAll = async (page = 1, limit = 10, searchTerm = '') => {
  try {
    const response = await axiosInstance.get('/roles', {
      params: { page, limit, searchTerm },
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAllList = async () => {
  try {
    const response = await axiosInstance.get('/roles');
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to get a single outlet by ID
export const getById = async (id) => {
  try {
    const response = await axiosInstance.get(`/roles/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to create
export const createData = async (data) => {
  try {
    const response = await axiosInstance.post('/roles', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to update
export const updateData = async (id, data) => {
  try {
    const response = await axiosInstance.post(`/roles/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to delete
export const deleteData = async (id) => {
  try {
    const response = await axiosInstance.delete(`/roles/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
