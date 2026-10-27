/**
 * ================================================================
 *  BÓ HOA ẢNH - Interactive Photo Bouquet Experience
 * ================================================================
 */
(function () {
  'use strict';

  // ----------------------------------------------------------------
  // 1. STARFIELD CANVAS BACKGROUND
  // ----------------------------------------------------------------
  const starCanvas = document.getElementById('starCanvas');
  const ctx = starCanvas.getContext('2d');
  let stars = [];
  const NUM_STARS = 280;

  function resizeCanvas() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < NUM_STARS; i++) {
      stars.push({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        r: Math.random() * 1.8 + 0.3,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function drawStars(t) {
    ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    stars.forEach(s => {
      const a = s.alpha * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 210, 230, ${a})`;
      ctx.fill();
    });
  }

  resizeCanvas();
  createStars();
  let animT = 0;
  function starLoop() { animT += 0.016; drawStars(animT); requestAnimationFrame(starLoop); }
  starLoop();
  window.addEventListener('resize', () => { resizeCanvas(); createStars(); });

  // ----------------------------------------------------------------
  // 2. SCENE DATA & COMPOSITION
  // ----------------------------------------------------------------
  const PHOTO_ITEMS = [
    { src: 'img/p1.jpg', w: 86,  h: 104, rot: -7, x: 0,    y: -230, z: -30 },
    { src: 'img/p2.jpg', w: 78,  h: 94,  rot: 4,  x: -240, y: -90,  z: 80  },
    { src: 'img/p3.jpg', w: 82,  h: 98,  rot: -3, x: 230,  y: -10,  z: -60 },
    { src: 'img/p4.jpg', w: 92,  h: 110, rot: 6,  x: -260, y: 110,  z: 110 },
    { src: 'img/p5.jpg', w: 80,  h: 96,  rot: -5, x: 0,    y: 10,   z: -180},
    { src: 'img/p6.jpg', w: 76,  h: 92,  rot: 3,  x: -40,  y: 130,  z: 50  },
    { src: 'img/p7.jpg', w: 82,  h: 98,  rot: -4, x: 220,  y: 160,  z: -30 },
    { src: 'img/p8.jpg', w: 75,  h: 90,  rot: 7,  x: -310, y: 220,  z: -50 },
    { src: 'img/p9.jpg', w: 85,  h: 102, rot: -2, x: 50,   y: 250,  z: -100}
  ];

  const MESSAGE_ITEMS = [
    // Top right - prominent
    { text: 'Chúc em luôn yêu đời', x: 490, y: -240, z: 90, size: 21, op: 0.95 },
    // Far left - prominent
    { text: 'Chúc em luôn xinh đẹp', x: -500, y: 35, z: 100, size: 21, op: 0.95 },
    // Middle right - prominent
    { text: 'Chúc mừng ngày phụ nữ Việt Nam', x: 430, y: -45, z: 60, size: 19, op: 0.92 },
    // Bottom right - prominent
    { text: 'Chúc mừng 20/10 thật hạnh phúc ❤', x: 260, y: 175, z: 70, size: 19, op: 0.92 },
    // Bottom center - prominent
    { text: 'Chúc em luôn vui vẻ và hạnh phúc', x: -40, y: 265, z: 40, size: 19, op: 0.92 },

    // Midground
    { text: 'Mong mọi điều dịu dàng sẽ đến với em', x: -250, y: -140, z: 40, size: 17, op: 0.88 },
    { text: 'Chúc em thật nhiều may mắn', x: -280, y: 15, z: 30, size: 17, op: 0.88 },
    { text: 'mãi yêu em', x: 20, y: 75, z: -60, size: 16, op: 0.85 },
    { text: '20/10', x: 200, y: -160, z: -40, size: 16, op: 0.85 },
    { text: 'Em là ánh sao sáng của anh', x: 380, y: -180, z: -30, size: 17, op: 0.88 },
    { text: 'Dành cả tình yêu cho em', x: -430, y: -190, z: -50, size: 17, op: 0.88 },
    { text: 'Em đẹp nhất trong mắt anh', x: -380, y: 220, z: -40, size: 17, op: 0.88 },

    // Deeper / smaller background accents
    { text: 'Chúc em luôn xinh đẹp', x: -160, y: 175, z: -140, size: 14, op: 0.72 },
    { text: 'Mong mọi điều dịu dàng sẽ đến với em', x: 30, y: -80, z: -240, size: 13, op: 0.65 },
    { text: 'Chúc em luôn yêu đời', x: -120, y: -80, z: -210, size: 13, op: 0.65 },
    { text: 'Chúc mừng ngày phụ nữ Việt Nam', x: -360, y: -50, z: -190, size: 13, op: 0.65 },
    { text: 'Chúc mừng 20/10 thật hạnh phúc ❤', x: 310, y: 130, z: -210, size: 13, op: 0.65 },
    { text: 'Chúc em thật nhiều may mắn', x: 80, y: 130, z: -230, size: 13, op: 0.65 },
    { text: 'mãi yêu em', x: 220, y: 230, z: -150, size: 14, op: 0.72 },
    { text: '20/10', x: 320, y: 70, z: -130, size: 14, op: 0.72 },
    { text: 'Mãi bên em', x: -140, y: -220, z: -100, size: 15, op: 0.78 }
  ];

  const HEART_POSITIONS = [
    { x: -180, y: -240, z: -20 }, { x: 160, y: -220, z: 30 }, { x: 340, y: -250, z: -40 },
    { x: -440, y: -100, z: 50 }, { x: -350, y: -140, z: -60 }, { x: -100, y: -150, z: 70 },
    { x: 100, y: -160, z: -80 }, { x: 300, y: -120, z: 20 }, { x: 480, y: -130, z: -50 },
    { x: -550, y: -20, z: 40 }, { x: -400, y: -10, z: -30 }, { x: -150, y: -40, z: 120 },
    { x: 140, y: -50, z: -120 }, { x: 350, y: -30, z: 80 }, { x: 530, y: 10, z: -30 },
    { x: -470, y: 80, z: -20 }, { x: -200, y: 60, z: 70 }, { x: -70, y: 70, z: -140 },
    { x: 100, y: 60, z: 60 }, { x: 260, y: 70, z: -70 }, { x: 440, y: 90, z: 40 },
    { x: -360, y: 150, z: 30 }, { x: -150, y: 140, z: -80 }, { x: 120, y: 150, z: 100 },
    { x: 360, y: 180, z: -50 }, { x: -260, y: 210, z: -30 }, { x: -50, y: 200, z: 60 },
    { x: 160, y: 230, z: -60 }, { x: 330, y: 250, z: 20 }, { x: -120, y: 280, z: -40 },
    { x: 100, y: 280, z: 50 }, { x: -480, y: 190, z: 60 }, { x: 450, y: -90, z: 90 },
    { x: -30, y: -80, z: 40 }, { x: 50, y: -40, z: 90 }, { x: -20, y: 170, z: -30 }
  ];

  const LETTER = `Em yêu của anh,

Hôm nay là một ngày đặc biệt của em — và anh muốn em biết rằng, trong tất cả những điều tuyệt vời mà cuộc đời đã trao cho anh, em chính là điều kỳ diệu nhất.

Mỗi nụ cười của em là ánh nắng rực rỡ sưởi ấm từng góc tối trong lòng anh. Mỗi lần em cười, tim anh lại lỡ mất một nhịp đập — vì em quá đẹp, quá dịu dàng.

Anh muốn gửi đến em bó hoa này như một lời nhắc nhỏ: Em luôn được yêu thương — hôm nay, ngày mai, và mãi mãi về sau.

Chúc em ngày 20/10 thật hạnh phúc, luôn mỉm cười rạng rỡ và nhận được tất cả những điều em xứng đáng được nhận. ❤`;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  // ----------------------------------------------------------------
  // 3. BUILD 3D SCENE
  // ----------------------------------------------------------------
  const sceneWorld = document.getElementById('sceneWorld');
  const all3DElements = [];

  // Photo cards
  PHOTO_ITEMS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card._baseX = p.x - p.w / 2;
    card._baseY = p.y - p.h / 2;
    card._baseZ = p.z;
    card.style.transform = `translate3d(${card._baseX}px, ${card._baseY}px, ${card._baseZ}px)`;

    const inner = document.createElement('div');
    inner.className = 'photo-card-inner';
    inner.style.cssText = `width:${p.w}px;height:${p.h}px;--rot:${p.rot}deg;--float-dur:${rand(3.5,5.5).toFixed(1)}s;--float-delay:${rand(0,2).toFixed(1)}s;`;

    const img = document.createElement('img');
    img.src = p.src;
    img.alt = 'Kỷ niệm';
    img.loading = 'lazy';

    inner.appendChild(img);
    card.appendChild(inner);
    sceneWorld.appendChild(card);
    all3DElements.push(card);
  });

  // Love messages
  MESSAGE_ITEMS.forEach(item => {
    const wrap = document.createElement('div');
    wrap.className = 'love-msg-wrap';
    wrap._baseX = item.x;
    wrap._baseY = item.y;
    wrap._baseZ = item.z;
    wrap.style.transform = `translate3d(${item.x}px, ${item.y}px, ${item.z}px)`;

    const text = document.createElement('span');
    text.className = 'love-msg-text';
    text.textContent = item.text;
    text.style.cssText = `--msg-size:${item.size}px;--base-op:${item.op};--m-dur:${rand(3.5, 6).toFixed(1)}s;--f-delay:${rand(0, 3).toFixed(1)}s;`;

    wrap.appendChild(text);
    sceneWorld.appendChild(wrap);
    all3DElements.push(wrap);
  });

  // Hearts
  HEART_POSITIONS.forEach(pos => {
    const wrap = document.createElement('div');
    wrap.className = 'heart-wrap';
    wrap._baseX = pos.x;
    wrap._baseY = pos.y;
    wrap._baseZ = pos.z;
    wrap.style.transform = `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)`;

    const inner = document.createElement('span');
    inner.className = 'heart-inner';
    inner.textContent = '❤';
    inner.style.cssText = `--heart-size:${rand(12, 22).toFixed(0)}px;--h-dur:${rand(2.5, 5).toFixed(1)}s;--h-delay:${rand(0, 3).toFixed(1)}s;`;

    wrap.appendChild(inner);
    sceneWorld.appendChild(wrap);
    all3DElements.push(wrap);
  });

  // ----------------------------------------------------------------
  // 4. TRANSITION LOGIC
  // ----------------------------------------------------------------
  const bouquetScreen = document.getElementById('bouquetScreen');
  const bouquetWrap  = document.getElementById('bouquetWrap');
  const galaxyScreen = document.getElementById('galaxyScreen');
  const overlay      = document.getElementById('transitionOverlay');
  let galaxyOpen = false;

  function enterGalaxy() {
    if (galaxyOpen) return;
    galaxyOpen = true;
    rotX = 6; rotY = 0; zoomZ = 0;
    applyTransform();
    overlay.classList.add('flash');
    setTimeout(() => {
      overlay.classList.remove('flash');
      bouquetScreen.classList.add('hidden');
      galaxyScreen.classList.add('visible');
    }, 420);
  }

  bouquetWrap.addEventListener('click', enterGalaxy);
  bouquetWrap.addEventListener('touchend', e => { e.preventDefault(); enterGalaxy(); });

  document.getElementById('closeBouquetBtn').addEventListener('click', () => {
    galaxyScreen.classList.remove('visible');
    setTimeout(() => { bouquetScreen.classList.remove('hidden'); galaxyOpen = false; }, 500);
  });

  // ----------------------------------------------------------------
  // 5. 3D DRAG ROTATION, BILLBOARDING & ZOOM
  // ----------------------------------------------------------------
  const sceneContainer = document.getElementById('sceneContainer');
  let rotX = 6, rotY = 0, zoomZ = 0;
  let isDragging = false, lastX = 0, lastY = 0, velX = 0, velY = 0;

  function applyTransform() {
    sceneWorld.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${zoomZ}px)`;
    // Billboarding: each element counter-rotates so it always faces forward
    const invRy = -rotY;
    const invRx = -rotX;
    for (let i = 0; i < all3DElements.length; i++) {
      const el = all3DElements[i];
      el.style.transform = `translate3d(${el._baseX}px, ${el._baseY}px, ${el._baseZ}px) rotateY(${invRy}deg) rotateX(${invRx}deg)`;
    }
  }

  sceneContainer.addEventListener('mousedown', e => {
    isDragging = true; lastX = e.clientX; lastY = e.clientY; velX = 0; velY = 0; e.preventDefault();
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    velX = (e.clientX - lastX) * 0.22; velY = (e.clientY - lastY) * 0.22;
    rotY += velX; rotX -= velY;
    rotX = Math.max(-50, Math.min(50, rotX));
    lastX = e.clientX; lastY = e.clientY;
    applyTransform();
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  sceneContainer.addEventListener('wheel', e => {
    e.preventDefault();
    zoomZ = Math.max(-500, Math.min(500, zoomZ + (e.deltaY < 0 ? 35 : -35)));
    applyTransform();
  }, { passive: false });

  let tx0 = 0, ty0 = 0, pinchDist = 0;
  sceneContainer.addEventListener('touchstart', e => {
    if (e.touches.length === 1) { tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY; }
    else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchDist = Math.hypot(dx, dy);
    }
    e.preventDefault();
  }, { passive: false });

  sceneContainer.addEventListener('touchmove', e => {
    if (e.touches.length === 1) {
      rotY += (e.touches[0].clientX - tx0) * 0.3;
      rotX -= (e.touches[0].clientY - ty0) * 0.3;
      rotX = Math.max(-50, Math.min(50, rotX));
      tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY;
      applyTransform();
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const d = Math.hypot(dx, dy);
      zoomZ = Math.max(-500, Math.min(500, zoomZ + (d - pinchDist) * 2.5));
      pinchDist = d;
      applyTransform();
    }
    e.preventDefault();
  }, { passive: false });

  let lastInteract = 0;
  sceneContainer.addEventListener('mousedown',  () => { lastInteract = Date.now(); });
  sceneContainer.addEventListener('touchstart', () => { lastInteract = Date.now(); }, { passive: true });

  // Gentle subtle ambient rotation
  (function animLoop() {
    if (!isDragging) {
      if (Date.now() - lastInteract > 2500) {
        rotY += 0.025;
        applyTransform();
      }
      if (Math.abs(velX) > 0.01 || Math.abs(velY) > 0.01) {
        rotY += velX; rotX -= velY;
        rotX = Math.max(-50, Math.min(50, rotX));
        velX *= 0.93; velY *= 0.93;
        applyTransform();
      }
    }
    requestAnimationFrame(animLoop);
  })();

  // ----------------------------------------------------------------
  // 6. LOVE LETTER MODAL
  // ----------------------------------------------------------------
  const letterModal     = document.getElementById('letterModal');
  const letterModalBody = document.getElementById('letterModalBody');
  const letterCursor    = document.getElementById('letterCursor');
  let typeInterval = null, charIdx = 0;

  function startTypewriter() {
    letterModalBody.innerHTML = '';
    charIdx = 0; clearInterval(typeInterval);
    letterCursor.style.display = '';
    typeInterval = setInterval(() => {
      if (charIdx < LETTER.length) {
        if (LETTER[charIdx] === '\n') letterModalBody.appendChild(document.createElement('br'));
        else letterModalBody.appendChild(document.createTextNode(LETTER[charIdx]));
        charIdx++;
      } else {
        clearInterval(typeInterval);
        letterCursor.style.display = 'none';
      }
    }, 26);
  }

  function closeLetter() {
    letterModal.classList.remove('open');
    clearInterval(typeInterval);
    letterCursor.style.display = '';
  }

  document.getElementById('openLetterBtn').addEventListener('click', () => {
    letterModal.classList.add('open');
    startTypewriter();
  });
  document.getElementById('letterModalClose').addEventListener('click', closeLetter);
  letterModal.addEventListener('click', e => { if (e.target === letterModal) closeLetter(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLetter(); });

  applyTransform();
})();
