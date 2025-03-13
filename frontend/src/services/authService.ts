import axiosInstance from '../config/axios';

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  name: string;  // changed from username to name to match backend
  email: string;
  password: string;
}

export const authService = {
  login: async (data: LoginData): Promise<string> => {
    try {
      const response = await axiosInstance.post('/api/auth/login', data);
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Set the token in axios headers for subsequent requests
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        return response.data.token;
      }
      throw new Error('No token received from server');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred during login';
      throw new Error(errorMessage);
    }
  },

  signup: async (data: SignupData): Promise<string> => {
    try {
      const response = await axiosInstance.post('/api/auth/register', data);
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        return response.data.token;
      }
      throw new Error('No token received from server');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred during signup';
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};
