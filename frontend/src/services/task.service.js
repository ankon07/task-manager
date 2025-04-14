import axios from 'axios';
import { API_URL } from '../utils/constants';
import authService from './auth.service';

const API_TASKS_URL = `${API_URL}/api/tasks`;

class TaskService {
  async getAllTasks() {
    return axios.get(API_TASKS_URL, {
      headers: authService.getAuthHeader()
    });
  }
  
  async getTaskById(id) {
    return axios.get(`${API_TASKS_URL}/${id}`, {
      headers: authService.getAuthHeader()
    });
  }
  
  async createTask(taskData) {
    return axios.post(API_TASKS_URL, taskData, {
      headers: authService.getAuthHeader()
    });
  }
  
  async updateTask(id, taskData) {
    return axios.put(`${API_TASKS_URL}/${id}`, taskData, {
      headers: authService.getAuthHeader()
    });
  }
  
  async deleteTask(id) {
    return axios.delete(`${API_TASKS_URL}/${id}`, {
      headers: authService.getAuthHeader()
    });
  }
  
  async getTasksByCategory(categoryId) {
    return axios.get(`${API_TASKS_URL}/category/${categoryId}`, {
      headers: authService.getAuthHeader()
    });
  }
  
  async getTasksByStatus(status) {
    return axios.get(`${API_TASKS_URL}/status/${status}`, {
      headers: authService.getAuthHeader()
    });
  }
  
  async getTasksByPriority(priority) {
    return axios.get(`${API_TASKS_URL}/priority/${priority}`, {
      headers: authService.getAuthHeader()
    });
  }
  
  async getTasksByDueDate(date) {
    return axios.get(`${API_TASKS_URL}/due-date/${date}`, {
      headers: authService.getAuthHeader()
    });
  }
  
  async getTasksForToday() {
    return axios.get(`${API_TASKS_URL}/today`, {
      headers: authService.getAuthHeader()
    });
  }
  
  async getTasksForWeek() {
    return axios.get(`${API_TASKS_URL}/week`, {
      headers: authService.getAuthHeader()
    });
  }
  
  async getTasksForMonth() {
    return axios.get(`${API_TASKS_URL}/month`, {
      headers: authService.getAuthHeader()
    });
  }
  
  async getCompletedTasks() {
    return axios.get(`${API_TASKS_URL}/completed`, {
      headers: authService.getAuthHeader()
    });
  }
  
  async markTaskAsCompleted(id) {
    return axios.patch(`${API_TASKS_URL}/${id}/complete`, {}, {
      headers: authService.getAuthHeader()
    });
  }
  
  async markTaskAsIncomplete(id) {
    return axios.patch(`${API_TASKS_URL}/${id}/incomplete`, {}, {
      headers: authService.getAuthHeader()
    });
  }
}

export default new TaskService();
