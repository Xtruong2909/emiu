/**
 * ============================================================================
 * 🌌 UNA GALAXIA DE AMOR PARA TI - 3D THREE.JS EXPERIENCE & PLAYLIST
 * ============================================================================
 */

(function () {
  'use strict';

  // ============================================================================
  // 1. PLAYLIST & AUDIO SETUP (6 SONGS)
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

  const mainAudio = document.getElementById('mainAudio');
  const vinylDisc = document.getElementById('vinylDisc');
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

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function updatePlaylistUI() {
    const song = PLAYLIST[currentSongIdx];
    if (tickerTitle) tickerTitle.textContent = song.title;
    if (tickerArtist) tickerArtist.textContent = song.artist;
    if (drawerNowPlaying) drawerNowPlaying.textContent = `Đang phát: ${song.title} - ${song.artist}`;

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
    if (shouldPlay) playSong();
  }

  function playSong() {
    mainAudio.play().then(() => {
      isAudioPlaying = true;
      updatePlaylistUI();
    }).catch(err => console.log('Autoplay deferred:', err));
  }

  function pauseSong() {
    mainAudio.pause();
    isAudioPlaying = false;
    updatePlaylistUI();
  }

  function togglePlay(e) {
    if (e) e.stopPropagation();
    if (isAudioPlaying) pauseSong();
    else playSong();
  }

  function nextSong(e) {
    if (e) e.stopPropagation();
    loadSong(currentSongIdx + 1, true);
  }

  function prevSong(e) {
    if (e) e.stopPropagation();
    loadSong(currentSongIdx - 1, true);
  }

  function initPlaylistDOM() {
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

  // Audio listeners
  mainAudio.addEventListener('timeupdate', () => {
    if (!isNaN(mainAudio.duration) && mainAudio.duration > 0) {
      const progress = (mainAudio.currentTime / mainAudio.duration) * 100;
      if (progressBarFill) progressBarFill.style.width = `${progress}%`;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(mainAudio.currentTime);
      if (totalDurationEl) totalDurationEl.textContent = formatTime(mainAudio.duration);
    }
  });

  mainAudio.addEventListener('ended', nextSong);
  mainAudio.addEventListener('play', () => { isAudioPlaying = true; updatePlaylistUI(); });
  mainAudio.addEventListener('pause', () => { isAudioPlaying = false; updatePlaylistUI(); });

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

  if (btnPlayPause) btnPlayPause.addEventListener('click', togglePlay);
  if (vinylDisc) vinylDisc.addEventListener('click', togglePlay);
  if (btnNext) btnNext.addEventListener('click', nextSong);
  if (btnPrev) btnPrev.addEventListener('click', prevSong);

  if (btnPlaylistToggle) {
    btnPlaylistToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (playlistDrawer) playlistDrawer.classList.toggle('open');
    });
  }

  document.addEventListener('click', (e) => {
    if (playlistDrawer && !playlistDrawer.contains(e.target) && !btnPlaylistToggle.contains(e.target)) {
      playlistDrawer.classList.remove('open');
    }
  });

  initPlaylistDOM();
  loadSong(0, false);

  // ============================================================================
  // 2. THREE.JS 3D UNIVERSE SETUP
  // ============================================================================
  const canvas = document.getElementById('webglCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x040006, 0.001);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
  camera.position.set(0, 450, 1300); // Initial far camera for hyperspace warp

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 1000;
  controls.minDistance = 60;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Particle Circular Sprite Generator with Glowing Aura
  function createParticleTexture() {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(255, 110, 180, 0.9)');
    grad.addColorStop(0.5, 'rgba(255, 30, 110, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  const particleTexture = createParticleTexture();

  // ============================================================================
  // 3. CENTRAL 3D GLOWING PARTICLE HEART
  // ============================================================================
  // Layer A: Sharp outer border contour (3,200 particles)
  // Layer B: Volumetric interior stardust (3,000 particles)
  const HEART_TOTAL = 6500;
  const heartGeo = new THREE.BufferGeometry();
  const heartPositions = new Float32Array(HEART_TOTAL * 3);
  const heartColors = new Float32Array(HEART_TOTAL * 3);

  const heartColorPalette = [
    new THREE.Color('#ff1a6c'),
    new THREE.Color('#ff4d88'),
    new THREE.Color('#ff85b3'),
    new THREE.Color('#ffffff'),
    new THREE.Color('#ff0055')
  ];

  for (let i = 0; i < HEART_TOTAL; i++) {
    const t = Math.PI * 2 * Math.random();
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

    let r, hz;
    if (i < 3200) {
      // Contour Ribbon
      r = 0.96 + Math.random() * 0.08;
      hz = (Math.random() - 0.5) * 5 * Math.pow(Math.sin(t), 2);
    } else {
      // Interior Stardust
      r = Math.pow(Math.random(), 0.45) * 0.95;
      hz = (Math.random() - 0.5) * 10 * Math.pow(Math.sin(t), 2);
    }

    const scale = 5.4;
    const x = hx * scale * r + (Math.random() - 0.5) * 2;
    const y = hy * scale * r + 25 + (Math.random() - 0.5) * 2;
    const z = hz * scale * r + (Math.random() - 0.5) * 2;

    heartPositions[i * 3 + 0] = x;
    heartPositions[i * 3 + 1] = y;
    heartPositions[i * 3 + 2] = z;

    const col = heartColorPalette[Math.floor(Math.random() * heartColorPalette.length)];
    heartColors[i * 3 + 0] = col.r;
    heartColors[i * 3 + 1] = col.g;
    heartColors[i * 3 + 2] = col.b;
  }

  heartGeo.setAttribute('position', new THREE.BufferAttribute(heartPositions, 3));
  heartGeo.setAttribute('color', new THREE.BufferAttribute(heartColors, 3));

  const heartMat = new THREE.PointsMaterial({
    size: 4.8,
    map: particleTexture,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const heartMesh = new THREE.Points(heartGeo, heartMat);
  scene.add(heartMesh);

  // ============================================================================
  // 4. GALACTIC SWIRL SPIRAL (Accretion Disk & Black Hole)
  // ============================================================================
  const GALAXY_COUNT = 15000;
  const galaxyGeo = new THREE.BufferGeometry();
  const galaxyPositions = new Float32Array(GALAXY_COUNT * 3);
  const galaxyColors = new Float32Array(GALAXY_COUNT * 3);
  const galaxySpeeds = new Float32Array(GALAXY_COUNT);
  const galaxyRadii = new Float32Array(GALAXY_COUNT);
  const galaxyAngles = new Float32Array(GALAXY_COUNT);
  const galaxyYOffsets = new Float32Array(GALAXY_COUNT);

  const colInner = new THREE.Color('#ffffff');
  const colMid = new THREE.Color('#ff2a70');
  const colOuter = new THREE.Color('#8a00b8');

  for (let i = 0; i < GALAXY_COUNT; i++) {
    const radius = 22 + Math.pow(Math.random(), 1.45) * 360;
    const branchAngle = ((i % 3) * (Math.PI * 2)) / 3;
    const spin = radius * 0.038;
    const angle = branchAngle + spin + (Math.random() - 0.5) * 0.35;

    const randomY = (Math.random() - 0.5) * 14 * Math.exp(-radius / 180);

    galaxyRadii[i] = radius;
    galaxyAngles[i] = angle;
    galaxyYOffsets[i] = -12 + randomY;
    galaxySpeeds[i] = (0.0025 + (1 / Math.sqrt(radius)) * 0.045) * 0.35;

    const x = Math.cos(angle) * radius;
    const y = -12 + randomY;
    const z = Math.sin(angle) * radius;

    galaxyPositions[i * 3 + 0] = x;
    galaxyPositions[i * 3 + 1] = y;
    galaxyPositions[i * 3 + 2] = z;

    const mixed = colInner.clone();
    if (radius < 130) {
      mixed.lerp(colMid, radius / 130);
    } else {
      mixed.lerp(colOuter, (radius - 130) / 230);
    }

    galaxyColors[i * 3 + 0] = mixed.r;
    galaxyColors[i * 3 + 1] = mixed.g;
    galaxyColors[i * 3 + 2] = mixed.b;
  }

  galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
  galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));

  const galaxyMat = new THREE.PointsMaterial({
    size: 3.4,
    map: particleTexture,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const galaxyMesh = new THREE.Points(galaxyGeo, galaxyMat);
  scene.add(galaxyMesh);

  // Black Hole Event Horizon Ring & Core
  const coreMesh = new THREE.Mesh(
    new THREE.SphereGeometry(18, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  coreMesh.position.y = -12;
  scene.add(coreMesh);

  const ringGeo = new THREE.RingGeometry(18.5, 26, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xff3377,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.y = -12;
  scene.add(ringMesh);

  // ==========================================
  // 5. DEEP SPACE BACKGROUND STARS
  // ==========================================
  const bgStarsCount = 2000;
  const bgStarsGeo = new THREE.BufferGeometry();
  const bgStarsPos = new Float32Array(bgStarsCount * 3);
  for (let i = 0; i < bgStarsCount; i++) {
    const dist = 600 + Math.random() * 1800;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    bgStarsPos[i * 3 + 0] = dist * Math.sin(phi) * Math.cos(theta);
    bgStarsPos[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
    bgStarsPos[i * 3 + 2] = dist * Math.cos(phi);
  }
  bgStarsGeo.setAttribute('position', new THREE.BufferAttribute(bgStarsPos, 3));
  const bgStars = new THREE.Points(bgStarsGeo, new THREE.PointsMaterial({
    size: 2.2,
    color: 0xffcce6,
    transparent: true,
    opacity: 0.8
  }));
  scene.add(bgStars);

  // ============================================================================
  // 6. ORBITING 3D TEXT BILLBOARDS (Matches Video)
  // ============================================================================
  function createBillboardSprite(text) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 128;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 512, 128);

    ctx.font = "bold 44px 'Montserrat', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = '#ff2a70';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#ff85b3';
    ctx.fillText(text, 256, 64);

    ctx.shadowBlur = 6;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, 256, 64);

    const tex = new THREE.CanvasTexture(c);
    const spriteMat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(52, 13, 1);
    return sprite;
  }

  const messages = [
    "MI AMOR ETERNO 💖",
    "ERES MAGIA ✨",
    "FELIZ CUMPLEAÑOS 🎂",
    "HAPPY BIRTHDAY 🎉",
    "TE ADORO 🥺",
    "PARA SIEMPRE 💍",
    "I LOVE YOU 💕",
    "AMOR DE MI VIDA 🌹",
    "HOY CELEBRAMOS 🥂",
    "ÁNH SAO CỦA ANH 🌟",
    "ĐỂ DÀNH KHI THỨC GIẤC 🎶"
  ];

  const orbitingSprites = [];
  messages.forEach((msg, idx) => {
    const sprite = createBillboardSprite(msg);
    const radius = 105 + (idx % 4) * 45;
    const angle = (idx / messages.length) * Math.PI * 2;
    const speed = 0.0035 + (idx % 3) * 0.0015;
    const yOffset = (Math.sin(idx * 2) * 22);

    sprite.userData = { radius, angle, speed, yOffset };
    scene.add(sprite);
    orbitingSprites.push(sprite);
  });

  // ============================================================================
  // 7. ORBITING 3D PHOTO CARDS & MODAL INTERACTION
  // ============================================================================
  const cardData = [
    {
      img: 'img/memory_couple.jpg',
      title: 'Amor de mi vida',
      text: 'Cuanto más tiempo estamos juntos, más te amo. Trong cả vũ trụ bao la này, em chính là điều tuyệt vời nhất của anh.'
    },
    {
      img: 'img/puung2.jpg',
      title: 'Para ti',
      text: 'Gửi tặng em cả bầu trời sao lấp lánh và triệu đóa hoa thơm ngát. Mãi luôn mỉm cười hạnh phúc em nhé!'
    },
    {
      img: 'img/puung3.jpg',
      title: 'Para Siempre',
      text: 'Dù năm tháng có trôi qua, dù thiên hà có xoay vần, anh vẫn nguyện nắm chặt tay em đi qua mọi giông bão.'
    },
    {
      img: 'img/cuteCat.jpg',
      title: 'Để Dành Khi Thức Giấc',
      text: 'Gửi trọn những yêu thương ngọt ngào nhất đến em mỗi sớm mai thức dậy. Chúc em ngày mới ngập tràn niềm vui!'
    },
    {
      img: 'img/p1.jpg',
      title: 'Ánh Sao Của Anh',
      text: 'Em là ngọn hải đăng soi sáng tâm hồn anh, là vì tinh tú rạng rỡ nhất trong dải ngân hà này.'
    }
  ];

  const textureLoader = new THREE.TextureLoader();
  const photoMeshes = [];

  cardData.forEach((data, idx) => {
    const tex = textureLoader.load(data.img);
    const geo = new THREE.PlaneGeometry(24, 28);
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geo, mat);

    // Glowing Frame
    const frameGeo = new THREE.PlaneGeometry(25.6, 29.6);
    const frameMat = new THREE.MeshBasicMaterial({
      color: 0xff3377,
      side: THREE.DoubleSide
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.z = -0.08;
    mesh.add(frame);

    const radius = 175 + idx * 30;
    const angle = (idx / cardData.length) * Math.PI * 2;
    const speed = 0.0028 + idx * 0.0007;

    mesh.userData = { ...data, radius, angle, speed, yOffset: Math.sin(idx * 1.8) * 16 };
    scene.add(mesh);
    photoMeshes.push(mesh);
  });

  // Modal logic
  const memoryModal = document.getElementById('memoryModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openModal(data) {
    if (!memoryModal) return;
    modalImg.src = data.img;
    modalTitle.textContent = data.title;
    modalText.textContent = data.text;
    memoryModal.classList.add('open');
    controls.autoRotate = false;
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      memoryModal.classList.remove('open');
      controls.autoRotate = true;
    });
  }

  // Raycaster for 3D card clicks
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  window.addEventListener('click', (e) => {
    if (memoryModal && memoryModal.classList.contains('open') && !memoryModal.contains(e.target)) {
      memoryModal.classList.remove('open');
      controls.autoRotate = true;
    }

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(photoMeshes);
    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      openModal(clickedMesh.userData);
    }
  });

  // ============================================================================
  // 8. HYPERSPACE WARP ENTRANCE (Video frame 00:01)
  // ============================================================================
  const introOverlay = document.getElementById('introOverlay');
  const enterBtn = document.getElementById('enterBtn');

  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      // 1. Play first song "Để Dành Khi Thức Giấc"
      playSong();

      // 2. Hide intro overlay with smooth zoom
      introOverlay.classList.add('hidden');

      // 3. Camera Hyperspace Warp Drive into the Galaxy
      camera.position.set(0, 480, 1350);
      new TWEEN.Tween(camera.position)
        .to({ x: 0, y: 160, z: 380 }, 3000)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
    });
  }

  // ============================================================================
  // 9. ANIMATION LOOP
  // ============================================================================
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();

    const elapsedTime = clock.getElapsedTime();

    // 1. Dual Heartbeat Pulsing
    const cycle = (elapsedTime / 1.25) % 1;
    let beat = 1;
    if (cycle < 0.16) {
      beat = 1 + 0.09 * Math.sin((cycle / 0.16) * Math.PI);
    } else if (cycle >= 0.22 && cycle < 0.36) {
      beat = 1 + 0.045 * Math.sin(((cycle - 0.22) / 0.14) * Math.PI);
    }
    heartMesh.scale.set(beat, beat, beat);

    // 2. Swirling Galaxy Simulation (Keplerian differential rotation)
    const pos = galaxyGeo.attributes.position.array;
    for (let i = 0; i < GALAXY_COUNT; i++) {
      galaxyAngles[i] += galaxySpeeds[i];
      const r = galaxyRadii[i];
      const a = galaxyAngles[i];
      pos[i * 3 + 0] = Math.cos(a) * r;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    galaxyGeo.attributes.position.needsUpdate = true;

    // 3. Ring Rotation
    ringMesh.rotation.z += 0.008;

    // 4. Orbiting Text Billboards
    orbitingSprites.forEach(sprite => {
      sprite.userData.angle += sprite.userData.speed;
      sprite.position.x = Math.cos(sprite.userData.angle) * sprite.userData.radius;
      sprite.position.z = Math.sin(sprite.userData.angle) * sprite.userData.radius;
      sprite.position.y = sprite.userData.yOffset + Math.sin(elapsedTime * 2 + sprite.userData.radius) * 4;
    });

    // 5. Orbiting Photo Cards
    photoMeshes.forEach(mesh => {
      mesh.userData.angle += mesh.userData.speed;
      mesh.position.x = Math.cos(mesh.userData.angle) * mesh.userData.radius;
      mesh.position.z = Math.sin(mesh.userData.angle) * mesh.userData.radius;
      mesh.position.y = mesh.userData.yOffset + Math.sin(elapsedTime * 1.6 + mesh.userData.radius) * 5;
      mesh.lookAt(camera.position); // Always face viewer
    });

    // 6. Slowly rotate background stars
    bgStars.rotation.y = elapsedTime * 0.0008;

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

})();
