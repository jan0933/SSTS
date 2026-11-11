/**
 * SSTS - 戰鬥引擎、升級數值卡片、1~5關數量遞增、6~10關血量翻倍 (game.js)
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

/* ==================== 戰鬥狀態 ==================== */
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const expBar = document.getElementById('exp-bar');
const hpBar = document.getElementById('hp-bar');
const txtExpVal = document.getElementById('txt-exp-val');
const txtHpVal = document.getElementById('txt-hp-val');
const txtLevel = document.getElementById('txt-level');
const txtCurrentCountry = document.getElementById('txt-current-country');
const txtWeaponMode = document.getElementById('txt-weapon-mode');
const txtKills = document.getElementById('txt-kills');

const upgradeModal = document.getElementById('upgrade-modal');
const chestModal = document.getElementById('chest-modal');
const chestOptionsContainer = document.getElementById('chest-options-container');
const chestStageInfo = document.getElementById('chest-stage-info');
const chestTitle = document.getElementById('chest-title');
const victoryModal = document.getElementById('victory-modal');
const victoryCountryName = document.getElementById('victory-country-name');
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
  fireInterval: 32,
  fireTimer: 0,

  combatMode: 'melee',
  meleeWeapon: { type: 'bare', name: '空手電磁衝擊', damage: 30, speed: 8, color: '#38bdf8' },
  rangedWeapon: { type: 'bow', name: '電磁弩弓', damage: 35, speed: 11, color: '#0284c7' },
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
    weapon: { type: 'bare', name: '空手電磁衝擊', damage: 30, speed: 8, color: '#38bdf8' }
  }
};

let dashGhosts = [];
const pet = { active: false, type: null, x: 0, y: 0, targetX: 0, targetY: 0, timer: 0 };
const chest = { active: false, x: 0, y: 0, radius: 16, isApex: false };
let battlePickups = [];
let stageObstacles = [];
let artifactEffects = [];

/* ==================== 裝備資料庫 ==================== */
const EQUIPMENT_DATABASE = {
  1: [
    { id: "w_sword_1", slot: "weapon", name: "斥候合金刃", type: "近戰武器", tier: "普通", desc: "軍刀斬擊 (傷害 45)", data: { type: 'melee', name: '斥候合金刃', damage: 45, speed: 9, color: '#38bdf8' } },
    { id: "w_bow_1", slot: "weapon", name: "輕型短弓", type: "遠程弓弩", tier: "普通", desc: "快速穿刺 (傷害 32)", data: { type: 'bow', name: '輕型短弓', damage: 32, speed: 11, color: '#0284c7' } },
    { id: "art_freeze", slot: "artifact", name: "極寒風暴核", type: "戰術法器", tier: "普通", desc: "技能：冰凍全場並減速 60%", skillType: "freeze" },
    { id: "h_scout", slot: "helmet", name: "斥候護目鏡", type: "頭盔", tier: "普通", desc: "提升 10% 視野與暴擊", val: "scout" },
    { id: "a_scout", slot: "armor", name: "輕甲胸衣", type: "盔甲", tier: "普通", desc: "提升 30 點生命上限", val: "scout" },
    { id: "t_atk", slot: "talisman", name: "雷光護符", type: "護符 (寵物)", tier: "普通", desc: "召喚【電漿浮游蟲】協助攻擊", val: "atk_pet" }
  ],
  2: [
    { id: "w_staff_2", slot: "weapon", name: "等離子星杖", type: "遠程法杖", tier: "稀有", desc: "貫穿光球 (傷害 75)", data: { type: 'staff', name: '等離子星杖', damage: 75, speed: 7, color: '#c084fc' } },
    { id: "art_thunder", slot: "artifact", name: "天罰雷霆核", type: "戰術法器", tier: "稀有", desc: "技能：全屏召喚五道天雷轟殺強敵", skillType: "thunder" },
    { id: "h_heavy_2", slot: "helmet", name: "重型合金角盔", type: "頭盔", tier: "稀有", desc: "減免 15% 所受傷害", val: "heavy" },
    { id: "a_heavy_2", slot: "armor", name: "板塊覆甲重鎧", type: "盔甲", tier: "稀有", desc: "大幅提升防禦與抗擊退", val: "heavy" },
    { id: "t_heal", slot: "talisman", name: "生命潮汐符", type: "護符 (寵物)", tier: "稀有", desc: "召喚【醫療水母】每 4 秒回血", val: "heal_pet" },
    { id: "acc_mantle", slot: "accessory", name: "極光披風", type: "配件", tier: "稀有", desc: "提升 15% 移動速度", val: "mantle" }
  ],
  3: [
    { id: "w_sword_3", slot: "weapon", name: "逆鱗弒神光刃", type: "近戰神話", tier: "史詩", desc: "大範圍真傷橫掃 (傷害 135)", data: { type: 'melee', name: '逆鱗弒神光刃', damage: 135, speed: 12, color: '#f43f5e' } },
    { id: "w_bow_3", slot: "weapon", name: "虛空貫滅巨弩", type: "遠程神話", tier: "史詩", desc: "三重散射電磁箭 (傷害 98)", data: { type: 'bow', name: '虛空貫滅巨弩', damage: 98, speed: 14, color: '#38bdf8' } },
    { id: "art_blackhole", slot: "artifact", name: "深淵重力核", type: "戰術法器", tier: "史詩", desc: "技能：全圖產生黑洞聚怪並引燃", skillType: "blackhole" },
    { id: "a_archmage_3", slot: "armor", name: "星宿天災戰袍", type: "盔甲神話", tier: "史詩", desc: "護甲超載，全傷害提升 30%", val: "archmage" },
    { id: "t_pull", slot: "talisman", name: "深淵重力核", type: "護符 (寵物)", tier: "史詩", desc: "召喚【磁暴黑洞核】定期強吸怪", val: "pull_pet" }
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

  player.meleeWeapon = userSave.equipped.meleeWeapon || { type: 'melee', name: '離子軍刀', damage: 45, speed: 9, color: '#38bdf8' };
  player.rangedWeapon = userSave.equipped.rangedWeapon || { type: 'bow', name: '電磁弩弓', damage: 35, speed: 11, color: '#0284c7' };
  player.artifact = userSave.equipped.artifact || { id: "art_nova", name: "等離子爆裂核", skillType: "nova" };
  player.combatMode = 'melee';

  player.equipment = {
    helmet: userSave.equipped.helmet,
    armor: userSave.equipped.armor,
    gloves: userSave.equipped.gloves,
    boots: userSave.equipped.boots,
    accessory: userSave.equipped.accessory,
    talisman: userSave.equipped.talisman,
    weapon: player.meleeWeapon
  };

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
  txtWeaponMode.innerText = `模式: 近戰斬擊`;
  txtLevel.innerText = `階級: Lv.${player.level}`;
  updateHUD();

  generateStageObstacles(activeCountryData.continent);
  initGame();
}

function triggerManualAttack(mode) {
  if (isPaused || !gameRunning) return;

  player.combatMode = mode;
  if (mode === 'melee') {
    player.equipment.weapon = player.meleeWeapon;
    txtWeaponMode.innerText = `模式: 近戰 (${player.meleeWeapon.name})`;
    txtWeaponMode.style.color = "#38bdf8";
  } else {
    player.equipment.weapon = player.rangedWeapon;
    txtWeaponMode.innerText = `模式: 遠程 (${player.rangedWeapon.name})`;
    txtWeaponMode.style.color = "#2dd4bf";
  }

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
  if (e.key === 'j' || e.key === 'J') triggerManualAttack('melee');
  if (e.key === 'k' || e.key === 'K') triggerManualAttack('ranged');
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
      <div style="font-size: 10px; color: #eab308; margin-top: 8px;">★ 點擊獲取 ★</div>
    `;
    card.onclick = () => { claimChestItem(item); };
    chestOptionsContainer.appendChild(card);
  });

  playTone(650, 'triangle', 0.3, 0.15);
}

function claimChestItem(item) {
  if (!userSave.myInventory.some(i => i.id === item.id)) {
    userSave.myInventory.push(item);
  }
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

  syncPlayerSaveState();
  showVictoryModal();
}

function syncPlayerSaveState() {
  userSave.playerLevel = player.level;
  userSave.playerExp = player.exp;
  userSave.playerNextExp = player.nextExp;
  userSave.playerMaxHp = player.maxHp;
  userSave.equipped = {
    helmet: player.equipment.helmet,
    armor: player.equipment.armor,
    gloves: player.equipment.gloves,
    boots: player.equipment.boots,
    accessory: player.equipment.accessory,
    talisman: player.equipment.talisman,
    meleeWeapon: player.meleeWeapon,
    rangedWeapon: player.rangedWeapon,
    artifact: player.artifact,
    activeCombatMode: player.combatMode
  };
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

/* ==================== 怪物數量階梯與血量翻倍機制 ==================== */
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
  const w = player.equipment.weapon || player.meleeWeapon;
  const totalDamage = w.damage + player.baseBonusDamage;

  bullets.push({
    x: player.x, y: player.y,
    vx: Math.cos(angle) * w.speed, vy: Math.sin(angle) * w.speed,
    radius: w.type === 'staff' ? 6 : (w.type === 'bow' ? 3 : 4.5),
    damage: totalDamage, type: w.type
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

  updatePet();

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
        if (e.hp <= 0) {
          gems.push({ x: e.x, y: e.y, radius: 4 });

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
      player.hp -= boss.isApex ? 0.6 : 0.35;
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
      player.hp -= bb.damage;
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
      const dmg = (activeCountryStageId === 1) ? 0.12 : 0.35;
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

  const curMelee = player.meleeWeapon.damage + player.baseBonusDamage;
  const curRanged = player.rangedWeapon.damage + player.baseBonusDamage;
  document.getElementById('up-stat-damage').innerText = 
    `目前: 近戰 ${curMelee} / 遠程 ${curRanged} ➜ 各 +15`;

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
    ctx.fillStyle = b.type === 'staff' ? '#c084fc' : (b.type === 'bow' ? '#38bdf8' : '#67e8f9');
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
