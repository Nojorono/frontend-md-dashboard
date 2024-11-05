// src/services/MasterRoleService.js

import axiosInstance from '@/api/index';

// Function to get all active outlets
export const getAll = async (params) => {
  try {
    const response = await axiosInstance.get('/call-plan', {
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
    const response = await axiosInstance.get(`/call-plan/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to create
export const createData = async (data) => {
  try {
    const response = await axiosInstance.post('/call-plan', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to update
export const updateData = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/call-plan/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to delete
export const deleteData = async (id) => {
  try {
    const response = await axiosInstance.delete(`/call-plan/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const geListSchedule = async (id, { page, limit, searchTerm }) => {
  try {
    console.log(id, { page, limit, searchTerm })
    const response = await axiosInstance.get(`/call-plan/schedule/${id}`, {
      params: { page, limit, searchTerm },
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const createScheduleData = async (data) => {
  try {
    const response = await axiosInstance.post('/call-plan/schedule', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to update
export const updateScheduleData = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/call-plan/schedule/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to delete
export const deleteScheduleData = async (id) => {
  try {
    const response = await axiosInstance.delete(`/call-plan/schedule/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
