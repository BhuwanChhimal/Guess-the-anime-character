import axiosInstance from '../config/axios';

export const getUserName = async () => {
  const token = localStorage.getItem('token');
  if (!token) return 'Guest';

  try {
    // Fixed API endpoint - removed 'auth' from path
    const response = await axiosInstance.get('/api/auth/username',{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.name || 'Guest';
  } catch (error) {
    console.error('Error fetching username:', error);
    return 'Guest';
  }
};
