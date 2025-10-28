import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { translations } from '../data/translations';
import * as api from '../api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Audio and visual state
  const [isPlaying, setIsPlaying] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [language, setLanguage] = useState(() => {
    // Check localStorage first, then default to Hebrew
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language');
      return savedLanguage || 'he';
    }
    return 'he';
  });
  const [scheduleImage, setScheduleImage] = useState(null);

  // Save language preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }, [language]);

  // Admin state
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminSection, setAdminSection] = useState('gallery');

  // Stats animation
  const [statsSessions, setStatsSessions] = useState(0);
  const [statsSatisfaction, setStatsSatisfaction] = useState(0);
  const [statsClients, setStatsClients] = useState(0);
  const [statsTemp, setStatsTemp] = useState(0);
  const [statsAnimationEnabled, setStatsAnimationEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('statsAnimationEnabled');
      if (saved === null) {
        localStorage.setItem('statsAnimationEnabled', 'true');
        return true;
      }
      return saved === 'true';
    }
    return true;
  });

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs
  const statsRef = useRef(null);
  const audioRef = useRef(null);
  const packagesRef = useRef(null);

  // Translations
  const t = translations[language] || translations.en || {
    footer: '© 2025 Cold Therapy by Dan Hayat. All rights reserved.',
    footerTagline: 'Unleash your potential through the power of cold and breath',
    wrongPassword: 'Wrong password!',
    logo: 'COLD THERAPY',
    home: 'Home',
    about: 'About',
    packages: 'Packages',
    gallery: 'Gallery',
    contact: 'Contact',
    bookNow: 'Book Now',
    adminButton: 'Admin',
    livePractice: 'Live Training',
    instructorTraining: 'Instructor Training',
    breathingVideosMenu: 'Breathwork Videos',
  };

  // Mouse tracking for parallax effect (throttled for performance)
  useEffect(() => {
    let ticking = false;

    const handleInteraction = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const clientX = e.clientX || (e.touches?.[0]?.clientX ?? 0);
          const clientY = e.clientY || (e.touches?.[0]?.clientY ?? 0);

          if (clientX !== undefined && clientY !== undefined) {
            setMousePosition({
              x: (clientX / window.innerWidth) * 100,
              y: (clientY / window.innerHeight) * 100,
            });
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleInteraction, { passive: true });
    window.addEventListener('touchmove', handleInteraction, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchmove', handleInteraction);
    };
  }, []);

  // Scroll reveal animation using Intersection Observer
  useEffect(() => {
    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth <= 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        threshold: prefersReducedMotion ? 0.01 : isMobile ? 0.05 : 0.1,
        rootMargin: isMobile ? '25px 0px -25px 0px' : '50px 0px -50px 0px',
      }
    );

    if (!prefersReducedMotion) {
      const reveals = document.querySelectorAll('.scroll-reveal');
      for (const element of reveals) {
        observer.observe(element);
      }
    } else {
      const reveals = document.querySelectorAll('.scroll-reveal');
      for (const element of reveals) {
        element.classList.add('revealed');
      }
    }

    return () => observer.disconnect();
  }, []);

  // Audio and visual functions
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
    setTimeout(() => {
      packagesRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  // Handle image upload
  const handleImageUpload = async (event, type, section = '') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('File must be an image');
      return;
    }

    try {
      await api.uploadImage(file, type, section);
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Upload failed!');
    }
  };

  // Admin functions
  const handleLogin = async () => {
    try {
      const result = await api.adminLogin({ email: adminEmail, password: adminPassword });
      if (result.token) {
        localStorage.setItem('adminToken', result.token);
        setIsAuthenticated(true);
        setAdminEmail('');
        setAdminPassword('');
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      alert(error.message || 'Login failed!');
      setAdminPassword('');
    }
  };

  const handleAdminLogin = handleLogin;

  const handleAdminClose = async () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        await api.adminLogout({ token });
      } catch (error) {
        console.error('Logout error:', error);
      }
      localStorage.removeItem('adminToken');
    }
    setShowAdmin(false);
    setIsAuthenticated(false);
    setPassword('');
  };

  // Check admin auth on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      api.verifyAdminToken({ token })
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
        });
    }
  }, []);

  const value = {
    // Audio/Visual
    isPlaying,
    setIsPlaying,
    openFaq,
    setOpenFaq,
    selectedImage,
    setSelectedImage,
    mousePosition,
    setMousePosition,
    language,
    setLanguage,
    
    // Admin
    showAdmin,
    setShowAdmin,
    isAuthenticated,
    setIsAuthenticated,
    password,
    setPassword,
    adminEmail,
    setAdminEmail,
    adminPassword,
    setAdminPassword,
    handleAdminLogin,
    handleImageUpload,
    handleLogin,
    handleAdminClose,
    adminSection,
    setAdminSection,
    
    // Stats
    statsSessions,
    statsSatisfaction,
    statsClients,
    statsTemp,
    setStatsSessions,
    setStatsSatisfaction,
    setStatsClients,
    setStatsTemp,
    statsAnimationEnabled,
    setStatsAnimationEnabled,
    
    // UI
    mobileMenuOpen,
    setMobileMenuOpen,
    scheduleImage,
    setScheduleImage,
    
    // Refs
    statsRef,
    audioRef,
    packagesRef,
    
    // Functions
    t,
    toggleMusic,
    scrollToPackages,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
