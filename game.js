/**
 * SSTS - 遊戲核心戰鬥循環、10 小關進度推進、特異敵怪與 Boss 自選掉落 (game.js)
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

function requestLandscapeFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
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
  lctx.fillText("— SSTS · 100 NATIONS SIEGE —", cx, 35);
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

/* ==================== 故事頁面 ==================== */
const storyCanvas = document.getElementById('story-canvas');
const sctx = storyCanvas.getContext('2d');
let storyTime = 0;
let storyAnimId = null;

const storyData = [
  { chapter: "SSTS // ARCHIVE 01", title: "海淵巨響 · 沉眠者復甦", desc: "萬米海溝深處的海洋霸主睜開眼瞳。遠古逆鱗引發深海沸騰狂潮，全球海岸線全面告急！" },
  { chapter: "SSTS // ARCHIVE 02", title: "逆鱗狂潮 · 百國淪陷", desc: "自最小的梵蒂岡到遼闊大陸，各國海岸皆被變異海嗣突破，地表文明退守各大洲的核心掩體。" },
  { chapter: "SSTS // ARCHIVE 03", title: "地表同盟 · 哨站奪還戰", desc: "每收復一個國家需清空 10 個防衛哨站。擊敗第 5 關先鋒與第 10 關霸主掠奪高階戰甲！" },
  { chapter: "SSTS // MISSION START", title: "全球反擊 · 征途展開", desc: "裝備與等級永久保存。利用觸控搖桿或鍵盤走位，逐一奪回地表 100 國領土！" }
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
  requestLandscapeFullscreen();
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

/* ==================== 戰鬥引擎與狀態 ==================== */
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const expBar = document.getElementById('exp-bar');
const hpBar = document.getElementById('hp-bar');
const txtExpVal = document.getElementById('txt-exp-val');
const txtHpVal = document.getElementById('txt-hp-val');
const txtLevel = document.getElementById('txt-level');
const txtCurrentCountry = document.getElementById('txt-current-country');
const txtKills = document.getElementById('txt-kills');

const upgradeModal = document.getElementById('upgrade-modal');
const chestModal = document.getElementById('chest-modal');
const chestOptionsContainer = document.getElementById('chest-options-container');
const chestStageInfo = document.getElementById('chest-stage-info');
const chestTitle = document.getElementById('chest-title');
const victoryModal = document.getElementById('victory-modal');
const victoryCountryName = document.getElementById('victory-country-name');
const victoryDescText = document.getElementById('victory-desc-text');
const dashCooldownOverlay = document.getElementById('dash-cooldown-overlay');

const bossAlarmOverlay = document.getElementById('boss-alarm-overlay');
const alarmText = document.getElementById('alarm-text');
const bossBarContainer = document.getElementById('boss-bar-container');
const bossBarFill = document.getElementById('boss-bar-fill');
const bossHpText = document.getElementById('boss-hp-text');

let isPaused = false;
let kills = 0;
let activeCountryStageId = 1;
let activeSubstage = 1; // 1~10
let activeCountryData = null;
let gameRunning = false;
let globalTime = 0;

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 0,
  vy: 0,
  radius: 14,
  speed: 2.7,
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
  fireInterval: 38,
  fireTimer: 0,

  isDashing: false,
  dashDuration: 9,
  dashTimer: 0,
  dashSpeedMulti: 3.5,
  dashCooldown: 90,
  dashCooldownTimer: 0,
  dashDirX: 1,
  dashDirY: 0,

  equipment: {
    helmet: null,
    armor: null,
    gloves: null,
    boots: null,
    accessory: null,
    talisman: null,
    weapon: { type: 'bare', name: '空手電磁衝擊', damage: 22, speed: 7, color: '#38bdf8' }
  }
};

let dashGhosts = [];
const pet = { active: false, type: null, x: 0, y: 0, targetX: 0, targetY: 0, timer: 0 };
const chest = { active: false, x: 0, y: 0, radius: 16, isApex: false };

/* ==================== 階梯式裝備庫 ==================== */
const EQUIPMENT_DATABASE = {
  1: [ // 普通
    { id: "w_sword_1", slot: "weapon", name: "斥候合金刃", type: "近戰武器", tier: "普通", desc: "基礎軍刀 (傷害 40)", data: { type: 'melee', name: '斥候合金刃', damage: 40, speed: 9, color: '#38bdf8' } },
    { id: "w_bow_1", slot: "weapon", name: "輕型短弓", type: "遠程弓弩", tier: "普通", desc: "快速穿刺 (傷害 28)", data: { type: 'bow', name: '輕型短弓', damage: 28, speed: 11, color: '#0284c7' } },
    { id: "h_scout", slot: "helmet", name: "斥候護目鏡", type: "頭盔", tier: "普通", desc: "提升 10% 視野與暴擊", val: "scout" },
    { id: "a_scout", slot: "armor", name: "輕甲胸衣", type: "盔甲", tier: "普通", desc: "提升 20 點生命上限", val: "scout" },
    { id: "t_atk", slot: "talisman", name: "雷光護符", type: "護符 (寵物)", tier: "普通", desc: "召喚【電漿浮游蟲】協助攻擊", val: "atk_pet" }
  ],
  2: [ // 稀有 (第 5 關 Mini-Boss 掉落)
    { id: "w_staff_2", slot: "weapon", name: "等離子星杖", type: "法術法杖", tier: "稀有", desc: "貫穿光球 (傷害 68)", data: { type: 'staff', name: '等離子星杖', damage: 68, speed: 6.5, color: '#c084fc' } },
    { id: "h_heavy_2", slot: "helmet", name: "重型合金角盔", type: "頭盔", tier: "稀有", desc: "減免 15% 所受傷害", val: "heavy" },
    { id: "a_heavy_2", slot: "armor", name: "板塊覆甲重鎧", type: "盔甲", tier: "稀有", desc: "大幅提升防禦與抗擊退", val: "heavy" },
    { id: "t_heal", slot: "talisman", name: "生命潮汐符", type: "護符 (寵物)", tier: "稀有", desc: "召喚【醫療水母】每 4 秒回血", val: "heal_pet" },
    { id: "acc_mantle", slot: "accessory", name: "極光披風", type: "配件", tier: "稀有", desc: "提升 15% 移動速度", val: "mantle" }
  ],
  3: [ // 史詩 / 神話 (第 10 關 Apex Boss 掉落)
    { id: "w_sword_3", slot: "weapon", name: "逆鱗弒神光刃", type: "近戰神話", tier: "史詩", desc: "大範圍真傷橫掃 (傷害 115)", data: { type: 'melee', name: '逆鱗弒神光刃', damage: 115, speed: 12, color: '#f43f5e' } },
    { id: "w_bow_3", slot: "weapon", name: "虛空貫滅巨弩", type: "遠程神話", tier: "史詩", desc: "三重散射電磁箭 (傷害 88)", data: { type: 'bow', name: '虛空貫滅巨弩', damage: 88, speed: 14, color: '#38bdf8' } },
    { id: "a_archmage_3", slot: "armor", name: "星宿天災戰袍", type: "盔甲神話", tier: "史詩", desc: "護甲超載，全傷害提升 30%", val: "archmage" },
    { id: "t_pull", slot: "talisman", name: "深淵重力核", type: "護符 (寵物)", tier: "史詩", desc: "召喚【磁暴黑洞核】定期強吸怪", val: "pull_pet" },
    { id: "acc_relic_3", slot: "accessory", name: "恆星核心遺物", type: "配件神話", tier: "史詩", desc: "周身環繞神聖烈焰光環", val: "relic" }
  ]
};

// 進入指定國家的特定小關 (1~10)
function startCountryBattle(countryId, substageIndex) {
  activeCountryStageId = countryId;
  activeSubstage = substageIndex;
  activeCountryData = COUNTRIES_STAGE_DATA.find(s => s.id === countryId) || COUNTRIES_STAGE_DATA[0];

  player.level = userSave.playerLevel;
  player.exp = userSave.playerExp;
  player.nextExp = userSave.playerNextExp;
  player.maxHp = userSave.playerMaxHp;
  player.hp = player.maxHp;
  player.equipment = { ...userSave.equipped };

  enemies = [];
  bullets = [];
  bossBullets = [];
  gems = [];
  dashGhosts = [];
  kills = 0;
  boss.active = false;
  chest.active = false;
  isPaused = false;

  txtCurrentCountry.innerText = `${activeCountryData.flag} ${activeCountryData.name.split(' ')[0]} - 哨站 ${substageIndex}/10`;
  txtLevel.innerText = `階級: Lv.${player.level}`;
  updateHUD();

  initGame();
}

function updatePet() {
  if (!player.equipment.talisman) { pet.active = false; return; }

  pet.active = true;
  if (player.equipment.talisman === 'atk_pet') pet.type = 'atk';
  else if (player.equipment.talisman === 'heal_pet') pet.type = 'heal';
  else if (player.equipment.talisman === 'pull_pet') pet.type = 'pull';

  pet.targetX = player.x - (player.facing * 24);
  pet.targetY = player.y - 20 + Math.sin(globalTime * 3) * 6;
  pet.x += (pet.targetX - pet.x) * 0.1;
  pet.y += (pet.targetY - pet.y) * 0.1;

  pet.timer++;

  if (pet.type === 'atk' && pet.timer >= 50) {
    pet.timer = 0;
    if (enemies.length > 0) {
      const e = enemies[0];
      bullets.push({
        x: pet.x, y: pet.y,
        vx: (e.x - pet.x) * 0.08, vy: (e.y - pet.y) * 0.08,
        radius: 3.5, damage: 25, type: 'bow'
      });
      playTone(1100, 'sine', 0.06, 0.04);
    }
  }

  if (pet.type === 'heal' && pet.timer >= 200) {
    pet.timer = 0;
    if (player.hp < player.maxHp) {
      player.hp = Math.min(player.maxHp, player.hp + 15);
      updateHUD();
      playTone(600, 'sine', 0.25, 0.08);
    }
  }

  if (pet.type === 'pull' && pet.timer >= 240) {
    pet.timer = 0;
    for (const e of enemies) {
      const dist = Math.hypot(e.x - pet.x, e.y - pet.y);
      if (dist < 140) {
        const angle = Math.atan2(pet.y - e.y, pet.x - e.x);
        e.x += Math.cos(angle) * 35; e.y += Math.sin(angle) * 35;
      }
    }
    playTone(200, 'sawtooth', 0.2, 0.1);
  }
}

/* ==================== 浮動搖桿 ==================== */
const joyBase = document.getElementById('joystick-base');
const joyThumb = document.getElementById('joystick-thumb');
const joystick = { active: false, touchId: null, startX: 0, startY: 0, vectorX: 0, vectorY: 0, maxRadius: 50 };

canvas.addEventListener('touchstart', (e) => {
  if (isPaused || !gameRunning || joystick.active) return;
  const rect = canvas.getBoundingClientRect();
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    if (touchX < rect.width * 0.5) {
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

function triggerDash() {
  if (isPaused || !gameRunning || player.dashCooldownTimer > 0 || player.isDashing) return;
  player.isDashing = true;
  player.dashTimer = player.dashDuration;
  player.dashCooldownTimer = player.dashCooldown;

  if (player.vx !== 0 || player.vy !== 0) {
    const len = Math.hypot(player.vx, player.vy);
    player.dashDirX = player.vx / len; player.dashDirY = player.vy / len;
  } else {
    player.dashDirX = player.facing; player.dashDirY = 0;
  }
  playTone(920, 'sawtooth', 0.12, 0.08);
}

const keys = {};
window.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === 'b' || e.key === 'B') toggleInventory();
  if (e.code === 'Space') { e.preventDefault(); triggerDash(); }
});
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

/* ==================== Boss 系統 (第 5 關先鋒 / 第 10 關霸主) ==================== */
const boss = {
  active: false,
  isApex: false, // true: 第 10 關領土霸主 | false: 第 5 關區域先鋒
  x: 0,
  y: 0,
  radius: 36,
  hp: 1000,
  maxHp: 1000,
  speed: 1.0,
  pulse: 0,
  ringAttackTimer: 0,
  ringAttackInterval: 120
};
let bossBullets = [];

function checkAndSpawnStageBoss() {
  if (boss.active) return;

  // 擊殺 50 隻且處於第 5 或第 10 關時觸發
  const isMini = (activeSubstage === 5);
  const isApex = (activeSubstage === 10);

  if (!isMini && !isApex) return;

  boss.active = true;
  boss.isApex = isApex;
  boss.x = canvas.width / 2;
  boss.y = -60;

  const baseHp = isApex ? 2000 : 1000;
  boss.hp = baseHp + (activeCountryStageId * 150);
  boss.maxHp = boss.hp;
  boss.radius = isApex ? 42 : 32;
  boss.speed = isApex ? 1.2 : 0.9;
  boss.ringAttackInterval = isApex ? 90 : 130;

  alarmText.innerText = isApex ? "⚠️ 警告：領土終極霸主現身 ⚠️" : "⚠️ 警告：區域精英先鋒現身 ⚠️";
  document.getElementById('boss-name').innerText = isApex ? `【${activeCountryData.name.split(' ')[0]}·領土霸主】` : `【${activeCountryData.name.split(' ')[0]}·突變先鋒】`;

  bossAlarmOverlay.style.display = 'flex';
  bossBarContainer.style.display = 'block';
  playTone(isApex ? 140 : 190, 'sawtooth', 0.6, 0.2);

  setTimeout(() => { bossAlarmOverlay.style.display = 'none'; }, 2200);
}

function fireBossRingBarrage() {
  const bulletCount = boss.isApex ? 16 : 10;
  const speed = boss.isApex ? 3.2 : 2.5;
  for (let i = 0; i < bulletCount; i++) {
    const angle = (Math.PI * 2 / bulletCount) * i + (boss.pulse * 0.5);
    bossBullets.push({
      x: boss.x,
      y: boss.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: boss.isApex ? 6.5 : 5,
      damage: boss.isApex ? 20 : 12,
      isApex: boss.isApex
    });
  }
  playTone(boss.isApex ? 180 : 240, 'square', 0.2, 0.1);
}

function openChestSelection(isApex) {
  isPaused = true;
  chestModal.style.display = 'flex';
  chestOptionsContainer.innerHTML = '';

  // 裝備階級：第 10 關必出史詩/神話 (Tier 3)；第 5 關必出稀有 (Tier 2)；一般關卡掉普通 (Tier 1)
  const tierKey = isApex ? 3 : 2;
  const pool = EQUIPMENT_DATABASE[tierKey];
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const options = shuffled.slice(0, 3);

  chestTitle.innerText = isApex ? "👑 擊破領土霸主 · 頂級神裝自選" : "⚔️ 擊破先鋒 Boss · 稀有裝備自選";
  chestStageInfo.innerText = isApex ? "品質階級：史詩 / 神話級戰利品" : "品質階級：稀有級戰利品";

  options.forEach(item => {
    const card = document.createElement('div');
    card.className = 'chest-card';
    card.innerHTML = `
      <div class="chest-card-type" style="color: ${item.tier === '史詩' ? '#f43f5e' : '#c084fc'}">
        [ ${item.tier} · ${item.type} ]
      </div>
      <div class="chest-card-name">${item.name}</div>
      <div class="chest-card-desc">${item.desc}</div>
      <div style="font-size: 10px; color: #eab308; margin-top: 8px;">★ 點擊獲取並裝備 ★</div>
    `;
    card.onclick = () => { claimChestItem(item); };
    chestOptionsContainer.appendChild(card);
  });

  playTone(650, 'triangle', 0.3, 0.15);
}

function claimChestItem(item) {
  if (item.slot === 'weapon') player.equipment.weapon = { ...item.data };
  else if (item.slot === 'helmet') player.equipment.helmet = item.val;
  else if (item.slot === 'armor') player.equipment.armor = item.val;
  else if (item.slot === 'accessory') player.equipment.accessory = item.val;
  else if (item.slot === 'talisman') player.equipment.talisman = item.val;

  if (!userSave.myInventory.some(i => i.id === item.id)) {
    userSave.myInventory.push(item);
  }

  chest.active = false;
  chestModal.style.display = 'none';
  playTone(850, 'sine', 0.3, 0.1);

  completeSubstage();
}

// 結算通關並記錄存檔
function completeSubstage() {
  const cId = activeCountryStageId;
  const currentProgress = userSave.stageProgress[cId] || 0;

  // 更新此國已通關子哨站
  if (activeSubstage > currentProgress) {
    userSave.stageProgress[cId] = activeSubstage;
  }

  // 若第 10 關通關，解鎖下一個國家
  if (activeSubstage === 10) {
    if (cId >= (userSave.unlockedCountryStage || 1) && userSave.unlockedCountryStage < 100) {
      userSave.unlockedCountryStage = cId + 1;
      userSave.currentSelectedStage = cId + 1;
    }
  }

  syncPlayerSaveState();
  showVictoryModal();
}

function syncPlayerSaveState() {
  userSave.playerLevel = player.level;
  userSave.playerExp = player.exp;
  userSave.playerNextExp = player.nextExp;
  userSave.playerMaxHp = player.maxHp;
  userSave.equipped = { ...player.equipment };
  saveGameProgress();
}

function showVictoryModal() {
  isPaused = true;
  victoryCountryName.innerText = `${activeCountryData.flag} ${activeCountryData.name} - 哨站 ${activeSubstage} 肅清！`;
  if (activeSubstage === 10) {
    victoryDescText.innerText = "【全國全面收復】深淵海潮徹底退卻，下一個國家防線已成功解鎖！";
  } else {
    victoryDescText.innerText = `哨站防禦網絡已建立，第 ${activeSubstage + 1} 哨站已開放作戰！`;
  }
  victoryModal.style.display = 'flex';
  playTone(880, 'triangle', 0.5, 0.2);
}

function returnToWorldMap() {
  victoryModal.style.display = 'none';
  document.getElementById('game-container').style.display = 'none';
  openWorldMapScreen();
}

/* ==================== 背包面板 ==================== */
let isInventoryOpen = false;
let previewAnimId = null;
let previewTime = 0;
const previewCanvas = document.getElementById('preview-canvas');
const pctx = previewCanvas.getContext('2d');
const invModal = document.getElementById('inventory-modal');
const invGrid = document.getElementById('inv-grid');
const previewInfo = document.getElementById('preview-info');
const previewPetInfo = document.getElementById('preview-pet-info');

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
  previewInfo.innerText = `武器：${player.equipment.weapon ? player.equipment.weapon.name : '赤手空拳'}`;
  previewPetInfo.innerText = player.equipment.talisman ? `護符寵物：${EQUIPMENT_REGISTRY.talismans[player.equipment.talisman].name}` : `護符寵物：未裝備`;

  if (userSave.myInventory.length === 0) {
    invGrid.innerHTML = `<div style="grid-column: span 3; color: #64748b; font-size: 11px; padding: 20px 0;">目前身上無備用裝備<br>擊破第 5 關與第 10 關 Boss 獲取自選寶箱！</div>`;
    return;
  }

  userSave.myInventory.forEach(item => {
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

    slot.onclick = () => {
      if (item.slot === 'weapon') player.equipment.weapon = { ...item.data };
      else if (item.slot === 'helmet') player.equipment.helmet = (player.equipment.helmet === item.val ? null : item.val);
      else if (item.slot === 'armor') player.equipment.armor = (player.equipment.armor === item.val ? null : item.val);
      else if (item.slot === 'talisman') player.equipment.talisman = (player.equipment.talisman === item.val ? null : item.val);
      else if (item.slot === 'accessory') player.equipment.accessory = (player.equipment.accessory === item.val ? null : item.val);

      syncPlayerSaveState();
      playTone(750, 'triangle', 0.08);
      renderInventorySlots();
    };
    invGrid.appendChild(slot);
  });
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

/* ==================== 戰鬥更新與大洲怪物生成 ==================== */
let enemies = [];
let bullets = [];
let gems = [];
let spawnInterval = 30;
let spawnTimer = 0;

function initGame() {
  if (gameRunning) return;
  gameRunning = true;
  updateHUD();
  requestAnimationFrame(gameLoop);
}

function updateHUD() {
  txtExpVal.innerText = `${player.exp} / ${player.nextExp}`;
  expBar.style.width = `${(player.exp / player.nextExp) * 100}%`;
  txtHpVal.innerText = `${Math.max(0, Math.floor(player.hp))} / ${player.maxHp}`;
  hpBar.style.width = `${Math.max(0, (player.hp / player.maxHp) * 100)}%`;
}

// 根據國家所屬大洲生成特種小怪
function spawnContinentEnemy() {
  const edge = Math.floor(Math.random() * 4);
  let x, y;
  if (edge === 0) { x = Math.random() * canvas.width; y = -20; }
  else if (edge === 1) { x = canvas.width + 20; y = Math.random() * canvas.height; }
  else if (edge === 2) { x = Math.random() * canvas.width; y = canvas.height + 20; }
  else { x = -20; y = Math.random() * canvas.height; }

  const cont = activeCountryData ? activeCountryData.continent : 'EU';
  let kind = 'default';
  let speed = 1.3;
  let radius = 10;
  let hp = 22 + player.level * 3 + activeSubstage * 2;

  if (cont === 'OC' || cont === 'AM') {
    kind = 'shark'; // 狂暴利齒鯊 (高速)
    speed = 1.8 + Math.random() * 0.4;
    radius = 11;
  } else if (cont === 'AS' || cont === 'AF') {
    kind = 'crab'; // 岩甲寄居蟹 (厚血抗打)
    speed = 0.9 + Math.random() * 0.2;
    hp *= 1.5;
    radius = 12;
  } else if (cont === 'EU' || cont === 'GL') {
    kind = 'ice_jelly'; // 冰晶水母
    speed = 1.1 + Math.random() * 0.3;
  }

  enemies.push({ x, y, kind, radius, speed, hp, pulse: Math.random() * 10 });
}

function executeAttack() {
  let target = null;
  if (boss.active) {
    target = boss;
  } else if (enemies.length > 0) {
    let minDist = Infinity;
    for (const enemy of enemies) {
      const d = Math.hypot(enemy.x - player.x, enemy.y - player.y);
      if (d < minDist) { minDist = d; target = enemy; }
    }
  }
  if (!target) return;

  player.attackTimer = player.attackDuration;
  player.facing = target.x >= player.x ? 1 : -1;

  const angle = Math.atan2(target.y - player.y, target.x - player.x);
  const w = player.equipment.weapon;

  bullets.push({
    x: player.x, y: player.y,
    vx: Math.cos(angle) * w.speed, vy: Math.sin(angle) * w.speed,
    radius: w.type === 'staff' ? 6 : (w.type === 'bow' ? 3 : 4.5),
    damage: w.damage, type: w.type
  });

  if (w.type === 'melee' || w.type === 'bare') playTone(280, 'sawtooth', 0.1);
  else if (w.type === 'bow') playTone(850, 'triangle', 0.08);
  else playTone(650, 'sine', 0.16);
}

function updateGame() {
  if (isPaused) return;
  globalTime += 0.04;

  let dx = 0, dy = 0;
  if (keys['w'] || keys['arrowup']) dy -= 1;
  if (keys['s'] || keys['arrowdown']) dy += 1;
  if (keys['a'] || keys['arrowleft']) dx -= 1;
  if (keys['d'] || keys['arrowright']) dx += 1;

  if (dx !== 0 && dy !== 0) { dx *= 0.7071; dy *= 0.7071; }

  if (joystick.active && (joystick.vectorX !== 0 || joystick.vectorY !== 0)) {
    dx = joystick.vectorX;
    dy = joystick.vectorY;
  }

  if (player.dashCooldownTimer > 0) {
    player.dashCooldownTimer--;
    dashCooldownOverlay.style.height = `${(player.dashCooldownTimer / player.dashCooldown) * 100}%`;
  } else {
    dashCooldownOverlay.style.height = `0%`;
  }

  if (player.isDashing) {
    player.dashTimer--;
    player.vx = player.dashDirX * player.speed * player.dashSpeedMulti;
    player.vy = player.dashDirY * player.speed * player.dashSpeedMulti;
    dashGhosts.push({ x: player.x, y: player.y, facing: player.facing, alpha: 1.0 });
    if (player.dashTimer <= 0) player.isDashing = false;
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

  for (let i = dashGhosts.length - 1; i >= 0; i--) {
    dashGhosts[i].alpha -= 0.12;
    if (dashGhosts[i].alpha <= 0) dashGhosts.splice(i, 1);
  }

  if (player.attackTimer > 0) player.attackTimer--;
  player.fireTimer++;
  if (player.fireTimer >= player.fireInterval) {
    executeAttack();
    player.fireTimer = 0;
  }

  updatePet();

  if (chest.active) {
    if (Math.hypot(player.x - chest.x, player.y - chest.y) < player.radius + chest.radius) {
      openChestSelection(chest.isApex);
    }
  }

  // 命中判定
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx; b.y += b.vy;
    if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
      bullets.splice(i, 1); continue;
    }

    if (boss.active && Math.hypot(b.x - boss.x, b.y - boss.y) < b.radius + boss.radius) {
      boss.hp -= b.damage;
      bullets.splice(i, 1);
      playTone(180, 'sawtooth', 0.04);

      const bossHpPct = Math.max(0, (boss.hp / boss.maxHp) * 100);
      bossBarFill.style.width = `${bossHpPct}%`;
      bossHpText.innerText = `${Math.ceil(bossHpPct)}%`;

      if (boss.hp <= 0) {
        boss.active = false;
        bossBarContainer.style.display = 'none';
        kills += 15;
        txtKills.innerText = `擊退海嗣: ${kills}`;

        // 掉落寶箱：記錄是否為第 10 關終極霸主
        chest.active = true;
        chest.isApex = boss.isApex;
        chest.x = boss.x;
        chest.y = boss.y;

        playTone(950, 'triangle', 0.5, 0.2);
      }
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

          // 常規關卡：擊殺達 50 隻通關
          if (activeSubstage !== 5 && activeSubstage !== 10) {
            if (kills >= 50) {
              completeSubstage();
            }
          } else {
            // 第 5 與第 10 關：擊殺 50 隻召喚 Boss
            if (kills >= 50 && !boss.active && !chest.active) {
              checkAndSpawnStageBoss();
            }
          }
        }
        break;
      }
    }
  }

  // Boss 行為
  if (boss.active) {
    boss.pulse += 0.05;
    const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
    boss.x += Math.cos(angle) * boss.speed;
    boss.y += Math.sin(angle) * boss.speed;

    boss.ringAttackTimer++;
    if (boss.ringAttackTimer >= boss.ringAttackInterval) {
      fireBossRingBarrage();
      boss.ringAttackTimer = 0;
    }

    if (!player.isDashing && Math.hypot(player.x - boss.x, player.y - boss.y) < player.radius + boss.radius) {
      player.hp -= boss.isApex ? 0.75 : 0.5;
      updateHUD();
      if (player.hp <= 0) {
        alert(`哨站失守！你被深海巨獸撕碎。總擊殺數：${kills}`);
        location.reload();
      }
    }
  }

  // Boss 彈幕
  for (let i = bossBullets.length - 1; i >= 0; i--) {
    const bb = bossBullets[i];
    bb.x += bb.vx; bb.y += bb.vy;
    if (bb.x < 0 || bb.x > canvas.width || bb.y < 0 || bb.y > canvas.height) {
      bossBullets.splice(i, 1); continue;
    }

    if (!player.isDashing && Math.hypot(bb.x - player.x, bb.y - player.y) < bb.radius + player.radius) {
      player.hp -= bb.damage;
      bossBullets.splice(i, 1);
      updateHUD();
      playTone(150, 'sawtooth', 0.1);
      if (player.hp <= 0) {
        alert(`哨站失守！你共消滅了 ${kills} 隻海嗣。`);
        location.reload();
      }
    }
  }

  // 生成大洲小怪
  spawnTimer++;
  if (spawnTimer >= spawnInterval) {
    spawnContinentEnemy();
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
      updateHUD();
      if (player.hp <= 0) {
        alert(`哨站失守！你共消滅了 ${kills} 隻海嗣。`);
        location.reload();
      }
    }
  }

  // 寶石吸附
  for (let i = gems.length - 1; i >= 0; i--) {
    const g = gems[i];
    const dist = Math.hypot(player.x - g.x, player.y - g.y);
    if (dist < 65) {
      const angle = Math.atan2(player.y - g.y, player.x - g.x);
      g.x += Math.cos(angle) * 5.5; g.y += Math.sin(angle) * 5.5;
    }
    if (dist < player.radius + g.radius) {
      gems.splice(i, 1);
      player.exp++;
      playTone(1050, 'sine', 0.04);
      if (player.exp >= player.nextExp) triggerLevelUp();
      updateHUD();
    }
  }
}

function triggerLevelUp() {
  isPaused = true;
  player.level++;
  player.exp = 0;
  player.nextExp = Math.floor(player.nextExp * 1.4);
  txtLevel.innerText = `階級: Lv.${player.level}`;
  upgradeModal.style.display = 'flex';
  playTone(700, 'sine', 0.25);
  syncPlayerSaveState();
}

function chooseUpgrade(type) {
  if (type === 'firerate') player.fireInterval = Math.max(8, Math.floor(player.fireInterval * 0.8));
  if (type === 'damage') {
    player.equipment.weapon.damage = Math.floor(player.equipment.weapon.damage * 1.4);
  }
  if (type === 'speed') player.speed *= 1.15;
  upgradeModal.style.display = 'none';
  isPaused = false;
  updateHUD();
  syncPlayerSaveState();
}

function renderGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. 繪製該國所屬大洲的科技濾鏡網格
  const cont = activeCountryData ? activeCountryData.continent : 'EU';
  drawContinentBackground(ctx, cont, canvas.width, canvas.height);

  // 2. 經驗寶石
  for (const g of gems) {
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2); ctx.fill();
  }

  // 3. 子彈
  for (const b of bullets) {
    ctx.fillStyle = b.type === 'staff' ? '#c084fc' : (b.type === 'bow' ? '#38bdf8' : '#67e8f9');
    ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2); ctx.fill();
  }

  // 4. 特異小怪、Boss 與環狀彈幕
  drawEnemies(ctx, enemies, boss);
  drawBossBullets(ctx, bossBullets);

  // 5. 戰利品自選寶箱
  drawChestItem(ctx, chest, globalTime);

  // 6. 玩家紙娃娃、衝刺殘影與護符寵物
  drawDashGhosts(ctx, dashGhosts);
  drawPlayerPaperdoll(ctx, player);
  drawPet(ctx, pet, player, globalTime);
}

function gameLoop() {
  updateGame();
  renderGame();
  requestAnimationFrame(gameLoop);
}
