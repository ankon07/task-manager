import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedCard from '../components/AnimatedCard';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        form: error.response?.data?.message || 'Failed to login. Please check your credentials.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <AnimatedCard className="p-6 md:p-8 relative overflow-hidden" glassEffect={true} animate={true}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary-light animate-pulse-custom"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-primary-light to-secondary opacity-20 blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-tr from-secondary to-primary opacity-20 blur-xl"></div>
      <h2 className="text-2xl font-bold text-center text-white mb-6 relative z-10">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-secondary">
          Login to Your Account
        </span>
      </h2>
      
      {errors.form && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded animate-float">
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
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
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-white text-sm font-medium" htmlFor="password">
              Password
            </label>
            <Link to="/forgot-password" className="text-sm text-primary-light hover:text-white">
              Forgot password?
            </Link>
          </div>
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
        
        <AnimatedButton
          type="submit"
          variant="primary"
          fullWidth={true}
          size="lg"
          disabled={isSubmitting}
          icon={isSubmitting ? null : <FiLogIn size={18} />}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
          ) : (
            'Login'
          )}
        </AnimatedButton>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-white text-opacity-80">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-light hover:text-white font-medium transition-all duration-300 hover:underline relative">
            <span className="relative z-10">Sign up</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-light to-secondary group-hover:w-full transition-all duration-300"></span>
          </Link>
        </p>
      </div>
    </AnimatedCard>
  );
};

export default Login;
