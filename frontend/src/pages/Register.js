import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedCard from '../components/AnimatedCard';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!username) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      await register(username, email, password);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        form: error.response?.data?.message || 'Failed to register. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  return (
    <AnimatedCard className="p-6 md:p-8 relative overflow-hidden" glassEffect={true} animate={true}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary-light animate-pulse-custom"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-primary-light to-secondary opacity-20 blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-tr from-secondary to-primary opacity-20 blur-xl"></div>
      <h2 className="text-2xl font-bold text-center text-white mb-6 relative z-10">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-secondary">
          Create an Account
        </span>
      </h2>
      
      {errors.form && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded animate-float">
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2" htmlFor="username">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-white text-opacity-70" />
            </div>
            <input
              id="username"
              type="text"
              className={`glass pl-10 text-white input-focus-effect ${errors.username ? 'border-red-500' : 'border-transparent'}`}
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-white text-opacity-70" />
            </div>
            <input
              id="email"
              type="email"
              className={`glass pl-10 text-white input-focus-effect ${errors.email ? 'border-red-500' : 'border-transparent'}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-white text-opacity-70" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`glass pl-10 text-white input-focus-effect ${errors.password ? 'border-red-500' : 'border-transparent'}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <FiEyeOff className="text-white text-opacity-70 hover:text-white" />
              ) : (
                <FiEye className="text-white text-opacity-70 hover:text-white" />
              )}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-white text-opacity-70" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className={`glass pl-10 text-white input-focus-effect ${errors.confirmPassword ? 'border-red-500' : 'border-transparent'}`}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? (
                <FiEyeOff className="text-white text-opacity-70 hover:text-white" />
              ) : (
                <FiEye className="text-white text-opacity-70 hover:text-white" />
              )}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>
        
        <AnimatedButton
          type="submit"
          variant="primary"
          fullWidth={true}
          size="lg"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          ) : (
            'Sign Up'
          )}
        </AnimatedButton>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-white text-opacity-80">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-light hover:text-white font-medium transition-all duration-300 hover:underline relative">
            <span className="relative z-10">Login</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-light to-secondary group-hover:w-full transition-all duration-300"></span>
          </Link>
        </p>
      </div>
    </AnimatedCard>
  );
};

export default Register;
