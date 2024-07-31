// utils/auth.ts
export const getToken = (): string | null => {
  console.log("localStorage.getItem",localStorage.getItem);

    return localStorage.getItem('token');
    
  };

// export const verifyTokenWithBackend = async (): Promise<boolean> => {
//   try {
//     const response = await axiosInstance.get('/verifyToken'); 
//     return response.data.valid; 
//   } catch (error) {
//     console.error('Error verifying token:', error);
//     return false;
//   }
// };