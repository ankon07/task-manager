import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPlus, 
  FiFilter, 
  FiSearch, 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiTrash2, 
  FiEdit,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import taskService from '../services/task.service';
import categoryService from '../services/category.service';
import { TASK_PRIORITIES, TASK_STATUSES } from '../utils/constants';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);
  
  // Task actions
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showActions, setShowActions] = useState(false);
  
  // Function to fetch tasks and categories
  const fetchTasksAndCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch tasks
      const tasksResponse = await taskService.getAllTasks();
      setTasks(tasksResponse.data);
      
      // Fetch categories
      const categoriesResponse = await categoryService.getAllCategories();
      setCategories(categoriesResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load tasks and categories on mount and when returning to the page
  useEffect(() => {
    fetchTasksAndCategories();
    
    // Add event listener for focus to refresh data when returning to the page
    window.addEventListener('focus', fetchTasksAndCategories);
    
    // Cleanup
    return () => {
      window.removeEventListener('focus', fetchTasksAndCategories);
    };
  }, []);
  
  // Filter tasks based on search term and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === '' || task.status === statusFilter;
    const matchesPriority = priorityFilter === '' || task.priority === priorityFilter;
    const matchesCategory = categoryFilter === '' || task.category === categoryFilter;
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      matchesDate = taskDate.getTime() === today.getTime();
    } else if (dateFilter === 'week') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekLater = new Date(today);
      weekLater.setDate(weekLater.getDate() + 7);
      
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      
      matchesDate = taskDate >= today && taskDate <= weekLater;
    } else if (dateFilter === 'month') {
      const today = new Date();
      const thisMonth = today.getMonth();
      const thisYear = today.getFullYear();
      
      const taskDate = new Date(task.dueDate);
      const taskMonth = taskDate.getMonth();
      const taskYear = taskDate.getFullYear();
      
      matchesDate = taskMonth === thisMonth && taskYear === thisYear;
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesDate;
  });
  
  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Handle task selection
  const toggleTaskSelection = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };
  
  // Handle bulk actions
  const handleBulkComplete = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Complete each selected task
      await Promise.all(
        selectedTasks.map(taskId => taskService.markTaskAsCompleted(taskId))
      );
      
      // Refresh tasks using the fetchTasksAndCategories function
      await fetchTasksAndCategories();
      
      // Clear selection
      setSelectedTasks([]);
      setShowActions(false);
    } catch (err) {
      console.error('Error completing tasks:', err);
      setError('Failed to complete tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBulkDelete = async () => {
    if (window.confirm('Are you sure you want to delete the selected tasks?')) {
      try {
        setIsLoading(true);
        setError(null);
        
        // Delete each selected task
        await Promise.all(
          selectedTasks.map(taskId => taskService.deleteTask(taskId))
        );
        
        // Refresh tasks using the fetchTasksAndCategories function
        await fetchTasksAndCategories();
        
        // Clear selection
        setSelectedTasks([]);
        setShowActions(false);
      } catch (err) {
        console.error('Error deleting tasks:', err);
        setError('Failed to delete tasks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
    setCategoryFilter('');
    setDateFilter('');
    setCurrentPage(1);
  };
  
  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
          <p className="text-gray-600">Manage and organize your tasks</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/tasks/new"
            className="btn btn-primary inline-flex items-center"
          >
            <FiPlus className="mr-2" />
            New Task
          </Link>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter button */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                className="btn inline-flex items-center bg-white border border-gray-300 hover:bg-gray-50"
                onClick={() => setShowActions(!showActions)}
              >
                <FiFilter className="mr-2" />
                Filters
              </button>
            </div>
            
            {selectedTasks.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  className="btn inline-flex items-center bg-green-500 text-white hover:bg-green-600"
                  onClick={handleBulkComplete}
                >
                  <FiCheckCircle className="mr-2" />
                  Complete
                </button>
                <button
                  className="btn inline-flex items-center bg-red-500 text-white hover:bg-red-600"
                  onClick={handleBulkDelete}
                >
                  <FiTrash2 className="mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Expanded filters */}
        {showActions && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value={TASK_STATUSES.TODO}>To Do</option>
                <option value={TASK_STATUSES.IN_PROGRESS}>In Progress</option>
                <option value={TASK_STATUSES.REVIEW}>Review</option>
                <option value={TASK_STATUSES.COMPLETED}>Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                className="input"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value={TASK_PRIORITIES.LOW}>Low</option>
                <option value={TASK_PRIORITIES.MEDIUM}>Medium</option>
                <option value={TASK_PRIORITIES.HIGH}>High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="relative">
                <select
                  className="input"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => {
                    // Generate a consistent color based on category name
                    const colors = [
                      'text-blue-600',
                      'text-green-600',
                      'text-purple-600',
                      'text-pink-600',
                      'text-indigo-600',
                      'text-yellow-600',
                      'text-red-600',
                      'text-teal-600'
                    ];
                    const colorIndex = category.name.length % colors.length;
                    const colorClass = colors[colorIndex];
                    
                    return (
                      <option key={category._id} value={category._id} className={colorClass}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <p className="text-xs text-gray-500">Filter tasks by their category</p>
                <button
                  type="button"
                  onClick={() => {
                    const categoryName = prompt('Enter new category name:');
                    if (categoryName && categoryName.trim()) {
                      categoryService.createCategory({ name: categoryName.trim() })
                        .then(response => {
                          setCategories([...categories, response.data]);
                          setCategoryFilter(response.data._id);
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <select
                className="input"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            
            <div className="md:col-span-4">
              <button
                className="text-primary hover:text-primary-dark text-sm font-medium"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Tasks list */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    checked={selectedTasks.length === currentTasks.length && currentTasks.length > 0}
                    onChange={() => {
                      if (selectedTasks.length === currentTasks.length) {
                        setSelectedTasks([]);
                      } else {
                        setSelectedTasks(currentTasks.map(task => task._id));
                      }
                    }}
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTasks.length > 0 ? (
                currentTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        checked={selectedTasks.includes(task._id)}
                        onChange={() => toggleTaskSelection(task._id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{task.title}</div>
                          {task.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {task.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task.status === TASK_STATUSES.COMPLETED
                          ? 'bg-green-100 text-green-800'
                          : task.status === TASK_STATUSES.IN_PROGRESS
                          ? 'bg-blue-100 text-blue-800'
                          : task.status === TASK_STATUSES.REVIEW
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task.priority === TASK_PRIORITIES.HIGH
                          ? 'bg-red-100 text-red-800'
                          : task.priority === TASK_PRIORITIES.MEDIUM
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        // Debug the category data
                        console.log(`Task ${task._id} category:`, task.category);
                        
                        // Check if category exists and has a name (populated from backend)
                        if (task.category && task.category.name) {
                          // If we have a populated category object with a name property
                          const categoryName = task.category.name;
                          
                          // Generate a consistent color based on category name
                          const colors = [
                            'bg-blue-100 text-blue-800',
                            'bg-green-100 text-green-800',
                            'bg-purple-100 text-purple-800',
                            'bg-pink-100 text-pink-800',
                            'bg-indigo-100 text-indigo-800',
                            'bg-yellow-100 text-yellow-800',
                            'bg-red-100 text-red-800',
                            'bg-teal-100 text-teal-800'
                          ];
                          const colorIndex = categoryName.length % colors.length;
                          const colorClass = colors[colorIndex];
                          
                          return (
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
                              {categoryName}
                            </span>
                          );
                        } 
                        // If category is an ID string, try to find it in the categories array
                        else if (task.category && typeof task.category === 'string') {
                          const category = categories.find(c => c._id === task.category);
                          if (category) {
                            // Generate a consistent color based on category name
                            const colors = [
                              'bg-blue-100 text-blue-800',
                              'bg-green-100 text-green-800',
                              'bg-purple-100 text-purple-800',
                              'bg-pink-100 text-pink-800',
                              'bg-indigo-100 text-indigo-800',
                              'bg-yellow-100 text-yellow-800',
                              'bg-red-100 text-red-800',
                              'bg-teal-100 text-teal-800'
                            ];
                            const colorIndex = category.name.length % colors.length;
                            const colorClass = colors[colorIndex];
                            
                            return (
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
                                {category.name}
                              </span>
                            );
                          }
                        }
                        
                        // Default case: no category or category not found
                        return <span className="text-xs text-gray-500">Uncategorized</span>;
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link to={`/tasks/${task._id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                          <FiEdit size={18} />
                        </Link>
                        {task.status !== TASK_STATUSES.COMPLETED && (
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() => {
                              setIsLoading(true);
                              taskService.markTaskAsCompleted(task._id)
                                .then(() => {
                                  // Refresh the task list
                                  return fetchTasksAndCategories();
                                })
                                .catch(err => {
                                  console.error('Error completing task:', err);
                                  setError('Failed to complete task. Please try again.');
                                })
                                .finally(() => {
                                  setIsLoading(false);
                                });
                            }}
                          >
                            <FiCheckCircle size={18} />
                          </button>
                        )}
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this task?')) {
                              setIsLoading(true);
                              taskService.deleteTask(task._id)
                                .then(() => {
                                  // Refresh the task list instead of filtering locally
                                  return fetchTasksAndCategories();
                                })
                                .catch(err => {
                                  console.error('Error deleting task:', err);
                                  setError('Failed to delete task. Please try again.');
                                })
                                .finally(() => {
                                  setIsLoading(false);
                                });
                            }
                          }}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No tasks found. {searchTerm || statusFilter || priorityFilter || categoryFilter || dateFilter ? (
                      <button
                        className="text-primary hover:text-primary-dark font-medium"
                        onClick={resetFilters}
                      >
                        Clear filters
                      </button>
                    ) : (
                      <Link
                        to="/tasks/new"
                        className="text-primary hover:text-primary-dark font-medium"
                      >
                        Create a new task
                      </Link>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredTasks.length > tasksPerPage && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstTask + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastTask, filteredTasks.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredTasks.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === number
                          ? 'z-10 bg-primary border-primary text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
