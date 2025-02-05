import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const getFolders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/folders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching folders:', error);
    throw error;
  }
};

export const getSubfolders = async (folderId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subfolders/${folderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subfolders:', error);
    throw error;
  }
};

export const getFiles = async (folderId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/files/${folderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};