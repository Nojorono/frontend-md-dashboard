
import axiosInstance from "@/api/index";


export const reportActivity = async (params) => {
  try {
    const response = await axiosInstance.get(`/report/activity/`, {
      params: params,
      responseType: 'arraybuffer',  
      timeout: 1000000,  
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
    throw error.response;
  }
};

export const reportOutlet = async (params) => {
  try {
    // Create URLSearchParams for proper filter parameter serialization
    const searchParams = new URLSearchParams();
    
    // Iterate through the filter params and format them correctly for the backend
    if (params.area) searchParams.append('filter[area]', params.area);
    if (params.region) searchParams.append('filter[region]', params.region);
    if (params.brand) searchParams.append('filter[brand]', params.brand);
    if (params.sio_type) searchParams.append('filter[sio_type]', params.sio_type);
    
    // Create URL with query string
    const url = `/report/outlet?${searchParams.toString()}`;
    
    const response = await axiosInstance.get(url, {
      responseType: 'arraybuffer',  
      timeout: 1000000,  
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
    // Create URLSearchParams for proper filter parameter serialization
    const searchParams = new URLSearchParams();
    
    // Iterate through the filter params and format them correctly for the backend
    if (params.area) searchParams.append('filter[area]', params.area);
    if (params.region) searchParams.append('filter[region]', params.region);
    
    // Create URL with query string
    const url = `/report/reimbursement?${searchParams.toString()}`;
    
    const response = await axiosInstance.get(url, {
      responseType: 'arraybuffer',  
      timeout: 1000000,  
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
    throw error.response;
  }
};

export const reportAbsent = async (params) => {
  try {
    // Create URLSearchParams for proper filter parameter serialization
    const searchParams = new URLSearchParams();
    
    // Iterate through the filter params and format them correctly for the backend
    if (params.area) searchParams.append('filter[area]', params.area);
    if (params.region) searchParams.append('filter[region]', params.region);
    
    // Create URL with query string
    const url = `/report/absent?${searchParams.toString()}`;
    
    const response = await axiosInstance.get(url, {
      responseType: 'arraybuffer',  
      timeout: 1000000,  
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
    throw error.response;
  }
};
