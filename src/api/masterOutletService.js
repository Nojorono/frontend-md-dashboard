// src/services/MasterOutletService.js

import axiosInstance from '@/api/index';

// Function to get all active outlets
export const getAllOutlets = async (params) => {
  try {
    const response = await axiosInstance.get('/outlets', {
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAllOutletSurvey = async () => {
  try {
    const response = await axiosInstance.get('/outlets/survey-list');
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to get a single outlet by ID
export const getOutletById = async (id) => {
  try {
    const response = await axiosInstance.get(`/outlets/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to get a area
export const getOutletArea = async () => {
  try {
    const response = await axiosInstance.get(`/outlets/area`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to get a Region
export const getOutletRegion = async () => {
  try {
    const response = await axiosInstance.get(`/outlets/region`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to get a area
export const getOutletSio = async () => {
  try {
    const response = await axiosInstance.get(`/outlets/sio`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to get a area
export const getOutletByType = async () => {
  try {
    const response = await axiosInstance.get(`/outlets/list-by`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to create a new outlet
export const createOutlet = async (outletData) => {
  try {
    const response = await axiosInstance.post('/outlets', outletData);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to update an existing outlet
export const updateOutlet = async (id, outletData) => {
  try {
    const response = await axiosInstance.put(`/outlets/${id}`, outletData);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateOutletStatus = async (id, outletData) => {
  try {
    const response = await axiosInstance.put(`/outlets/${id}/status`, outletData);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to delete an outlet by ID
export const deleteOutlet = async (id) => {
  try {
    const response = await axiosInstance.delete(`/outlets/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const uploadOutlet = async (fileData) => {
  const { file, fileType } = fileData;
  const formData = new FormData();
  formData.append('file', file);

  let endpoint;
  if (fileType === 'excel') {
    endpoint = '/outlets/excel';
  } else if (fileType === 'csv') {
    endpoint = '/outlets/csv';
  } else {
    throw new Error('Unsupported file type');
  }

  try {
    const response = await axiosInstance.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
