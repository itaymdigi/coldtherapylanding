import React from 'react';
import { useApp } from '../contexts/AppContext';

const Background = () => {
  const { mousePosition } = useApp();

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 animate-pulse"></div>
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-float"
        style={{ transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)` }}
      ></div>
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float-delayed"
        style={{ transform: `translate(-${mousePosition.x * 0.03}px, -${mousePosition.y * 0.03}px)` }}
      ></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-rotate"></div>
    </div>
  );
};

export default Background;
