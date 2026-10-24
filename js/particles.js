// ===== FLOATING HEARTS & PETALS PARTICLE SYSTEM =====

(function () {
  const heartEmojis = ['💖', '💗', '💓', '💘', '💝', '❤️', '🌸', '✨', '💕', '💞'];
  const petalEmojis = ['🌸', '🌺', '🌹', '🌷', '✿'];

  // Create floating heart particles
  function createHeart() {
    const container = document.getElementById('heartsContainer');
    if (!container) return;

    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

    const size = Math.random() * 20 + 12;
    const left = Math.random() * 100;
    const duration = Math.random() * 8 + 6;
    const delay = Math.random() * 4;

    heart.style.cssText = `
      left: ${left}%;
      font-size: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    container.appendChild(heart);

    // Remove after animation
    setTimeout(() => {
      if (heart.parentNode) heart.parentNode.removeChild(heart);
    }, (duration + delay) * 1000 + 500);
  }

  // Create falling petals
  function createPetal() {
    const container = document.getElementById('petalsContainer');
    if (!container) return;

    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];

    const size = Math.random() * 14 + 10;
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 8;
    const delay = Math.random() * 5;

    petal.style.cssText = `
      left: ${left}%;
      top: -30px;
      font-size: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    container.appendChild(petal);

    setTimeout(() => {
      if (petal.parentNode) petal.parentNode.removeChild(petal);
    }, (duration + delay) * 1000 + 500);
  }

  // Create sparkle dots on background
  function createSparkles() {
    const bg = document.getElementById('bg');
    if (!bg) return;
    for (let i = 0; i < 25; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 3}s;
        animation-duration: ${Math.random() * 2 + 1.5}s;
        width: ${Math.random() * 4 + 3}px;
        height: ${Math.random() * 4 + 3}px;
        background: rgba(255,255,255,${Math.random() * 0.5 + 0.3});
      `;
      bg.appendChild(sparkle);
    }
  }

  // Click burst effect
  document.addEventListener('click', function (e) {
    const burst = ['💖', '✨', '🌸', '💕', '⭐'];
    for (let i = 0; i < 6; i++) {
      const el = document.createElement('div');
      el.textContent = burst[Math.floor(Math.random() * burst.length)];
      el.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        font-size: ${Math.random() * 16 + 12}px;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.8s ease-out, opacity 0.8s ease-out;
        transform: translate(0, 0);
        opacity: 1;
        user-select: none;
      `;
      document.body.appendChild(el);

      const angle = (Math.random() * 360) * (Math.PI / 180);
      const distance = Math.random() * 80 + 40;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transform = `translate(${dx}px, ${dy}px) scale(0.3)`;
          el.style.opacity = '0';
        });
      });

      setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 900);
    }
  });

  // Start particle loops
  document.addEventListener('DOMContentLoaded', function () {
    createSparkles();

    // Generate hearts continuously
    setInterval(createHeart, 600);
    setInterval(createPetal, 1200);

    // Initial batch
    for (let i = 0; i < 8; i++) {
      setTimeout(createHeart, i * 200);
      setTimeout(createPetal, i * 300);
    }
  });
})();
