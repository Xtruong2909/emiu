/**
 * CÁCH CHUYÊN TOÁN TỎ TÌNH
 * Interactive Math Heart Graphing & Confession Web Experience
 * Formula: f(x) = \sqrt[3]{x^2} + \sqrt{3-x^2} \sin(m \pi x)
 */

// --- Global State ---
let currentM = 0.1;
let targetM = 0.1;
let currentMode = 'standard'; // 'standard', 'pulse16', 'grid4'
let isPlaying = false;
let isUserDraggingSlider = false;
const SQRT_3 = Math.sqrt(3);

// DOM Elements
const graphCanvas = document.getElementById('graphCanvas');
const graphCtx = graphCanvas.getContext('2d');
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');

const mSlider = document.getElementById('mSlider');
const mValueDisplay = document.getElementById('mValueDisplay');
const formulaDisplay = document.getElementById('formulaDisplay');
const lyricPrimary = document.getElementById('lyricPrimary');
const lyricSecondary = document.getElementById('lyricSecondary');

const playBtn = document.getElementById('playBtn');
const playBtnText = document.getElementById('playBtnText');
const playBtnIcon = document.getElementById('playBtnIcon');
const audioIndicator = document.getElementById('audioIndicator');

const modeStandardBtn = document.getElementById('modeStandard');
const modePulseBtn = document.getElementById('modePulse');
const modeGridBtn = document.getElementById('modeGrid');
const letterBtn = document.getElementById('letterBtn');

const letterModal = document.getElementById('letterModal');
const letterModalClose = document.getElementById('letterModalClose');
const letterContent = document.getElementById('letterContent');
const sendHeartModalBtn = document.getElementById('sendHeartModalBtn');

const gridContainer = document.getElementById('gridHeartsContainer');
const gridCanvases = [
  document.getElementById('gridCanvas1'),
  document.getElementById('gridCanvas2'),
  document.getElementById('gridCanvas3'),
  document.getElementById('gridCanvas4')
];
const gridContexts = gridCanvases.map(c => c ? c.getContext('2d') : null);

// Audio element
const bgAudio = document.getElementById('bgAudio');

// --- Timeline synchronization for the video ---
// Keep m = 100 once reached so heart NEVER collapses or disappears!
const TIMELINE = [
  { t: 0.0, m: 0.1, p: '', s: '' },
  { t: 0.9, m: 0.3, p: 'GIỜ ĐÂY', s: '' },
  { t: 1.8, m: 0.5, p: 'GIỜ ĐÂY', s: '' },
  { t: 2.7, m: 0.8, p: 'GIỜ ĐÂY', s: '~ DẠT DÀO TỪNG TIẾNG MƯA RÀO ~' },
  { t: 3.8, m: 1.4, p: 'GIỜ ĐÂY', s: '~ DẠT DÀO TỪNG TIẾNG MƯA RÀO ~' },
  { t: 4.8, m: 2.1, p: 'GIỜ ĐÂY', s: '~ DẠT DÀO TỪNG TIẾNG MƯA RÀO ~' },
  { t: 5.8, m: 3.3, p: 'CÔ ĐƠN KHÔNG SẮC KHÔNG MÀU', s: '' },
  { t: 6.8, m: 4.9, p: 'CÔ ĐƠN KHÔNG SẮC KHÔNG MÀU', s: '' },
  { t: 7.8, m: 7.4, p: 'CÔ ĐƠN KHÔNG SẮC KHÔNG MÀU', s: '' },
  { t: 8.8, m: 11.0, p: 'CÔ ĐƠN KHÔNG SẮC KHÔNG MÀU', s: '~ HỎI AI ĐÃ ĐÁNH CẮP NỤ CƯỜI ~' },
  { t: 9.9, m: 16.4, p: 'CÔ ĐƠN KHÔNG SẮC KHÔNG MÀU', s: '~ HỎI AI ĐÃ ĐÁNH CẮP NỤ CƯỜI ~' },
  { t: 11.0, m: 24.4, p: 'CÔ ĐƠN KHÔNG SẮC KHÔNG MÀU', s: '~ HỎI AI ĐÃ ĐÁNH CẮP NỤ CƯỜI ~' },
  { t: 12.0, m: 35.5, p: 'CÔ ĐƠN KHÔNG SẮC KHÔNG MÀU', s: '~ HỎI AI ĐÃ ĐÁNH CẮP NỤ CƯỜI ~' },
  { t: 13.0, m: 52.7, p: 'CÔ ĐƠN KHÔNG SẮC KHÔNG MÀU', s: '~ HỎI AI ĐÃ ĐÁNH CẮP NỤ CƯỜI ~' },
  { t: 14.0, m: 78.0, p: 'CÔ ĐƠN KHÔNG SẮC KHÔNG MÀU', s: '~ HỎI AI ĐÃ ĐÁNH CẮP NỤ CƯỜI ~' },
  { t: 14.8, m: 100.0, p: 'CÓ AI TỪNG KHÓC VÌ MỘT', s: '~ MÙA HẠ KHÔNG NẮNG ~' },
  { t: 18.5, m: 100.0, p: 'CÓ AI MỘT ĐỜI MÀ QUÊN ĐI', s: '~ SỰ THIẾU VẮNG ~' },
  { t: 22.0, m: 100.0, p: 'CÓ NGƯỜI TỪNG NÓI SẼ LÀM', s: '~ MẶT TRỜI DỊU DÀNG ~' },
  { t: 25.0, m: 100.0, p: 'NHƯNG GIỜ CHÌM TRONG', s: '~ BIỂN KHƠI ~' },
  { t: 28.5, m: 100.0, p: 'TOÁN HỌC CŨNG NHƯ TÌNH YÊU', s: '~ MÃI MÃI HƯỚNG VỀ EM ~ ❤️' }
];

// Confession Letter Text
const LOVE_LETTER_TEXT = `Gửi người đặc biệt nhất của anh,

Người ta bảo dân chuyên Toán khô khan, chỉ biết đến những con số và phương trình vô cảm.

Nhưng họ không biết rằng:
Nếu tình yêu là một hàm số f(x),
thì tập xác định của nó là toàn bộ cuộc đời anh,
và tiệm cận duy nhất anh muốn hướng tới chính là em!

Dù tham số m có biến thiên ngàn vạn lần,
thì quỹ đạo cuối cùng vẫn đọng lại thành một trái tim chân thành nhất dành tặng em.

Cảm ơn em đã xuất hiện và làm cho thế giới của anh trở nên rực rỡ! ❤️`;

// --- Background Particles ---
const particles = [];
const PARTICLE_COUNT = 38;

function initParticles() {
  particles.length = 0;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 0.45 + 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2
    });
  }
}

function updateAndDrawParticles() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  bgCtx.clearRect(0, 0, w, h);
  
  for (let p of particles) {
    p.y -= p.speedY;
    p.x += p.speedX;
    p.pulse += 0.03;
    
    if (p.y < -10) {
      p.y = h + 10;
      p.x = Math.random() * w;
    }
    if (p.x < -10) p.x = w + 10;
    if (p.x > w + 10) p.x = -10;
    
    const currentOpacity = p.opacity * (0.65 + 0.35 * Math.sin(p.pulse));
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(255, 230, 240, ${currentOpacity})`;
    bgCtx.shadowBlur = 8;
    bgCtx.shadowColor = 'rgba(255, 200, 220, 0.8)';
    bgCtx.fill();
  }
}

// --- Math Evaluation ---
// f(x) = (x^2)^(1/3) + sqrt(3 - x^2) * sin(m * pi * x)
function evalF(x, m, phase = 0) {
  const x2 = x * x;
  const term1 = Math.cbrt(x2);
  const inside = Math.max(0, 3 - x2);
  const term2 = Math.sqrt(inside) * Math.sin(m * Math.PI * x + phase);
  return term1 + term2;
}

// Envelope boundaries
function evalEnvelopeTop(x) {
  const x2 = x * x;
  return Math.cbrt(x2) + Math.sqrt(Math.max(0, 3 - x2));
}

function evalEnvelopeBottom(x) {
  const x2 = x * x;
  return Math.cbrt(x2) - Math.sqrt(Math.max(0, 3 - x2));
}

// --- Smooth Physiological Heartbeat (lub-dub) ---
function getSmoothHeartbeat(time) {
  const cycle = (time % 1.1) / 1.1; // 1.1s per cardiac cycle
  let pump = 0;
  if (cycle < 0.16) {
    pump = Math.sin((cycle / 0.16) * Math.PI) * 0.052;
  } else if (cycle >= 0.20 && cycle < 0.36) {
    pump = Math.sin(((cycle - 0.20) / 0.16) * Math.PI) * 0.026;
  }
  return 1.0 + pump;
}

// --- Canvas Drawing & Coordinate Transform ---
function drawChalkboardGraph(ctx, width, height, mVal, options = {}) {
  const {
    isPurple = false,
    pulseScale = 1.0,
    phase = 0,
    showGridText = true
  } = options;

  ctx.clearRect(0, 0, width, height);

  // Coordinate system mapping
  // Heart range: x in [-1.732, 1.732], y in [-1.732, 2.415]
  // Center of view around (0, 0.35)
  const centerX = width / 2;
  const centerY = height / 2 + height * 0.06;
  // Scale factor: fit interval x in [-2.5, 2.5] and y in [-2.4, 2.8]
  const scale = (Math.min(width, height) / 5.2) * pulseScale;

  const toPxX = (x) => centerX + x * scale;
  const toPxY = (y) => centerY - y * scale;

  // 1. Draw Coordinate Grid Lines (Subtle)
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  
  // Vertical grid lines
  for (let gx = -3; gx <= 3; gx += 1) {
    if (gx === 0) continue;
    const px = toPxX(gx);
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, height);
    ctx.stroke();
  }
  // Horizontal grid lines
  for (let gy = -2; gy <= 3; gy += 1) {
    if (gy === 0) continue;
    const py = toPxY(gy);
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(width, py);
    ctx.stroke();
  }

  // 2. Draw Main Axes (Ox and Oy)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 1.6;

  // X-axis
  const py0 = toPxY(0);
  ctx.beginPath();
  ctx.moveTo(10, py0);
  ctx.lineTo(width - 10, py0);
  ctx.stroke();

  // X-axis arrowhead
  ctx.beginPath();
  ctx.moveTo(width - 10, py0);
  ctx.lineTo(width - 18, py0 - 4);
  ctx.lineTo(width - 18, py0 + 4);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fill();

  // Y-axis
  const px0 = toPxX(0);
  ctx.beginPath();
  ctx.moveTo(px0, height - 10);
  ctx.lineTo(px0, 10);
  ctx.stroke();

  // Y-axis arrowhead
  ctx.beginPath();
  ctx.moveTo(px0, 10);
  ctx.lineTo(px0 - 4, 18);
  ctx.lineTo(px0 + 4, 18);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fill();

  // 3. Ticks and Numbers
  if (showGridText) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '11px "Nunito", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // X ticks: -2, -1, 1, 2
    [-2, -1, 1, 2].forEach(tx => {
      const px = toPxX(tx);
      ctx.beginPath();
      ctx.moveTo(px, py0 - 3);
      ctx.lineTo(px, py0 + 3);
      ctx.stroke();
      ctx.fillText(tx.toString(), px, py0 + 6);
    });

    // Y ticks: -1, 1, 2
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    [-1, 1, 2].forEach(ty => {
      const py = toPxY(ty);
      ctx.beginPath();
      ctx.moveTo(px0 - 3, py);
      ctx.lineTo(px0 + 3, py);
      ctx.stroke();
      ctx.fillText(ty.toString(), px0 - 6, py);
    });
  }
  ctx.restore();

  // 4. Inner Heart Fill (Appears smoothly as m increases, never disappears!)
  if (mVal > 12) {
    const fillAlpha = Math.min(0.88, ((mVal - 12) / 45) * 0.88);
    ctx.save();
    ctx.beginPath();
    
    const halfFill = 250;
    // Top boundary: from -SQRT_3 to 0
    for (let i = halfFill; i >= 0; i--) {
      const x = - (SQRT_3 * i) / halfFill;
      const y = evalEnvelopeTop(x);
      if (i === halfFill) ctx.moveTo(toPxX(x), toPxY(y));
      else ctx.lineTo(toPxX(x), toPxY(y));
    }
    // Top boundary: from 0 to SQRT_3
    for (let i = 1; i <= halfFill; i++) {
      const x = (SQRT_3 * i) / halfFill;
      const y = evalEnvelopeTop(x);
      ctx.lineTo(toPxX(x), toPxY(y));
    }
    // Bottom boundary: from SQRT_3 to 0
    for (let i = halfFill; i >= 0; i--) {
      const x = (SQRT_3 * i) / halfFill;
      const y = evalEnvelopeBottom(x);
      ctx.lineTo(toPxX(x), toPxY(y));
    }
    // Bottom boundary: from 0 to -SQRT_3
    for (let i = 1; i <= halfFill; i++) {
      const x = - (SQRT_3 * i) / halfFill;
      const y = evalEnvelopeBottom(x);
      ctx.lineTo(toPxX(x), toPxY(y));
    }
    ctx.closePath();

    // Heart Gradient Fill
    const grad = ctx.createRadialGradient(
      toPxX(0), toPxY(0.7), 8,
      toPxX(0), toPxY(0.3), scale * 2.2
    );
    if (!isPurple) {
      grad.addColorStop(0, `rgba(255, 60, 110, ${fillAlpha})`);
      grad.addColorStop(0.65, `rgba(235, 25, 75, ${fillAlpha * 0.92})`);
      grad.addColorStop(1, `rgba(180, 10, 45, ${fillAlpha * 0.75})`);
    } else {
      grad.addColorStop(0, `rgba(232, 121, 249, ${fillAlpha})`);
      grad.addColorStop(0.65, `rgba(192, 132, 252, ${fillAlpha * 0.92})`);
      grad.addColorStop(1, `rgba(147, 51, 234, ${fillAlpha * 0.75})`);
    }
    ctx.fillStyle = grad;
    ctx.shadowBlur = 24;
    ctx.shadowColor = isPurple ? 'rgba(216, 70, 239, 0.75)' : 'rgba(255, 45, 85, 0.85)';
    ctx.fill();
    ctx.restore();
  }

  // 5. Draw the Dynamic Mathematical Curve with Symmetrical High-Res Sampling
  ctx.save();
  ctx.beginPath();

  const halfSamples = Math.max(1800, Math.round(mVal * 55));
  // Left half: from -SQRT_3 to 0
  for (let i = halfSamples; i >= 0; i--) {
    const x = - (SQRT_3 * i) / halfSamples;
    const y = evalF(x, mVal, phase);
    if (i === halfSamples) {
      ctx.moveTo(toPxX(x), toPxY(y));
    } else {
      ctx.lineTo(toPxX(x), toPxY(y));
    }
  }
  // Right half: from 0 to SQRT_3
  for (let i = 1; i <= halfSamples; i++) {
    const x = (SQRT_3 * i) / halfSamples;
    const y = evalF(x, mVal, phase);
    ctx.lineTo(toPxX(x), toPxY(y));
  }

  const strokeColor = isPurple ? '#e879f9' : '#ff2d55';
  const glowColor = isPurple ? 'rgba(232, 121, 249, 0.9)' : 'rgba(255, 45, 85, 0.95)';
  
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = mVal > 40 ? 1.8 : 2.2;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = mVal > 40 ? 14 : 18;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();
}

// --- KaTeX & Formula Updates ---
function updateFormulaDisplay(mVal, isPulseMode = false) {
  let texString = '';
  if (isPulseMode) {
    texString = `f(x) = x^{\\frac{2}{3}} + \\sqrt{3 - x^2} \\sin(16\\pi x)`;
  } else {
    texString = `f(x) = \\sqrt[3]{x^2} + \\sqrt{3 - x^2} \\sin(m\\pi x)`;
  }

  if (window.katex) {
    try {
      window.katex.render(texString, formulaDisplay, {
        throwOnError: false,
        displayMode: true
      });
    } catch (e) {
      formulaDisplay.innerHTML = `<span class="formula-fallback">${texString}</span>`;
    }
  } else {
    formulaDisplay.innerHTML = `<span class="formula-fallback">f(x) = ∛(x²) + √(3 - x²) · sin(${isPulseMode ? '16' : 'm'}πx)</span>`;
  }
}

// --- Smooth Parameter m Interpolation (Lerp) ---
function setM(val, updateInput = true) {
  targetM = Math.max(0.1, Math.min(100.0, parseFloat(val.toFixed(1))));
  if (!isPlaying || isUserDraggingSlider) {
    currentM = targetM;
    mValueDisplay.textContent = currentM.toFixed(1);
    if (updateInput && mSlider) {
      mSlider.value = currentM;
      updateSliderGradient(currentM);
    }
  }
}

function updateSliderGradient(val) {
  if (mSlider) {
    const percent = (val - 0.1) / (100.0 - 0.1) * 100;
    mSlider.style.background = `linear-gradient(to right, var(--gold) 0%, var(--gold) ${percent}%, rgba(255, 255, 255, 0.2) ${percent}%, rgba(255, 255, 255, 0.2) 100%)`;
  }
}

function updateMLerp() {
  if (isPlaying && !isUserDraggingSlider) {
    if (Math.abs(targetM - currentM) > 0.005) {
      currentM += (targetM - currentM) * 0.16;
      mValueDisplay.textContent = currentM.toFixed(1);
      if (mSlider) {
        mSlider.value = currentM;
        updateSliderGradient(currentM);
      }
    } else {
      currentM = targetM;
      mValueDisplay.textContent = currentM.toFixed(1);
    }
  }
}

// --- Animation Loop ---
let lastFrameTime = performance.now();
let phaseTime = 0;

function renderFrame(timestamp) {
  const dt = (timestamp - lastFrameTime) / 1000;
  lastFrameTime = timestamp;
  phaseTime += dt;

  // Background floating dust particles
  updateAndDrawParticles();

  // If audio is playing and not manually scrubbing, sync from timeline
  if (isPlaying && !isUserDraggingSlider && bgAudio) {
    const curTime = bgAudio.currentTime;
    syncTimeline(curTime);
  }

  // Smooth parameter lerping for buttery visual morphing
  updateMLerp();

  // Smooth physiological heartbeat pulse (lub-dub)
  let pulseScale = 1.0;
  if (currentMode === 'pulse16' || currentM >= 55) {
    pulseScale = getSmoothHeartbeat(phaseTime);
  }

  // Render main canvas or grid
  if (currentMode === 'grid4') {
    graphCanvas.style.display = 'none';
    gridContainer.style.display = 'grid';
    const dpr = window.devicePixelRatio || 1;

    // Draw on the 4 mini canvases dynamically
    gridCanvases.forEach((c, idx) => {
      if (c) {
        const rect = c.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const targetW = Math.round(rect.width * dpr);
          const targetH = Math.round(rect.height * dpr);
          if (c.width !== targetW || c.height !== targetH) {
            c.width = targetW;
            c.height = targetH;
          }
          const ctx = gridContexts[idx];
          if (ctx) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
            drawChalkboardGraph(ctx, rect.width, rect.height, 100.0, {
              isPurple: false,
              pulseScale: pulseScale,
              showGridText: true
            });
          }
        }
      }
    });
  } else {
    graphCanvas.style.display = 'block';
    gridContainer.style.display = 'none';
    const isPurple = (currentMode === 'pulse16');
    const mToDraw = (currentMode === 'pulse16') ? 16.0 : currentM;
    const wavePhase = (currentMode === 'pulse16') ? -phaseTime * 4.0 : 0;

    drawChalkboardGraph(graphCtx, canvasCssWidth, canvasCssHeight, mToDraw, {
      isPurple: isPurple,
      pulseScale: pulseScale,
      phase: wavePhase,
      showGridText: true
    });
  }

  requestAnimationFrame(renderFrame);
}

// --- Audio & Timeline Sync Logic ---
function syncTimeline(time) {
  // Find current slot in timeline
  let activeIndex = 0;
  for (let i = 0; i < TIMELINE.length; i++) {
    if (time >= TIMELINE[i].t) {
      activeIndex = i;
    } else {
      break;
    }
  }

  const currentSlot = TIMELINE[activeIndex];
  const nextSlot = TIMELINE[activeIndex + 1];

  // Interpolate mValue smoothly
  let nextTargetM = currentSlot.m;
  if (nextSlot) {
    const fraction = (time - currentSlot.t) / (nextSlot.t - currentSlot.t);
    nextTargetM = currentSlot.m + (nextSlot.m - currentSlot.m) * Math.min(1, Math.max(0, fraction));
  } else {
    // Keep at 100 - NEVER decrease or disappear!
    nextTargetM = 100.0;
  }

  setM(nextTargetM, false);

  // Update Lyrics
  if (currentSlot.p !== lyricPrimary.textContent) {
    lyricPrimary.textContent = currentSlot.p;
  }
  if (currentSlot.s !== lyricSecondary.textContent) {
    lyricSecondary.textContent = currentSlot.s;
  }
}

// --- Mode Switching ---
function switchMode(newMode, manual = true) {
  currentMode = newMode;
  
  modeStandardBtn.classList.toggle('active', newMode === 'standard');
  modePulseBtn.classList.toggle('active', newMode === 'pulse16');
  modeGridBtn.classList.toggle('active', newMode === 'grid4');

  if (newMode === 'grid4') {
    graphCanvas.style.display = 'none';
    gridContainer.style.display = 'grid';
    updateFormulaDisplay(100.0, false);
    setM(100.0, true);
  } else {
    graphCanvas.style.display = 'block';
    gridContainer.style.display = 'none';
    if (newMode === 'pulse16') {
      updateFormulaDisplay(16.0, true);
      setM(16.0, true);
    } else {
      updateFormulaDisplay(currentM, false);
    }
  }
}

// --- Audio Playback Controls ---
async function startPlayback() {
  try {
    await bgAudio.play();
    isPlaying = true;
    playBtnText.textContent = 'Tạm Dừng';
    playBtnIcon.textContent = '⏸';
    audioIndicator.style.display = 'flex';
  } catch (err) {
    console.warn('Audio play error / user interaction required:', err);
    isPlaying = true;
    playBtnText.textContent = 'Đang Chạy';
    playBtnIcon.textContent = '▶';
  }
}

function pausePlayback() {
  bgAudio.pause();
  isPlaying = false;
  playBtnText.textContent = 'Tiếp Tục Phát';
  playBtnIcon.textContent = '▶';
  audioIndicator.style.display = 'none';
}

function togglePlayback() {
  if (isPlaying) {
    pausePlayback();
  } else {
    // If finished or at end, replay from beginning smoothly
    if (bgAudio.ended || bgAudio.currentTime >= 29) {
      bgAudio.currentTime = 0;
      targetM = 0.1;
      currentM = 0.1;
      setM(0.1, true);
    }
    startPlayback();
  }
}

// --- Floating Hearts on Click ---
function createFloatingHeart(x, y, text = '❤️') {
  const heart = document.createElement('div');
  heart.className = 'click-heart';
  heart.textContent = text;
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 1200);
}

// --- Confession Modal Typing Letter ---
let typingInterval = null;
function openLetterModal() {
  letterModal.style.display = 'flex';
  letterContent.textContent = '';
  
  if (typingInterval) clearInterval(typingInterval);
  
  let charIndex = 0;
  typingInterval = setInterval(() => {
    if (charIndex < LOVE_LETTER_TEXT.length) {
      letterContent.textContent += LOVE_LETTER_TEXT.charAt(charIndex);
      charIndex++;
    } else {
      clearInterval(typingInterval);
      typingInterval = null;
    }
  }, 28);
}

function closeLetterModal() {
  letterModal.style.display = 'none';
  if (typingInterval) {
    clearInterval(typingInterval);
    typingInterval = null;
  }
}

// --- Canvas Resizing & Resolution Handling ---
let canvasCssWidth = 400;
let canvasCssHeight = 400;
let gridCssSizes = [];

function resizeCanvases() {
  const dpr = window.devicePixelRatio || 1;

  // Background Canvas
  bgCanvas.width = window.innerWidth * dpr;
  bgCanvas.height = window.innerHeight * dpr;
  bgCanvas.style.width = `${window.innerWidth}px`;
  bgCanvas.style.height = `${window.innerHeight}px`;
  bgCtx.setTransform(1, 0, 0, 1, 0, 0);
  bgCtx.scale(dpr, dpr);

  // Main Graph Canvas
  const rect = graphCanvas.getBoundingClientRect();
  canvasCssWidth = rect.width;
  canvasCssHeight = rect.height;
  graphCanvas.width = Math.round(rect.width * dpr);
  graphCanvas.height = Math.round(rect.height * dpr);
  graphCtx.setTransform(1, 0, 0, 1, 0, 0);
  graphCtx.scale(dpr, dpr);

  // Grid Mini Canvases
  gridCssSizes = [];
  gridCanvases.forEach((c, idx) => {
    if (c) {
      const crect = c.getBoundingClientRect();
      gridCssSizes[idx] = { w: crect.width, h: crect.height };
      c.width = Math.round(crect.width * dpr);
      c.height = Math.round(crect.height * dpr);
      const ctx = gridContexts[idx];
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      }
    }
  });

  initParticles();
}

// --- Event Listeners Initialization ---
function initEvents() {
  window.addEventListener('resize', resizeCanvases);

  // Slider interaction
  mSlider.addEventListener('input', (e) => {
    isUserDraggingSlider = true;
    const val = parseFloat(e.target.value);
    setM(val, false);
    if (currentMode === 'pulse16') {
      switchMode('standard', true);
    }
    updateFormulaDisplay(val, false);
  });

  mSlider.addEventListener('change', () => {
    isUserDraggingSlider = false;
  });

  // Play button
  playBtn.addEventListener('click', togglePlayback);

  // Audio events
  bgAudio.addEventListener('ended', () => {
    isPlaying = false;
    playBtnText.textContent = 'Phát Lại Nhạc';
    playBtnIcon.textContent = '🔁';
    audioIndicator.style.display = 'none';
    // Giữ nguyên trái tim rực rỡ và đập nhịp, tuyệt đối KHÔNG làm mất đi!
    targetM = 100.0;
    currentM = 100.0;
    setM(100.0, true);
  });

  // Mode buttons
  modeStandardBtn.addEventListener('click', () => switchMode('standard', true));
  modePulseBtn.addEventListener('click', () => switchMode('pulse16', true));
  modeGridBtn.addEventListener('click', () => switchMode('grid4', true));

  // Confession modal
  letterBtn.addEventListener('click', openLetterModal);
  letterModalClose.addEventListener('click', closeLetterModal);
  letterModal.addEventListener('click', (e) => {
    if (e.target === letterModal) closeLetterModal();
  });
  sendHeartModalBtn.addEventListener('click', (e) => {
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        const x = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
        const y = window.innerHeight / 2 + (Math.random() - 0.5) * 100;
        createFloatingHeart(x, y, ['💖', '💕', '💗', '❤️', '🌸'][Math.floor(Math.random() * 5)]);
      }, i * 120);
    }
    closeLetterModal();
  });

  // Tap/Click on screen to create hearts & math sparks
  window.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.modal-card')) {
      return;
    }
    const icons = ['❤️', '💖', 'f(x)', 'lim', '∫', 'π', '∞'];
    const chosen = icons[Math.floor(Math.random() * icons.length)];
    createFloatingHeart(e.clientX, e.clientY, chosen);
  });
}

// --- Bootstrap ---
document.addEventListener('DOMContentLoaded', () => {
  resizeCanvases();
  initEvents();

  const urlParams = new URLSearchParams(window.location.search);
  const qm = urlParams.get('m');
  const qmode = urlParams.get('mode');

  if (qm) {
    setM(parseFloat(qm), true);
  } else {
    setM(0.1, true);
  }

  if (qmode) {
    switchMode(qmode, true);
  } else {
    updateFormulaDisplay(currentM, false);
  }

  // Start animation loop
  requestAnimationFrame(renderFrame);
});
