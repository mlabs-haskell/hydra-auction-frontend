const API_URL_CLIENT = 'xxxx';

export const getRequest = async (endpoint: string) => {
  return await fetch(`${API_URL_CLIENT}/${endpoint}`);
};
