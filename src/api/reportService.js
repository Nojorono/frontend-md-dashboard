
import axiosInstance from "@/api/index";


export const reportActivity = async (params) => {
  try {
    const response = await axiosInstance.get(`/report/activity/`, {
      params: params,
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const reportOutlet = async (params) => {
  try {
    // Set explicit timeout to prevent timeout issues for large reports
    const response = await axiosInstance.get('/report/outlet', {
      params: params,
      responseType: 'arraybuffer',  // Use arraybuffer instead of blob for better cross-browser compatibility
      timeout: 300000,  // 5 minute timeout
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.data) {
      throw new Error('Empty response received from server');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error in reportOutlet API call:', error);
    if (error.response) {
      throw error.response;
    } else {
      throw error;
    }
  }
};

export const reportReimbursement = async (params) => {
  try {
    const response = await axiosInstance.get('/report/reimbursement', {
      params: params,
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const reportAbsent = async (params) => {
  try {
    const response = await axiosInstance.get('/report/absent', {
      params: params,
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
