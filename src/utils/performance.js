// Performance monitoring utilities

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window !== 'undefined' && 'performance' in window && process.env.NODE_ENV === 'production') {
    // Track Core Web Vitals if available (only in production)
    try {
      // Use reportWebVitals if available (from CRA template)
      if (window.reportWebVitals) {
        window.reportWebVitals((metric) => {
          // Only log in production
          if (process.env.NODE_ENV === 'production') {
            console.log('Web Vital:', metric);
          }
        });
      }
    } catch (error) {
      // Silent in development
      if (process.env.NODE_ENV === 'production') {
        console.log('Web Vitals not available:', error.message);
      }
    }
  }
};

// Performance observer for custom metrics
export const observePerformance = () => {
  if ('PerformanceObserver' in window && process.env.NODE_ENV === 'production') {
    // Observe navigation timing (only in production)
    const navObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('Navigation timing:', {
          name: entry.name,
          duration: entry.duration,
          startTime: entry.startTime
        });
      }
    });
    navObserver.observe({ entryTypes: ['navigation'] });

    // Observe resource timing (only in production)
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('api.openweathermap.org')) {
          console.log('Weather API timing:', {
            name: entry.name,
            duration: entry.duration,
            transferSize: entry.transferSize
          });
        }
      }
    });
    resourceObserver.observe({ entryTypes: ['resource'] });

    // Observe paint timing (only in production)
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('Paint timing:', {
          name: entry.name,
          startTime: entry.startTime
        });
      }
    });
    paintObserver.observe({ entryTypes: ['paint'] });
  }
};

// Memory usage monitoring
export const monitorMemory = () => {
  if ('memory' in performance && process.env.NODE_ENV === 'production') {
    const memInfo = performance.memory;
    console.log('Memory usage:', {
      used: Math.round(memInfo.usedJSHeapSize / 1048576) + ' MB',
      total: Math.round(memInfo.totalJSHeapSize / 1048576) + ' MB',
      limit: Math.round(memInfo.jsHeapSizeLimit / 1048576) + ' MB'
    });
  }
};

// Network information
export const getNetworkInfo = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }
  return null;
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const resources = [
    { href: 'https://api.openweathermap.org', as: 'fetch', crossorigin: 'anonymous' },
    { href: 'https://openweathermap.org/img/wn/', as: 'image' }
  ];

  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = resource.href;
    if (resource.crossorigin) {
      link.crossOrigin = resource.crossorigin;
    }
    document.head.appendChild(link);
  });
};

// Lazy load images with intersection observer
export const lazyLoadImages = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

// Bundle size analysis (development only)
export const analyzeBundleSize = () => {
  // Silent function - bundle analysis available via npm scripts if needed
  // To analyze bundle size, run: npm install --save-dev webpack-bundle-analyzer
  // Then add to package.json scripts: "analyze": "npx webpack-bundle-analyzer build/static/js/*.js"
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  if (process.env.NODE_ENV === 'production') {
    trackWebVitals();
    observePerformance();
    preloadCriticalResources();

    // Monitor memory usage every 30 seconds (production only)
    setInterval(monitorMemory, 30000);

    // Log network info (production only)
    const networkInfo = getNetworkInfo();
    if (networkInfo) {
      console.log('Network info:', networkInfo);
    }
  }

  // Always enable lazy loading (but silently in development)
  setTimeout(lazyLoadImages, 1000);
};
