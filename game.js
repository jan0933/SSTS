/**
 * SSTS - 遊戲核心邏輯與控制引擎
 */

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

/* ==================== 故事插圖與過場 ==================== */
const storyCanvas = document.getElementById('story-canvas');
const sctx = storyCanvas.getContext('2d');
let storyTime = 0;
let storyAnimId = null;

const storyData = [
  {
    chapter: "SSTS // ARCHIVE 01",
    title: "海淵巨響 · 沉眠者復甦",
    desc: "萬米海溝深處的海洋霸主睜眼。遠古逆鱗共振引發深海熱泉狂潮，海洋不再溫馴，化為狂暴的變異進化母體。"
  },
  {
    chapter: "SSTS // ARCHIVE 02",
    title: "逆鱗狂潮 · 異種登陸",
    desc: "深海巨獸散發出超導進化信號。魚群長出覆甲足肢，水母演化出懸浮腺體，數以萬計的變異海嗣撕裂海岸堤防！"
  },
  {
    chapter: "SSTS // ARCHIVE 03",
    title: "地表同盟 · 孤注一擲",
    desc: "地表文明已無路可退。地表抗衛軍配備多模組「方舟核心」作戰甲胄，自由適配各類戰技，發起全面阻截！"
  },
  {
    chapter: "SSTS // MISSION START",
    title: "陸防前線 · 迎擊異形海嗣",
    desc: "突變潮汐已抵達據點！你可以透過數字鍵 [1]、[2]、[3] 即時更換近戰、弓弩與法杖，守衛陸地生靈！"
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
    // 巨眼
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
    // 波浪
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

/* ==================== 割草主遊戲邏輯 ==================== */
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const expBar = document.getElementById('exp-bar');
const txtLevel = document.getElementById('txt-level');
const txtKills = document.getElementById('txt-kills');
const txtHp = document.getElementById('txt-hp');
const txtWeapon = document.getElementById('txt-weapon');
const upgradeModal = document.getElementById('upgrade-modal');

let isPaused = false;
let kills = 0;
let gameRunning = false;

// 玩家實體與完整的換裝槽位數據
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
  facing: 1, // 1: 右, -1: 左
  isMoving: false,
  animTimer: 0,

  // 攻擊動畫控制
  attackTimer: 0,
  attackDuration: 14, // 攻擊動作持續幀數
  fireInterval: 32,
  fireTimer: 0,

  // 完整裝備槽位 (紙娃娃外觀系統)
  equipment: {
    helmet: 'scout',       // 'scout' | 'heavy' | 'archmage'
    armor: 'scout',        // 'scout' | 'heavy' | 'archmage'
    gloves: 'scout',       // 'scout' | 'heavy' | 'archmage'
    boots: 'scout',        // 'scout' | 'heavy' | 'archmage'
    accessory: 'mantle',   // 'mantle' | 'relic'
    talisman: 'orb',       // 'orb' | 'totem'
    weapon: {
      type: 'melee',       // 'melee' (軍刀) | 'bow' (弓箭) | 'staff' (法杖)
      name: '離子軍刀',
      damage: 45,
      speed: 9
    }
  }
};

const keys = {};
window.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;

  // 快捷換裝按鍵測試 (1: 近戰, 2: 弓箭, 3: 法杖)
  if (e.key === '1') {
    player.equipment.weapon = { type: 'melee', name: '離子軍刀', damage: 45, speed: 9 };
    player.equipment.helmet = 'heavy';
    player.equipment.armor = 'heavy';
    txtWeapon.innerText = "武器: 離子軍刀 (近戰)";
    playTone(400, 'sine', 0.1);
  }
  if (e.key === '2') {
    player.equipment.weapon = { type: 'bow', name: '電磁弩弓', damage: 30, speed: 12 };
    player.equipment.helmet = 'scout';
    player.equipment.armor = 'scout';
    txtWeapon.innerText = "武器: 電磁弩弓 (遠程)";
    playTone(600, 'sine', 0.1);
  }
  if (e.key === '3') {
    player.equipment.weapon = { type: 'staff', name: '星核法杖', damage: 60, speed: 6 };
    player.equipment.helmet = 'archmage';
    player.equipment.armor = 'archmage';
    txtWeapon.innerText = "武器: 星核法杖 (法器)";
    playTone(800, 'sine', 0.1);
  }
});
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

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

  // 觸發攻擊動畫計時器
  player.attackTimer = player.attackDuration;

  // 自動調整角色面朝方向
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

  // 1. 玩家移動計算
  let dx = 0, dy = 0;
  if (keys['w'] || keys['arrowup']) dy -= 1;
  if (keys['s'] || keys['arrowdown']) dy += 1;
  if (keys['a'] || keys['arrowleft']) dx -= 1;
  if (keys['d'] || keys['arrowright']) dx += 1;

  player.isMoving = (dx !== 0 || dy !== 0);
  if (player.isMoving) {
    player.animTimer += 0.08;
    if (dx !== 0) player.facing = dx > 0 ? 1 : -1;
    if (dx !== 0 && dy !== 0) { dx *= 0.7071; dy *= 0.7071; }
  }
  player.vx = dx * player.speed;
  player.vy = dy * player.speed;
  player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x + player.vx));
  player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y + player.vy));

  // 2. 攻擊冷卻與攻擊動作衰減
  if (player.attackTimer > 0) player.attackTimer--;
  player.fireTimer++;
  if (player.fireTimer >= player.fireInterval) {
    executeAttack();
    player.fireTimer = 0;
  }

  // 3. 子彈與擊中判定
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

  // 4. 敵人生成與追蹤
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

    if (Math.hypot(player.x - e.x, player.y - e.y) < player.radius + e.radius) {
      player.hp -= 0.35;
      txtHp.innerText = `核心護甲: ${Math.max(0, Math.floor(player.hp))}/${player.maxHp}`;
      if (player.hp <= 0) {
        alert(`防禦要塞失守！你共消滅了 ${kills} 隻登陸海嗣。`);
        location.reload();
      }
    }
  }

  // 5. 寶石吸附
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

  // 背景科技網格
  ctx.strokeStyle = "rgba(14, 165, 233, 0.06)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  // 水晶
  for (const g of gems) {
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // 子彈
  for (const b of bullets) {
    ctx.fillStyle = b.type === 'staff' ? '#c084fc' : (b.type === 'bow' ? '#38bdf8' : '#67e8f9');
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // 繪製敵人 (呼叫 render_art.js)
  drawEnemies(ctx, enemies);

  // 繪製紙娃娃玩家 (呼叫 render_art.js)
  drawPlayerPaperdoll(ctx, player);
}

function gameLoop() {
  updateGame();
  renderGame();
  requestAnimationFrame(gameLoop);
}
