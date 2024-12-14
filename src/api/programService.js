import axiosInstance from '@/api/index';

export const getAll = async (params) => {
  try {
    const response = await axiosInstance.get('/program', {
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAllProgram = async () => {
  try {
    const response = await axiosInstance.get('/program/all');
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to get a single outlet by ID
export const getById = async (id) => {
  try {
    const response = await axiosInstance.get(`/program/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to create
export const createData = async (data) => {
  try {
    const response = await axiosInstance.post('/program', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to update
export const updateData = async (id, data) => {
  try {
    const response = await axiosInstance.post(`/program/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to delete
export const deleteData = async (id) => {
  try {
    const response = await axiosInstance.delete(`/program/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
