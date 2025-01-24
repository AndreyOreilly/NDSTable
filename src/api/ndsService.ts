import axiosInstance from './axiosInstance';
import { Nds } from '../types/ndsTypes';

export const getToken = async (): Promise<string> => {
  const response = await axiosInstance.get('/token');
  return response.data;
};

export const getAllNds = async (): Promise<Nds[]> => {
  const response = await axiosInstance.get('/api/nds');
  return response.data;
};

export const createNdsItem = async (item: Nds) => {
  const response = await axiosInstance.post('/api/nds', item);
  return response.data as Nds;
};

export const updateNdsItem = async (id: string, item: Partial<Nds>) => {
  const response = await axiosInstance.put(`/api/nds/${id}`, item);
  return response.data as Nds;
};

export const deleteNdsItem = async (id: string) => {
  await axiosInstance.delete(`/api/nds/${id}`);
};

export const getNdsItem = async (id: string): Promise<Nds> => {
  const response = await axiosInstance.get(`/api/nds/${id}`);
  return response.data;
};
