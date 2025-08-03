// Ultra-optimized JavaScript with enhanced mobile/desktop functionality
class KitchenToolsApp {
  constructor() {
    this.video = document.querySelector('.product-video');
    this.modal = document.getElementById('imageModal');
    this.modalImg = this.modal?.querySelector('.modal-img');
    this.isModalOpen = false;
    this.currentImageSrc = null;
    this.imageCache = new Map();
    this.currentImageIndex = 0;
    this.images = [];
    this.isMobile = window.innerWidth <= 768;
    this.init();
  }

  init() {
    this.setupImages();
    this.setupVideo();
    this.setupGallery();
    this.setupModal();
    this.setupResponsive();
    this.preloadAssets();
  }

  setupImages() {
    // جمع جميع الصور من المعارض المختلفة
    const mainThumbs = document.querySelectorAll('.main-thumb');
    const desktopThumbs = document.querySelectorAll('.desktop-thumb');
    const dots = document.querySelectorAll('.dot');
    
    mainThumbs.forEach((thumb, index) => {
      this.images.push({
        src: thumb.src,
        alt: thumb.alt,
        element: thumb,
        desktopElement: desktopThumbs[index],
        dot: dots[index]
      });
    });
  }

  setupVideo() {
    if (!this.video) return;
    
    const muteBtn = document.querySelector('.mute-btn');
    const fullscreenBtn = document.querySelector('.fullscreen-btn');

    // Auto-play with intersection observer for better performance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.video.play().catch(() => {}); // Silent fail for autoplay restrictions
        } else {
          this.video.pause();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(this.video);

    // Video loaded event
    this.video.addEventListener('loadeddata', () => {
      this.video.play().catch(() => {});
    });

    // Click to play/pause
    this.video.addEventListener('click', (e) => {
      e.stopPropagation();
      this.video.paused ? this.video.play() : this.video.pause();
    });

    // Mute toggle
    muteBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.video.muted = !this.video.muted;
      muteBtn.textContent = this.video.muted ? '🔇' : '🔊';
      muteBtn.dataset.muted = this.video.muted;
    });

    // Fullscreen
    fullscreenBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.requestFullscreen(this.video);
    });

    // Video error handling
    this.video.addEventListener('error', () => {
      console.warn('Video failed to load');
    });
  }

  setupGallery() {
    // Setup main gallery (mobile and desktop)
    this.images.forEach((img, index) => {
      // Main thumbnails
      if (img.element) {
        this.setupImageElement(img.element, index);
      }
      
      // Desktop thumbnails
      if (img.desktopElement) {
        this.setupImageElement(img.desktopElement, index);
      }
      
      // Gallery dots
      if (img.dot) {
        img.dot.addEventListener('click', (e) => {
          e.preventDefault();
          this.switchImage(index);
        });
      }
    });

    // Initialize first image as active
    this.switchImage(0);
  }

  setupImageElement(element, index) {
    // Single click to open/close fullscreen
    element.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleFullscreen(this.images[index].src, this.images[index].alt);
    });
    
    // Preload on hover for instant loading
    element.addEventListener('mouseenter', () => {
      this.preloadImage(this.images[index].src);
    }, { once: true });

    // Visual feedback
    element.addEventListener('mousedown', () => {
      element.style.transform = 'scale(0.95)';
    });

    element.addEventListener('mouseup', () => {
      element.style.transform = '';
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
    });

    // Touch events for mobile
    if (this.isMobile) {
      element.addEventListener('touchstart', (e) => {
        element.style.transform = 'scale(0.95)';
      });

      element.addEventListener('touchend', (e) => {
        element.style.transform = '';
      });
    }
  }

  switchImage(index) {
    if (index < 0 || index >= this.images.length) return;
    
    this.currentImageIndex = index;
    
    // Update active states
    this.images.forEach((img, i) => {
      const isActive = i === index;
      
      // Main thumbnails
      if (img.element) {
        img.element.classList.toggle('active', isActive);
      }
      
      // Desktop thumbnails
      if (img.desktopElement) {
        img.desktopElement.classList.toggle('active', isActive);
      }
      
      // Dots
      if (img.dot) {
        img.dot.classList.toggle('active', isActive);
      }
    });
  }

  setupModal() {
    if (!this.modal || !this.modalImg) return;
    
    const closeBtn = this.modal.querySelector('.close-btn');
    
    // Close button
    closeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeModal();
    });
    
    // Click on image to close (single click toggle)
    this.modalImg.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeModal();
    });
    
    // Click outside image to close
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isModalOpen) {
        this.closeModal();
      }
      
      // Arrow keys for navigation
      if (this.isModalOpen) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.navigateModal(-1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.navigateModal(1);
        }
      }
    });

    // Prevent context menu on modal image
    this.modalImg.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Swipe gestures for mobile
    if (this.isMobile) {
      this.setupSwipeGestures();
    }
  }

  setupSwipeGestures() {
    let startX = 0;
    let startY = 0;
    
    this.modalImg.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });
    
    this.modalImg.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      // Check if it's a horizontal swipe
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left - next image
          this.navigateModal(1);
        } else {
          // Swipe right - previous image
          this.navigateModal(-1);
        }
      }
    });
  }

  navigateModal(direction) {
    if (!this.isModalOpen) return;
    
    const newIndex = this.currentImageIndex + direction;
    if (newIndex >= 0 && newIndex < this.images.length) {
      const newImage = this.images[newIndex];
      this.currentImageIndex = newIndex;
      this.openModal(newImage.src, newImage.alt, false);
      this.switchImage(newIndex);
    }
  }

  toggleFullscreen(src, alt) {
    if (this.isModalOpen && this.currentImageSrc === src) {
      // Same image clicked - close modal
      this.closeModal();
    } else {
      // Different image or modal closed - open with new image
      const imageIndex = this.images.findIndex(img => img.src === src);
      if (imageIndex !== -1) {
        this.currentImageIndex = imageIndex;
        this.switchImage(imageIndex);
      }
      this.openModal(src, alt);
    }
  }

  async openModal(src, alt, updateIndex = true) {
    // Prevent multiple rapid clicks
    if (this.isModalOpen && this.currentImageSrc === src && updateIndex) return;
    
    this.currentImageSrc = src;
    
    // Pre-load image if not cached
    await this.preloadImage(src);
    
    // Set image source only after it's loaded to prevent flicker
    if (this.modalImg.src !== src) {
      this.modalImg.src = src;
      this.modalImg.alt = alt;
    }
    
    // Show modal smoothly
    this.modal.style.display = 'flex';
    requestAnimationFrame(() => {
      this.modal.classList.add('show');
    });
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    this.isModalOpen = true;
  }

  closeModal() {
    if (!this.isModalOpen) return;
    
    this.modal.classList.remove('show');
    
    // Wait for transition to complete before hiding
    setTimeout(() => {
      if (!this.modal.classList.contains('show')) {
        this.modal.style.display = 'none';
      }
    }, 300);
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
    this.isModalOpen = false;
    this.currentImageSrc = null;
  }

  async preloadImage(src) {
    if (this.imageCache.has(src)) {
      return this.imageCache.get(src);
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

    this.imageCache.set(src, promise);
    
    try {
      await promise;
    } catch (error) {
      this.imageCache.delete(src);
      console.warn('Failed to preload image:', src);
    }
    
    return promise;
  }

  requestFullscreen(element) {
    const methods = [
      'requestFullscreen',
      'webkitRequestFullscreen',
      'mozRequestFullScreen',
      'msRequestFullscreen'
    ];
    
    const method = methods.find(m => element[m]);
    if (method) element[method]();
  }

  setupResponsive() {
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.isMobile = window.innerWidth <= 768;
        this.handleResponsiveChanges();
      }, 250);
    });
  }

  handleResponsiveChanges() {
    // Re-setup mobile-specific features if needed
    if (this.isMobile && !this.swipeGesturesSetup) {
      this.setupSwipeGestures();
      this.swipeGesturesSetup = true;
    }
  }

  preloadAssets() {
    // Preload all gallery images for instant access
    this.images.forEach((img, index) => {
      // Preload first image immediately, others after a short delay
      setTimeout(() => {
        this.preloadImage(img.src);
      }, index * 100);
    });

    // Preload video poster or first frame
    if (this.video) {
      this.video.addEventListener('loadeddata', () => {
        // Video is ready
      }, { once: true });
    }
  }

  // Utility methods for better performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new KitchenToolsApp());
} else {
  new KitchenToolsApp();
}
