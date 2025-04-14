import axios from 'axios';
import { API_URL } from '../utils/constants';
import authService from './auth.service';

const API_CATEGORIES_URL = `${API_URL}/api/categories`;

class CategoryService {
  async getAllCategories() {
    return axios.get(API_CATEGORIES_URL, {
      headers: authService.getAuthHeader()
    });
  }
  
  async getCategoryById(id) {
    return axios.get(`${API_CATEGORIES_URL}/${id}`, {
      headers: authService.getAuthHeader()
    });
  }
  
  async createCategory(categoryData) {
    return axios.post(API_CATEGORIES_URL, categoryData, {
      headers: authService.getAuthHeader()
    });
  }
  
  async updateCategory(id, categoryData) {
    return axios.put(`${API_CATEGORIES_URL}/${id}`, categoryData, {
      headers: authService.getAuthHeader()
    });
  }
  
  async deleteCategory(id) {
    return axios.delete(`${API_CATEGORIES_URL}/${id}`, {
      headers: authService.getAuthHeader()
    });
  }
  
  async getCategoryWithTasks(id) {
    return axios.get(`${API_CATEGORIES_URL}/${id}/tasks`, {
      headers: authService.getAuthHeader()
    });
  }
}

export default new CategoryService();
