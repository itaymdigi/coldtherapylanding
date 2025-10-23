import { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  const convexHeroVideo = useQuery(api.heroVideo.getActiveHeroVideo);
  const siteStats = useQuery(api.siteStats.getSiteStats);

  // Convex mutations
  const addGalleryImage = useMutation(api.galleryImages.addGalleryImage);
  const updateGalleryImage = useMutation(api.galleryImages.updateGalleryImage);
  const updateScheduleImage = useMutation(api.scheduleImages.addScheduleImage);
  const updateDanPhotoMutation = useMutation(api.danPhoto.updateDanPhoto);
  const uploadHeroVideoMutation = useMutation(api.heroVideo.uploadHeroVideo);

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

  // Initialize stats with real data from Convex or fallback to 0
  const [statsSessions, setStatsSessions] = useState(siteStats?.totalSessions || 0);
  const [statsSatisfaction, setStatsSatisfaction] = useState(siteStats?.satisfactionRate || 0);
  const [statsClients, setStatsClients] = useState(siteStats?.totalClients || 0);
  const [statsTemp, setStatsTemp] = useState(siteStats?.averageTemp || 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Update stats when Convex data loads
  useEffect(() => {
    if (siteStats) {
      setStatsSessions(siteStats.totalSessions);
      setStatsSatisfaction(siteStats.satisfactionRate);
      setStatsClients(siteStats.totalClients);
      setStatsTemp(siteStats.averageTemp);
      setStatsAnimated(true); // Mark as animated since we have real data
    }
  }, [siteStats]);

  // Refs
  const audioRef = useRef(null);
  const packagesRef = useRef(null);
  const statsRef = useRef(null);

  const t = translations[language];

  // Fallback data with defaults
  const galleryImages =
    convexGalleryImages && convexGalleryImages.length > 0
      ? convexGalleryImages.map((img) => img.url)
      : [
          '/gallery1.jpg',
          '/gallery2.jpg',
          '/gallery3.jpg',
          '/gallery4.jpg',
          '/gallery5.jpg',
          '/gallery6.jpg',
          '/gallery7.jpg',
        ];
  const scheduleImage = convexScheduleImage?.url || null;
  const danPhoto = convexDanPhoto?.url || '/20250906_123005.jpg';
  const heroVideo = convexHeroVideo?.url || '/dan_logo.mp4';

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
    const isMobile = typeof window !== 'undefined' && (window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        threshold: prefersReducedMotion ? 0.01 : (isMobile ? 0.05 : 0.1), // Lower threshold for mobile
        rootMargin: isMobile ? '25px 0px -25px 0px' : '50px 0px -50px 0px' // Smaller margin for mobile
      }
    );

    // Only observe elements that actually need scroll reveal (skip if reduced motion)
    if (!prefersReducedMotion) {
      const reveals = document.querySelectorAll('.scroll-reveal');
      reveals.forEach((element) => observer.observe(element));
    } else {
      // If reduced motion, just show all elements immediately
      const reveals = document.querySelectorAll('.scroll-reveal');
      reveals.forEach((element) => {
        element.classList.add('revealed');
      });
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
    setShowPackages(true);
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
      // Check file size for videos (Convex has 1MB limit for documents)
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
            const existingImage = convexGalleryImages?.[index];
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

  const adminLoginMutation = useMutation(api.auth.adminLogin);
  const adminLogoutMutation = useMutation(api.auth.adminLogout);
  const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  const adminTokenVerification = useQuery(
    api.auth.verifyAdminToken,
    adminToken ? { token: adminToken } : 'skip'
  );

  // Auto-verify admin token on mount
  useEffect(() => {
    if (adminTokenVerification?.valid) {
      setIsAuthenticated(true);
    } else if (adminTokenVerification && !adminTokenVerification?.valid) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
    }
  }, [adminTokenVerification]);

  const handleLogin = async () => {
    try {
      const result = await adminLoginMutation({ password });
      if (result.success) {
        // Store token in localStorage
        localStorage.setItem('adminToken', result.token);
        setIsAuthenticated(true);
        setPassword('');
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      alert(t.wrongPassword);
      setPassword('');
    }
  };

  const handleAdminClose = async () => {
    // Logout from server
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        await adminLogoutMutation({ token });
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
    handleImageUpload,
    handleLogin,
    handleAdminClose,
    adminSection,
    setAdminSection,
    galleryImages,
    danPhoto,
    heroVideo,
    statsAnimated,
    setStatsAnimated,
    statsSessions,
    statsSatisfaction,
    statsClients,
    statsTemp,
    mobileMenuOpen,
    setMobileMenuOpen,
    audioRef,
    packagesRef,
    statsRef,
    t,
    toggleMusic,
    scrollToPackages,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
