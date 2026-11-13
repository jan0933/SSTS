/**
 * SSTS - 戰鬥引擎、70件全裝備屬性實裝、四品階(白/藍/黃/橘)多詞條、雙手多點觸控與百國地標 (game.js)
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
  resizeBattleCanvas();
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

/* ==================== 戰鬥引擎與狀態 ==================== */
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

/* ==================== 動態匹配螢幕長寬比（全螢幕無黑邊、角色不變形、不超框） ==================== */
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

/* ==================== 100 國專屬特色建築地標對應表 (按國土面積由小到大 1~100 完整覆蓋) ==================== */
const COUNTRY_LANDMARK_MAP = {
  // 1~10：微型聖城、城邦與珊瑚礁島國
  1:  ['vatican_dome', 'roman_pillar'],          // 梵蒂岡：聖彼得大教堂圓頂
  2:  ['casino_palace', 'roman_pillar'],         // 摩納哥：蒙地卡羅皇宮
  3:  ['coral_totem', 'maldives_bungalow'],      // 諾魯：磷礦巨岩與海島柱
  4:  ['maldives_bungalow', 'coral_totem'],      // 吐瓦魯：環礁高腳茅屋
  5:  ['eu_castle', 'roman_pillar'],             // 聖馬利諾：瓜伊塔三塔堡壘
  6:  ['eu_castle', 'viking_hall'],              // 列支敦斯登：瓦杜茲阿爾卑斯古堡
  7:  ['coral_totem', 'maldives_bungalow'],      // 馬紹爾群島：比基尼環礁圖騰
  8:  ['us_liberty', 'coral_totem'],             // 聖克里斯多福及尼維斯：硫磺山要塞
  9:  ['maldives_bungalow', 'islamic_mosque'],   // 馬爾地夫：水上茅屋與珊瑚清真寺
  10: ['eu_castle', 'roman_pillar'],             // 馬爾他：騎士團海岸要塞

  // 11~20：加勒比海島嶼、太平洋群島與東南亞都市國家
  11: ['coral_totem', 'maldives_bungalow'],      // 格瑞那達：香料海岸燈塔
  12: ['coral_totem', 'mayan_temple'],           // 聖文森及格瑞那丁：火山岩圖騰
  13: ['roman_pillar', 'coral_totem'],           // 巴貝多：布里奇敦議會柱廊
  14: ['coral_totem', 'maldives_bungalow'],      // 安地卡及巴布達：英國港船塢
  15: ['maldives_bungalow', 'coral_totem'],      // 塞席爾：花崗岩海灘涼亭
  16: ['coral_totem', 'jp_torii'],               // 帛琉：洛克群島石柱與鳥居
  17: ['eu_castle', 'roman_pillar'],             // 安道爾：庇里牛斯山石砌教堂
  18: ['coral_totem', 'maldives_bungalow'],      // 聖露西亞：雙子皮通火山峰
  19: ['coral_totem', 'maldives_bungalow'],      // 密克羅尼西亞：南馬都爾玄武岩遺蹟
  20: ['singapore_mbs', 'merlion_statue'],       // 新加坡：濱海灣金沙空中花園、魚尾獅

  // 21~30：太平洋王國、波斯灣珍珠與台灣
  21: ['coral_totem', 'maldives_bungalow'],      // 東加：哈阿蒙加巨石三石塔
  22: ['coral_totem', 'mayan_temple'],           // 多米尼克：熱帶雨林石祭壇
  23: ['islamic_mosque', 'skyscraper_twin'],     // 巴林：世界貿易中心雙帆塔
  24: ['coral_totem', 'maldives_bungalow'],      // 吉里巴斯：赤道環礁觀測站
  25: ['obelisk_monument', 'coral_totem'],       // 聖多美普林西比：大犬座火山尖峰
  26: ['coral_totem', 'maldives_bungalow'],      // 薩摩亞：法萊傳統圓頂屋
  27: ['eu_castle', 'viking_hall'],              // 盧森堡：博克砲台古堡
  28: ['islamic_mosque', 'coral_totem'],         // 模里西斯：路易港海濱砲台
  29: ['islamic_mosque', 'obelisk_monument'],    // 葛摩：莫洛尼火山清真寺
  30: ['taipei_101', 'pagoda_temple'],           // 台灣：台北101大樓、飛簷廟宇

  // 31~40：高加索古國、海灣富國與低地國
  31: ['islamic_mosque', 'pagoda_temple'],       // 汶萊：奧馬爾阿里賽義夫丁金頂清真寺
  32: ['us_liberty', 'skyscraper_twin'],         // 千里達及托巴哥：西班牙港雙塔
  33: ['coral_totem', 'obelisk_monument'],       // 維德角：福戈火山燈塔
  34: ['coral_totem', 'maldives_bungalow'],      // 萬那杜：納戈爾木雕圖騰柱
  35: ['islamic_mosque', 'skyscraper_twin'],     // 卡達：杜哈伊斯蘭藝術博物館與帆塔
  36: ['mayan_temple', 'obelisk_monument'],      // 牙買加：藍山石砌莊園
  37: ['obelisk_monument', 'islamic_mosque'],    // 甘比亞：班竹凱旋門
  38: ['roman_pillar', 'islamic_mosque'],        // 黎巴嫩：巴勒貝克太陽神殿巨柱
  39: ['roman_pillar', 'eu_castle'],             // 賽普勒斯：帕福斯古希臘柱廊
  40: ['eu_castle', 'viking_hall'],              // 荷蘭：風車磨坊與運河山牆屋

  // 41~50：歐陸精華、東北亞與聖地
  41: ['eu_castle', 'roman_pillar'],             // 瑞士：西庸城堡與阿爾卑斯鐘樓
  42: ['viking_hall', 'eu_castle'],              // 丹麥：新港彩色山牆與維京長屋
  43: ['pagoda_temple', 'th_stupa'],             // 不丹：虎穴寺懸崖佛塔
  44: ['roman_pillar', 'islamic_mosque'],        // 以色列：耶路撒冷圓頂聖殿與古城牆
  45: ['mayan_temple', 'skyscraper_twin'],       // 薩爾瓦多：聖安娜火山神殿
  46: ['islamic_mosque', 'skyscraper_twin'],     // 科威特：科威特球形水塔
  47: ['coral_totem', 'maldives_bungalow'],      // 斐濟：蘇瓦傳統草頂議事廳
  48: ['eu_castle', 'roman_pillar'],             // 斯洛維尼亞：布萊德湖心教堂
  49: ['eu_castle', 'viking_hall'],              // 比利時：布魯塞爾大廣場市政廳尖塔
  50: ['kor_palace', 'pagoda_temple'],           // 韓國：景福宮殿樓、南山首爾塔

  // 51~60：中歐、波羅的海與中美洲
  51: ['islamic_mosque', 'skyscraper_twin'],     // 阿拉伯聯合大公國：哈里發塔與謝赫扎耶德清真寺
  52: ['eu_castle', 'roman_pillar'],             // 奧地利：美泉宮與聖史蒂芬尖塔
  53: ['eu_castle', 'ru_kremlin'],               // 捷克：布拉格查理大橋塔樓
  54: ['mayan_temple', 'skyscraper_twin'],       // 巴拿馬：運河船閘控制塔
  55: ['viking_hall', 'polar_beacon'],           // 冰島：哈爾格林姆教堂
  56: ['eu_castle', 'roman_pillar'],             // 匈牙利：布達佩斯國會大廈圓頂
  57: ['eu_castle', 'roman_pillar'],             // 葡萄牙：貝倫塔航海堡壘
  58: ['roman_pillar', 'eu_castle'],             // 希臘：雅典帕德嫩神殿多立克柱
  59: ['pagoda_temple', 'kor_palace'],           // 北韓：主體思想塔與凱旋門
  60: ['mayan_temple', 'us_liberty'],            // 古巴：哈瓦那國會大廈圓頂

  // 61~70：東南亞古文明與西歐列強
  61: ['th_stupa', 'pagoda_temple'],             // 柬埔寨：吳哥窟蓮花五塔
  62: ['th_stupa', 'pagoda_temple'],             // 寮國：永珍塔鑾金塔
  63: ['uk_bigben', 'eu_castle'],                // 英國：倫敦大笨鐘鐘樓
  64: ['eu_castle', 'roman_pillar'],             // 羅馬尼亞：布朗吸血鬼古堡
  65: ['it_colosseum', 'vatican_dome'],          // 義大利：羅馬競技場、比薩斜塔
  66: ['au_opera', 'coral_totem'],               // 紐西蘭：奧克蘭天空塔與毛利圖騰
  67: ['eu_castle', 'viking_hall'],              // 波蘭：華沙文化科學宮
  68: ['jp_torii', 'jp_pagoda'],                 // 日本：嚴島海上鳥居、五重塔
  69: ['eu_castle', 'viking_hall'],              // 德國：新天鵝堡與布蘭登堡門
  70: ['viking_hall', 'polar_beacon'],           // 芬蘭：赫爾辛基白教堂與極光觀測塔

  // 71~80：東南亞群島、北歐與南亞
  71: ['pagoda_temple', 'th_stupa'],             // 越南：下龍灣古帆與順化皇城門
  72: ['skyscraper_twin', 'islamic_mosque'],     // 馬來西亞：吉隆坡雙子星塔
  73: ['viking_hall', 'polar_beacon'],           // 挪威：峽灣維京木板教堂
  74: ['viking_hall', 'eu_castle'],              // 瑞典：斯德哥爾摩市政廳紅磚塔
  75: ['ziggurat_step', 'islamic_mosque'],       // 伊拉克：巴比倫空中花園階梯神廟
  76: ['eu_castle', 'roman_pillar'],             // 西班牙：巴塞隆納聖家堂尖塔
  77: ['th_stupa', 'pagoda_temple'],             // 泰國：曼谷鄭王廟金頂佛塔
  78: ['fr_eiffel', 'eu_castle'],                // 法國：巴黎艾菲爾鐵塔、凱旋門
  79: ['obelisk_monument', 'tribal_totem'],      // 肯亞：蒙巴薩耶穌堡與草原圖騰
  80: ['ru_kremlin', 'eu_castle'],               // 烏克蘭：基輔聖索菲亞金頂教堂

  // 81~90：中東古國、亞洲巨龍與非洲
  81: ['th_stupa', 'pagoda_temple'],             // 緬甸：仰光瑞光大金塔
  82: ['islamic_mosque', 'ziggurat_step'],       // 阿富汗：巴米揚石窟拱龕
  83: ['eg_pyramid', 'obelisk_monument'],        // 埃及：吉薩金字塔、方尖碑
  84: ['islamic_mosque', 'roman_pillar'],        // 土耳其：伊斯坦堡聖索菲亞清真寺尖塔
  85: ['br_christ', 'mayan_temple'],             // 智利：復活節島摩艾巨石像
  86: ['obelisk_monument', 'tribal_totem'],      // 尚比亞：維多利亞瀑布觀景石柱
  87: ['ziggurat_step', 'islamic_mosque'],       // 伊朗：波斯波利斯萬國門與清真寺
  88: ['pagoda_temple', 'ru_kremlin'],           // 蒙古：成吉思汗巨像與蒙古包
  89: ['pagoda_temple', 'th_stupa'],             // 印尼：婆羅浮屠佛塔與峇里島善惡門
  90: ['mayan_temple', 'skyscraper_twin'],       // 墨西哥：奇琴伊察瑪雅金字塔

  // 91~100：領土面積前十強超級大國
  91: ['islamic_mosque', 'skyscraper_twin'],     // 沙烏地阿拉伯：麥加皇家鐘塔與清真寺
  92: ['mayan_temple', 'br_christ'],             // 秘魯：馬丘比丘印加石殿
  93: ['obelisk_monument', 'tribal_totem'],      // 查德：提貝斯提沙漠石柱
  94: ['islamic_mosque', 'eg_pyramid'],          // 阿爾及利亞：阿爾及爾白色清真寺
  95: ['ziggurat_step', 'ru_kremlin'],           // 哈薩克：巴伊傑列克生命之樹塔
  96: ['in_tajmahal', 'pagoda_temple'],          // 印度：泰姬瑪哈陵
  97: ['au_opera', 'coral_totem'],               // 澳洲：雪梨歌劇院風帆
  98: ['br_christ', 'mayan_temple'],             // 巴西：里約救世基督像聖壇
  99: ['us_liberty', 'skyscraper_twin'],         // 美國：自由女神火炬台、雙子摩天樓
  100:['cn_greatwall', 'ru_kremlin']             // 中國 / 俄羅斯壓軸防線：萬里長城烽火台與克里姆林洋蔥頭教堂
};

// 依大洲分配的備援建築群
const CONTINENT_ARCH_POOL = {
  EU: ['eu_castle', 'uk_bigben', 'roman_pillar'],
  AS: ['pagoda_temple', 'jp_torii', 'th_stupa'],
  AM: ['skyscraper_twin', 'mayan_temple', 'us_liberty'],
  AF: ['eg_pyramid', 'obelisk_monument', 'islamic_mosque'],
  OC: ['au_opera', 'coral_totem', 'maldives_bungalow'],
  GL: ['polar_beacon', 'viking_hall', 'roman_pillar']
};

// 依據國家名稱關鍵字優先匹配地標（確保即使調整關卡順序也能對應正確國家建築）
function resolveCountryLandmarks(countryData, countryId) {
  const rawName = (countryData && countryData.name) ? countryData.name : '';
  const keywordRules = [
    { keys: ['梵蒂岡', 'Vatican'], arch: ['vatican_dome', 'roman_pillar'] },
    { keys: ['摩納哥', 'Monaco'], arch: ['casino_palace', 'roman_pillar'] },
    { keys: ['馬爾地夫', 'Maldives'], arch: ['maldives_bungalow', 'coral_totem'] },
    { keys: ['新加坡', 'Singapore'], arch: ['singapore_mbs', 'merlion_statue'] },
    { keys: ['台灣', 'Taiwan'], arch: ['taipei_101', 'pagoda_temple'] },
    { keys: ['韓國', 'Korea'], arch: ['kor_palace', 'pagoda_temple'] },
    { keys: ['英國', 'United Kingdom', 'UK'], arch: ['uk_bigben', 'eu_castle'] },
    { keys: ['日本', 'Japan'], arch: ['jp_torii', 'jp_pagoda'] },
    { keys: ['義大利', 'Italy'], arch: ['it_colosseum', 'vatican_dome'] },
    { keys: ['法國', 'France'], arch: ['fr_eiffel', 'eu_castle'] },
    { keys: ['泰國', 'Thailand', '柬埔寨', '緬甸'], arch: ['th_stupa', 'pagoda_temple'] },
    { keys: ['埃及', 'Egypt'], arch: ['eg_pyramid', 'obelisk_monument'] },
    { keys: ['印度', 'India'], arch: ['in_tajmahal', 'pagoda_temple'] },
    { keys: ['澳洲', 'Australia'], arch: ['au_opera', 'coral_totem'] },
    { keys: ['巴西', 'Brazil'], arch: ['br_christ', 'mayan_temple'] },
    { keys: ['美國', 'United States', 'USA'], arch: ['us_liberty', 'skyscraper_twin'] },
    { keys: ['中國', 'China'], arch: ['cn_greatwall', 'pagoda_temple'] },
    { keys: ['加拿大', 'Canada'], arch: ['ca_cntower', 'polar_beacon'] },
    { keys: ['俄羅斯', 'Russia'], arch: ['ru_kremlin', 'eu_castle'] },
    { keys: ['墨西哥', 'Mexico', '秘魯', 'Peru'], arch: ['mayan_temple', 'br_christ'] },
    { keys: ['沙烏地', 'Saudi', '阿聯', 'UAE', '土耳其', 'Turkey', '伊朗', 'Iran'], arch: ['islamic_mosque', 'ziggurat_step'] },
    { keys: ['希臘', 'Greece'], arch: ['roman_pillar', 'eu_castle'] },
    { keys: ['挪威', 'Norway', '瑞典', 'Sweden', '冰島', 'Iceland', '芬蘭', 'Finland'], arch: ['viking_hall', 'polar_beacon'] }
  ];

  for (const rule of keywordRules) {
    if (rule.keys.some(k => rawName.includes(k))) {
      return rule.arch;
    }
  }

  if (COUNTRY_LANDMARK_MAP[countryId]) {
    return COUNTRY_LANDMARK_MAP[countryId];
  }

  const cont = (countryData && countryData.continent) ? countryData.continent : 'EU';
  return CONTINENT_ARCH_POOL[cont] || CONTINENT_ARCH_POOL.EU;
}

function generateStageObstacles(continent, countryId = activeCountryStageId) {
  stageObstacles = [];
  const count = 3 + Math.floor(Math.random() * 2);
  const archPool = resolveCountryLandmarks(activeCountryData, countryId);

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

  if (activeAffixes.rush) {
    player.dashCooldown = 60;
  } else {
    player.dashCooldown = 90;
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

/* ==================== 主動操作 (法器 / 衝刺；射擊全自動) ==================== */
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

    const novaDmg = Math.floor((90 + player.baseBonusDamage) * skillMult);
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      if (Math.hypot(e.x - player.x, e.y - player.y) < 180) {
        e.hp -= novaDmg;
      }
    }
    if (boss.active && Math.hypot(boss.x - player.x, boss.y - player.y) < 180 + boss.radius) {
      boss.hp -= novaDmg;
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

    const freezeDmg = Math.floor((35 + player.baseBonusDamage) * skillMult);
    for (const e of enemies) {
      e.speed *= 0.4;
      e.hp -= freezeDmg;
    }
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

    const bhDmg = Math.floor((55 + player.baseBonusDamage * 0.6) * skillMult);
    for (const e of enemies) {
      e.x = canvas.width / 2 + (Math.random() - 0.5) * 40;
      e.y = canvas.height / 2 + (Math.random() - 0.5) * 40;
      e.hp -= bhDmg;
    }
    if (boss.active) {
      boss.hp -= bhDmg;
    }
  }
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
      triggerArtifactSkill();
    }, { passive: false });

    btnArtifact.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      triggerArtifactSkill();
    });
  }

  if (btnDash) {
    btnDash.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      triggerDash();
    }, { passive: false });

    btnDash.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      triggerDash();
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

canvas.addEventListener('touchstart', (e) => {
  if (isPaused || !gameRunning) return;
  if (e.cancelable) e.preventDefault();

  if (joystick.active) return;

  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];
    const pos = getTouchPosInCanvas(touch, canvas);

    if (pos.x < canvas.width * 0.55) {
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
      const pos = getTouchPosInCanvas(touch, canvas);

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

window.addEventListener('resize', () => {
  joystick.active = false;
  joystick.touchId = null;
  joyBase.style.display = 'none';
  resizeBattleCanvas();
});

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

/* ==================== 70 件全裝備庫寶箱三選一 (四品階：白/藍/黃/橘) ==================== */
function openChestSelection(isApex) {
  isPaused = true;
  chestModal.style.display = 'flex';
  chestOptionsContainer.innerHTML = '';

  let allowedTiers = ["common", "rare"];
  if (activeCountryStageId > 60) {
    allowedTiers = isApex ? ["elite", "legendary"] : ["rare", "elite", "legendary"];
  } else if (activeCountryStageId > 20) {
    allowedTiers = isApex ? ["rare", "elite"] : ["common", "rare", "elite"];
  } else {
    allowedTiers = isApex ? ["rare", "elite"] : ["common", "rare"];
  }

  const db = (typeof MASTER_EQUIPMENT_DB !== 'undefined') ? MASTER_EQUIPMENT_DB : [];
  const pool = db.filter(item => allowedTiers.includes(item.tier));
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const options = shuffled.slice(0, 3);

  const slotNames = {
    weapon: "遠程武器", helmet: "頭盔", armor: "胸部盔甲",
    gloves: "手套", boots: "鞋子", talisman: "護符", artifact: "戰術法器"
  };

  chestTitle.innerText = isApex ? "👑 擊破領土霸主 · 頂級戰利品自選" : "⚔️ 擊破先鋒 Boss · 戰術裝備自選";
  chestStageInfo.innerText = `藍裝附帶 1 詞條 · 黃裝附帶 2 詞條 · 橘裝附帶 3 詞條`;

  options.forEach(item => {
    const rolledAffixes = (typeof generateAffixesForTier === 'function') ? generateAffixesForTier(item.tier) : [];
    const affixPreviewHtml = rolledAffixes.length > 0
      ? rolledAffixes.map(a => `<div style="font-size:9.5px; color:#fde047; margin-top:2px;">${a.name} (${a.tag})</div>`).join('')
      : `<div style="font-size:9.5px; color:#64748b; margin-top:2px;">無附魔詞條</div>`;

    const card = document.createElement('div');
    card.className = 'chest-card';
    const tierMeta = TIER_META[item.tier || 'common'] || TIER_META.common;
    card.innerHTML = `
      <div class="chest-card-type" style="color: ${tierMeta.color}">
        [ ${tierMeta.name} · ${slotNames[item.slot] || '裝備'} ]
      </div>
      <div class="chest-card-name">${item.name}</div>
      <div class="chest-card-desc">${item.desc}</div>
      ${affixPreviewHtml}
      <div style="font-size: 10px; color: #eab308; margin-top: 6px;">★ 點擊獲取 ★</div>
    `;
    card.onclick = () => {
      const instanceItem = {
        ...item,
        id: `${item.id}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        affixes: rolledAffixes
      };
      claimChestItem(instanceItem);
    };
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
  updateKillsDisplay();
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

  // 全自動遠程射擊循環
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
          radius: 3.5,
          damage: Math.floor((30 + player.baseBonusDamage * 0.5) * pet.power),
          type: 'bow'
        });
        playTone(1100, 'sine', 0.06, 0.04);
      }
    } else if (pet.type === 'heal' && pet.timer >= 180) {
      pet.timer = 0;
      if (player.hp < player.maxHp) {
        const healAmount = Math.floor(20 * pet.power);
        player.hp = Math.min(player.maxHp, player.hp + healAmount);
        updateHUD();
        playTone(600, 'sine', 0.25, 0.08);
      }
    } else if (pet.type === 'pull' && pet.timer >= 240) {
      pet.timer = 0;
      const pullRange = 150 * Math.min(1.6, pet.power);
      for (const e of enemies) {
        const dist = Math.hypot(e.x - pet.x, e.y - pet.y);
        if (dist < pullRange) {
          const angle = Math.atan2(pet.y - e.y, pet.x - e.x);
          e.x += Math.cos(angle) * 45; e.y += Math.sin(angle) * 45;
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

  // 子彈碰撞
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
            if (other !== e && Math.hypot(other.x - e.x, other.y - e.y) < 95) {
              other.hp -= 20;
            }
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
            if (kills >= killThreshold && !boss.active && !chest.active) {
              checkAndSpawnStageBoss();
            }
          }
        }
        break;
      }
    }
  }

  // Boss 行為與血條同步
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
        const rawDmg = boss.isApex ? 0.6 : 0.35;
        if (applyDamageToPlayer(rawDmg)) return;
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
      const rawDmg = (activeCountryStageId === 1) ? 0.12 : 0.35;
      if (applyDamageToPlayer(rawDmg)) return;
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
