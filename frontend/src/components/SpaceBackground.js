import React, { useEffect, useRef, useState } from 'react';

const SpaceBackground = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Track mouse movement for parallax effect
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Star properties
    const stars = [];
    const galaxies = [];
    const shootingStars = [];
    
    // Create stars
    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random() * 0.8 + 0.2,
        pulse: Math.random() * 0.1,
        pulseFactor: 0,
        pulseDirection: Math.random() > 0.5 ? 1 : -1
      });
    }
    
    // Create galaxies
    for (let i = 0; i < 8; i++) {
      galaxies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 100 + 50,
        color: getRandomGalaxyColor(),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() * 0.0005) + 0.0001,
        opacity: Math.random() * 0.3 + 0.1,
        particles: []
      });
    }
    
    // Create galaxy particles
    galaxies.forEach(galaxy => {
      const particleCount = Math.floor(galaxy.radius * 1.5);
      for (let i = 0; i < particleCount; i++) {
        const distance = Math.random() * galaxy.radius;
        const angle = Math.random() * Math.PI * 2;
        
        galaxy.particles.push({
          distance: distance,
          angle: angle,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.8 + 0.2
        });
      }
    });
    
    // Random galaxy colors
    function getRandomGalaxyColor() {
      const colors = [
        { r: 138, g: 43, b: 226 },  // Blue/purple
        { r: 75, g: 0, b: 130 },    // Indigo
        { r: 123, g: 104, b: 238 }, // Medium slate blue
        { r: 147, g: 112, b: 219 }, // Medium purple
        { r: 186, g: 85, b: 211 },  // Medium orchid
        { r: 218, g: 112, b: 214 }, // Orchid
        { r: 221, g: 160, b: 221 }, // Plum
        { r: 238, g: 130, b: 238 }, // Violet
        { r: 255, g: 105, b: 180 }, // Hot pink
        { r: 255, g: 20, b: 147 },  // Deep pink
        { r: 199, g: 21, b: 133 },  // Medium violet red
        { r: 176, g: 224, b: 230 }, // Powder blue
        { r: 135, g: 206, b: 235 }, // Sky blue
        { r: 0, g: 191, b: 255 }    // Deep sky blue
      ];
      
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Create new shooting star
    const createShootingStar = () => {
      if (shootingStars.length < 5 && Math.random() < 0.02) {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * (canvas.height / 3);
        
        shootingStars.push({
          x: startX,
          y: startY,
          length: Math.random() * 80 + 50,
          speed: Math.random() * 10 + 5,
          angle: Math.PI / 4 + (Math.random() * Math.PI / 4),
          opacity: 1,
          trail: []
        });
      }
    };
    
    // Animation loop
    const animate = () => {
      // Clear canvas with a dark background
      ctx.fillStyle = 'rgba(10, 3, 25, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Apply parallax effect based on mouse position
      const parallaxX = (mousePosition.x / window.innerWidth - 0.5) * 20;
      const parallaxY = (mousePosition.y / window.innerHeight - 0.5) * 20;
      
      // Draw stars with parallax effect
      stars.forEach(star => {
        // Update star pulsing
        star.pulseFactor += 0.01 * star.pulseDirection;
        if (star.pulseFactor > 1 || star.pulseFactor < 0) {
          star.pulseDirection *= -1;
        }
        
        const currentOpacity = star.opacity * (1 + star.pulse * star.pulseFactor);
        const currentRadius = star.radius * (1 + star.pulse * star.pulseFactor * 0.5);
        
        // Apply parallax effect (stars further away move less)
        const parallaxFactor = star.radius / 1.5; // Smaller stars move less
        const parallaxedX = star.x + parallaxX * parallaxFactor * 0.1;
        const parallaxedY = star.y + parallaxY * parallaxFactor * 0.1;
        
        // Draw star
        ctx.beginPath();
        ctx.arc(parallaxedX, parallaxedY, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.fill();
      });
      
      // Draw galaxies with parallax effect
      galaxies.forEach(galaxy => {
        // Update galaxy rotation
        galaxy.rotation += galaxy.rotationSpeed;
        
        // Apply parallax effect (galaxies move more than stars)
        const galaxyParallaxX = galaxy.x + parallaxX * 0.3;
        const galaxyParallaxY = galaxy.y + parallaxY * 0.3;
        
        // Draw galaxy particles
        galaxy.particles.forEach(particle => {
          const x = galaxyParallaxX + Math.cos(particle.angle + galaxy.rotation) * particle.distance;
          const y = galaxyParallaxY + Math.sin(particle.angle + galaxy.rotation) * particle.distance;
          
          // Distance from center affects color intensity
          const distanceFactor = particle.distance / galaxy.radius;
          const fadeOut = 1 - distanceFactor;
          
          // Draw particle
          ctx.beginPath();
          ctx.arc(x, y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${galaxy.color.r}, ${galaxy.color.g}, ${galaxy.color.b}, ${particle.opacity * galaxy.opacity * fadeOut})`;
          ctx.fill();
        });
        
        // Add a glow effect to the galaxy center
        const gradient = ctx.createRadialGradient(
          galaxyParallaxX, galaxyParallaxY, 0,
          galaxyParallaxX, galaxyParallaxY, galaxy.radius * 0.5
        );
        gradient.addColorStop(0, `rgba(${galaxy.color.r}, ${galaxy.color.g}, ${galaxy.color.b}, ${galaxy.opacity * 0.8})`);
        gradient.addColorStop(1, `rgba(${galaxy.color.r}, ${galaxy.color.g}, ${galaxy.color.b}, 0)`);
        
        ctx.beginPath();
        ctx.arc(galaxyParallaxX, galaxyParallaxY, galaxy.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Move galaxies slowly
        galaxy.x += Math.sin(Date.now() * 0.0001) * 0.2;
        galaxy.y += Math.cos(Date.now() * 0.0001) * 0.2;
        
        // Wrap around edges
        if (galaxy.x < -galaxy.radius) galaxy.x = canvas.width + galaxy.radius;
        if (galaxy.x > canvas.width + galaxy.radius) galaxy.x = -galaxy.radius;
        if (galaxy.y < -galaxy.radius) galaxy.y = canvas.height + galaxy.radius;
        if (galaxy.y > canvas.height + galaxy.radius) galaxy.y = -galaxy.radius;
      });
      
      // Create new shooting stars
      createShootingStar();
      
      // Draw and update shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        
        // Calculate direction
        const dx = Math.cos(star.angle) * star.speed;
        const dy = Math.sin(star.angle) * star.speed;
        
        // Update position
        star.x += dx;
        star.y += dy;
        
        // Add to trail
        star.trail.push({ x: star.x, y: star.y, opacity: 1 });
        
        // Draw trail
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        
        for (let j = 0; j < star.trail.length; j++) {
          const point = star.trail[j];
          point.opacity -= 0.05;
          
          if (j === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        }
        
        // Draw trail
        ctx.strokeStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Remove old trail points
        star.trail = star.trail.filter(point => point.opacity > 0);
        
        // Remove shooting star if it's off screen or trail is empty
        if (
          star.x < 0 ||
          star.x > canvas.width ||
          star.y < 0 ||
          star.y > canvas.height ||
          star.trail.length === 0
        ) {
          shootingStars.splice(i, 1);
        }
      }
      
      animationFrameId = window.requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
        style={{ pointerEvents: 'none' }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default SpaceBackground;
