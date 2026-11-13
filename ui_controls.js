/**
 * SSTS - 音效合成器、全螢幕/PWA偵測、首頁Logo、劇情動畫與雙手多點觸控搖桿 (ui_controls.js)
 */

/* ==================== Web Audio 合成音效 ==================== */
let audioCtx = null;
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function playTone(freq, type, duration, gainLevel = 0.08) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(gainLevel, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch(e){}
}

/* ==================== 裝置偵測與全螢幕切換 (含 iOS 引導與 PWA 自動隱藏) ==================== */
function isIOSDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isStandaloneMode() {
  return window.navigator.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches;
}

function toggleGlobalFullscreen() {
  const btn = document.getElementById('btn-global-fullscreen');

  if (isIOSDevice()) {
    if (isStandaloneMode()) {
      alert("目前已處於 iOS 無邊框全螢幕應用程式模式！");
    } else {
      alert(
        "📱 iPhone / iPad 全螢幕遊玩方式：\n\n" +
        "1. 【最佳體驗】點擊下方「分享按鈕 (方框向上箭頭)」→ 選擇「加入主畫面」，再從桌面圖示開啟即可獲得 100% 無網址列全螢幕！\n\n" +
        "2. 【快速隱藏】點擊網址列左側的「大小 / 閱讀器圖示」→ 選擇「隱藏工具列」。"
      );
    }
    return;
  }

  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }
    if (btn) btn.innerText = "✖ 退出全螢幕";
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    if (btn) btn.innerText = "⛶ 全螢幕";
  }
}

document.addEventListener('fullscreenchange', () => {
  const btn = document.getElementById('btn-global-fullscreen');
  if (btn) btn.innerText = document.fullscreenElement ? "✖ 退出全螢幕" : "⛶ 全螢幕";
  if (typeof resizeBattleCanvas === 'function') resizeBattleCanvas();
});

/* ==================== 首頁動態發光 LOGO ==================== */
const logoCanvas = document.getElementById('logo-canvas');
const lctx = logoCanvas.getContext('2d');
let logoTime = 0;
let logoAnimId = null;

const bubbles = Array.from({ length: 35 }, () => ({
  x: Math.random() * logoCanvas.width,
  y: Math.random() * logoCanvas.height,
  r: 1 + Math.random() * 2.5,
  speed: 0.3 + Math.random() * 0.7,
  alpha: 0.15 + Math.random() * 0.4
}));

function drawLogo() {
  logoTime += 0.035;
  lctx.clearRect(0, 0, logoCanvas.width, logoCanvas.height);

  for (const b of bubbles) {
    b.y -= b.speed;
    if (b.y < -10) { b.y = logoCanvas.height + 10; b.x = Math.random() * logoCanvas.width; }
    lctx.fillStyle = `rgba(56, 189, 248, ${b.alpha})`;
    lctx.beginPath();
    lctx.arc(b.x + Math.sin(logoTime + b.y * 0.05) * 5, b.y, b.r, 0, Math.PI * 2);
    lctx.fill();
  }

  const cx = logoCanvas.width / 2;
  const pulse = Math.sin(logoTime);

  lctx.save();
  lctx.font = "900 15px 'Courier New', monospace";
  lctx.textAlign = "center";
  lctx.fillStyle = "rgba(56, 189, 248, 0.9)";
  lctx.shadowColor = "#0284c7";
  lctx.shadowBlur = 8 + pulse * 4;
  lctx.fillText("— SSTS · TACTICAL SURVIVAL —", cx, 35);
  lctx.restore();

  lctx.save();
  lctx.font = "900 39px -apple-system, BlinkMacSystemFont, 'Microsoft JhengHei', sans-serif";
  lctx.textAlign = "center";
  lctx.shadowColor = "rgba(14, 165, 233, 0.85)";
  lctx.shadowBlur = 22 + pulse * 10;

  const textGrad = lctx.createLinearGradient(cx - 200, 0, cx + 200, 0);
  textGrad.addColorStop(0, "#34d399");
  textGrad.addColorStop(0.45, "#38bdf8");
  textGrad.addColorStop(1, "#06b6d4");
  lctx.fillStyle = textGrad;
  lctx.fillText("地表倖存者：深海逆鱗", cx, 102 + Math.sin(logoTime * 0.8) * 2);
  lctx.restore();

  lctx.save();
  lctx.font = "800 15px 'Segoe UI', sans-serif";
  lctx.textAlign = "center";
  lctx.fillStyle = "#94a3b8";
  lctx.shadowColor = "rgba(56, 189, 248, 0.4)";
  lctx.shadowBlur = 6;
  lctx.fillText("SURFACE SURVIVORS: TIDAL SIEGE", cx, 140);
  lctx.restore();

  logoAnimId = requestAnimationFrame(drawLogo);
}

drawLogo();

/* ==================== 故事模式 ==================== */
const storyCanvas = document.getElementById('story-canvas');
const sctx = storyCanvas.getContext('2d');
let storyTime = 0;
let storyAnimId = null;

const storyData = [
  { chapter: "SSTS // ARCHIVE 01", title: "海淵巨響 · 沉眠者復甦", desc: "萬米海溝深處的海洋霸主睜開眼瞳。遠古逆鱗引發深海沸騰狂潮，全球海岸線全面告急！" },
  { chapter: "SSTS // ARCHIVE 02", title: "逆鱗狂潮 · 百國淪陷", desc: "自最小的梵蒂岡到遼闊大陸，各國海岸皆被變異海嗣突破，地表文明退守各大洲的核心掩體。" },
  { chapter: "SSTS // ARCHIVE 03", title: "地表同盟 · 哨站奪還戰", desc: "藍裝 1 詞條、黃裝 2 詞條、橘裝 3 詞條！升星強化核心數值，擊潰海嗣收復全球 100 國！" },
  { chapter: "SSTS // MISSION START", title: "全球反擊 · 征途展開", desc: "出擊吧！擊敗 Boss 獲取自選裝備，閒置裝備可拆解為金幣，強化戰甲迎戰深淵！" }
];

let storyIndex = 0;

function drawStoryScene() {
  storyTime += 0.04;
  sctx.clearRect(0, 0, storyCanvas.width, storyCanvas.height);
  const w = storyCanvas.width;
  const h = storyCanvas.height;
  const cx = w / 2;
  const cy = h / 2;

  if (storyIndex === 0) {
    const grad = sctx.createRadialGradient(cx, cy, 20, cx, cy, 140);
    grad.addColorStop(0, '#0c4a6e'); grad.addColorStop(1, '#020617');
    sctx.fillStyle = grad; sctx.fillRect(0, 0, w, h);
    sctx.save();
    sctx.translate(cx, cy);
    sctx.scale(1, 0.65 + Math.sin(storyTime * 0.8) * 0.08);
    sctx.strokeStyle = '#0284c7'; sctx.lineWidth = 3;
    sctx.beginPath(); sctx.ellipse(0, 0, 100, 55, 0, 0, Math.PI * 2); sctx.stroke();

    const iris = sctx.createRadialGradient(0, 0, 5, 0, 0, 50);
    iris.addColorStop(0, '#f59e0b'); iris.addColorStop(1, '#082f49');
    sctx.fillStyle = iris; sctx.beginPath(); sctx.arc(0, 0, 46, 0, Math.PI * 2); sctx.fill();
    sctx.fillStyle = '#020617'; sctx.beginPath(); sctx.ellipse(0, 0, 7 + Math.sin(storyTime * 2) * 2, 40, 0, 0, Math.PI * 2); sctx.fill();
    sctx.restore();
  } else {
    sctx.fillStyle = '#050c1a'; sctx.fillRect(0, 0, w, h);
    sctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
    sctx.beginPath(); sctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 10) sctx.lineTo(x, 120 + Math.sin(x * 0.02 + storyTime * 2) * 25);
    sctx.lineTo(w, h); sctx.closePath(); sctx.fill();
  }
  storyAnimId = requestAnimationFrame(drawStoryScene);
}

function startStory() {
  initAudio();
  loadGameSave();
  playTone(440, 'triangle', 0.2);
  if (logoAnimId) cancelAnimationFrame(logoAnimId);
  document.getElementById('title-screen').style.display = 'none';
  document.getElementById('story-screen').style.display = 'flex';
  renderStory();
  if (!storyAnimId) drawStoryScene();
}

function renderStory() {
  const current = storyData[storyIndex];
  document.getElementById('story-chapter').innerText = current.chapter;
  document.getElementById('story-title').innerText = current.title;
  document.getElementById('story-desc').innerText = current.desc;
  const dotsContainer = document.getElementById('dots-container');
  dotsContainer.innerHTML = '';
  storyData.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `dot ${idx === storyIndex ? 'active' : ''}`;
    dotsContainer.appendChild(dot);
  });
}

function handleStoryScreenClick(e) {
  if (e.target.classList.contains('story-skip-btn')) return;
  nextStory();
}

function nextStory() {
  playTone(550, 'sine', 0.15);
  storyIndex++;
  if (storyIndex >= storyData.length) {
    if (storyAnimId) { cancelAnimationFrame(storyAnimId); storyAnimId = null; }
    openWorldMapScreen();
  } else {
    renderStory();
  }
}

function skipStory(e) {
  e.stopPropagation();
  if (storyAnimId) { cancelAnimationFrame(storyAnimId); storyAnimId = null; }
  openWorldMapScreen();
}

/* ==================== 頁面初始化：多點觸控按鈕綁定與 PWA 全螢幕按鈕隱藏 ==================== */
function initUIControlsAndPWA() {
  const fsBtn = document.getElementById('btn-global-fullscreen');
  if (isStandaloneMode() && fsBtn) {
    fsBtn.style.display = 'none';
  }

  const btnArtifact = document.getElementById('btn-act-artifact');
  const btnDash = document.getElementById('btn-act-dash');

  if (btnArtifact) {
    btnArtifact.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof triggerArtifactSkill === 'function') triggerArtifactSkill();
    }, { passive: false });

    btnArtifact.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      if (typeof triggerArtifactSkill === 'function') triggerArtifactSkill();
    });
  }

  if (btnDash) {
    btnDash.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof triggerDash === 'function') triggerDash();
    }, { passive: false });

    btnDash.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      if (typeof triggerDash === 'function') triggerDash();
    });
  }
}

window.addEventListener('DOMContentLoaded', initUIControlsAndPWA);

/* ==================== 浮動搖桿 (支援雙手多點觸控隔離) ==================== */
const joyBase = document.getElementById('joystick-base');
const joyThumb = document.getElementById('joystick-thumb');
const joystick = { active: false, touchId: null, startX: 0, startY: 0, vectorX: 0, vectorY: 0, maxRadius: 50 };

function getTouchPosInCanvas(touch, canvasElem) {
  const rect = canvasElem.getBoundingClientRect();
  const scale = canvasElem.width / rect.width;
  return {
    x: (touch.clientX - rect.left) * scale,
    y: (touch.clientY - rect.top) * scale,
    uiX: touch.clientX - rect.left,
    uiY: touch.clientY - rect.top
  };
}

function initJoystickEvents(canvasElem) {
  canvasElem.addEventListener('touchstart', (e) => {
    if (isPaused || !gameRunning) return;
    if (e.cancelable) e.preventDefault();
    if (joystick.active) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const pos = getTouchPosInCanvas(touch, canvasElem);

      if (pos.x < canvasElem.width * 0.55) {
        joystick.active = true;
        joystick.touchId = touch.identifier;
        joystick.startX = pos.uiX;
        joystick.startY = pos.uiY;
        joystick.vectorX = 0;
        joystick.vectorY = 0;

        joyBase.style.left = `${pos.uiX}px`;
        joyBase.style.top = `${pos.uiY}px`;
        joyBase.style.display = 'block';
        joyThumb.style.transform = `translate(-50%, -50%)`;
        break;
      }
    }
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (!joystick.active) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === joystick.touchId) {
        if (e.cancelable) e.preventDefault();
        const pos = getTouchPosInCanvas(touch, canvasElem);

        const deltaX = pos.uiX - joystick.startX;
        const deltaY = pos.uiY - joystick.startY;
        const dist = Math.hypot(deltaX, deltaY);

        if (dist === 0) {
          joystick.vectorX = 0; joystick.vectorY = 0;
          joyThumb.style.transform = `translate(-50%, -50%)`;
        } else {
          const angle = Math.atan2(deltaY, deltaX);
          const clampedDist = Math.min(dist, joystick.maxRadius);
          const thumbX = Math.cos(angle) * clampedDist;
          const thumbY = Math.sin(angle) * clampedDist;
          joystick.vectorX = thumbX / joystick.maxRadius;
          joystick.vectorY = thumbY / joystick.maxRadius;
          joyThumb.style.transform = `translate(calc(-50% + ${thumbX}px), calc(-50% + ${thumbY}px))`;
        }
        break;
      }
    }
  }, { passive: false });

  function resetJoystick(e) {
    if (!joystick.active) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joystick.touchId) {
        joystick.active = false;
        joystick.touchId = null;
        joystick.vectorX = 0;
        joystick.vectorY = 0;
        joyBase.style.display = 'none';
        joyThumb.style.transform = `translate(-50%, -50%)`;
        break;
      }
    }
  }
  window.addEventListener('touchend', resetJoystick, { passive: false });
  window.addEventListener('touchcancel', resetJoystick, { passive: false });
}

/* ==================== 鍵盤操作 ==================== */
const keys = {};
window.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  if (e.code === 'Space') {
    e.preventDefault();
    if (typeof triggerDash === 'function') triggerDash();
  }
  if (e.key === 'l' || e.key === 'L') {
    if (typeof triggerArtifactSkill === 'function') triggerArtifactSkill();
  }
});
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
