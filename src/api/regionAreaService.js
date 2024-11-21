// src/services/MasterRoleService.js

import axiosInstance from '@/api/index';

// Function to get all active outlets
export const getAll = async (params) => {
  try {
    const response = await axiosInstance.get('/region', {
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAllChildData = async (id) => {
  try {
    const response = await axiosInstance.get(`/area/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAllList = async () => {
  try {
    const response = await axiosInstance.get('/region');
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const findLast = async () => {
  try {
    const response = await axiosInstance.get('/region/find-last');
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to get a single outlet by ID
export const getById = async (id) => {
  try {
    const response = await axiosInstance.get(`/region/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to create
export const createData = async (data) => {
  try {
    const response = await axiosInstance.post('/region', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const createChildData = async (data) => {
  try {
    const response = await axiosInstance.post('/area', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to update
export const updateData = async (id, data) => {
  try {
    const response = await axiosInstance.post(`/region/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateChildData = async (id, data) => {
  try {
    const response = await axiosInstance.post(`/area/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to delete
export const deleteData = async (id) => {
  console.log(id)
  try {
    const response = await axiosInstance.delete(`/region/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const deleteChildData = async (id) => {
  console.log(id)
  try {
    const response = await axiosInstance.delete(`/area/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
