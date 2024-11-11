// src/services/MasterRoleService.js

import axiosInstance from '@/api/index';

// Function to get all pagination
export const getAll = async (params) => {
  try {
    const response = await axiosInstance.get('/user', {
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to get all pagination
// Function to get roles with optional region and area filtering
export const getAllRole = async (region, area) => {
  // Construct params object based on the presence of region and area
  const params = {};
  params.region = region
  params.area = area

  try {
    const response = await axiosInstance.get('/user/get-md', {
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to get by ID
export const getById = async (id) => {
  try {
    const response = await axiosInstance.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to create
export const createData = async (data) => {
  try {
    const response = await axiosInstance.post('/user', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to update
export const updateData = async (id, data) => {
  try {
    const response = await axiosInstance.post(`/user/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to delete
export const deleteData = async (id) => {
  try {
    const response = await axiosInstance.delete(`/user/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
