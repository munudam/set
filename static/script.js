const preloader = document.getElementById('preloader');
    const toggleBtn = document.getElementById('darkToggle');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const heroText = document.getElementById('heroText');
    const heroButton = document.getElementById('heroButton');
    const sections = document.querySelectorAll('.section');

    // Apply saved theme immediately
    const isDark = localStorage.theme === 'dark' || 
                   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) { 
      document.documentElement.classList.add('dark'); 
      preloader.style.backgroundColor = '#1f2937'; 
      toggleBtn.textContent = '☀️'; 
    } else { 
      document.documentElement.classList.remove('dark'); 
      preloader.style.backgroundColor = '#ffffff'; 
      toggleBtn.textContent = '🌙'; 
    }

    // Preloader and looping typing animation
    window.addEventListener('load', () => {
      window.scrollTo(0, 0); // Ensure page loads at the top
      // Set hero section background to smoothly transition between two colors like a wave
      const heroSection = document.getElementById('home');
      let waveStep = 0;
      let prevColors = [128,128,128,128,128,128];
      function lerp(a, b, t) { return a + (b - a) * t; }
      function getTargetColors() {
        return [
          Math.floor(Math.random() * 256),
          Math.floor(Math.random() * 256),
          Math.floor(Math.random() * 256),
          Math.floor(Math.random() * 256),
          Math.floor(Math.random() * 256),
          Math.floor(Math.random() * 256)
        ];
      }
      let targetColors = getTargetColors();
      heroSection.style.transition = 'background 3.5s cubic-bezier(.68,-0.55,.27,1.55)';
      function setWaveGradient() {
        // Interpolate previous colors to target colors
        let t = 0;
        const duration = 70; // steps for smoothness
        function animate() {
          t++;
          let r1 = Math.floor(lerp(prevColors[0], targetColors[0], t/duration));
          let g1 = Math.floor(lerp(prevColors[1], targetColors[1], t/duration));
          let b1 = Math.floor(lerp(prevColors[2], targetColors[2], t/duration));
          let r2 = Math.floor(lerp(prevColors[3], targetColors[3], t/duration));
          let g2 = Math.floor(lerp(prevColors[4], targetColors[4], t/duration));
          let b2 = Math.floor(lerp(prevColors[5], targetColors[5], t/duration));
          heroSection.style.background = `linear-gradient(135deg, rgb(${r1},${g1},${b1}) 0%, rgb(${r2},${g2},${b2}) 100%)`;
          if (t < duration) {
            requestAnimationFrame(animate);
          } else {
            prevColors = targetColors;
            targetColors = getTargetColors();
            setTimeout(setWaveGradient, 3500);
          }
        }
        animate();
      }
      setWaveGradient();

      preloader.classList.add('hidden');
      document.body.classList.add('fade-in');

      const fullText = "Make easily work with technology 🚀";
      let index = 0;
      let typing = true;

      function typeLoop() {
        if (typing) {
          if (index === 0) heroText.textContent = ""; // Only clear on first typing
          heroText.textContent += fullText[index];
          index++;
          if (index === fullText.length) {
            typing = false;
            setTimeout(typeLoop, 1200); // Pause at full text
            return;
          }
        } else {
          heroText.textContent = heroText.textContent.slice(0, -1);
          if (heroText.textContent.length === 0) {
            typing = true;
            index = 0;
            setTimeout(typeLoop, 400); // Smooth restart
            return;
          }
        }
        setTimeout(typeLoop, typing ? 60 : 40); // Smoother typing and deleting
      }

      typeLoop();

      // Hero button bounce after first full type
      setTimeout(() => heroButton.classList.add('visible'), fullText.length * 60 + 300);
    });

    // Dark mode toggle
    toggleBtn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      if (document.documentElement.classList.contains('dark')) { 
        localStorage.theme = 'dark'; 
        preloader.style.backgroundColor = '#1f2937'; 
        toggleBtn.textContent = '☀️'; 
      } else { 
        localStorage.theme = 'light'; 
        preloader.style.backgroundColor = '#ffffff'; 
        toggleBtn.textContent = '🌙'; 
      }
    });

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      hamburger.classList.toggle('open');
    });

    // Scroll-triggered section animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    sections.forEach(section => observer.observe(section));
