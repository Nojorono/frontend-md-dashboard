// src/services/MasterRoleService.js

import axiosInstance from '@/api/index';

// Function to get all active outlets
export const getAll = async (params) => {
  try {
    const response = await axiosInstance.get('/batch', {
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAllTarget = async (batchId) => {
  try {
    const response = await axiosInstance.get(`/batch-target/${batchId}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAllList = async () => {
  try {
    const response = await axiosInstance.get('/batch');
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const findLast = async () => {
  try {
    const response = await axiosInstance.get('/batch/find-last');
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to get a single outlet by ID
export const getById = async (id) => {
  try {
    const response = await axiosInstance.get(`/batch/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to create
export const createData = async (data) => {
  try {
    const response = await axiosInstance.post('/batch', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to update
export const updateData = async (id, data) => {
  try {
    const response = await axiosInstance.post(`/batch/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to delete
export const deleteData = async (id) => {
  console.log(id)
  try {
    const response = await axiosInstance.delete(`/batch/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
