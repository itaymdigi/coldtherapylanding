import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { translations } from '../data/translations';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPackages, setShowPackages] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [language, setLanguage] = useState('he'); // 'en' or 'he' - Default to Hebrew
  const [scheduleImage, setScheduleImage] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminSection, setAdminSection] = useState('schedule');
  const [galleryImages, setGalleryImages] = useState([
    '/gallery1.jpg', '/gallery2.jpg', '/gallery3.jpg', '/gallery4.jpg',
    '/gallery5.jpg', '/gallery6.jpg', '/gallery7.jpg'
  ]);
  const [danPhoto, setDanPhoto] = useState('/20250906_123005.jpg');
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [statsSessions, setStatsSessions] = useState(0);
  const [statsSatisfaction, setStatsSatisfaction] = useState(0);
  const [statsClients, setStatsClients] = useState(0);
  const [statsTemp, setStatsTemp] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const audioRef = useRef(null);
  const packagesRef = useRef(null);
  const statsRef = useRef(null);

  const t = translations[language];

  // Load images from localStorage on mount
  useEffect(() => {
    const savedSchedule = localStorage.getItem('scheduleImage');
    if (savedSchedule) {
      setScheduleImage(savedSchedule);
    }
    
    const savedGallery = localStorage.getItem('galleryImages');
    if (savedGallery) {
      setGalleryImages(JSON.parse(savedGallery));
    }
    
    const savedDanPhoto = localStorage.getItem('danPhoto');
    if (savedDanPhoto) {
      setDanPhoto(savedDanPhoto);
    }
  }, []);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.scroll-reveal');
      reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('revealed');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const scrollToPackages = () => {
    setShowPackages(true);
    setTimeout(() => {
      packagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleImageUpload = (event, type, index = null) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        
        if (type === 'schedule') {
          setScheduleImage(imageData);
          localStorage.setItem('scheduleImage', imageData);
        } else if (type === 'gallery' && index !== null) {
          const newGalleryImages = [...galleryImages];
          newGalleryImages[index] = imageData;
          setGalleryImages(newGalleryImages);
          localStorage.setItem('galleryImages', JSON.stringify(newGalleryImages));
        } else if (type === 'danPhoto') {
          setDanPhoto(imageData);
          localStorage.setItem('danPhoto', imageData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = () => {
    if (password === 'Coldislife') {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert(t.wrongPassword);
      setPassword('');
    }
  };

  const handleAdminClose = () => {
    setShowAdmin(false);
    setIsAuthenticated(false);
    setPassword('');
  };

  const value = {
    isPlaying,
    setIsPlaying,
    showPackages,
    setShowPackages,
    openFaq,
    setOpenFaq,
    selectedImage,
    setSelectedImage,
    mousePosition,
    setMousePosition,
    language,
    setLanguage,
    scheduleImage,
    setScheduleImage,
    showAdmin,
    setShowAdmin,
    isAuthenticated,
    setIsAuthenticated,
    password,
    setPassword,
    adminSection,
    setAdminSection,
    galleryImages,
    setGalleryImages,
    danPhoto,
    setDanPhoto,
    statsAnimated,
    setStatsAnimated,
    statsSessions,
    setStatsSessions,
    statsSatisfaction,
    setStatsSatisfaction,
    statsClients,
    setStatsClients,
    statsTemp,
    setStatsTemp,
    mobileMenuOpen,
    setMobileMenuOpen,
    audioRef,
    packagesRef,
    statsRef,
    t,
    toggleMusic,
    scrollToPackages,
    handleImageUpload,
    handleLogin,
    handleAdminClose,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
