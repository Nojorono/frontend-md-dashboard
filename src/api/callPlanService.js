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

export const geListSchedule = async (id, { page, limit, searchTerm, userId }) => {
  try {
    const response = await axiosInstance.get(`/schedule-plan/${id}`, {
      params: { page, limit, searchTerm, userId },
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const createScheduleData = async (data) => {
  try {
    const response = await axiosInstance.post('/schedule-plan', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to update
export const updateScheduleData = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/schedule-plan/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to delete
export const deleteScheduleData = async (id) => {
  try {
    const response = await axiosInstance.delete(`/schedule-plan/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const importScheduleData = async (fileData) => {
  try {
    const { file, call_plan_id } = fileData;
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post(`/schedule-plan/import-schedule/${call_plan_id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};