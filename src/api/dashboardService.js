
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
