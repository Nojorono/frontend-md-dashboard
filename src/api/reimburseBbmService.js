import axiosInstance from '@/api/index';

export const getAll = async (params) => {
  try {
    const response = await axiosInstance.get('/reimburse-bbm', {
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
    const response = await axiosInstance.get(`/reimburse-bbm/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to create
export const createData = async (data) => {
  try {
    const response = await axiosInstance.post('/reimburse-bbm', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to update
export const updateData = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/reimburse-bbm/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateStatus = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/reimburse-bbm/status/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to delete
export const deleteData = async (id) => {
  try {
    const response = await axiosInstance.delete(`/reimburse-bbm/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
