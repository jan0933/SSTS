/**
 * SSTS - 遊戲核心控制、故事狀態機、觸控搖桿、衝刺閃避與背包邏輯
 */

/* ==================== 音效引擎 (Web Audio API) ==================== */
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

/* ==================== 手機全螢幕與方向鎖定請求 ==================== */
function requestLandscapeFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(() => {});
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  }
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(() => {});
  }
}

/* ==================== 首頁純程式碼動態 LOGO ==================== */
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
  lctx.fillText("— SSTS · MODULAR SURVIVAL —", cx, 35);
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

/* ==================== 故事頁面與動態插圖 ==================== */
const storyCanvas = document.getElementById('story-canvas');
const sctx = storyCanvas.getContext('2d');
let storyTime = 0;
let storyAnimId = null;

const storyData = [
  {
    chapter: "SSTS // ARCHIVE 01",
    title: "海淵巨響 · 沉眠者復甦",
    desc: "萬米海溝深處的海洋霸主睜開眼瞳。遠古逆鱗共振引發深海熱泉狂潮，海洋不再溫馴，化為狂暴的變異進化母體。"
  },
  {
    chapter: "SSTS // ARCHIVE 02",
    title: "逆鱗狂潮 · 異種登陸",
    desc: "深海巨獸散發出超導進化信號。魚群長出覆甲足肢，水母演化出懸浮腺體，數以萬計的變異海嗣撕裂海岸防線！"
  },
  {
    chapter: "SSTS // ARCHIVE 03",
    title: "地表同盟 · 孤注一擲",
    desc: "地表文明已無路可退。地表抗衛軍配備多模組「方舟核心」作戰甲胄，自由適配各類戰技，發起全面阻截！"
  },
  {
    chapter: "SSTS // MISSION START",
    title: "陸防前線 · 迎擊異形海嗣",
    desc: "突變潮汐已抵達據點！你可以透過搖桿移動、右手快捷鍵衝刺閃避與更換裝備，守衛陸地生靈！"
  }
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
    grad.addColorStop(0, '#0c4a6e');
    grad.addColorStop(1, '#020617');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, w, h);

    sctx.save();
    sctx.translate(cx, cy);
    sctx.scale(1, 0.65 + Math.sin(storyTime * 0.8) * 0.08);
    sctx.strokeStyle = '#0284c7';
    sctx.lineWidth = 3;
    sctx.beginPath();
    sctx.ellipse(0, 0, 100, 55, 0, 0, Math.PI * 2);
    sctx.stroke();

    const iris = sctx.createRadialGradient(0, 0, 5, 0, 0, 50);
    iris.addColorStop(0, '#f59e0b');
    iris.addColorStop(1, '#082f49');
    sctx.fillStyle = iris;
    sctx.beginPath();
    sctx.arc(0, 0, 46, 0, Math.PI * 2);
    sctx.fill();

    sctx.fillStyle = '#020617';
    sctx.beginPath();
    sctx.ellipse(0, 0, 7 + Math.sin(storyTime * 2) * 2, 40, 0, 0, Math.PI * 2);
    sctx.fill();
    sctx.restore();
  } else {
    sctx.fillStyle = '#050c1a';
    sctx.fillRect(0, 0, w, h);
    sctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
    sctx.beginPath();
    sctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 10) {
      sctx.lineTo(x, 120 + Math.sin(x * 0.02 + storyTime * 2) * 25);
    }
    sctx.lineTo(w, h);
    sctx.closePath();
    sctx.fill();
  }
  storyAnimId = requestAnimationFrame(drawStoryScene);
}

function startStory() {
  initAudio();
  requestLandscapeFullscreen();
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

  const nextBtn = document.getElementById('next-story-btn');
  if (storyIndex === storyData.length - 1) {
    nextBtn.innerText = "踏入戰場 (BATTLE)";
    nextBtn.style.background = "linear-gradient(135deg, #e11d48, #be123c)";
  } else {
    nextBtn.innerText = "下一頁 (NEXT)";
    nextBtn.style.background = "linear-gradient(135deg, #0284c7, #0369a1)";
  }
}

function nextStory() {
  playTone(550, 'sine', 0.15);
  storyIndex++;
  if (storyIndex >= storyData.length) enterGame();
  else renderStory();
}

function enterGame() {
  initAudio();
  playTone(330, 'square', 0.4);
  if (storyAnimId) { cancelAnimationFrame(storyAnimId); storyAnimId = null; }
  document.getElementById('story-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'flex';
  initGame();
}

/* ==================== 割草遊戲核心戰鬥 ==================== */
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const expBar = document.getElementById('exp-bar');
const txtLevel = document.getElementById('txt-level');
const txtKills = document.getElementById('txt-kills');
const txtHp = document.getElementById('txt-hp');
const upgradeModal = document.getElementById('upgrade-modal');
const dashCooldownOverlay = document.getElementById('dash-cooldown-overlay');

let isPaused = false;
let kills = 0;
let gameRunning = false;

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 0,
  vy: 0,
  radius: 14,
  speed: 2.8,
  hp: 100,
  maxHp: 100,
  exp: 0,
  level: 1,
  nextExp: 6,
  facing: 1,
  isMoving: false,
  animTimer: 0,
  attackTimer: 0,
  attackDuration: 14,
  fireInterval: 32,
  fireTimer: 0,

  // 電磁衝刺狀態控制
  isDashing: false,
  dashDuration: 9,      // 衝刺持續 9 幀
  dashTimer: 0,
  dashSpeedMulti: 3.5,  // 瞬間加速 3.5 倍
  dashCooldown: 90,     // 冷卻 90 幀 (~1.5 秒)
  dashCooldownTimer: 0,
  dashDirX: 1,
  dashDirY: 0,

  equipment: {
    helmet: 'scout',
    armor: 'scout',
    gloves: 'scout',
    boots: 'scout',
    accessory: 'mantle',
    talisman: 'orb',
    weapon: {
      type: 'melee',
      name: '離子軍刀',
      damage: 45,
      speed: 9
    }
  }
};

let dashGhosts = [];

// 觸發電磁衝刺
function triggerDash() {
  if (isPaused || !gameRunning || player.dashCooldownTimer > 0 || player.isDashing) return;

  player.isDashing = true;
  player.dashTimer = player.dashDuration;
  player.dashCooldownTimer = player.dashCooldown;

  // 若目前有移動向量則朝該方向衝，否則朝當前面向方向衝
  if (player.vx !== 0 || player.vy !== 0) {
    const len = Math.hypot(player.vx, player.vy);
    player.dashDirX = player.vx / len;
    player.dashDirY = player.vy / len;
  } else {
    player.dashDirX = player.facing;
    player.dashDirY = 0;
  }

  playTone(920, 'sawtooth', 0.12, 0.08);
}

const keys = {};
window.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === 'b' || e.key === 'B') toggleInventory();
  if (e.code === 'Space') {
    e.preventDefault();
    triggerDash();
  }
});
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

/* ==================== 動態浮動虛擬搖桿 ==================== */
const joyBase = document.getElementById('joystick-base');
const joyThumb = document.getElementById('joystick-thumb');

const joystick = {
  active: false,
  touchId: null,
  startX: 0,
  startY: 0,
  vectorX: 0,
  vectorY: 0,
  maxRadius: 50
};

// 避免右手點按按鈕時觸發左側搖桿
canvas.addEventListener('touchstart', (e) => {
  if (isPaused || !gameRunning) return;
  if (joystick.active) return;

  const rect = canvas.getBoundingClientRect();
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    // 螢幕左半部（或左側 60% 區域）觸控才判定為呼叫移動搖桿
    if (touchX < rect.width * 0.65) {
      joystick.active = true;
      joystick.touchId = touch.identifier;
      joystick.startX = touchX;
      joystick.startY = touchY;
      joystick.vectorX = 0;
      joystick.vectorY = 0;

      joyBase.style.left = `${touchX}px`;
      joyBase.style.top = `${touchY}px`;
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
      const rect = canvas.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;

      const deltaX = touchX - joystick.startX;
      const deltaY = touchY - joystick.startY;
      const dist = Math.hypot(deltaX, deltaY);

      if (dist === 0) {
        joystick.vectorX = 0;
        joystick.vectorY = 0;
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

/* ==================== 背包系統與九宮格數據 ==================== */
let isInventoryOpen = false;
let previewAnimId = null;
let previewTime = 0;

const previewCanvas = document.getElementById('preview-canvas');
const pctx = previewCanvas.getContext('2d');
const invModal = document.getElementById('inventory-modal');
const invGrid = document.getElementById('inv-grid');
const previewInfo = document.getElementById('preview-info');

const INVENTORY_ITEMS = [
  { id: "w_melee", slot: "weapon", name: "離子軍刀", type: "近戰武器", desc: "高速扇形揮砍 (傷害 45)", data: { type: 'melee', name: '離子軍刀', damage: 45, speed: 9 } },
  { id: "w_bow", slot: "weapon", name: "電磁弩弓", type: "弓箭遠程", desc: "超遠距電磁貫穿 (傷害 30)", data: { type: 'bow', name: '電磁弩弓', damage: 30, speed: 12 } },
  { id: "w_staff", slot: "weapon", name: "星核法杖", type: "法術法杖", desc: "聚能等離子寶珠 (傷害 60)", data: { type: 'staff', name: '星核法杖', damage: 60, speed: 6 } },
  { id: "h_heavy", slot: "helmet", name: "重裝角盔", type: "頭盔", desc: "堅韌合金與猩紅目鏡", val: "heavy" },
  { id: "h_archmage", slot: "helmet", name: "奧術風帽", type: "頭盔", desc: "聚能紫光法師頭部", val: "archmage" },
  { id: "a_heavy", slot: "armor", name: "板塊重鎧", type: "盔甲", desc: "加厚金屬胸甲防禦片", val: "heavy" },
  { id: "a_archmage", slot: "armor", name: "秘法星袍", type: "盔甲", desc: "深紫能量護符外袍", val: "archmage" },
  { id: "t_totem", slot: "talisman", name: "赤焰圖騰", type: "法器", desc: "身後浮遊赤紅核心", val: "totem" },
  { id: "acc_relic", slot: "accessory", name: "太陽遺物", type: "配件", desc: "金色神聖流動光輝", val: "relic" }
];

function toggleInventory() {
  if (!gameRunning) return;
  isInventoryOpen = !isInventoryOpen;

  if (isInventoryOpen) {
    isPaused = true;
    invModal.style.display = "flex";
    renderInventorySlots();
    startPreviewLoop();
    playTone(520, 'sine', 0.1);
  } else {
    isPaused = false;
    invModal.style.display = "none";
    if (previewAnimId) cancelAnimationFrame(previewAnimId);
    playTone(380, 'sine', 0.1);
  }
}

function renderInventorySlots() {
  invGrid.innerHTML = '';
  previewInfo.innerText = `武器：${player.equipment.weapon.name} | 頭盔：${player.equipment.helmet}`;

  INVENTORY_ITEMS.forEach(item => {
    const slot = document.createElement('div');
    slot.className = 'item-slot';

    let isEquipped = false;
    if (item.slot === 'weapon' && player.equipment.weapon.name === item.data.name) isEquipped = true;
    if (item.slot === 'helmet' && player.equipment.helmet === item.val) isEquipped = true;
    if (item.slot === 'armor' && player.equipment.armor === item.val) isEquipped = true;
    if (item.slot === 'talisman' && player.equipment.talisman === item.val) isEquipped = true;
    if (item.slot === 'accessory' && player.equipment.accessory === item.val) isEquipped = true;

    if (isEquipped) slot.classList.add('equipped');

    slot.innerHTML = `
      <div class="item-name">${item.name}</div>
      <div class="item-type">${item.type}</div>
      <div class="item-desc">${item.desc}</div>
    `;

    slot.onclick = () => equipItem(item);
    invGrid.appendChild(slot);
  });
}

function equipItem(item) {
  if (item.slot === 'weapon') player.equipment.weapon = { ...item.data };
  else if (item.slot === 'helmet') player.equipment.helmet = item.val;
  else if (item.slot === 'armor') player.equipment.armor = item.val;
  else if (item.slot === 'talisman') player.equipment.talisman = item.val;
  else if (item.slot === 'accessory') player.equipment.accessory = item.val;

  playTone(750, 'triangle', 0.08);
  renderInventorySlots();
}

function startPreviewLoop() {
  function loop() {
    if (!isInventoryOpen) return;
    previewTime += 0.04;
    drawInventoryPreview(pctx, player, previewTime);
    previewAnimId = requestAnimationFrame(loop);
  }
  loop();
}

/* ==================== 實體與循環 ==================== */
let enemies = [];
let bullets = [];
let gems = [];
let spawnInterval = 32;
let spawnTimer = 0;

function initGame() {
  if (gameRunning) return;
  gameRunning = true;
  requestAnimationFrame(gameLoop);
}

function spawnSeaEnemy() {
  const edge = Math.floor(Math.random() * 4);
  let x, y;
  if (edge === 0) { x = Math.random() * canvas.width; y = -20; }
  else if (edge === 1) { x = canvas.width + 20; y = Math.random() * canvas.height; }
  else if (edge === 2) { x = Math.random() * canvas.width; y = canvas.height + 20; }
  else { x = -20; y = Math.random() * canvas.height; }

  const isJelly = Math.random() > 0.45;
  enemies.push({
    x, y,
    type: isJelly ? 'jelly' : 'fish',
    radius: isJelly ? 12 : 9,
    speed: isJelly ? (1.0 + Math.random() * 0.3) : (1.6 + Math.random() * 0.4),
    hp: isJelly ? (42 + player.level * 8) : (24 + player.level * 4),
    pulse: Math.random() * 10
  });
}

function executeAttack() {
  if (enemies.length === 0) return;
  let nearest = null;
  let minDist = Infinity;
  for (const enemy of enemies) {
    const d = Math.hypot(enemy.x - player.x, enemy.y - player.y);
    if (d < minDist) { minDist = d; nearest = enemy; }
  }
  if (!nearest) return;

  player.attackTimer = player.attackDuration;
  player.facing = nearest.x >= player.x ? 1 : -1;

  const angle = Math.atan2(nearest.y - player.y, nearest.x - player.x);
  const w = player.equipment.weapon;

  bullets.push({
    x: player.x,
    y: player.y,
    vx: Math.cos(angle) * w.speed,
    vy: Math.sin(angle) * w.speed,
    radius: w.type === 'staff' ? 6 : (w.type === 'bow' ? 3 : 5),
    damage: w.damage,
    type: w.type
  });

  if (w.type === 'melee') playTone(280, 'sawtooth', 0.12);
  else if (w.type === 'bow') playTone(850, 'triangle', 0.08);
  else playTone(650, 'sine', 0.18);
}

function updateGame() {
  if (isPaused) return;

  // 1. 移動輸入計算
  let dx = 0, dy = 0;
  if (keys['w'] || keys['arrowup']) dy -= 1;
  if (keys['s'] || keys['arrowdown']) dy += 1;
  if (keys['a'] || keys['arrowleft']) dx -= 1;
  if (keys['d'] || keys['arrowright']) dx += 1;

  if (dx !== 0 && dy !== 0) { dx *= 0.7071; dy *= 0.7071; }

  // 融合虛擬搖桿輸入
  if (joystick.active && (joystick.vectorX !== 0 || joystick.vectorY !== 0)) {
    dx = joystick.vectorX;
    dy = joystick.vectorY;
  }

  // 2. 處理衝刺冷卻與衝刺位移邏輯
  if (player.dashCooldownTimer > 0) {
    player.dashCooldownTimer--;
    // 更新衝刺按鈕遮罩高度百分比 (冷卻進度)
    const pct = (player.dashCooldownTimer / player.dashCooldown) * 100;
    dashCooldownOverlay.style.height = `${pct}%`;
  } else {
    dashCooldownOverlay.style.height = `0%`;
  }

  if (player.isDashing) {
    player.dashTimer--;
    player.vx = player.dashDirX * player.speed * player.dashSpeedMulti;
    player.vy = player.dashDirY * player.speed * player.dashSpeedMulti;

    // 每幀生成殘影
    dashGhosts.push({
      x: player.x,
      y: player.y,
      facing: player.facing,
      alpha: 1.0
    });

    if (player.dashTimer <= 0) {
      player.isDashing = false;
    }
  } else {
    player.isMoving = (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05);
    if (player.isMoving) {
      player.animTimer += 0.08;
      if (Math.abs(dx) > 0.05) player.facing = dx > 0 ? 1 : -1;
    }
    player.vx = dx * player.speed;
    player.vy = dy * player.speed;
  }

  player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x + player.vx));
  player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y + player.vy));

  // 3. 更新殘影透明度衰退
  for (let i = dashGhosts.length - 1; i >= 0; i--) {
    dashGhosts[i].alpha -= 0.12;
    if (dashGhosts[i].alpha <= 0) {
      dashGhosts.splice(i, 1);
    }
  }

  // 4. 自動攻擊
  if (player.attackTimer > 0) player.attackTimer--;
  player.fireTimer++;
  if (player.fireTimer >= player.fireInterval) {
    executeAttack();
    player.fireTimer = 0;
  }

  // 5. 子彈飛行與碰撞
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx;
    b.y += b.vy;
    if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
      bullets.splice(i, 1);
      continue;
    }
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if (Math.hypot(b.x - e.x, b.y - e.y) < b.radius + e.radius) {
        e.hp -= b.damage;
        bullets.splice(i, 1);
        playTone(220, 'sawtooth', 0.04);
        if (e.hp <= 0) {
          gems.push({ x: e.x, y: e.y, radius: 4 });
          enemies.splice(j, 1);
          kills++;
          txtKills.innerText = `擊退海嗣: ${kills}`;
        }
        break;
      }
    }
  }

  // 6. 敵群追蹤與撞擊判定 (衝刺期間具備無敵免疫)
  spawnTimer++;
  if (spawnTimer >= spawnInterval) {
    spawnSeaEnemy();
    spawnTimer = 0;
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.pulse += 0.08;
    const angle = Math.atan2(player.y - e.y, player.x - e.x);
    e.x += Math.cos(angle) * e.speed;
    e.y += Math.sin(angle) * e.speed;

    if (!player.isDashing && Math.hypot(player.x - e.x, player.y - e.y) < player.radius + e.radius) {
      player.hp -= 0.35;
      txtHp.innerText = `核心護甲: ${Math.max(0, Math.floor(player.hp))}/${player.maxHp}`;
      if (player.hp <= 0) {
        alert(`防禦要塞失守！你共消滅了 ${kills} 隻登陸海嗣。`);
        location.reload();
      }
    }
  }

  // 7. 經驗寶石吸附
  for (let i = gems.length - 1; i >= 0; i--) {
    const g = gems[i];
    const dist = Math.hypot(player.x - g.x, player.y - g.y);
    if (dist < 65) {
      const angle = Math.atan2(player.y - g.y, player.x - g.x);
      g.x += Math.cos(angle) * 5.5;
      g.y += Math.sin(angle) * 5.5;
    }
    if (dist < player.radius + g.radius) {
      gems.splice(i, 1);
      player.exp++;
      playTone(1050, 'sine', 0.04);
      if (player.exp >= player.nextExp) triggerLevelUp();
      expBar.style.width = `${(player.exp / player.nextExp) * 100}%`;
    }
  }
}

function triggerLevelUp() {
  isPaused = true;
  player.level++;
  player.exp = 0;
  player.nextExp = Math.floor(player.nextExp * 1.4);
  txtLevel.innerText = `防衛階級: ${player.level}`;
  upgradeModal.style.display = 'flex';
  playTone(700, 'sine', 0.25);
}

function chooseUpgrade(type) {
  if (type === 'firerate') player.fireInterval = Math.max(8, Math.floor(player.fireInterval * 0.8));
  if (type === 'damage') {
    player.equipment.weapon.damage = Math.floor(player.equipment.weapon.damage * 1.4);
  }
  if (type === 'speed') player.speed *= 1.15;
  upgradeModal.style.display = 'none';
  isPaused = false;
}

function renderGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(14, 165, 233, 0.06)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  for (const g of gems) {
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const b of bullets) {
    ctx.fillStyle = b.type === 'staff' ? '#c084fc' : (b.type === 'bow' ? '#38bdf8' : '#67e8f9');
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  drawEnemies(ctx, enemies);

  // 繪製衝刺殘影與玩家紙娃娃
  drawDashGhosts(ctx, dashGhosts);
  drawPlayerPaperdoll(ctx, player);
}

function gameLoop() {
  updateGame();
  renderGame();
  requestAnimationFrame(gameLoop);
}
