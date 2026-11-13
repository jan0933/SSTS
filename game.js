/**
 * SSTS - 核心戰鬥物理引擎、主動法器技能、Boss 系統與 60fps 主迴圈 (game.js)
 */

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const expBar = document.getElementById('exp-bar');
const hpBar = document.getElementById('hp-bar');
const txtExpVal = document.getElementById('txt-exp-val');
const txtHpVal = document.getElementById('txt-hp-val');
const txtLevelPrefix = document.getElementById('txt-level-prefix');
const txtCurrentCountry = document.getElementById('txt-current-country');
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

// 綁定畫布多點觸控搖桿
if (typeof initJoystickEvents === 'function') {
  initJoystickEvents(canvas);
}

let isPaused = false;
let kills = 0;
let activeCountryStageId = 1;
let activeSubstage = 1;
let activeCountryData = null;
let gameRunning = false;
let globalTime = 0;
let activeAffixes = {};

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 0,
  vy: 0,
  radius: 14,
  baseSpeed: 2.8,
  speed: 2.8,
  hp: 100,
  maxHp: 100,
  baseBonusDamage: 0,
  gearDmgReduce: 0,
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

  weapon: { id: "w_01", name: "新兵製式獵弓", type: "bow", tier: "common", stars: 1, damage: 30, speed: 10 },
  artifact: { id: "art_01", name: "基礎爆裂手雷核", skillType: "nova", skillMult: 1.0 },

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
const pet = { active: false, type: null, power: 1.0, x: 0, y: 0, targetX: 0, targetY: 0, timer: 0 };
const chest = { active: false, x: 0, y: 0, radius: 16, isApex: false };
let battlePickups = [];
let stageObstacles = [];
let artifactEffects = [];

let enemies = [];
let bullets = [];
let gems = [];
let spawnTimer = 0;

/* ==================== 動態匹配螢幕長寬比（無黑邊、不變形） ==================== */
function resizeBattleCanvas() {
  const wrapper = document.querySelector('.canvas-aspect-wrapper');
  const w = wrapper && wrapper.clientWidth > 0 ? wrapper.clientWidth : window.innerWidth;
  const h = wrapper && wrapper.clientHeight > 0 ? wrapper.clientHeight : window.innerHeight;
  if (w > 0 && h > 0) {
    const baseLogicalHeight = 540;
    canvas.height = baseLogicalHeight;
    canvas.width = Math.round(baseLogicalHeight * (w / h));

    if (typeof player !== 'undefined') {
      player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
      player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));
    }
  }
}

window.addEventListener('resize', () => {
  if (typeof joystick !== 'undefined') {
    joystick.active = false;
    joystick.touchId = null;
    if (joyBase) joyBase.style.display = 'none';
  }
  resizeBattleCanvas();
});

function getKillThreshold() {
  return (activeCountryStageId === 1 && activeSubstage < 5) ? 25 : 50;
}

function updateKillsDisplay() {
  if (!txtKills) return;
  const target = getKillThreshold();
  if ((activeSubstage === 5 || activeSubstage === 10) && boss.active) {
    txtKills.innerText = `⚔️ 首領戰`;
  } else {
    txtKills.innerText = `擊退: ${Math.min(kills, target)} / ${target}`;
  }
}

function generateStageObstacles(continent, countryId = activeCountryStageId) {
  stageObstacles = [];
  const count = 3 + Math.floor(Math.random() * 2);
  const archPool = (typeof resolveCountryLandmarks === 'function')
    ? resolveCountryLandmarks(activeCountryData, countryId)
    : ['eu_castle'];

  for (let i = 0; i < count; i++) {
    let ox = 95 + Math.random() * (canvas.width - 190);
    let oy = 95 + Math.random() * (canvas.height - 190);
    if (Math.hypot(ox - canvas.width / 2, oy - canvas.height / 2) < 95) {
      ox += (ox > canvas.width / 2 ? 105 : -105);
    }
    const landmarkType = archPool[i % archPool.length];
    stageObstacles.push({
      x: ox,
      y: oy,
      width: 48,
      height: 48,
      landmark: landmarkType
    });
  }
}

function compileActiveAffixes() {
  activeAffixes = {};
  for (const key in userSave.equipped) {
    const item = userSave.equipped[key];
    if (!item) continue;
    const list = (typeof getItemAffixList === 'function')
      ? getItemAffixList(item)
      : (item.affixes || (item.affix ? [item.affix] : []));
    list.forEach(aff => {
      if (aff && aff.id) {
        activeAffixes[aff.id] = true;
      }
    });
  }
  player.dashCooldown = activeAffixes.rush ? 60 : 90;
}

function startCountryBattle(countryId, substageIndex) {
  resizeBattleCanvas();

  activeCountryStageId = countryId;
  activeSubstage = substageIndex;
  activeCountryData = COUNTRIES_STAGE_DATA.find(s => s.id === countryId) || COUNTRIES_STAGE_DATA[0];

  let totalGearHp = 0;
  let totalGearDmg = 0;
  let totalGearSpeed = 0;
  let fireRateMult = 1.0;
  let dashCdMult = 1.0;
  player.gearDmgReduce = 0;

  for (const key in userSave.equipped) {
    const eqItem = userSave.equipped[key];
    if (!eqItem) continue;
    if (eqItem.bonusHp) totalGearHp += eqItem.bonusHp;
    if (eqItem.bonusDmg) totalGearDmg += eqItem.bonusDmg;
    if (eqItem.bonusSpeed) totalGearSpeed += eqItem.bonusSpeed;
    if (eqItem.fireRateMult) fireRateMult *= eqItem.fireRateMult;
    if (eqItem.dashCdMult) dashCdMult *= eqItem.dashCdMult;
    if (eqItem.dmgReduce) player.gearDmgReduce += eqItem.dmgReduce;
  }
  player.gearDmgReduce = Math.min(0.75, player.gearDmgReduce);

  player.level = userSave.playerLevel;
  player.exp = userSave.playerExp;
  player.nextExp = userSave.playerNextExp;
  player.maxHp = userSave.playerMaxHp + totalGearHp;
  player.hp = player.maxHp;
  player.baseBonusDamage = ((player.level - 1) * 5) + totalGearDmg;
  player.speed = parseFloat((player.baseSpeed + totalGearSpeed).toFixed(2));
  player.fireInterval = Math.max(8, Math.floor(30 * fireRateMult));

  player.weapon = userSave.equipped.weapon || (typeof getStarterWeapon === 'function' ? getStarterWeapon() : { id: "w_01", name: "新兵製式獵弓", type: "bow", tier: "common", stars: 1, damage: 30, speed: 10 });
  player.artifact = userSave.equipped.artifact || (typeof getStarterArtifact === 'function' ? getStarterArtifact() : { id: "art_01", name: "基礎爆裂手雷核", skillType: "nova", skillMult: 1.0 });

  player.equipment = {
    helmet: userSave.equipped.helmet ? userSave.equipped.helmet.val : null,
    armor: userSave.equipped.armor ? userSave.equipped.armor.val : null,
    gloves: userSave.equipped.gloves ? userSave.equipped.gloves.val : null,
    boots: userSave.equipped.boots ? userSave.equipped.boots.val : null,
    accessory: userSave.equipped.accessory ? userSave.equipped.accessory.val : null,
    talisman: userSave.equipped.talisman ? userSave.equipped.talisman.val : null,
    weapon: player.weapon
  };

  pet.power = (userSave.equipped.talisman && userSave.equipped.talisman.petPower) ? userSave.equipped.talisman.petPower : 1.0;

  compileActiveAffixes();
  player.dashCooldown = Math.max(25, Math.floor(player.dashCooldown * dashCdMult));

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
  bossBarContainer.style.display = 'none';
  chest.active = false;
  isPaused = false;

  defeatModal.style.display = 'none';
  victoryModal.style.display = 'none';

  if (txtCurrentCountry) txtCurrentCountry.innerText = `${activeCountryData.flag} ${activeCountryData.name.split(' ')[0]} · 哨站 ${substageIndex}/10`;
  if (txtLevelPrefix) txtLevelPrefix.innerText = `Lv.${player.level} EXP`;
  updateKillsDisplay();
  updateHUD();

  generateStageObstacles(activeCountryData.continent, countryId);
  initGame();
}

/* ==================== 主動操作 (法器 / 衝刺) ==================== */
function triggerArtifactSkill() {
  if (isPaused || !gameRunning || player.artifactCooldownTimer > 0) return;

  player.artifactCooldownTimer = player.artifactCooldown;
  const skill = player.artifact ? player.artifact.skillType : 'nova';
  const skillMult = (player.artifact && player.artifact.skillMult) ? player.artifact.skillMult : 1.0;

  if (skill === 'nova') {
    playTone(200, 'sawtooth', 0.4, 0.25);
    const particles = [];
    for (let i = 0; i < 28; i++) {
      particles.push({
        x: player.x, y: player.y,
        angle: Math.random() * Math.PI * 2,
        speed: 3 + Math.random() * 5,
        size: 3 + Math.random() * 3
      });
    }
    artifactEffects.push({ type: 'nova', x: player.x, y: player.y, timer: 30, maxDuration: 30, particles });

    const novaDmg = Math.floor((90 + player.baseBonusDamage) * skillMult);
    for (let i = enemies.length - 1; i >= 0; i--) {
      if (Math.hypot(enemies[i].x - player.x, enemies[i].y - player.y) < 180) enemies[i].hp -= novaDmg;
    }
    if (boss.active && Math.hypot(boss.x - player.x, boss.y - player.y) < 180 + boss.radius) boss.hp -= novaDmg;

  } else if (skill === 'freeze') {
    playTone(850, 'sine', 0.3, 0.2);
    const particles = [];
    for (let i = 0; i < 35; i++) {
      particles.push({ x: player.x, y: player.y, angle: Math.random() * Math.PI * 2, speed: 2 + Math.random() * 6 });
    }
    artifactEffects.push({ type: 'freeze', x: player.x, y: player.y, timer: 35, maxDuration: 35, particles });

    const freezeDmg = Math.floor((35 + player.baseBonusDamage) * skillMult);
    for (const e of enemies) { e.speed *= 0.4; e.hp -= freezeDmg; }
    if (boss.active) {
      boss.speed *= 0.65;
      boss.hp -= freezeDmg;
      setTimeout(() => { if (boss.active) boss.speed = boss.isApex ? 1.0 : 0.75; }, 2500);
    }

  } else if (skill === 'thunder') {
    playTone(150, 'square', 0.5, 0.3);
    const strikes = [];
    const sorted = [...enemies].sort((a, b) => b.hp - a.hp);
    const strikeCount = Math.min(5, Math.max(3, sorted.length));
    const thunderDmg = Math.floor((150 + player.baseBonusDamage) * skillMult);

    for (let i = 0; i < strikeCount; i++) {
      const target = (i === 0 && boss.active) ? boss : (sorted[i] || { x: Math.random() * canvas.width, y: Math.random() * canvas.height, hp: 0 });
      target.hp -= thunderDmg;

      const points = [];
      let cy = 0;
      let cx = target.x + (Math.random() - 0.5) * 60;
      while (cy < target.y) {
        cy += 40 + Math.random() * 30;
        cx += (Math.random() - 0.5) * 35;
        points.push({ x: cx, y: Math.min(cy, target.y) });
      }
      strikes.push({ x: target.x + (Math.random() - 0.5) * 40, targetX: target.x, targetY: target.y, points });
    }
    artifactEffects.push({ type: 'thunder', timer: 24, maxDuration: 24, strikes });

  } else if (skill === 'blackhole') {
    playTone(120, 'sawtooth', 0.6, 0.25);
    const particles = [];
    for (let i = 0; i < 40; i++) {
      const a = Math.random() * Math.PI * 2;
      const dist = 70 + Math.random() * 120;
      particles.push({ x: canvas.width / 2 + Math.cos(a) * dist, y: canvas.height / 2 + Math.sin(a) * dist });
    }
    artifactEffects.push({ type: 'blackhole', x: canvas.width / 2, y: canvas.height / 2, timer: 50, maxDuration: 50, particles });

    const bhDmg = Math.floor((55 + player.baseBonusDamage * 0.6) * skillMult);
    for (const e of enemies) {
      e.x = canvas.width / 2 + (Math.random() - 0.5) * 40;
      e.y = canvas.height / 2 + (Math.random() - 0.5) * 40;
      e.hp -= bhDmg;
    }
    if (boss.active) boss.hp -= bhDmg;
  }
}

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

/* ==================== Boss 系統 ==================== */
const boss = {
  active: false, isApex: false, x: 0, y: 0, radius: 36,
  hp: 500, maxHp: 500, speed: 0.9, pulse: 0,
  ringAttackTimer: 0, ringAttackInterval: 120
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
  updateKillsDisplay();
  playTone(isApex ? 140 : 190, 'sawtooth', 0.6, 0.2);

  setTimeout(() => { bossAlarmOverlay.style.display = 'none'; }, 2200);
}

function fireBossRingBarrage() {
  const bulletCount = boss.isApex ? 12 : 8;
  const speed = boss.isApex ? 2.6 : 2.0;
  for (let i = 0; i < bulletCount; i++) {
    const angle = (Math.PI * 2 / bulletCount) * i + (boss.pulse * 0.5);
    bossBullets.push({
      x: boss.x, y: boss.y,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      radius: boss.isApex ? 6 : 4.5,
      damage: boss.isApex ? 14 : 8,
      isApex: boss.isApex
    });
  }
  playTone(boss.isApex ? 180 : 240, 'square', 0.2, 0.1);
}

/* ==================== 哨站結算與道具效果 ==================== */
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
  let totalGearHp = 0;
  for (const key in userSave.equipped) {
    if (userSave.equipped[key] && userSave.equipped[key].bonusHp) {
      totalGearHp += userSave.equipped[key].bonusHp;
    }
  }
  userSave.playerMaxHp = Math.max(100, player.maxHp - totalGearHp);
  saveGameProgress();
}

function showVictoryModal() {
  isPaused = true;
  victoryCountryName.innerText = `${activeCountryData.flag} ${activeCountryData.name} - 哨站 ${activeSubstage} 肅清！`;
  victoryDescText.innerText = activeSubstage === 10
    ? "【全國全面收復】深淵海潮退卻，下一個國家防線已成功解鎖！"
    : `哨站防禦網絡已建立，第 ${activeSubstage + 1} 哨站已開放作戰！`;
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
  updateKillsDisplay();
}

/* ==================== 戰鬥物理主迴圈 ==================== */
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

  if (isHpDoubled) baseHp *= 2;

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

function applyDamageToPlayer(rawDmg) {
  let finalDmg = rawDmg * (1 - (player.gearDmgReduce || 0));
  if (activeAffixes.armor) finalDmg *= 0.75;
  player.hp -= finalDmg;
  updateHUD();
  if (player.hp <= 0) {
    triggerPlayerDefeat();
    return true;
  }
  return false;
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
          radius: 3.5,
          damage: Math.floor((30 + player.baseBonusDamage * 0.5) * pet.power),
          type: 'bow'
        });
        playTone(1100, 'sine', 0.06, 0.04);
      }
    } else if (pet.type === 'heal' && pet.timer >= 180) {
      pet.timer = 0;
      if (player.hp < player.maxHp) {
        player.hp = Math.min(player.maxHp, player.hp + Math.floor(20 * pet.power));
        updateHUD();
        playTone(600, 'sine', 0.25, 0.08);
      }
    } else if (pet.type === 'pull' && pet.timer >= 240) {
      pet.timer = 0;
      const pullRange = 150 * Math.min(1.6, pet.power);
      for (const e of enemies) {
        if (Math.hypot(e.x - pet.x, e.y - pet.y) < pullRange) {
          const angle = Math.atan2(pet.y - e.y, pet.x - e.x);
          e.x += Math.cos(angle) * 45; e.y += Math.sin(angle) * 45;
        }
      }
      playTone(200, 'sawtooth', 0.2, 0.1);
    }
  } else {
    pet.active = false;
  }

  if (chest.active && Math.hypot(player.x - chest.x, player.y - chest.y) < player.radius + chest.radius) {
    openChestSelection(chest.isApex);
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
        updateKillsDisplay();
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

        if (activeAffixes.slow) e.speed *= 0.55;

        if (activeAffixes.chain && Math.random() < 0.25) {
          for (const other of enemies) {
            if (other !== e && Math.hypot(other.x - e.x, other.y - e.y) < 95) other.hp -= 20;
          }
          playTone(900, 'sine', 0.05, 0.03);
        }

        if (e.hp <= 0) {
          gems.push({ x: e.x, y: e.y, radius: 4 });

          if (activeAffixes.vamp && Math.random() < 0.12) {
            player.hp = Math.min(player.maxHp, player.hp + 8);
            updateHUD();
          }

          const dropRand = Math.random();
          if (dropRand < 0.05) battlePickups.push({ x: e.x, y: e.y, type: 'magnet' });
          else if (dropRand < 0.09) battlePickups.push({ x: e.x, y: e.y, type: 'bomb' });

          enemies.splice(j, 1);
          kills++;
          updateKillsDisplay();

          const killThreshold = getKillThreshold();
          if (activeSubstage !== 5 && activeSubstage !== 10) {
            if (kills >= killThreshold) completeSubstage();
          } else {
            if (kills >= killThreshold && !boss.active && !chest.active) checkAndSpawnStageBoss();
          }
        }
        break;
      }
    }
  }

  if (boss.active) {
    const bossHpPct = Math.max(0, (boss.hp / boss.maxHp) * 100);
    bossBarFill.style.width = `${bossHpPct}%`;
    bossHpText.innerText = `${Math.ceil(bossHpPct)}%`;

    if (boss.hp <= 0) {
      boss.active = false;
      bossBarContainer.style.display = 'none';
      kills += 15;
      updateKillsDisplay();
      chest.active = true;
      chest.isApex = boss.isApex;
      chest.x = boss.x;
      chest.y = boss.y;
      playTone(950, 'triangle', 0.5, 0.2);
    } else {
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
        if (applyDamageToPlayer(boss.isApex ? 0.6 : 0.35)) return;
      }
    }
  }

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
      bossBullets.splice(i, 1);
      playTone(150, 'sawtooth', 0.1);
      if (applyDamageToPlayer(bb.damage)) return;
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
    if (e.hp <= 0) {
      gems.push({ x: e.x, y: e.y, radius: 4 });
      enemies.splice(i, 1);
      kills++;
      updateKillsDisplay();
      continue;
    }

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
      if (applyDamageToPlayer((activeCountryStageId === 1) ? 0.12 : 0.35)) return;
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
  document.getElementById('up-stat-damage').innerText = `目前: ${curAtk} ➜ 升級後: ${curAtk + 15}`;
  document.getElementById('up-stat-hp').innerText = `目前: ${Math.floor(player.hp)} / ${player.maxHp} ➜ 上限: ${player.maxHp + 25} (並補滿)`;
  const nextSpeed = (player.speed * 1.12).toFixed(2);
  document.getElementById('up-stat-speed').innerText = `目前: ${player.speed.toFixed(2)} ➜ 升級後: ${nextSpeed}`;

  if (txtLevelPrefix) txtLevelPrefix.innerText = `Lv.${player.level} EXP`;
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
    player.baseSpeed = parseFloat((player.baseSpeed * 1.12).toFixed(2));
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
