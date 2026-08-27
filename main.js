/**
 * QUANTEXA — Master Orchestrator & User Interface Controller
 * Zero-gap transition from intro video to infinitely looping video.mp4 background in ultra slow motion.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const loaderOverlay = document.getElementById('loader-overlay');
  const loaderVideo = document.getElementById('loader-video');
  const homeHeroVideo = document.getElementById('home-hero-video');
  const customCursor = document.getElementById('custom-cursor');
  const registerForm = document.getElementById('register-form');
  const formChamber = document.getElementById('form-chamber');
  const formSuccess = document.getElementById('form-success');

  let hasTransitioned = false;

  // 1. Custom Reticle Cursor Follow
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    if (customCursor) {
      customCursor.style.left = `${cursorX}px`;
      customCursor.style.top = `${cursorY}px`;
    }
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Hover state for interactive elements
  const interactiveEls = document.querySelectorAll('a, button, input, select, .track-card, .faq-question');
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });

  // 2. Setup Ultra Slow Motion Playback Rate (0.35x speed)
  const SLOW_MOTION_SPEED = 0.35;

  function applySlowMotion() {
    if (homeHeroVideo) {
      homeHeroVideo.playbackRate = SLOW_MOTION_SPEED;
    }
  }
  
  if (homeHeroVideo) {
    applySlowMotion();
    homeHeroVideo.addEventListener('play', applySlowMotion);
    homeHeroVideo.addEventListener('loadeddata', applySlowMotion);
    homeHeroVideo.addEventListener('canplay', applySlowMotion);
    homeHeroVideo.addEventListener('ratechange', () => {
      if (homeHeroVideo.playbackRate !== SLOW_MOTION_SPEED) {
        homeHeroVideo.playbackRate = SLOW_MOTION_SPEED;
      }
    });
  }

  // 3. Zero-Gap Transition Function (Intro Video -> Infinitely Looping Ultra Slow-Mo video.mp4)
  function transitionToWebsite() {
    if (hasTransitioned) return;
    hasTransitioned = true;

    // Start home hero video playing in infinity loop at ultra slow motion
    if (homeHeroVideo) {
      homeHeroVideo.currentTime = 0;
      applySlowMotion();
      homeHeroVideo.play().then(() => {
        applySlowMotion();
      }).catch(e => console.log("Home hero video play:", e));
    }

    // Instant/Smooth crossfade out loader overlay so there is ZERO flash or gap
    if (loaderOverlay) {
      loaderOverlay.classList.add('fade-out');
    }

    // Unlock scrolling for the website
    document.body.classList.remove('loading-state');

    // Remove loader overlay completely after crossfade
    setTimeout(() => {
      if (loaderOverlay) {
        loaderOverlay.style.display = 'none';
      }
    }, 450);
  }

  // 4. Monitor Loader Video Playback for Zero-Gap Transition
  if (loaderVideo) {
    loaderVideo.play().catch(err => console.log("Video play request:", err));

    loaderVideo.addEventListener('timeupdate', () => {
      if (loaderVideo.duration && loaderVideo.currentTime >= loaderVideo.duration - 0.1) {
        transitionToWebsite();
      }
    });

    loaderVideo.addEventListener('ended', transitionToWebsite);
  }

  // Allow click or keypress to skip video anytime
  if (loaderOverlay) {
    loaderOverlay.addEventListener('click', transitionToWebsite);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
      transitionToWebsite();
    }
  });

  // 5. Hero Video Scroll Fading
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;
    
    if (homeHeroVideo) {
      const opacity = Math.max(0, 1 - (scrollY / (heroHeight * 0.75)));
      homeHeroVideo.style.opacity = opacity.toString();
    }
  });

  // 6. FAQ Accordion Handler
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });

  // 7. Registration Form Submission
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (formChamber) formChamber.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
    });
  }
});
