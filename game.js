/**
 * SSTS - 核心戰鬥物理引擎、30種海嗣AI與特殊攻擊、10武器詞條、30防具疊加詞條與傳說海怪BOSS主迴圈 (game.js)
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
let frameCounter = 0;

let activeAffixes = {};
let affixStats = {}; // 跨部位疊加後的最終數值

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
  shield: 0,           // 相位力場護盾 (a_shield_start)
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
  dashInvulTimer: 0,   // 殘影相位無敵幀 (a_dash_invul)
  killSpeedTimer: 0,   // 獵殺狂熱移速幀 (a_kill_spd)
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
const pet = { active: false, animal: 'seagull', mode: 'atk', power: 1.0, x: 0, y: 0, targetX: 0, targetY: 0, timer: 0 };
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
  if (activeCountryStageId === 1 && activeSubstage < 5) return 25;
  // 隨國家進度微幅提升清剿目標數（50 ~ 75 隻）
  return Math.min(75, 50 + Math.floor(activeCountryStageId / 4));
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

/* ==================== 詞條跨部位疊加規則彙整引擎 ==================== */
function compileActiveAffixes() {
  activeAffixes = {};
  affixStats = {};

  const defMap = {};
  if (typeof WEAPON_AFFIX_POOL !== 'undefined') WEAPON_AFFIX_POOL.forEach(a => defMap[a.id] = a);
  if (typeof ARMOR_AFFIX_POOL !== 'undefined') ARMOR_AFFIX_POOL.forEach(a => defMap[a.id] = a);

  for (const slotKey in userSave.equipped) {
    const item = userSave.equipped[slotKey];
    if (!item || item.slot === 'talisman' || item.slot === 'artifact') continue;

    const list = (typeof getItemAffixList === 'function')
      ? getItemAffixList(item)
      : (item.affixes || (item.affix ? [item.affix] : []));

    list.forEach(aff => {
      if (!aff || !aff.id) return;
      const id = aff.id;
      const def = defMap[id] || aff;
      const val = typeof def.val === 'number' ? def.val : 1;
      const stackType = def.stackType || 'add';

      activeAffixes[id] = (activeAffixes[id] || 0) + 1;

      if (stackType === 'mult_reduce') {
        const prevRemain = affixStats[id] !== undefined ? (1 - affixStats[id]) : 1.0;
        const newRemain = prevRemain * (1 - val);
        affixStats[id] = parseFloat((1 - newRemain).toFixed(4));
      } else if (stackType === 'count') {
        const cap = def.cap || 5;
        affixStats[id] = Math.min(cap, (affixStats[id] || 0) + val);
      } else {
        const cap = def.cap !== undefined ? def.cap : 9999;
        affixStats[id] = parseFloat(Math.min(cap, (affixStats[id] || 0) + val).toFixed(4));
      }
    });
  }
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

  player.weapon = userSave.equipped.weapon || (typeof getStarterWeapon === 'function' ? getStarterWeapon() : { id: "w_01", name: "新兵製式獵弓", type: "bow", tier: "common", stars: 1, damage: 30, speed: 10 });
  player.artifact = userSave.equipped.artifact || (typeof getStarterArtifact === 'function' ? getStarterArtifact() : { id: "art_01", name: "基礎爆裂手雷核", skillType: "nova", skillMult: 1.0 });

  const eqTalisman = userSave.equipped.talisman;
  pet.power = (eqTalisman && eqTalisman.petPower) ? eqTalisman.petPower : 1.0;
  pet.animal = (eqTalisman && eqTalisman.petAnimal) ? eqTalisman.petAnimal : 'seagull';
  pet.mode = (eqTalisman && eqTalisman.petMode) ? eqTalisman.petMode : 'atk';

  compileActiveAffixes();

  player.level = userSave.playerLevel;
  player.exp = userSave.playerExp;
  player.nextExp = userSave.playerNextExp;

  const baseCombinedHp = userSave.playerMaxHp + totalGearHp;
  player.maxHp = Math.round(baseCombinedHp * (1 + (affixStats.a_hp_pct || 0)));
  player.hp = player.maxHp;

  player.shield = affixStats.a_shield_start || 0;
  player.baseBonusDamage = ((player.level - 1) * 5) + totalGearDmg;

  const rawSpeed = (player.baseSpeed + totalGearSpeed) * (1 + (affixStats.a_move_spd || 0));
  player.speed = parseFloat(rawSpeed.toFixed(2));
  player.fireInterval = Math.max(8, Math.floor(30 * fireRateMult));

  const rushReduce = affixStats.a_rush || 0;
  player.dashCooldown = Math.max(22, Math.round(90 * dashCdMult * (1 - rushReduce)));

  const artCdReduce = affixStats.a_art_cd || 0;
  const baseArtCd = (player.artifact && player.artifact.cooldownFrames) ? player.artifact.cooldownFrames : 240;
  player.artifactCooldown = Math.max(75, Math.round(baseArtCd * (1 - artCdReduce)));

  if (affixStats.a_pet_boost) {
    pet.power = parseFloat((pet.power * (1 + affixStats.a_pet_boost)).toFixed(2));
  }

  player.equipment = {
    helmet: userSave.equipped.helmet ? userSave.equipped.helmet.val : null,
    armor: userSave.equipped.armor ? userSave.equipped.armor.val : null,
    gloves: userSave.equipped.gloves ? userSave.equipped.gloves.val : null,
    boots: userSave.equipped.boots ? userSave.equipped.boots.val : null,
    accessory: userSave.equipped.accessory ? userSave.equipped.accessory.val : null,
    talisman: eqTalisman ? eqTalisman.val : null,
    weapon: player.weapon
  };

  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  player.dashInvulTimer = 0;
  player.killSpeedTimer = 0;

  enemies = [];
  bullets = [];
  bossBullets = [];
  gems = [];
  dashGhosts = [];
  battlePickups = [];
  artifactEffects = [];
  kills = 0;
  frameCounter = 0;
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

function getEffectiveBonusDamage() {
  let bonus = player.baseBonusDamage;
  if (affixStats.a_berserk_atk && player.maxHp > 0) {
    const missingRatio = Math.max(0, 1 - (player.hp / player.maxHp));
    const stacks = Math.floor(missingRatio * 10);
    if (stacks > 0) {
      const wepBase = player.weapon ? player.weapon.damage : 30;
      const pct = Math.min(affixStats.a_berserk_atk, stacks * 0.04);
      bonus += Math.round((wepBase + bonus) * pct);
    }
  }
  return bonus;
}

/* ==================== 主動操作 (法器 / 衝刺) ==================== */
function triggerArtifactSkill() {
  if (isPaused || !gameRunning || player.artifactCooldownTimer > 0) return;

  player.artifactCooldownTimer = player.artifactCooldown;
  const skill = player.artifact ? player.artifact.skillType : 'nova';
  const baseMult = (player.artifact && player.artifact.skillMult) ? player.artifact.skillMult : 1.0;
  const skillMult = baseMult * (1 + (affixStats.a_art_dmg || 0));
  const curBonus = getEffectiveBonusDamage();

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

    const novaDmg = Math.floor((90 + curBonus) * skillMult);
    for (let i = enemies.length - 1; i >= 0; i--) {
      if (Math.hypot(enemies[i].x - player.x, enemies[i].y - player.y) < 185) enemies[i].hp -= novaDmg;
    }
    if (boss.active && Math.hypot(boss.x - player.x, boss.y - player.y) < 185 + boss.radius) boss.hp -= novaDmg;

  } else if (skill === 'freeze') {
    playTone(850, 'sine', 0.3, 0.2);
    const particles = [];
    for (let i = 0; i < 35; i++) {
      particles.push({ x: player.x, y: player.y, angle: Math.random() * Math.PI * 2, speed: 2 + Math.random() * 6 });
    }
    artifactEffects.push({ type: 'freeze', x: player.x, y: player.y, timer: 35, maxDuration: 35, particles });

    const freezeDmg = Math.floor((35 + curBonus) * skillMult);
    for (const e of enemies) { e.baseSpeed *= 0.45; e.hp -= freezeDmg; }
    if (boss.active) {
      boss.speed *= 0.65;
      boss.hp -= freezeDmg;
      setTimeout(() => { if (boss.active) boss.speed = boss.baseSpeed || (boss.isApex ? 1.0 : 0.75); }, 2500);
    }

  } else if (skill === 'thunder') {
    playTone(150, 'square', 0.5, 0.3);
    const strikes = [];
    const sorted = [...enemies].sort((a, b) => b.hp - a.hp);
    const strikeCount = Math.min(5, Math.max(3, sorted.length));
    const thunderDmg = Math.floor((150 + curBonus) * skillMult);

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

    const bhDmg = Math.floor((55 + curBonus * 0.6) * skillMult);
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

  if (affixStats.a_dash_invul) {
    player.dashInvulTimer = affixStats.a_dash_invul;
  }

  if (affixStats.a_dash_nova) {
    const layers = affixStats.a_dash_nova;
    const novaR = 85 + layers * 25;
    const novaDmg = (25 + Math.round(getEffectiveBonusDamage() * 0.35)) * layers;
    for (const e of enemies) {
      const dist = Math.hypot(e.x - player.x, e.y - player.y);
      if (dist < novaR) {
        e.hp -= novaDmg;
        const pushAng = Math.atan2(e.y - player.y, e.x - player.x);
        e.x += Math.cos(pushAng) * (30 + layers * 10);
        e.y += Math.sin(pushAng) * (30 + layers * 10);
      }
    }
  }

  if (player.vx !== 0 || player.vy !== 0) {
    const len = Math.hypot(player.vx, player.vy);
    player.dashDirX = player.vx / len; player.dashDirY = player.vy / len;
  } else {
    player.dashDirX = player.facing; player.dashDirY = 0;
  }
  playTone(920, 'sawtooth', 0.12, 0.08);
}

/* ==================== Boss 系統 (連動 monsters_db.js 傳說海怪圖鑑與難度曲線) ==================== */
const boss = {
  active: false, isApex: false, x: 0, y: 0, radius: 36,
  hp: 500, maxHp: 500, speed: 0.9, baseSpeed: 0.9, pulse: 0,
  ringAttackTimer: 0, ringAttackInterval: 120,
  visual: 'leviathan',
  bulletPattern: 'ring',
  bulletColor: '#f43f5e'
};
let bossBullets = [];

function checkAndSpawnStageBoss() {
  if (boss.active) return;
  const isMini = (activeSubstage === 5);
  const isApex = (activeSubstage === 10);
  if (!isMini && !isApex) return;

  const bossSpec = (typeof resolveStageBossData === 'function')
    ? resolveStageBossData(activeCountryData, activeCountryStageId, isApex)
    : { name: '深海領土霸主', visual: 'leviathan', hpMult: 1.0, speed: 0.9, bulletPattern: 'ring', bulletColor: '#f43f5e' };

  boss.active = true;
  boss.isApex = isApex;
  boss.x = canvas.width / 2;
  boss.y = -60;
  boss.visual = bossSpec.visual;
  boss.bulletPattern = bossSpec.bulletPattern || 'ring';
  boss.bulletColor = bossSpec.bulletColor || '#f43f5e';

  // 隨國家編號 (1~100) 指數成長的 BOSS 血量曲線
  const cId = activeCountryStageId;
  const stageScaling = Math.max(0, cId - 1) * 95 + Math.pow(Math.max(0, cId - 15), 1.5) * 18;
  const baseHp = (isApex ? 950 : 420) * (bossSpec.hpMult || 1.0);
  boss.hp = Math.round(baseHp + stageScaling);
  boss.maxHp = boss.hp;
  boss.radius = isApex ? 40 : 30;
  boss.baseSpeed = (bossSpec.speed || (isApex ? 1.0 : 0.75)) * Math.min(1.5, 1 + cId * 0.004);
  boss.speed = boss.baseSpeed;
  boss.ringAttackInterval = Math.max(55, (isApex ? 95 : 135) - Math.floor(cId * 0.35));

  alarmText.innerText = isApex
    ? `⚠️ 警告：傳說巨獸【${bossSpec.name}】降臨 ⚠️`
    : `⚠️ 警告：深淵海怪【${bossSpec.name}】現身 ⚠️`;
  document.getElementById('boss-name').innerText = `【${bossSpec.name}】`;

  bossAlarmOverlay.style.display = 'flex';
  bossBarContainer.style.display = 'block';
  updateKillsDisplay();
  playTone(isApex ? 130 : 185, 'sawtooth', 0.65, 0.22);

  setTimeout(() => { bossAlarmOverlay.style.display = 'none'; }, 2300);
}

function fireBossRingBarrage() {
  const cId = activeCountryStageId;
  const extraBullets = Math.floor(cId / 25);
  const bulletCount = (boss.isApex ? 12 : 8) + extraBullets;
  const baseSpeed = (boss.isApex ? 2.6 : 2.0) + Math.min(1.3, cId * 0.012);
  const dmgScale = 1 + (cId - 1) * 0.025;
  const shotDmg = Math.round((boss.isApex ? 14 : 8) * dmgScale);

  if (boss.bulletPattern === 'spiral') {
    for (let i = 0; i < bulletCount; i++) {
      const angle = (Math.PI * 2 / bulletCount) * i + (boss.pulse * 1.4);
      bossBullets.push({
        x: boss.x, y: boss.y,
        vx: Math.cos(angle) * (baseSpeed * 1.1),
        vy: Math.sin(angle) * (baseSpeed * 1.1),
        radius: boss.isApex ? 6 : 4.5,
        damage: shotDmg,
        isApex: boss.isApex,
        color: boss.bulletColor
      });
    }
  } else if (boss.bulletPattern === 'sonar_wave') {
    const aimAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
    const fanCount = (boss.isApex ? 7 : 5) + Math.floor(cId / 35);
    for (let i = 0; i < fanCount; i++) {
      const offset = (i - (fanCount - 1) / 2) * 0.20;
      const angle = aimAngle + offset;
      bossBullets.push({
        x: boss.x, y: boss.y,
        vx: Math.cos(angle) * (baseSpeed * 1.25),
        vy: Math.sin(angle) * (baseSpeed * 1.25),
        radius: boss.isApex ? 6.5 : 5,
        damage: Math.round(shotDmg * 1.1),
        isApex: boss.isApex,
        color: boss.bulletColor
      });
    }
  } else {
    for (let i = 0; i < bulletCount; i++) {
      const angle = (Math.PI * 2 / bulletCount) * i + (boss.pulse * 0.5);
      bossBullets.push({
        x: boss.x, y: boss.y,
        vx: Math.cos(angle) * baseSpeed,
        vy: Math.sin(angle) * baseSpeed,
        radius: boss.isApex ? 6 : 4.5,
        damage: shotDmg,
        isApex: boss.isApex,
        color: boss.bulletColor
      });
    }
  }
  playTone(boss.isApex ? 175 : 235, 'square', 0.2, 0.1);
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

  const baseGold = 60 + (cId - 1) * 28 + activeSubstage * 10;
  const goldBonusMult = 1 + (affixStats.a_gold_gain || 0);
  const earnedGold = Math.round(baseGold * goldBonusMult);

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
  const hpPctMult = 1 + (affixStats.a_hp_pct || 0);
  const unscaledHp = Math.round(player.maxHp / hpPctMult);
  userSave.playerMaxHp = Math.max(100, unscaledHp - totalGearHp);
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

  const extraGems = affixStats.a_bomb_power || 0;
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    gems.push({ x: e.x, y: e.y, radius: 4, magnetPull: true });
    for (let k = 0; k < extraGems; k++) {
      gems.push({ x: e.x + (Math.random() - 0.5) * 14, y: e.y + (Math.random() - 0.5) * 14, radius: 4, magnetPull: true });
    }
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
  const shieldStr = player.shield > 0 ? ` (+${Math.ceil(player.shield)}盾)` : '';
  txtHpVal.innerText = `${Math.max(0, Math.floor(player.hp))}${shieldStr} / ${player.maxHp}`;
  hpBar.style.width = `${Math.max(0, (player.hp / player.maxHp) * 100)}%`;
}

function healPlayer(rawAmount) {
  if (rawAmount <= 0 || player.hp >= player.maxHp) return;
  const boost = 1 + (affixStats.a_heal_boost || 0);
  player.hp = Math.min(player.maxHp, player.hp + Math.max(1, Math.round(rawAmount * boost)));
  updateHUD();
}

/* ==================== 隨國家進度 (1~100) 階梯難度成長的生態生怪引擎 ==================== */
function spawnContinentEnemy() {
  const normSubstage = (activeSubstage > 5) ? (activeSubstage - 5) : activeSubstage;
  const isHpDoubled = (activeSubstage > 5);
  const cId = activeCountryStageId;

  const tierBonusCap = Math.floor(cId / 8);
  const maxCap = (cId === 1 ? 4 : 7) + normSubstage * 2 + tierBonusCap;
  if (enemies.length >= maxCap) return;

  const edge = Math.floor(Math.random() * 4);
  let x, y;
  if (edge === 0) { x = Math.random() * canvas.width; y = 16; }
  else if (edge === 1) { x = canvas.width - 16; y = Math.random() * canvas.height; }
  else if (edge === 2) { x = Math.random() * canvas.width; y = canvas.height - 16; }
  else { x = 16; y = Math.random() * canvas.height; }

  const cont = activeCountryData ? activeCountryData.continent : 'EU';
  const spec = (typeof pickStageEnemySpec === 'function')
    ? pickStageEnemySpec(cont, cId)
    : { kind: 'ice_jelly', radius: 10, speedMult: 1.0, hpMult: 1.0, dmgMult: 1.0, aiType: 'chase', attackType: 'melee' };

  const progressFactor = 1 + (cId - 1) * 0.085 + Math.pow(Math.max(0, cId - 20), 1.35) * 0.025;
  const speedScaling = Math.min(1.75, 1 + (cId - 1) * 0.006);

  const baseSpeed = (cId === 1 ? 0.95 : 1.25) * (spec.speedMult || 1.0) * speedScaling;
  let baseHp = (cId === 1 ? (14 + normSubstage * 3) : (26 * progressFactor + normSubstage * 6)) * (spec.hpMult || 1.0);
  if (isHpDoubled) baseHp *= 1.85;
  const finalHp = Math.round(baseHp);

  const contactDmg = ((cId === 1 ? 0.14 : 0.32) * (1 + (cId - 1) * 0.022)) * (spec.dmgMult || 1.0);

  enemies.push({
    x, y,
    vx: 0, vy: 0,
    baseSpeed: baseSpeed,
    kind: spec.kind,
    color: spec.color || '#6366f1',
    radius: spec.radius || 10,
    hp: finalHp,
    maxHp: finalHp,
    contactDmg: contactDmg,
    aiType: spec.aiType || 'chase',
    attackType: spec.attackType || 'melee',
    bulletColor: spec.bulletColor || '#fb7185',
    pulse: Math.random() * 10,
    aiTimer: Math.floor(Math.random() * 90),
    attackTimer: Math.floor(Math.random() * 120),
    dashState: 0,
    dashVx: 0, dashVy: 0,
    burnTimer: 0,
    burnDmg: 0,
    frostBroken: false
  });
}

/* ==================== 遠程自動射擊 (實裝 10 種武器純攻擊詞條) ==================== */
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

  const baseAngle = Math.atan2(target.y - player.y, target.x - player.x);
  const w = player.weapon || { damage: 30, speed: 10, type: 'bow' };
  let totalDamage = w.damage + getEffectiveBonusDamage();

  let isCrit = false;
  if (activeAffixes.w_crit && Math.random() < 0.18) {
    const critMult = 2.0 + (affixStats.w_crit_dmg || 0);
    totalDamage = Math.round(totalDamage * critMult);
    isCrit = true;
  }

  const pierceCount = activeAffixes.w_pierce ? 1 : 0;

  bullets.push({
    x: player.x, y: player.y,
    vx: Math.cos(baseAngle) * w.speed, vy: Math.sin(baseAngle) * w.speed,
    radius: isCrit ? 6 : (w.type === 'staff' ? 6 : 4),
    damage: totalDamage,
    type: w.type,
    isCrit: isCrit,
    pierceLeft: pierceCount,
    hitIds: []
  });

  if (activeAffixes.w_multishot && Math.random() < 0.28) {
    const spreadAngle = baseAngle + (Math.random() < 0.5 ? 0.16 : -0.16);
    bullets.push({
      x: player.x, y: player.y,
      vx: Math.cos(spreadAngle) * w.speed, vy: Math.sin(spreadAngle) * w.speed,
      radius: 4,
      damage: Math.round(totalDamage * 0.75),
      type: w.type,
      isCrit: isCrit,
      pierceLeft: pierceCount,
      hitIds: []
    });
  }

  if (isCrit) playTone(980, 'square', 0.12, 0.1);
  else if (w.type === 'staff') playTone(650, 'sine', 0.16);
  else playTone(850, 'triangle', 0.08);
}

/* ==================== 玩家受擊與 30 種防具防禦/反擊詞條判定 ==================== */
function applyDamageToPlayer(rawDmg, isBossOrProjectile = false) {
  if (player.dashInvulTimer > 0) return false;

  if (affixStats.a_dodge && Math.random() < affixStats.a_dodge) {
    return false;
  }

  let finalDmg = rawDmg * (1 - (player.gearDmgReduce || 0));
  if (affixStats.a_armor) finalDmg *= (1 - affixStats.a_armor);
  if (isBossOrProjectile && affixStats.a_boss_def) finalDmg *= (1 - affixStats.a_boss_def);
  if (affixStats.a_low_hp_def && (player.hp / player.maxHp) < 0.40) {
    finalDmg *= (1 - affixStats.a_low_hp_def);
  }

  if (affixStats.a_flat_block && rawDmg >= 1) {
    finalDmg = Math.max(1, finalDmg - affixStats.a_flat_block);
  }

  if (affixStats.a_thorns && rawDmg >= 0.3) {
    const thornsDmg = affixStats.a_thorns;
    for (const e of enemies) {
      if (Math.hypot(e.x - player.x, e.y - player.y) < 115) {
        e.hp -= thornsDmg;
      }
    }
  }

  if (player.shield > 0) {
    if (player.shield >= finalDmg) {
      player.shield -= finalDmg;
      updateHUD();
      return false;
    } else {
      finalDmg -= player.shield;
      player.shield = 0;
    }
  }

  player.hp -= finalDmg;
  updateHUD();
  if (player.hp <= 0) {
    triggerPlayerDefeat();
    return true;
  }
  return false;
}

function handleEnemyKilled(e) {
  gems.push({ x: e.x, y: e.y, radius: 4 });

  // 特殊攻擊型態【自爆衝擊 bomber】
  if (e.attackType === 'bomber') {
    artifactEffects.push({
      type: 'nova', x: e.x, y: e.y, timer: 16, maxDuration: 16,
      particles: [{ x: e.x, y: e.y, angle: 0, speed: 0, size: 6 }]
    });
    if (!player.isDashing && Math.hypot(player.x - e.x, player.y - e.y) < 65 + player.radius) {
      applyDamageToPlayer(8 + Math.floor(activeCountryStageId * 0.25), true);
    }
  }

  // 特殊攻擊型態【分裂增殖 splitter】
  if (e.attackType === 'splitter' && typeof SEA_MONSTER_SPECIES !== 'undefined') {
    const mini = SEA_MONSTER_SPECIES.mini_slime;
    for (let s = 0; s < 2; s++) {
      const offsetAngle = Math.random() * Math.PI * 2;
      const miniHp = Math.max(10, Math.round(e.maxHp * 0.28));
      enemies.push({
        x: e.x + Math.cos(offsetAngle) * 14,
        y: e.y + Math.sin(offsetAngle) * 14,
        vx: 0, vy: 0,
        baseSpeed: e.baseSpeed * 1.65,
        kind: mini.kind,
        color: mini.color,
        radius: mini.radius,
        hp: miniHp,
        maxHp: miniHp,
        contactDmg: e.contactDmg * 0.65,
        aiType: 'zigzag',
        attackType: 'melee',
        pulse: Math.random() * 10,
        aiTimer: 0,
        attackTimer: 0,
        burnTimer: 0, burnDmg: 0, frostBroken: false
      });
    }
  }

  if (affixStats.a_vamp && Math.random() < affixStats.a_vamp) {
    healPlayer(8);
  }

  if (affixStats.a_kill_spd) {
    player.killSpeedTimer = 120;
  }

  const luckBonus = affixStats.a_drop_luck || 0;
  const dropRand = Math.random();
  if (dropRand < (0.05 + luckBonus)) battlePickups.push({ x: e.x, y: e.y, type: 'magnet' });
  else if (dropRand < (0.09 + luckBonus * 1.5)) battlePickups.push({ x: e.x, y: e.y, type: 'bomb' });

  kills++;
  updateKillsDisplay();

  const killThreshold = getKillThreshold();
  if (activeSubstage !== 5 && activeSubstage !== 10) {
    if (kills >= killThreshold) completeSubstage();
  } else {
    if (kills >= killThreshold && !boss.active && !chest.active) checkAndSpawnStageBoss();
  }
}

function updateGame() {
  if (isPaused) return;
  globalTime += 0.04;
  frameCounter++;

  if (player.dashInvulTimer > 0) player.dashInvulTimer--;
  if (player.killSpeedTimer > 0) player.killSpeedTimer--;

  if (affixStats.a_regen && frameCounter % 180 === 0 && player.hp < player.maxHp) {
    healPlayer(player.maxHp * affixStats.a_regen);
  }

  if (affixStats.a_aura_shock && frameCounter % 60 === 0) {
    const auraDmg = affixStats.a_aura_shock;
    for (const e of enemies) {
      if (Math.hypot(e.x - player.x, e.y - player.y) < 95) e.hp -= auraDmg;
    }
    if (boss.active && Math.hypot(boss.x - player.x, boss.y - player.y) < 95 + boss.radius) {
      boss.hp -= auraDmg;
    }
  }

  if (affixStats.a_auto_missile && frameCounter % 180 === 0) {
    const count = affixStats.a_auto_missile;
    const missileDmg = 35 + Math.round(getEffectiveBonusDamage() * 0.6);
    for (let m = 0; m < count; m++) {
      const target = boss.active ? boss : (enemies[m % Math.max(1, enemies.length)]);
      if (target) {
        const ang = Math.atan2(target.y - player.y, target.x - player.x) + (m - (count - 1) / 2) * 0.15;
        bullets.push({
          x: player.x, y: player.y,
          vx: Math.cos(ang) * 8.5, vy: Math.sin(ang) * 8.5,
          radius: 5, damage: missileDmg, type: 'staff', isCrit: true, pierceLeft: 0, hitIds: []
        });
      }
    }
  }

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

  const effectiveSpeed = player.speed * (player.killSpeedTimer > 0 ? (1 + (affixStats.a_kill_spd || 0)) : 1.0);
  let nextPx = player.x;
  let nextPy = player.y;

  if (player.isDashing) {
    player.dashTimer--;
    player.vx = player.dashDirX * effectiveSpeed * player.dashSpeedMulti;
    player.vy = player.dashDirY * effectiveSpeed * player.dashSpeedMulti;
    dashGhosts.push({ x: player.x, y: player.y, facing: player.facing, alpha: 1.0 });
    if (player.dashTimer <= 0) player.isDashing = false;
  } else {
    player.isMoving = (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05);
    if (player.isMoving) {
      player.animTimer += 0.08;
      if (Math.abs(dx) > 0.05) player.facing = dx > 0 ? 1 : -1;
    }
    player.vx = dx * effectiveSpeed;
    player.vy = dy * effectiveSpeed;
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

  // 護符伴生靈獸行為 (海鷗/靈龜/虎鯊/應龍)
  if (player.equipment && player.equipment.talisman) {
    pet.active = true;
    pet.targetX = player.x - (player.facing * 24);
    pet.targetY = player.y - 20 + Math.sin(globalTime * 3) * 6;
    pet.x += (pet.targetX - pet.x) * 0.12;
    pet.y += (pet.targetY - pet.y) * 0.12;
    pet.timer++;

    const mode = pet.mode || 'atk';
    const atkCd = (mode === 'omni') ? 28 : (mode === 'hunt' ? 35 : 48);
    if ((mode === 'atk' || mode === 'hunt' || mode === 'omni') && pet.timer % atkCd === 0) {
      const target = boss.active ? boss : enemies[0];
      if (target) {
        const ang = Math.atan2(target.y - pet.y, target.x - pet.x);
        bullets.push({
          x: pet.x, y: pet.y,
          vx: Math.cos(ang) * 9, vy: Math.sin(ang) * 9,
          radius: mode === 'omni' ? 5 : 3.5,
          damage: Math.floor((28 + getEffectiveBonusDamage() * 0.45) * pet.power),
          type: mode === 'omni' ? 'staff' : 'bow',
          isCrit: (mode === 'omni'),
          pierceLeft: 0,
          hitIds: []
        });
        playTone(mode === 'omni' ? 1250 : 1080, 'sine', 0.05, 0.03);
      }
    }

    if ((mode === 'heal' || mode === 'omni') && pet.timer % 180 === 0) {
      if (player.hp < player.maxHp) {
        healPlayer(22 * pet.power);
        playTone(620, 'sine', 0.22, 0.07);
      }
    }

    if ((mode === 'hunt' || mode === 'omni') && pet.timer % 220 === 0) {
      const range = 160 * Math.min(1.5, pet.power);
      for (const e of enemies) {
        if (Math.hypot(e.x - pet.x, e.y - pet.y) < range) {
          const ang = Math.atan2(pet.y - e.y, pet.x - e.x);
          const dir = (mode === 'omni') ? 1 : -1;
          e.x += Math.cos(ang) * 42 * dir;
          e.y += Math.sin(ang) * 42 * dir;
        }
      }
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

  // 子彈碰撞與 10 種武器攻擊詞條觸發
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
      let bossDmg = b.damage;
      if (activeAffixes.w_giant_slay) bossDmg = Math.round(bossDmg * 1.25);
      if (activeAffixes.w_execute && boss.hp < boss.maxHp * 0.35) bossDmg = Math.round(bossDmg * 1.6);
      if (activeAffixes.w_frost_atk) {
        bossDmg = Math.round(bossDmg * 1.15);
        boss.speed = (boss.baseSpeed || 0.9) * 0.75;
      }

      boss.hp -= bossDmg;
      bullets.splice(i, 1);
      playTone(180, 'sawtooth', 0.04);

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
      if (b.hitIds && b.hitIds.includes(e)) continue;

      if (Math.hypot(b.x - e.x, b.y - e.y) < b.radius + e.radius) {
        let hitDmg = b.damage;

        if (activeAffixes.w_execute && e.hp < (e.maxHp || 30) * 0.35) {
          hitDmg = Math.round(hitDmg * 1.6);
        }
        if (activeAffixes.w_frost_atk) {
          hitDmg = Math.round(hitDmg * 1.15);
          if (!e.frostBroken) {
            e.baseSpeed *= 0.6;
            e.frostBroken = true;
          }
        }

        e.hp -= hitDmg;

        if (activeAffixes.w_ignite) {
          e.burnTimer = 180;
          e.burnDmg = Math.max(3, Math.round(hitDmg * 0.14));
        }

        if (activeAffixes.w_blast && Math.random() < 0.20) {
          const blastDmg = Math.round(hitDmg * 0.45);
          for (const other of enemies) {
            if (other !== e && Math.hypot(other.x - e.x, other.y - e.y) < 75) other.hp -= blastDmg;
          }
        }

        if (activeAffixes.w_chain && Math.random() < 0.25) {
          const chainDmg = Math.max(15, Math.round(hitDmg * 0.35));
          for (const other of enemies) {
            if (other !== e && Math.hypot(other.x - e.x, other.y - e.y) < 100) other.hp -= chainDmg;
          }
          playTone(900, 'sine', 0.05, 0.03);
        }

        if (b.pierceLeft > 0) {
          b.pierceLeft--;
          b.hitIds.push(e);
        } else {
          bullets.splice(i, 1);
        }

        playTone(220, 'sawtooth', 0.04);

        if (e.hp <= 0) {
          enemies.splice(j, 1);
          handleEnemyKilled(e);
        }
        break;
      }
    }
  }

  // Boss 行為與彈幕
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
        if (applyDamageToPlayer(boss.isApex ? 0.6 : 0.35, true)) return;
      }
    }
  }

  // 敵軍遠程彈幕（包含 BOSS 與遠程海嗣射出的子彈）
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
      if (applyDamageToPlayer(bb.damage, true)) return;
    }
  }

  // 刷怪頻率隨國家編號與哨站遞增
  spawnTimer++;
  const normSubstage = (activeSubstage > 5) ? (activeSubstage - 5) : activeSubstage;
  const countrySpeedup = Math.min(20, Math.floor(activeCountryStageId / 5));
  const currentInterval = Math.max(18, 72 - (normSubstage * 7) - countrySpeedup);
  if (spawnTimer >= currentInterval) {
    spawnContinentEnemy();
    spawnTimer = 0;
  }

  // 30 種生態海嗣 5 種 AI 行進與攻擊更新
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];

    if (e.burnTimer > 0) {
      e.burnTimer--;
      if (e.burnTimer % 30 === 0) e.hp -= e.burnDmg;
    }

    if (e.hp <= 0) {
      enemies.splice(i, 1);
      handleEnemyKilled(e);
      continue;
    }

    e.pulse += 0.08;
    e.aiTimer = (e.aiTimer || 0) + 1;
    e.attackTimer = (e.attackTimer || 0) + 1;

    const toPlayerAng = Math.atan2(player.y - e.y, player.x - e.x);
    const distToPlayer = Math.hypot(player.x - e.x, player.y - e.y);
    const spd = e.baseSpeed || 1.2;

    if (e.aiType === 'zigzag') {
      const sway = Math.sin(e.aiTimer * 0.12) * 1.15;
      e.vx = Math.cos(toPlayerAng + sway) * spd;
      e.vy = Math.sin(toPlayerAng + sway) * spd;
    } else if (e.aiType === 'orbiter') {
      const orbitOffset = (distToPlayer > 165) ? 0.35 : 1.35;
      e.vx = Math.cos(toPlayerAng + orbitOffset) * spd;
      e.vy = Math.sin(toPlayerAng + orbitOffset) * spd;
    } else if (e.aiType === 'sniper') {
      if (distToPlayer > 220) {
        e.vx = Math.cos(toPlayerAng) * spd;
        e.vy = Math.sin(toPlayerAng) * spd;
      } else {
        e.vx = Math.cos(toPlayerAng + Math.PI / 2) * (spd * 0.35);
        e.vy = Math.sin(toPlayerAng + Math.PI / 2) * (spd * 0.35);
      }
    } else if (e.aiType === 'dasher') {
      if (e.dashState === 0) {
        e.vx = Math.cos(toPlayerAng) * spd;
        e.vy = Math.sin(toPlayerAng) * spd;
        if (distToPlayer < 210 && e.aiTimer > 70) {
          e.dashState = 1;
          e.aiTimer = 0;
        }
      } else if (e.dashState === 1) {
        e.vx = 0; e.vy = 0;
        if (e.aiTimer >= 32) {
          e.dashState = 2;
          e.aiTimer = 0;
          e.dashVx = Math.cos(toPlayerAng) * (spd * 3.1);
          e.dashVy = Math.sin(toPlayerAng) * (spd * 3.1);
        }
      } else {
        e.vx = e.dashVx;
        e.vy = e.dashVy;
        if (e.aiTimer >= 24) {
          e.dashState = 0;
          e.aiTimer = 0;
        }
      }
    } else {
      e.vx = Math.cos(toPlayerAng) * spd;
      e.vy = Math.sin(toPlayerAng) * spd;
    }

    if (e.attackType === 'ranged' && e.attackTimer >= 165) {
      e.attackTimer = 0;
      const projSpeed = 2.2 + Math.min(1.4, activeCountryStageId * 0.015);
      const projDmg = 6 + Math.floor(activeCountryStageId * 0.18);
      bossBullets.push({
        x: e.x, y: e.y,
        vx: Math.cos(toPlayerAng) * projSpeed,
        vy: Math.sin(toPlayerAng) * projSpeed,
        radius: 4,
        damage: projDmg,
        isApex: false,
        color: e.bulletColor || '#c084fc'
      });
    }

    e.x += e.vx;
    e.y += e.vy;

    e.x = Math.max(e.radius, Math.min(canvas.width - e.radius, e.x));
    e.y = Math.max(e.radius, Math.min(canvas.height - e.radius, e.y));

    for (const obs of stageObstacles) {
      const halfW = obs.width / 2 + e.radius;
      const halfH = obs.height / 2 + e.radius;
      if (Math.abs(e.x - obs.x) < halfW && Math.abs(e.y - obs.y) < halfH) {
        const overlapX = halfW - Math.abs(e.x - obs.x);
        const overlapY = halfH - Math.abs(e.y - obs.y);
        if (overlapX < overlapY) {
          e.x += (e.x > obs.x ? overlapX : -overlapX);
        } else {
          e.y += (e.y > obs.y ? overlapY : -overlapY);
        }
      }
    }

    if (!player.isDashing && Math.hypot(player.x - e.x, player.y - e.y) < player.radius + e.radius) {
      if (applyDamageToPlayer(e.contactDmg || 0.25, false)) return;
    }
  }

  const magnetRange = 75 + (affixStats.a_magnet || 0);
  for (let i = gems.length - 1; i >= 0; i--) {
    const g = gems[i];
    const dist = Math.hypot(player.x - g.x, player.y - g.y);

    if (g.magnetPull || dist < magnetRange) {
      const pullSpeed = g.magnetPull ? 14 : 6.5;
      const angle = Math.atan2(player.y - g.y, player.x - g.x);
      g.x += Math.cos(angle) * pullSpeed;
      g.y += Math.sin(angle) * pullSpeed;
    }

    if (dist < player.radius + g.radius + 4) {
      gems.splice(i, 1);

      if (affixStats.a_orb_heal) {
        healPlayer(affixStats.a_orb_heal);
      }

      const expGain = 1 + (affixStats.a_exp_gain || 0);
      player.exp = parseFloat((player.exp + expGain).toFixed(2));
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

  if (affixStats.a_level_heal) {
    healPlayer(player.maxHp * affixStats.a_level_heal);
  }

  const curWep = player.weapon ? player.weapon.damage : 30;
  const curAtk = curWep + getEffectiveBonusDamage();
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
