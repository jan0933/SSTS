/**
 * SSTS - 戰鬥引擎、單一遠距武器、5★附魔詞條戰鬥實裝 (game.js)
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

/* ==================== 手動全螢幕切換 ==================== */
function toggleGlobalFullscreen() {
  const btn = document.getElementById('btn-global-fullscreen');
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
    btn.innerText = "✖ 退出全螢幕";
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    btn.innerText = "⛶ 全螢幕";
  }
}

document.addEventListener('fullscreenchange', () => {
  const btn = document.getElementById('btn-global-fullscreen');
  if (btn) btn.innerText = document.fullscreenElement ? "✖ 退出全螢幕" : "⛶ 全螢幕";
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

/* ==================== 故事模式 ==================== */
const storyCanvas = document.getElementById('story-canvas');
const sctx = storyCanvas.getContext('2d');
let storyTime = 0;
let storyAnimId = null;

const storyData = [
  { chapter: "SSTS // ARCHIVE 01", title: "海淵巨響 · 沉眠者復甦", desc: "萬米海溝深處的海洋霸主睜開眼瞳。遠古逆鱗引發深海沸騰狂潮，全球海岸線全面告急！" },
  { chapter: "SSTS // ARCHIVE 02", title: "逆鱗狂潮 · 百國淪陷", desc: "自最小的梵蒂岡到遼闊大陸，各國海岸皆被變異海嗣突破，地表文明退守各大洲的核心掩體。" },
  { chapter: "SSTS // ARCHIVE 03", title: "地表同盟 · 哨站奪還戰", desc: "裝備皆為全遠距攻擊。升滿 5★ 覺醒專屬附魔詞條，擊潰海嗣收復全球 100 國！" },
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

/* ==================== 戰鬥引擎與狀態 ==================== */
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const expBar = document.getElementById('exp-bar');
const hpBar = document.getElementById('hp-bar');
const txtExpVal = document.getElementById('txt-exp-val');
const txtHpVal = document.getElementById('txt-hp-val');
const txtLevel = document.getElementById('txt-level');
const txtCurrentCountry = document.getElementById('txt-current-country');
const txtWeaponInfo = document.getElementById('txt-weapon-info');
const txtKills = document.getElementById('txt-kills');

const upgradeModal = document.getElementById('upgrade-modal');
const chestModal = document.getElementById('chest-modal');
const chestOptionsContainer = document.getElementById('chest-options-container');
const chestStageInfo = document.getElementById('chest-stage-info');
const chestTitle = document.getElementById('chest-title');
const victoryModal = document.getElementById('victory-modal');
const victoryCountryName = document.getElementById('victory-country-name');
const victoryGoldReward = document.getElementById('victory-gold-reward');
const victoryDescText = document.getElementById('victory-desc-text');
const defeatModal = document.getElementById('defeat-modal');
const defeatCountryInfo = document.getElementById('defeat-country-info');
const dashCooldownOverlay = document.getElementById('dash-cooldown-overlay');
const artifactCooldownOverlay = document.getElementById('artifact-cooldown-overlay');
const empFlashOverlay = document.getElementById('emp-flash-overlay');

const bossAlarmOverlay = document.getElementById('boss-alarm-overlay');
const alarmText = document.getElementById('alarm-text');
const bossBarContainer = document.getElementById('boss-bar-container');
const bossBarFill = document.getElementById('boss-bar-fill');
const bossHpText = document.getElementById('boss-hp-text');

let isPaused = false;
let kills = 0;
let activeCountryStageId = 1;
let activeSubstage = 1;
let activeCountryData = null;
let gameRunning = false;
let globalTime = 0;

// 活躍的 5★ 詞條狀態集
let activeAffixes = {};

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 0,
  vy: 0,
  radius: 14,
  speed: 2.8,
  hp: 100,
  maxHp: 100,
  baseBonusDamage: 0,
  exp: 0,
  level: 1,
  nextExp: 5,
  facing: 1,
  isMoving: false,
  animTimer: 0,
  attackTimer: 0,
  attackDuration: 14,
  fireInterval: 30,
  fireTimer: 0,

  weapon: { id: "w_start", name: "斥候脈衝弓", type: "bow", tier: "common", stars: 1, damage: 32, speed: 11, color: '#38bdf8' },
  artifact: { id: "art_nova", name: "等離子爆裂核", skillType: "nova" },

  artifactCooldown: 240,
  artifactCooldownTimer: 0,

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
    weapon: null
  }
};

let dashGhosts = [];
const pet = { active: false, type: null, x: 0, y: 0, targetX: 0, targetY: 0, timer: 0 };
const chest = { active: false, x: 0, y: 0, radius: 16, isApex: false };
let battlePickups = [];
let stageObstacles = [];
let artifactEffects = [];

/* ==================== 5 品階戰利品裝備庫 ==================== */
const EQUIPMENT_DATABASE = {
  1: [
    { id: "w_bow_1", slot: "weapon", name: "電磁穿甲弩", type: "bow", tier: "common", stars: 1, desc: "遠程穿透射擊 (傷害 35)", damage: 35, speed: 11, color: '#38bdf8' },
    { id: "w_staff_1", slot: "weapon", name: "星芒脈衝杖", type: "staff", tier: "rare", stars: 1, desc: "遠程等離子法球 (傷害 48)", damage: 48, speed: 8.5, color: '#c084fc' },
    { id: "h_scout_1", slot: "helmet", name: "斥候護目鏡", tier: "common", stars: 1, desc: "視野延伸，基礎暴擊提升", val: "scout" },
    { id: "a_scout_1", slot: "armor", name: "輕甲合金胸衣", tier: "rare", stars: 1, desc: "提升 35 點生命上限", val: "scout" },
    { id: "t_atk_1", slot: "talisman", name: "雷光護符", tier: "common", stars: 1, desc: "召喚【電漿浮游蟲】遠距雷射協攻", val: "atk_pet" }
  ],
  2: [
    { id: "w_bow_2", slot: "weapon", name: "暴風電磁巨弩", type: "bow", tier: "elite", stars: 1, desc: "超高速貫穿箭 (傷害 75)", damage: 75, speed: 13, color: '#facc15' },
    { id: "w_staff_2", slot: "weapon", name: "虛空引力星杖", type: "staff", tier: "epic", stars: 1, desc: "雙重分裂暗能球 (傷害 95)", damage: 95, speed: 9.5, color: '#c084fc' },
    { id: "h_heavy_2", slot: "helmet", name: "重型合金角盔", tier: "elite", stars: 1, desc: "減免 15% 承受傷害", val: "heavy" },
    { id: "a_heavy_2", slot: "armor", name: "板塊重裝戰甲", tier: "epic", stars: 1, desc: "大幅提升護甲與生命上限", val: "heavy" },
    { id: "t_heal_2", slot: "talisman", name: "潮汐精靈符", tier: "elite", stars: 1, desc: "召喚【醫療水母】每 4 秒回復生命", val: "heal_pet" }
  ],
  3: [
    { id: "w_bow_3", slot: "weapon", name: "弒神天罰巨弩", type: "bow", tier: "legendary", stars: 1, desc: "三重散射電磁光束 (傷害 145)", damage: 145, speed: 15, color: '#fb923c' },
    { id: "w_staff_3", slot: "weapon", name: "超新星天災杖", type: "staff", tier: "legendary", stars: 1, desc: "貫穿引爆核光球 (傷害 165)", damage: 165, speed: 11, color: '#fb923c' },
    { id: "a_archmage_3", slot: "armor", name: "星宿天災戰袍", tier: "legendary", stars: 1, desc: "生命與護甲超載，傷害提升 30%", val: "archmage" },
    { id: "t_pull_3", slot: "talisman", name: "深淵重力核", tier: "legendary", stars: 1, desc: "召喚【磁暴黑洞核】強力牽引群怪", val: "pull_pet" }
  ]
};

function generateStageObstacles(continent) {
  stageObstacles = [];
  const count = 3 + Math.floor(Math.random() * 2);
  for (let i = 0; i < count; i++) {
    let ox = 80 + Math.random() * (canvas.width - 160);
    let oy = 80 + Math.random() * (canvas.height - 160);
    if (Math.hypot(ox - canvas.width / 2, oy - canvas.height / 2) < 90) ox += 110;
    stageObstacles.push({ x: ox, y: oy, width: 44, height: 44 });
  }
}

// 彙整目前穿戴裝備中的所有 5★ 專屬詞條
function compileActiveAffixes() {
  activeAffixes = {};
  for (const key in userSave.equipped) {
    const item = userSave.equipped[key];
    if (item && item.stars === 5 && item.affix) {
      activeAffixes[item.affix.id] = true;
    }
  }

  // 若覺醒了【急行幽影】，永久縮短衝刺 CD
  if (activeAffixes.rush) {
    player.dashCooldown = 60;
  } else {
    player.dashCooldown = 90;
  }
}

function startCountryBattle(countryId, substageIndex) {
  activeCountryStageId = countryId;
  activeSubstage = substageIndex;
  activeCountryData = COUNTRIES_STAGE_DATA.find(s => s.id === countryId) || COUNTRIES_STAGE_DATA[0];

  player.level = userSave.playerLevel;
  player.exp = userSave.playerExp;
  player.nextExp = userSave.playerNextExp;
  player.maxHp = userSave.playerMaxHp;
  player.hp = player.maxHp;
  player.baseBonusDamage = (player.level - 1) * 5;

  player.weapon = userSave.equipped.weapon || { id: "w_start", name: "斥候脈衝弓", type: "bow", tier: "common", stars: 1, damage: 32, speed: 11, color: '#38bdf8' };
  player.artifact = userSave.equipped.artifact || { id: "art_nova", name: "等離子爆裂核", skillType: "nova" };

  player.equipment = {
    helmet: userSave.equipped.helmet ? userSave.equipped.helmet.val : null,
    armor: userSave.equipped.armor ? userSave.equipped.armor.val : null,
    gloves: userSave.equipped.gloves ? userSave.equipped.gloves.val : null,
    boots: userSave.equipped.boots ? userSave.equipped.boots.val : null,
    accessory: userSave.equipped.accessory ? userSave.equipped.accessory.val : null,
    talisman: userSave.equipped.talisman ? userSave.equipped.talisman.val : null,
    weapon: player.weapon
  };

  // 啟用所有 5★ 詞條
  compileActiveAffixes();

  player.x = canvas.width / 2;
  player.y = canvas.height / 2;

  enemies = [];
  bullets = [];
  bossBullets = [];
  gems = [];
  dashGhosts = [];
  battlePickups = [];
  artifactEffects = [];
  kills = 0;
  boss.active = false;
  chest.active = false;
  isPaused = false;

  defeatModal.style.display = 'none';
  victoryModal.style.display = 'none';

  txtCurrentCountry.innerText = `${activeCountryData.flag} ${activeCountryData.name.split(' ')[0]} - 哨站 ${substageIndex}/10`;
  txtWeaponInfo.innerText = `武器: ${player.weapon.name} ${renderStarsStr(player.weapon.stars || 1)}`;
  txtLevel.innerText = `階級: Lv.${player.level}`;
  updateHUD();

  generateStageObstacles(activeCountryData.continent);
  initGame();
}

/* ==================== 手動操作 (射擊 / 法器 / 衝刺) ==================== */
function triggerManualShoot() {
  if (isPaused || !gameRunning) return;
  executeAttack();
}

function triggerArtifactSkill() {
  if (isPaused || !gameRunning || player.artifactCooldownTimer > 0) return;

  player.artifactCooldownTimer = player.artifactCooldown;
  const skill = player.artifact ? player.artifact.skillType : 'nova';

  if (skill === 'nova') {
    playTone(200, 'sawtooth', 0.4, 0.25);
    const particles = [];
    for (let i = 0; i < 28; i++) {
      particles.push({
        x: player.x,
        y: player.y,
        angle: Math.random() * Math.PI * 2,
        speed: 3 + Math.random() * 5,
        size: 3 + Math.random() * 3
      });
    }
    artifactEffects.push({
      type: 'nova',
      x: player.x,
      y: player.y,
      timer: 30,
      maxDuration: 30,
      particles
    });

    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      if (Math.hypot(e.x - player.x, e.y - player.y) < 180) {
        e.hp -= (90 + player.baseBonusDamage);
      }
    }

  } else if (skill === 'freeze') {
    playTone(850, 'sine', 0.3, 0.2);
    const particles = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: player.x,
        y: player.y,
        angle: Math.random() * Math.PI * 2,
        speed: 2 + Math.random() * 6
      });
    }
    artifactEffects.push({
      type: 'freeze',
      x: player.x,
      y: player.y,
      timer: 35,
      maxDuration: 35,
      particles
    });

    for (const e of enemies) {
      e.speed *= 0.4;
      e.hp -= (30 + player.baseBonusDamage);
    }

  } else if (skill === 'thunder') {
    playTone(150, 'square', 0.5, 0.3);
    const strikes = [];
    const sorted = [...enemies].sort((a, b) => b.hp - a.hp);
    const strikeCount = Math.min(5, Math.max(3, sorted.length));

    for (let i = 0; i < strikeCount; i++) {
      const target = sorted[i] || { x: Math.random() * canvas.width, y: Math.random() * canvas.height, hp: 0 };
      target.hp -= (150 + player.baseBonusDamage);

      const points = [];
      let cy = 0;
      let cx = target.x + (Math.random() - 0.5) * 60;
      while (cy < target.y) {
        cy += 40 + Math.random() * 30;
        cx += (Math.random() - 0.5) * 35;
        points.push({ x: cx, y: Math.min(cy, target.y) });
      }
      strikes.push({
        x: target.x + (Math.random() - 0.5) * 40,
        targetX: target.x,
        targetY: target.y,
        points
      });
    }

    artifactEffects.push({
      type: 'thunder',
      timer: 24,
      maxDuration: 24,
      strikes
    });

  } else if (skill === 'blackhole') {
    playTone(120, 'sawtooth', 0.6, 0.25);
    const particles = [];
    for (let i = 0; i < 40; i++) {
      const a = Math.random() * Math.PI * 2;
      const dist = 70 + Math.random() * 120;
      particles.push({
        x: canvas.width / 2 + Math.cos(a) * dist,
        y: canvas.height / 2 + Math.sin(a) * dist
      });
    }
    artifactEffects.push({
      type: 'blackhole',
      x: canvas.width / 2,
      y: canvas.height / 2,
      timer: 50,
      maxDuration: 50,
      particles
    });

    for (const e of enemies) {
      e.x = canvas.width / 2 + (Math.random() - 0.5) * 40;
      e.y = canvas.height / 2 + (Math.random() - 0.5) * 40;
      e.hp -= 40;
    }
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
  if (e.code === 'Space') { e.preventDefault(); triggerDash(); }
  if (e.key === 'j' || e.key === 'J') triggerManualShoot();
  if (e.key === 'l' || e.key === 'L') triggerArtifactSkill();
});
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

/* ==================== Boss 系統 ==================== */
const boss = {
  active: false,
  isApex: false,
  x: 0,
  y: 0,
  radius: 36,
  hp: 500,
  maxHp: 500,
  speed: 0.9,
  pulse: 0,
  ringAttackTimer: 0,
  ringAttackInterval: 120
};
let bossBullets = [];

function checkAndSpawnStageBoss() {
  if (boss.active) return;
  const isMini = (activeSubstage === 5);
  const isApex = (activeSubstage === 10);
  if (!isMini && !isApex) return;

  boss.active = true;
  boss.isApex = isApex;
  boss.x = canvas.width / 2;
  boss.y = -60;

  const stageScaling = Math.max(0, activeCountryStageId - 1) * 80;
  const baseHp = isApex ? 900 : 400;
  boss.hp = baseHp + stageScaling;
  boss.maxHp = boss.hp;
  boss.radius = isApex ? 38 : 28;
  boss.speed = isApex ? 1.0 : 0.75;
  boss.ringAttackInterval = isApex ? 100 : 140;

  alarmText.innerText = isApex ? "⚠️ 警告：領土終極霸主現身 ⚠️" : "⚠️ 警告：區域精英先鋒現身 ⚠️";
  document.getElementById('boss-name').innerText = isApex ? `【${activeCountryData.name.split(' ')[0]}·領土霸主】` : `【${activeCountryData.name.split(' ')[0]}·突變先鋒】`;

  bossAlarmOverlay.style.display = 'flex';
  bossBarContainer.style.display = 'block';
  playTone(isApex ? 140 : 190, 'sawtooth', 0.6, 0.2);

  setTimeout(() => { bossAlarmOverlay.style.display = 'none'; }, 2200);
}

function fireBossRingBarrage() {
  const bulletCount = boss.isApex ? 12 : 8;
  const speed = boss.isApex ? 2.6 : 2.0;
  for (let i = 0; i < bulletCount; i++) {
    const angle = (Math.PI * 2 / bulletCount) * i + (boss.pulse * 0.5);
    bossBullets.push({
      x: boss.x,
      y: boss.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: boss.isApex ? 6 : 4.5,
      damage: boss.isApex ? 14 : 8,
      isApex: boss.isApex
    });
  }
  playTone(boss.isApex ? 180 : 240, 'square', 0.2, 0.1);
}

function openChestSelection(isApex) {
  isPaused = true;
  chestModal.style.display = 'flex';
  chestOptionsContainer.innerHTML = '';

  const poolKey = activeCountryStageId <= 20 ? 1 : (activeCountryStageId <= 60 ? 2 : 3);
  const pool = EQUIPMENT_DATABASE[poolKey];
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const options = shuffled.slice(0, 3);

  chestTitle.innerText = isApex ? "👑 擊破領土霸主 · 頂級裝備自選" : "⚔️ 擊破先鋒 Boss · 稀有裝備自選";
  chestStageInfo.innerText = isApex ? "品質階級：史詩 / 傳說級戰利品" : "品質階級：稀有 / 菁英級戰利品";

  options.forEach(item => {
    const card = document.createElement('div');
    card.className = 'chest-card';
    const tierMeta = TIER_META[item.tier || 'common'] || TIER_META.common;
    card.innerHTML = `
      <div class="chest-card-type" style="color: ${tierMeta.color}">
        [ ${tierMeta.name} · ${renderStarsStr(item.stars || 1)} ]
      </div>
      <div class="chest-card-name">${item.name}</div>
      <div class="chest-card-desc">${item.desc}</div>
      <div style="font-size: 10px; color: #eab308; margin-top: 8px;">★ 點擊獲取 ★</div>
    `;
    card.onclick = () => { claimChestItem(item); };
    chestOptionsContainer.appendChild(card);
  });

  playTone(650, 'triangle', 0.3, 0.15);
}

function claimChestItem(item) {
  userSave.myInventory.push({ ...item });
  chest.active = false;
  chestModal.style.display = 'none';
  playTone(850, 'sine', 0.3, 0.1);

  completeSubstage();
}

function completeSubstage() {
  const cId = activeCountryStageId;
  const currentProgress = userSave.stageProgress[cId] || 0;

  if (activeSubstage > currentProgress) {
    userSave.stageProgress[cId] = activeSubstage;
  }

  if (activeSubstage === 10) {
    if (cId >= (userSave.unlockedCountryStage || 1) && userSave.unlockedCountryStage < 100) {
      userSave.unlockedCountryStage = cId + 1;
      userSave.currentSelectedStage = cId + 1;
    }
  }

  const earnedGold = 60 + (cId - 1) * 25 + activeSubstage * 8;
  userSave.playerGold = (userSave.playerGold || 0) + earnedGold;
  victoryGoldReward.innerText = `💰 作戰津貼：+${earnedGold} 金幣 (結餘: ${userSave.playerGold})`;

  syncPlayerSaveState();
  showVictoryModal();
}

function syncPlayerSaveState() {
  userSave.playerLevel = player.level;
  userSave.playerExp = player.exp;
  userSave.playerNextExp = player.nextExp;
  userSave.playerMaxHp = player.maxHp;
  saveGameProgress();
}

function showVictoryModal() {
  isPaused = true;
  victoryCountryName.innerText = `${activeCountryData.flag} ${activeCountryData.name} - 哨站 ${activeSubstage} 肅清！`;
  if (activeSubstage === 10) {
    victoryDescText.innerText = "【全國全面收復】深淵海潮退卻，下一個國家防線已成功解鎖！";
  } else {
    victoryDescText.innerText = `哨站防禦網絡已建立，第 ${activeSubstage + 1} 哨站已開放作戰！`;
  }
  victoryModal.style.display = 'flex';
  playTone(880, 'triangle', 0.5, 0.2);
}

function triggerPlayerDefeat() {
  if (isPaused) return;
  isPaused = true;
  gameRunning = false;

  defeatCountryInfo.innerText = `${activeCountryData.flag} ${activeCountryData.name} - 哨站 ${activeSubstage}`;
  defeatModal.style.display = 'flex';
  playTone(160, 'sawtooth', 0.5, 0.2);
}

function returnToWorldMapFromDefeat() {
  defeatModal.style.display = 'none';
  document.getElementById('game-container').style.display = 'none';
  openWorldMapScreen();
}

function returnToWorldMap() {
  victoryModal.style.display = 'none';
  document.getElementById('game-container').style.display = 'none';
  openWorldMapScreen();
}

/* ==================== 磁鐵與炸彈道具 ==================== */
function activateSuperMagnet() {
  playTone(950, 'sine', 0.35, 0.15);
  for (const g of gems) g.magnetPull = true;
}

function activateEmpBomb() {
  playTone(150, 'sawtooth', 0.6, 0.3);
  empFlashOverlay.style.display = 'block';
  empFlashOverlay.style.opacity = '1';
  setTimeout(() => {
    empFlashOverlay.style.opacity = '0';
    setTimeout(() => { empFlashOverlay.style.display = 'none'; }, 400);
  }, 100);

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    gems.push({ x: e.x, y: e.y, radius: 4, magnetPull: true });
    kills++;
  }
  enemies = [];
  txtKills.innerText = `擊退海嗣: ${kills}`;
}

/* ==================== 怪物生成與戰鬥物理循環 ==================== */
let enemies = [];
let bullets = [];
let gems = [];
let spawnInterval = 60;
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

function spawnContinentEnemy() {
  const normSubstage = (activeSubstage > 5) ? (activeSubstage - 5) : activeSubstage;
  const isHpDoubled = (activeSubstage > 5);

  const isEarlyCountry = (activeCountryStageId === 1);
  const maxCap = isEarlyCountry ? (4 + normSubstage * 2) : (7 + normSubstage * 3);
  if (enemies.length >= maxCap) return;

  const edge = Math.floor(Math.random() * 4);
  let x, y, angle = 0;

  if (edge === 0) {
    x = Math.random() * canvas.width; y = 15;
    angle = (Math.PI * 0.2) + Math.random() * (Math.PI * 0.6);
  } else if (edge === 1) {
    x = canvas.width - 15; y = Math.random() * canvas.height;
    angle = (Math.PI * 0.7) + Math.random() * (Math.PI * 0.6);
  } else if (edge === 2) {
    x = Math.random() * canvas.width; y = canvas.height - 15;
    angle = -(Math.PI * 0.2) - Math.random() * (Math.PI * 0.6);
  } else {
    x = 15; y = Math.random() * canvas.height;
    angle = -(Math.PI * 0.3) + Math.random() * (Math.PI * 0.6);
  }

  const cont = activeCountryData ? activeCountryData.continent : 'EU';
  let kind = 'default';
  let baseSpeed = isEarlyCountry ? 1.0 : 1.35;
  let radius = 10;
  let baseHp = isEarlyCountry ? (12 + normSubstage * 2) : (25 + activeCountryStageId * 3);

  if (isHpDoubled) {
    baseHp *= 2;
  }

  if (cont === 'OC' || cont === 'AM') {
    kind = 'shark';
    baseSpeed = isEarlyCountry ? 1.2 : 1.7;
  } else if (cont === 'AS' || cont === 'AF') {
    kind = 'crab';
    baseSpeed = isEarlyCountry ? 0.7 : 0.95;
    baseHp = Math.floor(baseHp * 1.3);
  } else if (cont === 'EU' || cont === 'GL') {
    kind = 'ice_jelly';
  }

  enemies.push({
    x, y,
    vx: Math.cos(angle) * baseSpeed,
    vy: Math.sin(angle) * baseSpeed,
    kind, radius,
    hp: baseHp,
    pulse: Math.random() * 10
  });
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
  const w = player.weapon || { damage: 30, speed: 10, type: 'bow' };
  let totalDamage = w.damage + player.baseBonusDamage;

  // 5★【精準獵殺】詞條：15% 觸發雙倍爆擊
  let isCrit = false;
  if (activeAffixes.crit && Math.random() < 0.15) {
    totalDamage *= 2.0;
    isCrit = true;
  }

  bullets.push({
    x: player.x, y: player.y,
    vx: Math.cos(angle) * w.speed, vy: Math.sin(angle) * w.speed,
    radius: isCrit ? 6 : (w.type === 'staff' ? 6 : 4),
    damage: totalDamage,
    type: w.type,
    isCrit: isCrit
  });

  if (isCrit) playTone(980, 'square', 0.12, 0.1);
  else if (w.type === 'staff') playTone(650, 'sine', 0.16);
  else playTone(850, 'triangle', 0.08);
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

  if (player.artifactCooldownTimer > 0) {
    player.artifactCooldownTimer--;
    artifactCooldownOverlay.style.height = `${(player.artifactCooldownTimer / player.artifactCooldown) * 100}%`;
  } else {
    artifactCooldownOverlay.style.height = `0%`;
  }

  let nextPx = player.x;
  let nextPy = player.y;

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

  nextPx = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x + player.vx));
  nextPy = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y + player.vy));

  for (const obs of stageObstacles) {
    const halfW = obs.width / 2 + player.radius;
    const halfH = obs.height / 2 + player.radius;
    if (Math.abs(nextPx - obs.x) < halfW && Math.abs(nextPy - obs.y) < halfH) {
      if (Math.abs(player.x - obs.x) >= halfW) nextPx = player.x;
      if (Math.abs(player.y - obs.y) >= halfH) nextPy = player.y;
    }
  }
  player.x = nextPx;
  player.y = nextPy;

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

  // 護符寵物邏輯
  if (player.equipment && player.equipment.talisman) {
    pet.active = true;
    pet.type = player.equipment.talisman === 'atk_pet' ? 'atk' : (player.equipment.talisman === 'heal_pet' ? 'heal' : 'pull');
    pet.targetX = player.x - (player.facing * 24);
    pet.targetY = player.y - 20 + Math.sin(globalTime * 3) * 6;
    pet.x += (pet.targetX - pet.x) * 0.1;
    pet.y += (pet.targetY - pet.y) * 0.1;
    pet.timer++;

    if (pet.type === 'atk' && pet.timer >= 45) {
      pet.timer = 0;
      if (enemies.length > 0) {
        const e = enemies[0];
        bullets.push({
          x: pet.x, y: pet.y,
          vx: (e.x - pet.x) * 0.08, vy: (e.y - pet.y) * 0.08,
          radius: 3.5, damage: 30 + player.baseBonusDamage, type: 'bow'
        });
        playTone(1100, 'sine', 0.06, 0.04);
      }
    } else if (pet.type === 'heal' && pet.timer >= 180) {
      pet.timer = 0;
      if (player.hp < player.maxHp) {
        player.hp = Math.min(player.maxHp, player.hp + 20);
        updateHUD();
        playTone(600, 'sine', 0.25, 0.08);
      }
    } else if (pet.type === 'pull' && pet.timer >= 240) {
      pet.timer = 0;
      for (const e of enemies) {
        const dist = Math.hypot(e.x - pet.x, e.y - pet.y);
        if (dist < 150) {
          const angle = Math.atan2(pet.y - e.y, pet.x - e.x);
          e.x += Math.cos(angle) * 40; e.y += Math.sin(angle) * 40;
        }
      }
      playTone(200, 'sawtooth', 0.2, 0.1);
    }
  } else {
    pet.active = false;
  }

  if (chest.active) {
    if (Math.hypot(player.x - chest.x, player.y - chest.y) < player.radius + chest.radius) {
      openChestSelection(chest.isApex);
    }
  }

  for (let i = battlePickups.length - 1; i >= 0; i--) {
    const bp = battlePickups[i];
    if (Math.hypot(player.x - bp.x, player.y - bp.y) < player.radius + 14) {
      if (bp.type === 'magnet') activateSuperMagnet();
      else if (bp.type === 'bomb') activateEmpBomb();
      battlePickups.splice(i, 1);
    }
  }

  // 子彈碰撞與詞條觸發 (冰凍減速、連鎖電弧、殺敵嗜血)
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx; b.y += b.vy;
    if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
      bullets.splice(i, 1); continue;
    }

    let hitObstacle = false;
    for (const obs of stageObstacles) {
      if (Math.abs(b.x - obs.x) < obs.width / 2 && Math.abs(b.y - obs.y) < obs.height / 2) {
        bullets.splice(i, 1);
        hitObstacle = true;
        break;
      }
    }
    if (hitObstacle) continue;

    if (boss.active && Math.hypot(b.x - boss.x, b.y - boss.y) < b.radius + boss.radius) {
      boss.hp -= b.damage;
      bullets.splice(i, 1);
      playTone(180, 'sawtooth', 0.04);

      // 5★【極寒凝霜】：命中減速 Boss
      if (activeAffixes.slow) {
        boss.speed *= 0.85;
        setTimeout(() => { boss.speed = boss.isApex ? 1.0 : 0.75; }, 1500);
      }

      const bossHpPct = Math.max(0, (boss.hp / boss.maxHp) * 100);
      bossBarFill.style.width = `${bossHpPct}%`;
      bossHpText.innerText = `${Math.ceil(bossHpPct)}%`;

      if (boss.hp <= 0) {
        boss.active = false;
        bossBarContainer.style.display = 'none';
        kills += 15;
        txtKills.innerText = `擊退海嗣: ${kills}`;
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

        // 5★【極寒凝霜】：命中減速小怪
        if (activeAffixes.slow) {
          e.speed *= 0.55;
        }

        // 5★【超導連鎖】：25% 機率電弧彈跳傷害周邊怪
        if (activeAffixes.chain && Math.random() < 0.25) {
          for (const other of enemies) {
            if (other !== e && Math.hypot(other.x - e.x, other.y - e.y) < 95) {
              other.hp -= 20;
            }
          }
          playTone(900, 'sine', 0.05, 0.03);
        }

        if (e.hp <= 0) {
          gems.push({ x: e.x, y: e.y, radius: 4 });

          // 5★【逆鱗嗜血】：12% 殺敵回血 +8
          if (activeAffixes.vamp && Math.random() < 0.12) {
            player.hp = Math.min(player.maxHp, player.hp + 8);
            updateHUD();
          }

          const dropRand = Math.random();
          if (dropRand < 0.05) battlePickups.push({ x: e.x, y: e.y, type: 'magnet' });
          else if (dropRand < 0.09) battlePickups.push({ x: e.x, y: e.y, type: 'bomb' });

          enemies.splice(j, 1);
          kills++;
          txtKills.innerText = `擊退海嗣: ${kills}`;

          const killThreshold = (activeCountryStageId === 1 && activeSubstage < 5) ? 25 : 50;
          if (activeSubstage !== 5 && activeSubstage !== 10) {
            if (kills >= killThreshold) completeSubstage();
          } else {
            if (kills >= killThreshold && !boss.active && !chest.active) {
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
      let dmg = boss.isApex ? 0.6 : 0.35;
      if (activeAffixes.armor) dmg *= 0.75; // 5★【深淵磐石】減傷 25%
      player.hp -= dmg;
      updateHUD();
      if (player.hp <= 0) {
        triggerPlayerDefeat();
        return;
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

    let hitObs = false;
    for (const obs of stageObstacles) {
      if (Math.abs(bb.x - obs.x) < obs.width / 2 && Math.abs(bb.y - obs.y) < obs.height / 2) {
        bossBullets.splice(i, 1);
        hitObs = true;
        break;
      }
    }
    if (hitObs) continue;

    if (!player.isDashing && Math.hypot(bb.x - player.x, bb.y - player.y) < bb.radius + player.radius) {
      let dmg = bb.damage;
      if (activeAffixes.armor) dmg *= 0.75;
      player.hp -= dmg;
      bossBullets.splice(i, 1);
      updateHUD();
      playTone(150, 'sawtooth', 0.1);
      if (player.hp <= 0) {
        triggerPlayerDefeat();
        return;
      }
    }
  }

  spawnTimer++;
  const normSubstage = (activeSubstage > 5) ? (activeSubstage - 5) : activeSubstage;
  const currentInterval = Math.max(25, 75 - (normSubstage * 9));
  if (spawnTimer >= currentInterval) {
    spawnContinentEnemy();
    spawnTimer = 0;
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.pulse += 0.08;
    e.x += e.vx;
    e.y += e.vy;

    if (e.x - e.radius <= 0) { e.x = e.radius; e.vx = -e.vx; }
    else if (e.x + e.radius >= canvas.width) { e.x = canvas.width - e.radius; e.vx = -e.vx; }

    if (e.y - e.radius <= 0) { e.y = e.radius; e.vy = -e.vy; }
    else if (e.y + e.radius >= canvas.height) { e.y = canvas.height - e.radius; e.vy = -e.vy; }

    for (const obs of stageObstacles) {
      const halfW = obs.width / 2 + e.radius;
      const halfH = obs.height / 2 + e.radius;
      if (Math.abs(e.x - obs.x) < halfW && Math.abs(e.y - obs.y) < halfH) {
        const overlapX = halfW - Math.abs(e.x - obs.x);
        const overlapY = halfH - Math.abs(e.y - obs.y);
        if (overlapX < overlapY) {
          e.vx = -e.vx;
          e.x += (e.x > obs.x ? overlapX : -overlapX);
        } else {
          e.vy = -e.vy;
          e.y += (e.y > obs.y ? overlapY : -overlapY);
        }
      }
    }

    if (!player.isDashing && Math.hypot(player.x - e.x, player.y - e.y) < player.radius + e.radius) {
      let dmg = (activeCountryStageId === 1) ? 0.12 : 0.35;
      if (activeAffixes.armor) dmg *= 0.75;
      player.hp -= dmg;
      updateHUD();
      if (player.hp <= 0) {
        triggerPlayerDefeat();
        return;
      }
    }
  }

  for (let i = gems.length - 1; i >= 0; i--) {
    const g = gems[i];
    const dist = Math.hypot(player.x - g.x, player.y - g.y);

    if (g.magnetPull || dist < 75) {
      const pullSpeed = g.magnetPull ? 14 : 6;
      const angle = Math.atan2(player.y - g.y, player.x - g.x);
      g.x += Math.cos(angle) * pullSpeed;
      g.y += Math.sin(angle) * pullSpeed;
    }

    if (dist < player.radius + g.radius + 4) {
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
  player.nextExp = Math.floor(player.nextExp * 1.35);

  const curWep = player.weapon ? player.weapon.damage : 30;
  const curAtk = curWep + player.baseBonusDamage;
  document.getElementById('up-stat-damage').innerText = 
    `目前: ${curAtk} ➜ 升級後: ${curAtk + 15}`;

  document.getElementById('up-stat-hp').innerText = 
    `目前: ${Math.floor(player.hp)} / ${player.maxHp} ➜ 上限: ${player.maxHp + 25} (並補滿)`;

  const nextSpeed = (player.speed * 1.12).toFixed(2);
  document.getElementById('up-stat-speed').innerText = 
    `目前: ${player.speed.toFixed(2)} ➜ 升級後: ${nextSpeed}`;

  txtLevel.innerText = `階級: Lv.${player.level}`;
  upgradeModal.style.display = 'flex';
  playTone(700, 'sine', 0.25);
  updateHUD();
  syncPlayerSaveState();
}

function chooseUpgrade(type) {
  if (type === 'damage') {
    player.baseBonusDamage += 15;
  } else if (type === 'hp') {
    player.maxHp += 25;
    player.hp = player.maxHp;
  } else if (type === 'speed') {
    player.speed = parseFloat((player.speed * 1.12).toFixed(2));
  }

  upgradeModal.style.display = 'none';
  isPaused = false;
  updateHUD();
  syncPlayerSaveState();
}

function renderGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cont = activeCountryData ? activeCountryData.continent : 'EU';

  drawContinentBackground(ctx, cont, canvas.width, canvas.height);
  drawObstacles(ctx, stageObstacles, cont, globalTime);

  for (const g of gems) {
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2); ctx.fill();
  }

  drawBattlePickups(ctx, battlePickups, globalTime);

  for (const b of bullets) {
    ctx.fillStyle = b.isCrit ? '#facc15' : (b.type === 'staff' ? '#c084fc' : '#38bdf8');
    ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2); ctx.fill();
  }

  drawEnemies(ctx, enemies, boss);
  drawBossBullets(ctx, bossBullets);
  drawArtifactSkillEffects(ctx, artifactEffects, globalTime);
  drawChestItem(ctx, chest, globalTime);
  drawDashGhosts(ctx, dashGhosts);
  drawPlayerPaperdoll(ctx, player);
  drawPet(ctx, pet, player, globalTime);
}

function gameLoop() {
  updateGame();
  renderGame();
  requestAnimationFrame(gameLoop);
}
