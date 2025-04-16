import React, { useState } from 'react';

const AnimatedButton = ({ 
  children, 
  onClick, 
  className = '', 
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  icon = null
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Base styles
  const baseStyles = "relative overflow-hidden rounded-lg font-medium transition-all duration-300 flex items-center justify-center";
  
  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  
  // Variant styles
  const variantStyles = {
    primary: `bg-primary text-white hover:bg-primary-dark ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`,
    secondary: `bg-secondary text-gray-800 hover:bg-secondary-dark ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`,
    outline: `border-2 border-primary text-primary hover:bg-primary hover:text-white ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`,
    ghost: `bg-transparent text-primary hover:bg-primary-light hover:bg-opacity-20 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`
  };
  
  // Width style
  const widthStyle = fullWidth ? 'w-full' : '';
  
  // Combined styles
  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`;
  
  // Handle mouse events
  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    if (!disabled) {
      setIsHovered(false);
      setIsPressed(false);
    }
  };
  
  const handleMouseDown = () => {
    if (!disabled) setIsPressed(true);
  };
  
  const handleMouseUp = () => {
    if (!disabled) setIsPressed(false);
  };
  
  return (
    <button
      type={type}
      className={buttonStyles}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={disabled}
      style={{
        transform: isPressed ? 'scale(0.97)' : isHovered ? 'scale(1.03)' : 'scale(1)',
        boxShadow: isHovered && !isPressed && !disabled ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none'
      }}
    >
      {/* Ripple effect */}
      {isPressed && !disabled && (
        <span 
          className="absolute inset-0 bg-white bg-opacity-30 animate-ripple rounded-lg"
          style={{
            transformOrigin: 'center'
          }}
        />
      )}
      
      {/* Button content */}
      <div className="flex items-center justify-center space-x-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </div>
    </button>
  );
};

export default AnimatedButton;
