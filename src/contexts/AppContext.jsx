import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
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
  // Convex queries
  const convexGalleryImages = useQuery(api.galleryImages.getGalleryImages);
  const convexScheduleImage = useQuery(api.scheduleImages.getActiveScheduleImage);
  const convexDanPhoto = useQuery(api.danPhoto.getActiveDanPhoto);

  // Convex mutations
  const addGalleryImage = useMutation(api.galleryImages.addGalleryImage);
  const updateGalleryImage = useMutation(api.galleryImages.updateGalleryImage);
  const updateScheduleImage = useMutation(api.scheduleImages.addScheduleImage);
  const updateDanPhotoMutation = useMutation(api.danPhoto.updateDanPhoto);

  // UI State
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPackages, setShowPackages] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [language, setLanguage] = useState('he'); // 'en' or 'he' - Default to Hebrew
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminSection, setAdminSection] = useState('schedule');
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [statsSessions, setStatsSessions] = useState(0);
  const [statsSatisfaction, setStatsSatisfaction] = useState(0);
  const [statsClients, setStatsClients] = useState(0);
  const [statsTemp, setStatsTemp] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Refs
  const audioRef = useRef(null);
  const packagesRef = useRef(null);
  const statsRef = useRef(null);

  const t = translations[language];

  // Fallback data with defaults
  const galleryImages = convexGalleryImages?.map(img => img.url) || [
    '/gallery1.jpg', '/gallery2.jpg', '/gallery3.jpg', '/gallery4.jpg',
    '/gallery5.jpg', '/gallery6.jpg', '/gallery7.jpg'
  ];
  const scheduleImage = convexScheduleImage?.url || null;
  const danPhoto = convexDanPhoto?.url || '/20250906_123005.jpg';

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

  const handleImageUpload = async (event, type, index = null) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result;
        
        try {
          if (type === 'schedule') {
            await updateScheduleImage({
              url: imageData,
              title: 'Event Schedule',
              description: 'Current event schedule'
            });
            alert('✅ Schedule image uploaded successfully!');
          } else if (type === 'gallery' && index !== null) {
            const existingImage = convexGalleryImages?.[index];
            if (existingImage) {
              await updateGalleryImage({
                id: existingImage._id,
                url: imageData,
                order: index
              });
            } else {
              await addGalleryImage({
                url: imageData,
                order: index,
                altText: `Gallery image ${index + 1}`
              });
            }
            alert('✅ Gallery image uploaded successfully!');
          } else if (type === 'danPhoto') {
            await updateDanPhotoMutation({
              url: imageData
            });
            alert('✅ Dan\'s photo uploaded successfully!');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('❌ Failed to upload image. Please try again.');
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
    showAdmin,
    setShowAdmin,
    isAuthenticated,
    setIsAuthenticated,
    password,
    setPassword,
    adminSection,
    setAdminSection,
    galleryImages,
    danPhoto,
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
