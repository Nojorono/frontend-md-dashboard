
import axiosInstance from "@/api/index";


export const getDashboardBatchTarget = async (codeBatch) => {
  try {
    const response = await axiosInstance.get(`/dashboard/batch-target`, {
      params: {
        code_batch: codeBatch
      }
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAllOutletByFilter = async (params) => {
  try {
    const response = await axiosInstance.get('/dashboard/outlet', {
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAllRegion = async () => {
  try {
    const response = await axiosInstance.get(`/region/all`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAllArea = async () => {
  try {
    const response = await axiosInstance.get('/area/all');
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAllComponent = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/all-component');
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getTimeMotion = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/time-motion');
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getOutletDistribution = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/outlet-distribution');
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
