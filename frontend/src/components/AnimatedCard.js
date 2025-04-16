import React, { useState } from 'react';

const AnimatedCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  animate = true,
  glassEffect = false,
  onClick = null,
  hoverEffect = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Base styles
  const baseStyles = "rounded-xl shadow-card p-4 transition-all duration-300";
  
  // Variant styles
  const variantStyles = {
    default: "bg-white",
    primary: "bg-primary-light bg-opacity-20 border border-primary-light",
    secondary: "bg-secondary-light bg-opacity-20 border border-secondary-light",
    dark: "bg-background-dark text-white"
  };
  
  // Animation styles
  const animationStyles = animate ? "animate-float" : "";
  
  // Glass effect
  const glassStyles = glassEffect ? "glass" : "";
  
  // Hover effect
  const hoverStyles = hoverEffect ? "hover:shadow-lg hover:shadow-primary-light/20" : "";
  
  // Combined styles
  const cardStyles = `${baseStyles} ${variantStyles[variant]} ${animationStyles} ${glassStyles} ${hoverStyles} ${className}`;
  
  // Handle mouse events
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  return (
    <div
      className={cardStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: isHovered && hoverEffect ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered && hoverEffect ? '0 20px 25px -5px rgba(168, 85, 247, 0.15), 0 10px 10px -5px rgba(168, 85, 247, 0.1)' : '',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      {/* Glow effect on hover */}
      {isHovered && hoverEffect && (
        <div 
          className="absolute inset-0 rounded-xl animate-glow -z-10"
          style={{ opacity: 0.7 }}
        ></div>
      )}
      
      {/* Card content */}
      {children}
    </div>
  );
};

export default AnimatedCard;
