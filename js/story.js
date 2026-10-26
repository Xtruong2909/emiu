/**
 * ============================================================================
 * 💖 NHẬT KÝ TÌNH YÊU LÃNG MẠN (ROMANTIC LOVE STORY & MEMORY JOURNAL)
 * Logic & Hiệu ứng tương tác: Phong bì niêm phong sáp, đĩa than, đếm ngày,
 * typewriter, cánh hoa rơi, vệt sáng chuột, và pháo hoa trái tim.
 * ============================================================================
 */

(function () {
  'use strict';

  // ============================================================================
  // 1. DATA & LOCAL STORAGE CONFIGURATION
  // ============================================================================
  const DEFAULT_CONFIG = {
    maleName: "Xuân Trường",
    femaleName: "Lan Anh",
    startDate: "2025-10-26", // YYYY-MM-DD
    quote: "Dẫu cho năm tháng đổi thay, chỉ cần ngoảnh lại, anh vẫn sẽ luôn ở đây cạnh em...",
    letterSalutation: "Gửi Lan Anh - Em bé ngoan của anh ♥",
    letterBody: `Gửi em, cô gái đã thắp sáng cả bầu trời trong lòng anh...

Cảm ơn em vì đã đến bên anh, vì những nụ cười trong veo, những cái ôm ấm áp và cả những khoảnh khắc giản đơn mà vô cùng quý giá. 

Mỗi ngày trôi qua cùng em đều là một ngày tuyệt vời. Dù ngoài kia thế giới có ồn ào và vội vã đến đâu, chỉ cần nhìn thấy nụ cười của em là mọi muộn phiền trong anh đều tan biến.

Anh mong rằng dù 1 năm, 5 năm, 10 năm hay cả cuộc đời sau này, chúng ta vẫn sẽ nắm chặt tay nhau như những ngày đầu. Yêu em nhiều hơn mỗi ngày! ♥`,
    letterSign: "Mãi yêu em, Xuân Trường ♥"
  };

  // Load or initialize config
  function loadConfig() {
    try {
      const saved = localStorage.getItem('love_story_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.femaleName === "Quỳnh Như") {
          parsed.femaleName = "Lan Anh";
          if (parsed.letterSalutation) parsed.letterSalutation = parsed.letterSalutation.replace("Quỳnh Như", "Lan Anh");
          localStorage.setItem('love_story_config', JSON.stringify(parsed));
        }
        return { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch (e) {
      console.warn('Error reading config from localStorage:', e);
    }
    return { ...DEFAULT_CONFIG };
  }

  function saveConfig(newConfig) {
    try {
      localStorage.setItem('love_story_config', JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Error saving config to localStorage:', e);
    }
  }

  let appConfig = loadConfig();

  // ============================================================================
  // 2. ROMANTIC 6-SONG PLAYLIST & AUDIO ENGINE
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
  let isPlaying = false;

  const audioEl = document.getElementById('mainAudio');
  const vinylDisc = document.getElementById('vinylDisc');
  const songTitleEl = document.getElementById('currentSongTitle');
  const songArtistEl = document.getElementById('currentSongArtist');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const iconPlay = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const playlistToggleBtn = document.getElementById('playlistToggleBtn');
  const playlistPopup = document.getElementById('playlistPopup');
  const playlistCloseBtn = document.getElementById('playlistCloseBtn');
  const playlistList = document.getElementById('playlistList');
  const progressTrack = document.getElementById('progressTrack');
  const progressFill = document.getElementById('progressFill');
  const currTimeLabel = document.getElementById('currTimeLabel');
  const totalDurationLabel = document.getElementById('totalDurationLabel');

  function formatTime(sec) {
    if (isNaN(sec) || sec < 0) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function updatePlayerUI() {
    const song = PLAYLIST[currentSongIdx];
    if (songTitleEl) songTitleEl.textContent = song.title;
    if (songArtistEl) songArtistEl.textContent = song.artist;

    if (isPlaying) {
      if (iconPlay) iconPlay.style.display = 'none';
      if (iconPause) iconPause.style.display = 'block';
      if (vinylDisc) vinylDisc.classList.add('spinning');
    } else {
      if (iconPlay) iconPlay.style.display = 'block';
      if (iconPause) iconPause.style.display = 'none';
      if (vinylDisc) vinylDisc.classList.remove('spinning');
    }

    // Highlight row in playlist
    if (playlistList) {
      const rows = playlistList.querySelectorAll('.song-row');
      rows.forEach((r, idx) => {
        if (idx === currentSongIdx) r.classList.add('active');
        else r.classList.remove('active');
      });
    }
  }

  function loadTrack(idx, autoStart = false) {
    currentSongIdx = (idx + PLAYLIST.length) % PLAYLIST.length;
    const song = PLAYLIST[currentSongIdx];
    audioEl.src = song.src;
    audioEl.load();
    updatePlayerUI();
    if (autoStart) playAudio();
  }

  function playAudio() {
    audioEl.play().then(() => {
      isPlaying = true;
      updatePlayerUI();
    }).catch(err => {
      console.log('Audio autoplay prevented by browser policy:', err);
    });
  }

  function pauseAudio() {
    audioEl.pause();
    isPlaying = false;
    updatePlayerUI();
  }

  function toggleAudio() {
    if (isPlaying) pauseAudio();
    else playAudio();
  }

  function nextTrack() {
    loadTrack(currentSongIdx + 1, true);
  }

  function prevTrack() {
    loadTrack(currentSongIdx - 1, true);
  }

  function renderPlaylist() {
    if (!playlistList) return;
    playlistList.innerHTML = '';
    PLAYLIST.forEach((song, idx) => {
      const row = document.createElement('div');
      row.className = 'song-row' + (idx === currentSongIdx ? ' active' : '');
      row.innerHTML = `
        <div class="row-left">
          <span class="row-num">${idx + 1 < 10 ? '0' : ''}${idx + 1}</span>
          <div>
            <div class="row-name">${song.title}</div>
            <div class="row-artist">${song.artist}</div>
          </div>
        </div>
        <div class="row-badge">♥</div>
      `;
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        loadTrack(idx, true);
      });
      playlistList.appendChild(row);
    });
  }

  // Audio Event Listeners
  audioEl.addEventListener('timeupdate', () => {
    if (!isNaN(audioEl.duration) && audioEl.duration > 0) {
      const percent = (audioEl.currentTime / audioEl.duration) * 100;
      if (progressFill) progressFill.style.width = `${percent}%`;
      if (currTimeLabel) currTimeLabel.textContent = formatTime(audioEl.currentTime);
      if (totalDurationLabel) totalDurationLabel.textContent = formatTime(audioEl.duration);
    }
  });

  audioEl.addEventListener('ended', nextTrack);
  audioEl.addEventListener('play', () => { isPlaying = true; updatePlayerUI(); });
  audioEl.addEventListener('pause', () => { isPlaying = false; updatePlayerUI(); });

  if (progressTrack) {
    progressTrack.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = progressTrack.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      if (!isNaN(audioEl.duration)) {
        audioEl.currentTime = pos * audioEl.duration;
      }
    });
  }

  if (playPauseBtn) playPauseBtn.addEventListener('click', toggleAudio);
  if (vinylDisc) vinylDisc.addEventListener('click', toggleAudio);
  if (prevBtn) prevBtn.addEventListener('click', prevTrack);
  if (nextBtn) nextBtn.addEventListener('click', nextTrack);

  if (playlistToggleBtn) {
    playlistToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playlistPopup.classList.toggle('open');
    });
  }
  if (playlistCloseBtn) {
    playlistCloseBtn.addEventListener('click', () => playlistPopup.classList.remove('open'));
  }
  document.addEventListener('click', (e) => {
    if (playlistPopup && !playlistPopup.contains(e.target) && !playlistToggleBtn.contains(e.target)) {
      playlistPopup.classList.remove('open');
    }
  });

  renderPlaylist();
  loadTrack(0, false);

  // ============================================================================
  // 3. WAX-SEALED ENVELOPE OPENING ANIMATION
  // ============================================================================
  const envelopeScreen = document.getElementById('envelopeScreen');
  const envelopeContainer = document.getElementById('envelopeContainer');
  const waxSeal = document.getElementById('waxSeal');
  const siteWrapper = document.getElementById('siteWrapper');
  const envelopeFlapTop = document.getElementById('envelopeFlapTop');

  function openEnvelope() {
    // Play sound effect if available
    try {
      const swishAudio = new Audio('./sound/Swish1.mp3');
      swishAudio.volume = 0.6;
      swishAudio.play().catch(() => {});
    } catch (e) {}

    // 1. Crack Wax Seal
    waxSeal.style.transform = 'translate(-50%, -40%) scale(1.35)';
    waxSeal.style.opacity = '0';

    // 2. Flip Open Flap
    if (envelopeFlapTop) {
      envelopeFlapTop.style.transform = 'rotateX(180deg)';
      envelopeFlapTop.style.zIndex = '1';
    }

    // 3. Spawn celebratory heart particles
    spawnHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 40);

    // 4. Start Playing Music automatically
    setTimeout(() => {
      playAudio();
    }, 600);

    // 5. Fade out envelope screen and show main website
    setTimeout(() => {
      envelopeScreen.classList.add('opened');
      siteWrapper.classList.add('visible');
      // Trigger typewriter animation
      startTypewriter();
    }, 1000);
  }

  if (envelopeContainer) {
    envelopeContainer.addEventListener('click', openEnvelope);
  }

  // ============================================================================
  // 4. LIVE LOVE DAYS & MOMENTS COUNTER
  // ============================================================================
  const countDaysEl = document.getElementById('countDays');
  const countHoursEl = document.getElementById('countHours');
  const countMinsEl = document.getElementById('countMins');
  const countSecsEl = document.getElementById('countSecs');
  const heroNamesEl = document.getElementById('heroNames');
  const heroQuoteEl = document.getElementById('heroQuote');

  function updateLoveCounter() {
    const start = new Date(appConfig.startDate + "T00:00:00").getTime();
    const now = new Date().getTime();
    let diff = Math.max(0, now - start);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);

    const seconds = Math.floor(diff / 1000);

    if (countDaysEl) countDaysEl.textContent = days;
    if (countHoursEl) countHoursEl.textContent = hours < 10 ? '0' + hours : hours;
    if (countMinsEl) countMinsEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    if (countSecsEl) countSecsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  setInterval(updateLoveCounter, 1000);
  updateLoveCounter();

  // Apply names and quote
  function applyConfigToUI() {
    if (heroNamesEl) {
      heroNamesEl.innerHTML = `${appConfig.maleName} <span class="heart-symbol">♥</span> ${appConfig.femaleName}`;
    }
    if (heroQuoteEl) {
      heroQuoteEl.textContent = appConfig.quote;
    }
    const letterSalutationEl = document.getElementById('letterSalutation');
    const letterSignNameEl = document.getElementById('letterSignName');
    if (letterSalutationEl) letterSalutationEl.textContent = appConfig.letterSalutation;
    if (letterSignNameEl) letterSignNameEl.textContent = appConfig.letterSign;
  }
  applyConfigToUI();

  // ============================================================================
  // 5. CANVAS FX: CHERRY BLOSSOM PETALS & STARRY MOUSE TRAIL
  // ============================================================================
  const canvas = document.getElementById('fxCanvas');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Falling Petals
  const PETAL_COUNT = 36;
  const petals = [];

  class Petal {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // initial spread
    }

    reset() {
      this.x = Math.random() * width;
      this.y = -20;
      this.size = 8 + Math.random() * 10;
      this.speedY = 0.8 + Math.random() * 1.4;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.oscillation = Math.random() * Math.PI * 2;
      this.oscSpeed = 0.02 + Math.random() * 0.03;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
      this.color = Math.random() > 0.4 ? 'rgba(255, 160, 200, 0.65)' : 'rgba(255, 110, 160, 0.5)';
    }

    update() {
      this.y += this.speedY;
      this.oscillation += this.oscSpeed;
      this.x += Math.sin(this.oscillation) * 1.2 + this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size / 2, this.size / 2, 0, this.size);
      ctx.bezierCurveTo(this.size / 2, this.size / 2, this.size / 2, -this.size / 2, 0, 0);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push(new Petal());
  }

  // Sparkling Mouse Trail
  const sparkles = [];

  class Sparkle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 3 + Math.random() * 5;
      this.life = 1;
      this.decay = 0.025 + Math.random() * 0.02;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2 - 0.8;
      this.color = Math.random() > 0.5 ? '#ff427f' : '#ffd180';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  window.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.4) {
      sparkles.push(new Sparkle(e.clientX, e.clientY));
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      sparkles.push(new Sparkle(e.touches[0].clientX, e.touches[0].clientY));
    }
  }, { passive: true });

  function renderFX() {
    ctx.clearRect(0, 0, width, height);

    // Draw petals
    petals.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw sparkles
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];
      s.update();
      s.draw();
      if (s.life <= 0) sparkles.splice(i, 1);
    }

    requestAnimationFrame(renderFX);
  }
  renderFX();

  // ============================================================================
  // 6. TYPEWRITER LOVE LETTER ENGINE
  // ============================================================================
  const letterBodyEl = document.getElementById('letterBody');
  const replayLetterBtn = document.getElementById('replayLetterBtn');
  let typeTimer = null;

  function startTypewriter() {
    if (!letterBodyEl) return;
    if (typeTimer) clearInterval(typeTimer);

    const fullText = appConfig.letterBody;
    letterBodyEl.textContent = '';
    let idx = 0;

    typeTimer = setInterval(() => {
      if (idx < fullText.length) {
        letterBodyEl.textContent += fullText[idx];
        idx++;
      } else {
        clearInterval(typeTimer);
      }
    }, 38);
  }

  if (replayLetterBtn) {
    replayLetterBtn.addEventListener('click', startTypewriter);
  }

  // ============================================================================
  // 7. 3D POLAROID TILT EFFECT
  // ============================================================================
  const polaroidCards = document.querySelectorAll('.polaroid-card');

  polaroidCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ============================================================================
  // 8. LIGHTBOX MODAL FOR MEMORY PHOTOS
  // ============================================================================
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  function openLightbox(src, title, desc) {
    if (!lightboxModal) return;
    lightboxImg.src = src;
    lightboxTitle.textContent = title || "Kỷ Niệm Của Chúng Mình";
    lightboxDesc.textContent = desc || "Mỗi khoảnh khắc bên em đều là một kỷ niệm ngọt ngào vô giá.";
    lightboxModal.classList.add('open');
  }

  function closeLightbox() {
    if (lightboxModal) lightboxModal.classList.remove('open');
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Attach lightbox to all polaroids
  polaroidCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const caption = card.querySelector('.polaroid-caption');
      const sub = card.querySelector('.polaroid-sub');
      if (img) {
        openLightbox(img.src, caption ? caption.textContent : '', sub ? sub.textContent : '');
      }
    });
  });

  // Attach lightbox to timeline photos
  const timelinePhotos = document.querySelectorAll('.timeline-photo');
  timelinePhotos.forEach(p => {
    p.addEventListener('click', () => {
      const img = p.querySelector('img');
      const card = p.closest('.timeline-card');
      const title = card ? card.querySelector('.timeline-item-title') : null;
      const desc = card ? card.querySelector('.timeline-item-desc') : null;
      if (img) {
        openLightbox(img.src, title ? title.textContent : '', desc ? desc.textContent : '');
      }
    });
  });

  // ============================================================================
  // 9. HEART CANNON & LOVE BURST SURPRISE
  // ============================================================================
  const heartCannonBtn = document.getElementById('heartCannonBtn');
  const loveQuoteToast = document.getElementById('loveQuoteToast');

  const SWEET_QUOTES = [
    "Hôm nay em có mệt không? Nhớ ăn uống đầy đủ nha, có anh luôn ở đây nè! ♥",
    "Trong mắt anh, nụ cười của em là điều lấp lánh nhất thế gian! ✨",
    "Mỗi ngày trôi qua, anh lại thấy yêu em nhiều hơn ngày hôm qua một chút... 💕",
    "Dù ngoài kia có bao nhiêu bão giông, vòng tay anh mãi là chốn bình yên của em. 🌹",
    "Thế giới có hơn 8 tỉ người, nhưng anh chỉ muốn nắm chặt lấy bàn tay em thôi! 💍",
    "Cảm ơn em vì đã xuất hiện và làm cho cuộc đời anh trở nên trọn vẹn và rực rỡ! 💖",
    "Em chính là món quà tuyệt vời nhất mà cuộc đời đã ban tặng cho anh! 🎁",
    "Gửi đến em một triệu cái ôm ấm áp và nụ hôn thật ngọt ngào! 😘",
    "Cứ mỗi lần nhìn thấy em, tim anh lại lỡ mất một nhịp! 💓"
  ];

  function spawnHeartBurst(x, y, count = 25) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'burst-heart';
      el.textContent = Math.random() > 0.3 ? '♥' : '💖';
      el.style.position = 'fixed';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.fontSize = `${16 + Math.random() * 26}px`;
      el.style.color = Math.random() > 0.5 ? '#ff2a70' : '#ffd180';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '99999';
      el.style.transform = 'translate(-50%, -50%)';
      el.style.transition = 'all 1.4s cubic-bezier(0.12, 0.8, 0.32, 1)';
      document.body.appendChild(el);

      const destX = (Math.random() - 0.5) * 550;
      const destY = -120 - Math.random() * 450;
      const rot = (Math.random() - 0.5) * 360;

      requestAnimationFrame(() => {
        el.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) rotate(${rot}deg) scale(0)`;
        el.style.opacity = '0';
      });

      setTimeout(() => el.remove(), 1500);
    }
  }

  if (heartCannonBtn) {
    heartCannonBtn.addEventListener('click', (e) => {
      const rect = heartCannonBtn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      spawnHeartBurst(x, y, 35);

      // Random sweet quote
      const quote = SWEET_QUOTES[Math.floor(Math.random() * SWEET_QUOTES.length)];
      if (loveQuoteToast) {
        loveQuoteToast.innerHTML = `<span class="love-quote-badge">${quote}</span>`;
      }
    });
  }

  // ============================================================================
  // 10. QUICK CUSTOMIZATION & SETTINGS MODAL
  // ============================================================================
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const editLetterBtn = document.getElementById('editLetterBtn');
  const settingsModal = document.getElementById('settingsModal');
  const settingsCloseBtn = document.getElementById('settingsCloseBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');

  const inputMaleName = document.getElementById('inputMaleName');
  const inputFemaleName = document.getElementById('inputFemaleName');
  const inputStartDate = document.getElementById('inputStartDate');
  const inputQuote = document.getElementById('inputQuote');
  const inputLetterBody = document.getElementById('inputLetterBody');

  function openSettings() {
    if (!settingsModal) return;
    if (inputMaleName) inputMaleName.value = appConfig.maleName;
    if (inputFemaleName) inputFemaleName.value = appConfig.femaleName;
    if (inputStartDate) inputStartDate.value = appConfig.startDate;
    if (inputQuote) inputQuote.value = appConfig.quote;
    if (inputLetterBody) inputLetterBody.value = appConfig.letterBody;
    settingsModal.classList.add('open');
  }

  function closeSettings() {
    if (settingsModal) settingsModal.classList.remove('open');
  }

  if (openSettingsBtn) openSettingsBtn.addEventListener('click', openSettings);
  if (editLetterBtn) editLetterBtn.addEventListener('click', openSettings);
  if (settingsCloseBtn) settingsCloseBtn.addEventListener('click', closeSettings);
  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) closeSettings();
    });
  }

  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
      appConfig.maleName = inputMaleName.value.trim() || appConfig.maleName;
      appConfig.femaleName = inputFemaleName.value.trim() || appConfig.femaleName;
      appConfig.startDate = inputStartDate.value || appConfig.startDate;
      appConfig.quote = inputQuote.value.trim() || appConfig.quote;
      appConfig.letterBody = inputLetterBody.value.trim() || appConfig.letterBody;
      appConfig.letterSalutation = `Gửi ${appConfig.femaleName} - Em bé ngoan của anh ♥`;
      appConfig.letterSign = `Mãi yêu em, ${appConfig.maleName} ♥`;

      saveConfig(appConfig);
      applyConfigToUI();
      updateLoveCounter();
      startTypewriter();
      closeSettings();

      spawnHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 20);
    });
  }

})();
