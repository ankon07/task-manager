import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiCalendar, FiClock } from 'react-icons/fi';
import categoryService from '../services/category.service';
import { TASK_PRIORITIES, TASK_STATUSES } from '../utils/constants';

const TaskForm = ({ task, onSubmit, isLoading }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TASK_STATUSES.TODO,
    priority: TASK_PRIORITIES.MEDIUM,
    dueDate: '',
    dueTime: '',
    category: ''
  });
  const [errors, setErrors] = useState({});
  
  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Initialize form with task data if editing
  useEffect(() => {
    if (task) {
      const dueDate = task.dueDate ? new Date(task.dueDate) : null;
      
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || TASK_STATUSES.TODO,
        priority: task.priority || TASK_PRIORITIES.MEDIUM,
        dueDate: dueDate ? dueDate.toISOString().split('T')[0] : '',
        dueTime: task.dueTime || '',
        category: task.category || ''
      });
    }
  }, [task]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required for proper task organization';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Prepare data for submission
    const taskData = {
      ...formData
    };
    
    // Combine date and time if both are provided
    if (formData.dueDate) {
      if (formData.dueTime) {
        const dateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
        taskData.dueDate = dateTime.toISOString();
      } else {
        const date = new Date(formData.dueDate);
        taskData.dueDate = date.toISOString();
      }
    }
    
    // Remove dueTime as it's now part of dueDate
    delete taskData.dueTime;
    
    onSubmit(taskData);
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/tasks');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`input w-full ${errors.title ? 'border-red-500' : ''}`}
            placeholder="Enter task title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>
        
        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="input w-full"
            placeholder="Enter task description"
          ></textarea>
        </div>
        
        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`input w-full ${errors.status ? 'border-red-500' : ''}`}
          >
            <option value={TASK_STATUSES.TODO}>To Do</option>
            <option value={TASK_STATUSES.IN_PROGRESS}>In Progress</option>
            <option value={TASK_STATUSES.REVIEW}>Review</option>
            <option value={TASK_STATUSES.COMPLETED}>Completed</option>
          </select>
          {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
        </div>
        
        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={`input w-full ${errors.priority ? 'border-red-500' : ''}`}
          >
            <option value={TASK_PRIORITIES.LOW}>Low</option>
            <option value={TASK_PRIORITIES.MEDIUM}>Medium</option>
            <option value={TASK_PRIORITIES.HIGH}>High</option>
          </select>
          {errors.priority && <p className="mt-1 text-sm text-red-500">{errors.priority}</p>}
        </div>
        
        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="text-gray-400" />
            </div>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="input pl-10 w-full"
            />
          </div>
        </div>
        
        {/* Due Time */}
        <div>
          <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 mb-1">
            Due Time
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiClock className="text-gray-400" />
            </div>
            <input
              type="time"
              id="dueTime"
              name="dueTime"
              value={formData.dueTime}
              onChange={handleChange}
              className="input pl-10 w-full"
            />
          </div>
        </div>
        
        {/* Category */}
        <div className="md:col-span-2">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`input w-full ${errors.category ? 'border-red-500' : ''}`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="text-xs text-gray-500">Categorizing tasks helps with organization and filtering</p>
            <button
              type="button"
              onClick={() => {
                const categoryName = prompt('Enter new category name:');
                if (categoryName && categoryName.trim()) {
                  categoryService.createCategory({ name: categoryName.trim() })
                    .then(response => {
                      setCategories([...categories, response.data]);
                      setFormData({
                        ...formData,
                        category: response.data._id
                      });
                      console.log('Created new category:', response.data);
                    })
                    .catch(err => {
                      console.error('Error creating category:', err);
                    });
                }
              }}
              className="text-xs text-primary hover:text-primary-dark font-medium"
            >
              + Add New Category
            </button>
          </div>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleCancel}
          className="btn bg-white border border-gray-300 hover:bg-gray-50 inline-flex items-center"
        >
          <FiX className="mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary inline-flex items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <FiSave className="mr-2" />
              Save Task
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
