/**
 * ============================================================================
 * 💖 I LOVE YOU - INTERACTIVE HEART & ROMANTIC 6-SONG PLAYLIST EXPERIENCE
 * ============================================================================
 */

(function () {
  'use strict';

  // Canvas & Context Setup
  const canvas = document.getElementById('loveCanvas');
  const ctx = canvas.getContext('2d');

  // Audio & Music Player Elements
  const mainAudio = document.getElementById('mainAudio');
  const vinylDisc = document.getElementById('vinylDisc');
  const songTicker = document.getElementById('songTicker');
  const tickerTitle = document.getElementById('tickerTitle');
  const tickerArtist = document.getElementById('tickerArtist');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnPlayPause = document.getElementById('btnPlayPause');
  const iconPlay = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');
  const btnPlaylistToggle = document.getElementById('btnPlaylistToggle');
  const playlistDrawer = document.getElementById('playlistDrawer');
  const playlistItems = document.getElementById('playlistItems');
  const drawerNowPlaying = document.getElementById('drawerNowPlaying');
  const progressBarWrap = document.getElementById('progressBarWrap');
  const progressBarFill = document.getElementById('progressBarFill');
  const currentTimeEl = document.getElementById('currentTime');
  const totalDurationEl = document.getElementById('totalDuration');
  const bottomPrompt = document.getElementById('bottomPrompt');
  const centerHeart = document.getElementById('centerHeart');

  let width = 0;
  let height = 0;

  function handleResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', handleResize);
  handleResize();

  // ============================================================================
  // 6-SONG ROMANTIC PLAYLIST
  // ============================================================================
  const PLAYLIST = [
    {
      title: "Để Dành Khi Thức Giấc",
      artist: "SIVAN",
      src: "./sound/de_danh_khi_thuc_giac.m4a"
    },
    {
      title: "Ánh Sao Và Bầu Trời",
      artist: "T.R.I x Cá",
      src: "./sound/anh_sao_va_bau_troi.m4a"
    },
    {
      title: "Nàng Thơ",
      artist: "Hoàng Dũng",
      src: "./sound/nang_tho.m4a"
    },
    {
      title: "Chuyện Đôi Ta",
      artist: "Emcee L (Da LAB) ft. Muội",
      src: "./sound/chuyen_doi_ta.m4a"
    },
    {
      title: "11:11",
      artist: "MiiNa x RIN9",
      src: "./sound/11_11.m4a"
    },
    {
      title: "Có Em",
      artist: "Madihu ft. Low G",
      src: "./sound/co_em.m4a"
    }
  ];

  let currentSongIdx = 0;
  let isAudioPlaying = false;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function showToast(msg) {
    if (!bottomPrompt) return;
    bottomPrompt.textContent = msg;
    bottomPrompt.style.opacity = '1';
    clearTimeout(bottomPrompt._timer);
    bottomPrompt._timer = setTimeout(() => {
      bottomPrompt.style.opacity = '0.5';
    }, 4500);
  }

  function updatePlaylistUI() {
    const song = PLAYLIST[currentSongIdx];
    if (tickerTitle) tickerTitle.textContent = song.title;
    if (tickerArtist) tickerArtist.textContent = song.artist;
    if (drawerNowPlaying) drawerNowPlaying.textContent = `Đang phát: ${song.title} - ${song.artist}`;

    // Update list items
    const items = playlistItems ? playlistItems.querySelectorAll('.song-item') : [];
    items.forEach((item, idx) => {
      if (idx === currentSongIdx) {
        item.classList.add('active');
        if (isAudioPlaying) item.classList.add('playing');
        else item.classList.remove('playing');
      } else {
        item.classList.remove('active', 'playing');
      }
    });

    if (isAudioPlaying) {
      if (iconPlay) iconPlay.style.display = 'none';
      if (iconPause) iconPause.style.display = 'block';
      if (vinylDisc) vinylDisc.classList.add('spinning');
    } else {
      if (iconPlay) iconPlay.style.display = 'block';
      if (iconPause) iconPause.style.display = 'none';
      if (vinylDisc) vinylDisc.classList.remove('spinning');
    }
  }

  function loadSong(idx, shouldPlay = false) {
    currentSongIdx = (idx + PLAYLIST.length) % PLAYLIST.length;
    const song = PLAYLIST[currentSongIdx];
    mainAudio.src = song.src;
    mainAudio.load();
    updatePlaylistUI();

    if (shouldPlay) {
      playSong();
    }
  }

  function playSong() {
    mainAudio.play().then(() => {
      isAudioPlaying = true;
      updatePlaylistUI();
      const song = PLAYLIST[currentSongIdx];
      showToast(`🎵 Đang phát: ${song.title} - ${song.artist} 💕`);
    }).catch(err => {
      console.log('Autoplay waiting for user gesture:', err);
    });
  }

  function pauseSong() {
    mainAudio.pause();
    isAudioPlaying = false;
    updatePlaylistUI();
  }

  function togglePlay(e) {
    if (e) e.stopPropagation();
    if (isAudioPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  }

  function nextSong(e) {
    if (e) e.stopPropagation();
    loadSong(currentSongIdx + 1, true);
  }

  function prevSong(e) {
    if (e) e.stopPropagation();
    loadSong(currentSongIdx - 1, true);
  }

  // Generate Playlist DOM
  function initPlaylistDrawer() {
    if (!playlistItems) return;
    playlistItems.innerHTML = '';
    PLAYLIST.forEach((song, idx) => {
      const item = document.createElement('div');
      item.className = 'song-item' + (idx === currentSongIdx ? ' active' : '');
      item.innerHTML = `
        <div class="song-left">
          <span class="song-idx">${idx + 1 < 10 ? '0' : ''}${idx + 1}</span>
          <div class="song-meta">
            <span class="song-name">${song.title}</span>
            <span class="song-artist">${song.artist}</span>
          </div>
        </div>
        <div class="song-equalizer">
          <div class="eq-bar-item"></div>
          <div class="eq-bar-item"></div>
          <div class="eq-bar-item"></div>
        </div>
      `;
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        loadSong(idx, true);
      });
      playlistItems.appendChild(item);
    });
  }

  // Audio Event Listeners
  mainAudio.addEventListener('timeupdate', () => {
    if (!isNaN(mainAudio.duration) && mainAudio.duration > 0) {
      const progress = (mainAudio.currentTime / mainAudio.duration) * 100;
      if (progressBarFill) progressBarFill.style.width = `${progress}%`;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(mainAudio.currentTime);
      if (totalDurationEl) totalDurationEl.textContent = formatTime(mainAudio.duration);
    }
  });

  mainAudio.addEventListener('ended', () => {
    // Automatically play next song in playlist
    nextSong();
  });

  mainAudio.addEventListener('play', () => {
    isAudioPlaying = true;
    updatePlaylistUI();
  });

  mainAudio.addEventListener('pause', () => {
    isAudioPlaying = false;
    updatePlaylistUI();
  });

  // Scrubber Click
  if (progressBarWrap) {
    progressBarWrap.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = progressBarWrap.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      if (!isNaN(mainAudio.duration)) {
        mainAudio.currentTime = pos * mainAudio.duration;
      }
    });
  }

  // Button Controls
  if (btnPlayPause) btnPlayPause.addEventListener('click', togglePlay);
  if (vinylDisc) vinylDisc.addEventListener('click', togglePlay);
  if (btnNext) btnNext.addEventListener('click', nextSong);
  if (btnPrev) btnPrev.addEventListener('click', prevSong);

  // Playlist Drawer Toggle
  if (btnPlaylistToggle) {
    btnPlaylistToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (playlistDrawer) playlistDrawer.classList.toggle('open');
    });
  }
  if (songTicker) {
    songTicker.addEventListener('click', (e) => {
      e.stopPropagation();
      if (playlistDrawer) playlistDrawer.classList.toggle('open');
    });
  }

  // Close drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (playlistDrawer && !playlistDrawer.contains(e.target) && !btnPlaylistToggle.contains(e.target) && !songTicker.contains(e.target)) {
      playlistDrawer.classList.remove('open');
    }
  });

  // Autoplay on first user interaction anywhere
  const triggerAutoPlay = () => {
    if (!isAudioPlaying) {
      playSong();
    }
  };
  window.addEventListener('click', triggerAutoPlay, { once: true });
  window.addEventListener('touchstart', triggerAutoPlay, { once: true });

  // Initialize
  initPlaylistDrawer();
  loadSong(0, false);

  // ============================================================================
  // MATHEMATICAL BEZIER HEART SPLINE & ARC LENGTH LOOKUP TABLE
  // ============================================================================
  function cubicBezier(p0, p1, p2, p3, t) {
    const mt = 1 - t;
    return {
      x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
      y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y
    };
  }

  // Symmetrical 4-segment Bezier Heart normalized to [-1, 1] range:
  const seg1 = (t) => cubicBezier({ x: 0, y: 0.85 }, { x: -0.55, y: 0.3 }, { x: -0.95, y: -0.05 }, { x: -0.92, y: -0.42 }, t);
  const seg2 = (t) => cubicBezier({ x: -0.92, y: -0.42 }, { x: -0.88, y: -0.9 }, { x: -0.35, y: -0.98 }, { x: 0, y: -0.62 }, t);
  const seg3 = (t) => cubicBezier({ x: 0, y: -0.62 }, { x: 0.35, y: -0.98 }, { x: 0.88, y: -0.9 }, { x: 0.92, y: -0.42 }, t);
  const seg4 = (t) => cubicBezier({ x: 0.92, y: -0.42 }, { x: 0.95, y: -0.05 }, { x: 0.55, y: 0.3 }, { x: 0, y: 0.85 }, t);

  const N_SEG = 800;
  const lut = [];
  let totalPerimeter = 0;

  (function buildLookupTable() {
    const segments = [seg1, seg2, seg3, seg4];
    let prev = segments[0](0);
    lut.push({ s: 0, x: prev.x, y: prev.y });

    for (let s = 0; s < 4; s++) {
      for (let i = 1; i <= N_SEG; i++) {
        const pt = segments[s](i / N_SEG);
        const ds = Math.hypot(pt.x - prev.x, pt.y - prev.y);
        totalPerimeter += ds;
        lut.push({ s: totalPerimeter, x: pt.x, y: pt.y });
        prev = pt;
      }
    }
  })();

  function getPointAlongHeart(dist) {
    dist = ((dist % totalPerimeter) + totalPerimeter) % totalPerimeter;
    let low = 0, high = lut.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (lut[mid].s < dist) low = mid + 1;
      else high = mid - 1;
    }
    const idx = Math.max(1, Math.min(lut.length - 1, low));
    const p0 = lut[idx - 1];
    const p1 = lut[idx];
    const ratio = (dist - p0.s) / (p1.s - p0.s || 1e-6);

    const x = p0.x + (p1.x - p0.x) * ratio;
    const y = p0.y + (p1.y - p0.y) * ratio;

    // Smoothed tangent angle
    const step = 12;
    const nextPt = lut[(idx + step) % lut.length];
    const prevPt = lut[(idx - step + lut.length) % lut.length];
    const angle = Math.atan2(nextPt.y - prevPt.y, nextPt.x - prevPt.x);

    return { x, y, angle };
  }

  // ============================================================================
  // STARRY COSMOS BACKGROUND
  // ============================================================================
  const stars = [];
  for (let i = 0; i < 110; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.6,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.008
    });
  }

  // Romantic Shooting Stars
  const shootingStars = [];
  function spawnShootingStar() {
    shootingStars.push({
      x: Math.random() * width * 0.7,
      y: Math.random() * height * 0.35,
      len: Math.random() * 80 + 50,
      speed: Math.random() * 7 + 8,
      angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.2,
      opacity: 1,
      decay: Math.random() * 0.022 + 0.014
    });
  }

  // ============================================================================
  // FLOATING HEARTS & PARTICLES
  // ============================================================================
  const floatingHearts = [];
  const heartColors = ['#ff4d88', '#ff70a6', '#ff99c8', '#ff2a70', '#ffffff', '#ffb3c6'];

  function spawnFloatingHeart(x, y, isBurst = false) {
    floatingHearts.push({
      x: x !== undefined ? x : Math.random() * width,
      y: y !== undefined ? y : height + 25,
      vx: (Math.random() - 0.5) * (isBurst ? 6 : 1.2),
      vy: isBurst ? -(Math.random() * 7 + 4) : -(Math.random() * 1.5 + 0.8),
      size: isBurst ? Math.random() * 18 + 12 : Math.random() * 14 + 8,
      alpha: 1,
      decay: isBurst ? Math.random() * 0.015 + 0.012 : Math.random() * 0.005 + 0.003,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.04,
      color: heartColors[Math.floor(Math.random() * heartColors.length)]
    });
  }

  for (let i = 0; i < 28; i++) {
    floatingHearts.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -(Math.random() * 1.2 + 0.6),
      size: Math.random() * 14 + 8,
      alpha: Math.random() * 0.8 + 0.2,
      decay: Math.random() * 0.004 + 0.002,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.03,
      color: heartColors[Math.floor(Math.random() * heartColors.length)]
    });
  }

  // ============================================================================
  // INTERIOR STARDUST PARTICLES (Trái tim sao lung linh)
  // ============================================================================
  const heartParticles = [];
  const PARTICLE_COUNT = 380;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const s = Math.random() * totalPerimeter;
    const pt = getPointAlongHeart(s);
    const r = Math.sqrt(Math.random()) * 0.82;
    heartParticles.push({
      baseX: pt.x * r,
      baseY: pt.y * r,
      size: Math.random() * 2.5 + 1.2,
      alpha: Math.random() * 0.7 + 0.3,
      pulseSpeed: Math.random() * 0.05 + 0.02,
      pulseOffset: Math.random() * Math.PI * 2,
      color: ['#ff2a70', '#ff6699', '#ff99bb', '#ffc2d4', '#ffffff'][Math.floor(Math.random() * 5)]
    });
  }

  // ============================================================================
  // INTERACTIVE CURSOR & TOUCH TRAILS
  // ============================================================================
  const mouseTrail = [];
  let extraBeat = 0;

  function addTrail(x, y) {
    if (Math.random() < 0.45) {
      mouseTrail.push({
        x: x,
        y: y,
        size: Math.random() * 10 + 6,
        alpha: 1,
        rot: Math.random() * Math.PI,
        color: '#ff4d88'
      });
    }
  }

  window.addEventListener('mousemove', (e) => {
    addTrail(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      addTrail(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('click', (e) => {
    extraBeat = 0.16;
    for (let i = 0; i < 20; i++) {
      spawnFloatingHeart(e.clientX, e.clientY, true);
    }
  });

  if (centerHeart) {
    centerHeart.addEventListener('click', (e) => {
      e.stopPropagation();
      extraBeat = 0.32;
      for (let i = 0; i < 30; i++) {
        spawnFloatingHeart(width / 2, height / 2 + 10, true);
      }
    });
  }

  // ============================================================================
  // RENDER MINI HEART HELPER
  // ============================================================================
  function drawMiniHeart(ctx, x, y, size, color, alpha, rot = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = color;
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.beginPath();
    const topCurve = size * 0.3;
    ctx.moveTo(0, topCurve);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurve);
    ctx.bezierCurveTo(-size / 2, (size + topCurve) / 2, 0, size * 0.85, 0, size);
    ctx.bezierCurveTo(0, size * 0.85, size / 2, (size + topCurve) / 2, size / 2, topCurve);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurve);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // ============================================================================
  // MAIN ANIMATION LOOP
  // ============================================================================
  let offsetOuter = 0;
  let offsetInner = 0;

  const phraseOuter = "♥ I LOVE YOU ♥";
  const phraseInner = "✦ I LOVE YOU ✦";

  function render() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Starfield
    ctx.save();
    for (let star of stars) {
      star.alpha += star.speed;
      const opacity = (Math.sin(star.alpha) + 1) * 0.4 + 0.1;
      ctx.fillStyle = `rgba(255, 220, 240, ${opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 2. Draw Shooting Stars
    ctx.save();
    if (Math.random() < 0.015 && shootingStars.length < 3) {
      spawnShootingStar();
    }
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.opacity -= s.decay;

      if (s.opacity <= 0) {
        shootingStars.splice(i, 1);
      } else {
        ctx.strokeStyle = `rgba(255, 180, 220, ${s.opacity})`;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#ff69b4';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
        ctx.stroke();
      }
    }
    ctx.restore();

    // 3. Heartbeat Dynamics (Dual Lub-Dub pulse)
    const now = Date.now() / 1000;
    const cycle = (now / 1.25) % 1;
    let beat = 1;
    if (cycle < 0.16) {
      beat = 1 + 0.08 * Math.sin((cycle / 0.16) * Math.PI);
    } else if (cycle >= 0.22 && cycle < 0.36) {
      beat = 1 + 0.045 * Math.sin(((cycle - 0.22) / 0.14) * Math.PI);
    }

    if (extraBeat > 0.001) {
      beat += extraBeat;
      extraBeat *= 0.94;
    }

    const cx = width / 2;
    const cy = height / 2 + 10;
    const heartRadius = Math.min(width, height) * 0.44;
    const scale = heartRadius * beat;

    // 4. Center Radial Romance Glow
    ctx.save();
    const radGlow = ctx.createRadialGradient(cx, cy - 25, 15, cx, cy - 25, scale * 1.05);
    radGlow.addColorStop(0, 'rgba(255, 30, 110, 0.42)');
    radGlow.addColorStop(0.38, 'rgba(255, 20, 80, 0.18)');
    radGlow.addColorStop(0.75, 'rgba(230, 0, 90, 0.05)');
    radGlow.addColorStop(1, 'rgba(200, 0, 80, 0)');
    ctx.fillStyle = radGlow;
    ctx.beginPath();
    ctx.arc(cx, cy - 25, scale * 1.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. Stardust Heart Particles
    ctx.save();
    for (let p of heartParticles) {
      p.pulseOffset += p.pulseSpeed;
      const pScale = scale * (1 + 0.04 * Math.sin(p.pulseOffset));
      const px = cx + p.baseX * pScale;
      const py = cy + p.baseY * pScale;
      const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulseOffset));

      ctx.fillStyle = p.color;
      ctx.globalAlpha = currentAlpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 6. Soft Radiant Heart Neon Stroke Silhouette
    ctx.save();
    ctx.beginPath();
    const pInit = lut[0];
    ctx.moveTo(cx + pInit.x * scale, cy + pInit.y * scale);
    for (let i = 1; i < lut.length; i += 6) {
      ctx.lineTo(cx + lut[i].x * scale, cy + lut[i].y * scale);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255, 45, 117, 0.32)';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#ff1a6c';
    ctx.shadowBlur = 24;
    ctx.stroke();
    ctx.restore();

    // 7. MAIN BORDER: Perfectly Spaced "♥ I LOVE YOU ♥" words
    const countOuter = 14;
    const stepOuter = totalPerimeter / countOuter;
    const fontSizeOuter = Math.max(12, Math.round(scale * 0.046));

    ctx.save();
    ctx.font = `800 ${fontSizeOuter}px 'Montserrat', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < countOuter; i++) {
      const dist = (i * stepOuter + offsetOuter) % totalPerimeter;
      const pt = getPointAlongHeart(dist);

      let ang = pt.angle;
      if (Math.abs(ang) > Math.PI / 2) {
        ang += Math.PI;
      }

      const posX = cx + pt.x * scale;
      const posY = cy + pt.y * scale;

      ctx.save();
      ctx.translate(posX, posY);
      ctx.rotate(ang);

      // Deep pink neon glow
      ctx.shadowColor = '#ff1f6d';
      ctx.shadowBlur = 22;
      ctx.fillStyle = '#ff7dad';
      ctx.fillText(phraseOuter, 0, 0);

      // Crystal white crisp core
      ctx.shadowBlur = 5;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(phraseOuter, 0, 0);

      ctx.restore();
    }
    ctx.restore();

    // 8. SECOND INNER BORDER: Delicate "✦ I LOVE YOU ✦" Ribbon
    const innerScale = scale * 0.88;
    const countInner = 11;
    const stepInner = totalPerimeter / countInner;
    const fontSizeInner = Math.max(10, Math.round(innerScale * 0.036));

    ctx.save();
    ctx.font = `700 ${fontSizeInner}px 'Outfit', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < countInner; i++) {
      const dist = (i * stepInner - offsetInner + totalPerimeter) % totalPerimeter;
      const pt = getPointAlongHeart(dist);

      let ang = pt.angle;
      if (Math.abs(ang) > Math.PI / 2) {
        ang += Math.PI;
      }

      const posX = cx + pt.x * innerScale;
      const posY = cy + pt.y * innerScale;

      ctx.save();
      ctx.translate(posX, posY);
      ctx.rotate(ang);

      ctx.shadowColor = '#ff6b9d';
      ctx.shadowBlur = 12;
      ctx.fillStyle = 'rgba(255, 200, 230, 0.95)';
      ctx.fillText(phraseInner, 0, 0);

      ctx.restore();
    }
    ctx.restore();

    // 9. Floating Hearts (Ascending and Expanding)
    ctx.save();
    if (Math.random() < 0.07) spawnFloatingHeart();

    for (let i = floatingHearts.length - 1; i >= 0; i--) {
      const fh = floatingHearts[i];
      fh.x += fh.vx;
      fh.y += fh.vy;
      fh.rot += fh.vRot;
      fh.alpha -= fh.decay;

      if (fh.alpha <= 0 || fh.y < -50) {
        floatingHearts.splice(i, 1);
      } else {
        drawMiniHeart(ctx, fh.x, fh.y, fh.size, fh.color, fh.alpha, fh.rot);
      }
    }
    ctx.restore();

    // 10. Interactive Cursor Trails
    ctx.save();
    for (let i = mouseTrail.length - 1; i >= 0; i--) {
      const t = mouseTrail[i];
      t.alpha -= 0.025;
      t.y -= 0.6;
      if (t.alpha <= 0) {
        mouseTrail.splice(i, 1);
      } else {
        drawMiniHeart(ctx, t.x, t.y, t.size, t.color, t.alpha, t.rot);
      }
    }
    ctx.restore();

    // Motion offsets
    offsetOuter += 0.0028;
    offsetInner += 0.0022;

    requestAnimationFrame(render);
  }

  // Start the animation loop
  render();

})();
