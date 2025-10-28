import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { translations } from '../data/translations';
import * as api from '../api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Supabase data state
  const [galleryImagesData, setGalleryImagesData] = useState([]);
  const [scheduleImageData, setScheduleImageData] = useState(null);
  const [danPhotoData, setDanPhotoData] = useState(null);
  const [heroVideoData, setHeroVideoData] = useState(null);
  const [siteStats, setSiteStats] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Load data from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const [gallery, schedule, dan, hero, stats] = await Promise.all([
          api.getGalleryImages(),
          api.getActiveScheduleImage(),
          api.getActiveDanPhoto(),
          api.getActiveHeroVideo(),
          api.getSiteStats(),
        ]);
        setGalleryImagesData(gallery);
        setScheduleImageData(schedule);
        setDanPhotoData(dan);
        setHeroVideoData(hero);
        setSiteStats(stats);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setDataLoading(false);
      }
    }
    loadData();
  }, []);

  // Supabase mutations (async functions)
  const addGalleryImage = async (args) => {
    const result = await api.addGalleryImage(args);
    const updated = await api.getGalleryImages();
    setGalleryImagesData(updated);
    return result;
  };

  const updateGalleryImage = async (args) => {
    const result = await api.updateGalleryImage(args);
    const updated = await api.getGalleryImages();
    setGalleryImagesData(updated);
    return result;
  };

  const updateScheduleImage = async (args) => {
    const result = await api.addScheduleImage(args);
    const updated = await api.getActiveScheduleImage();
    setScheduleImageData(updated);
    return result;
  };

  const updateDanPhotoMutation = async (args) => {
    const result = await api.updateDanPhoto(args);
    const updated = await api.getActiveDanPhoto();
    setDanPhotoData(updated);
    return result;
  };

  const uploadHeroVideoMutation = async (args) => {
    const result = await api.uploadHeroVideo(args);
    const updated = await api.getActiveHeroVideo();
    setHeroVideoData(updated);
    return result;
  };

  // UI State
  const [isPlaying, setIsPlaying] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [language, setLanguage] = useState('he'); // 'en' or 'he' - Default to Hebrew
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState(''); // Legacy - will be removed
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminSection, setAdminSection] = useState('schedule');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load stats animation setting from localStorage on mount
  const [statsAnimationEnabled, setStatsAnimationEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('statsAnimationEnabled');
      // If no saved value, default to true and save it
      if (saved === null) {
        localStorage.setItem('statsAnimationEnabled', 'true');
        return true;
      }
      return saved === 'true';
    }
    return true;
  });

  // Initialize stats with manual values (from localStorage) or Supabase data
  const [statsSessions, setStatsSessions] = useState(() => {
    if (typeof window !== 'undefined') {
      const manualStats = localStorage.getItem('manualStats');
      if (manualStats) {
        const parsed = JSON.parse(manualStats);
        return parsed.sessions || 0;
      }
    }
    return siteStats?.totalSessions || 0;
  });

  const [statsSatisfaction, setStatsSatisfaction] = useState(() => {
    if (typeof window !== 'undefined') {
      const manualStats = localStorage.getItem('manualStats');
      if (manualStats) {
        const parsed = JSON.parse(manualStats);
        return parsed.satisfaction || 0;
      }
    }
    return siteStats?.satisfactionRate || 0;
  });

  const [statsClients, setStatsClients] = useState(() => {
    if (typeof window !== 'undefined') {
      const manualStats = localStorage.getItem('manualStats');
      if (manualStats) {
        const parsed = JSON.parse(manualStats);
        return parsed.clients || 0;
      }
    }
    return siteStats?.totalClients || 0;
  });

  const [statsTemp, setStatsTemp] = useState(() => {
    if (typeof window !== 'undefined') {
      const manualStats = localStorage.getItem('manualStats');
      if (manualStats) {
        const parsed = JSON.parse(manualStats);
        return parsed.temp || 0;
      }
    }
    return siteStats?.averageTemp || 0;
  });

  // Ensure language is valid on mount
  useEffect(() => {
    if (!translations[language] && !translations.en) {
      console.error('Translations not loaded properly', {
        language,
        availableLanguages: Object.keys(translations || {}),
        translations
      });
    }
  }, [language]);

  // Refs
  const audioRef = useRef(null);
  const packagesRef = useRef(null);
  const statsRef = useRef(null);

  const t = (translations?.[language]) || translations?.en || {
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
  const galleryImages =
    galleryImagesData && galleryImagesData.length > 0
      ? galleryImagesData.map((img) => img.url)
      : [
          '/gallery1.jpg',
          '/gallery2.jpg',
          '/gallery3.jpg',
          '/gallery4.jpg',
          '/gallery5.jpg',
          '/gallery6.jpg',
          '/gallery7.jpg',
        ];
  const scheduleImage = scheduleImageData?.url || null;
  const danPhoto = danPhotoData?.url || '/20250906_123005.jpg';
  const heroVideo = heroVideoData?.url || '/dan_logo.mp4';

  // Mouse tracking for parallax effect (throttled for performance)
  useEffect(() => {
    let ticking = false;

    const handleInteraction = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Get coordinates from both mouse and touch events
          const clientX = e.clientX || (e.touches?.[0]?.clientX ?? 0);
          const clientY = e.clientY || (e.touches?.[0]?.clientY ?? 0);

          // Only update if we have valid coordinates
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

    // Add both mouse and touch event listeners with passive option for mobile performance
    window.addEventListener('mousemove', handleInteraction, { passive: true });
    window.addEventListener('touchmove', handleInteraction, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchmove', handleInteraction);
    };
  }, []);

  // Scroll reveal animation using Intersection Observer (more performant)
  useEffect(() => {
    // Check if device is mobile for different optimization strategy
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
        threshold: prefersReducedMotion ? 0.01 : isMobile ? 0.05 : 0.1, // Lower threshold for mobile
        rootMargin: isMobile ? '25px 0px -25px 0px' : '50px 0px -50px 0px', // Smaller margin for mobile
      }
    );

    // Only observe elements that actually need scroll reveal (skip if reduced motion)
    if (!prefersReducedMotion) {
      const reveals = document.querySelectorAll('.scroll-reveal');
      for (const element of reveals) {
        observer.observe(element);
      }
    } else {
      // If reduced motion, just show all elements immediately
      const reveals = document.querySelectorAll('.scroll-reveal');
      for (const element of reveals) {
        element.classList.add('revealed');
      }
    }

    return () => observer.disconnect();
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
    setTimeout(() => {
      packagesRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  const handleImageUpload = async (event, type, index = null) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size for videos (Supabase has reasonable limits)
      if (type === 'heroVideo') {
        const maxSize = 800 * 1024; // 800KB to be safe (base64 encoding increases size by ~33%)
        if (file.size > maxSize) {
          alert(
            `❌ Video file is too large (${(file.size / 1024).toFixed(0)}KB). Please use a video smaller than 800KB.\n\nTip: Compress your video or use a shorter clip.`
          );
          return;
        }
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result;

        try {
          if (type === 'schedule') {
            await updateScheduleImage({
              url: imageData,
              title: 'Event Schedule',
              description: 'Current event schedule',
            });
            alert('✅ Schedule image uploaded successfully!');
          } else if (type === 'gallery' && index !== null) {
            const existingImage = galleryImagesData?.[index];
            if (existingImage) {
              await updateGalleryImage({
                id: existingImage._id,
                url: imageData,
                order: index,
              });
            } else {
              await addGalleryImage({
                url: imageData,
                order: index,
                altText: `Gallery image ${index + 1}`,
              });
            }
            alert('✅ Gallery image uploaded successfully!');
          } else if (type === 'danPhoto') {
            await updateDanPhotoMutation({
              url: imageData,
            });
            alert("✅ Dan's photo uploaded successfully!");
          } else if (type === 'heroVideo') {
            await uploadHeroVideoMutation({
              url: imageData,
              isActive: true,
              altText: 'Hero video',
            });
            alert('✅ Hero video uploaded successfully!');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('❌ Failed to upload image. Please try again.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-verify admin token on mount
  useEffect(() => {
    const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (adminToken) {
      api.verifyAdminToken({ token: adminToken })
        .then((isValid) => {
          if (isValid) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('adminToken');
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
        });
    }
  }, []);

  const handleLogin = async () => {
    try {
      const result = await api.adminLogin({ email: adminEmail, password: adminPassword });
      if (result.token) {
        // Store token in localStorage
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

  // New admin login handler (alias for handleLogin)
  const handleAdminLogin = handleLogin;

  const handleAdminClose = async () => {
    // Logout from server
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

  const value = {
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
    scheduleImage,
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
    galleryImages,
    danPhoto,
    heroVideo,
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
    mobileMenuOpen,
    setMobileMenuOpen,
    statsRef,
    audioRef,
    packagesRef,
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
