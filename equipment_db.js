/**
 * SSTS - 全遊戲 70 件裝備資料庫 (1~10階)、10種武器攻擊詞條、30種防具疊加詞條與靈獸進化設定 (equipment_db.js)
 * 四大品階：common (普通/白)、rare (稀有/藍·1詞條)、elite (菁英/黃·2詞條)、legendary (傳說/橘·3詞條)
 */

const MASTER_EQUIPMENT_DB = [
  // ==================== 1. 遠程武器 (weapon) - 10 階 ====================
  { id: "w_01", slot: "weapon", rank: 1,  name: "新兵製式獵弓", type: "bow", tier: "common", stars: 1, damage: 30, speed: 10, desc: "基礎電磁弦弓 (傷害 30)" },
  { id: "w_02", slot: "weapon", rank: 2,  name: "海防速射短弩", type: "bow", tier: "common", stars: 1, damage: 36, speed: 12, desc: "輕量化連發弩 (傷害 36)" },
  { id: "w_03", slot: "weapon", rank: 3,  name: "深海穿甲重弩", type: "bow", tier: "rare", stars: 1, damage: 48, speed: 11, desc: "高初速破甲箭 (傷害 48)" },
  { id: "w_04", slot: "weapon", rank: 4,  name: "星芒脈衝法杖", type: "staff", tier: "rare", stars: 1, damage: 55, speed: 8.5, desc: "凝聚海洋星能球 (傷害 55)" },
  { id: "w_05", slot: "weapon", rank: 5,  name: "雷鳴連發電磁弓", type: "bow", tier: "elite", stars: 1, damage: 75, speed: 13, desc: "高壓電弧箭矢 (傷害 75)" },
  { id: "w_06", slot: "weapon", rank: 6,  name: "寒霜極光魔導杖", type: "staff", tier: "elite", stars: 1, damage: 85, speed: 9.5, desc: "極寒結晶光彈 (傷害 85)" },
  { id: "w_07", slot: "weapon", rank: 7,  name: "虛空裂隙狙擊弩", type: "bow", tier: "elite", stars: 1, damage: 105, speed: 15, desc: "超視距貫穿光束 (傷害 105)" },
  { id: "w_08", slot: "weapon", rank: 8,  name: "深淵引力星辰杖", type: "staff", tier: "legendary", stars: 1, damage: 135, speed: 10, desc: "暗物質坍縮法球 (傷害 135)" },
  { id: "w_09", slot: "weapon", rank: 9,  name: "弒神逆鱗天罰弩", type: "bow", tier: "legendary", stars: 1, damage: 155, speed: 16, desc: "毀滅級電磁砲矢 (傷害 155)" },
  { id: "w_10", slot: "weapon", rank: 10, name: "超新星創世天災杖", type: "staff", tier: "legendary", stars: 1, damage: 175, speed: 11.5, desc: "恆星核爆衝擊球 (傷害 175)" },

  // ==================== 2. 頭盔 (helmet) - 10 階 ====================
  { id: "h_01", slot: "helmet", rank: 1,  name: "偵察兵護目鏡", val: "scout", tier: "common", stars: 1, bonusHp: 15, desc: "基礎戰術目鏡 (生命 +15)" },
  { id: "h_02", slot: "helmet", rank: 2,  name: "海防通信面罩", val: "scout", tier: "common", stars: 1, bonusHp: 25, desc: "強化聲納接收 (生命 +25)" },
  { id: "h_03", slot: "helmet", rank: 3,  name: "合金防彈頭盔", val: "heavy", tier: "rare", stars: 1, bonusHp: 40, dmgReduce: 0.05, desc: "生命 +40，減傷 5%" },
  { id: "h_04", slot: "helmet", rank: 4,  name: "深潛抗壓面甲", val: "scout", tier: "rare", stars: 1, bonusHp: 50, bonusDmg: 5, desc: "生命 +50，攻擊 +5" },
  { id: "h_05", slot: "helmet", rank: 5,  name: "破浪先鋒角盔", val: "heavy", tier: "elite", stars: 1, bonusHp: 75, dmgReduce: 0.08, desc: "生命 +75，減傷 8%" },
  { id: "h_06", slot: "helmet", rank: 6,  name: "星靈感應頭冠", val: "archmage", tier: "elite", stars: 1, bonusHp: 65, bonusDmg: 12, desc: "生命 +65，攻擊 +12" },
  { id: "h_07", slot: "helmet", rank: 7,  name: "泰坦重裝堡壘盔", val: "heavy", tier: "elite", stars: 1, bonusHp: 105, dmgReduce: 0.11, desc: "生命 +105，減傷 11%" },
  { id: "h_08", slot: "helmet", rank: 8,  name: "虛空視界戰術兜帽", val: "archmage", tier: "legendary", stars: 1, bonusHp: 120, bonusDmg: 24, desc: "生命 +120，攻擊 +24" },
  { id: "h_09", slot: "helmet", rank: 9,  name: "海神王權不朽皇冠", val: "archmage", tier: "legendary", stars: 1, bonusHp: 150, bonusDmg: 32, desc: "生命 +150，攻擊 +32" },
  { id: "h_10", slot: "helmet", rank: 10, name: "深淵逆鱗滅世戰盔", val: "heavy", tier: "legendary", stars: 1, bonusHp: 200, dmgReduce: 0.18, desc: "生命 +200，減傷 18%" },

  // ==================== 3. 胸部盔甲 (armor) - 10 階 ====================
  { id: "a_01", slot: "armor", rank: 1,  name: "輕型纖維作戰服", val: "scout", tier: "common", stars: 1, bonusHp: 30, desc: "基礎防護內襯 (生命 +30)" },
  { id: "a_02", slot: "armor", rank: 2,  name: "海岸巡邏防彈衣", val: "scout", tier: "common", stars: 1, bonusHp: 45, desc: "陶瓷插板護甲 (生命 +45)" },
  { id: "a_03", slot: "armor", rank: 3,  name: "鈦合金複合胸甲", val: "heavy", tier: "rare", stars: 1, bonusHp: 70, dmgReduce: 0.05, desc: "生命 +70，減傷 5%" },
  { id: "a_04", slot: "armor", rank: 4,  name: "潮汐能量導流鎧", val: "scout", tier: "rare", stars: 1, bonusHp: 85, bonusDmg: 6, desc: "生命 +85，攻擊 +6" },
  { id: "a_05", slot: "armor", rank: 5,  name: "無畏先鋒重型板甲", val: "heavy", tier: "elite", stars: 1, bonusHp: 120, dmgReduce: 0.10, desc: "生命 +120，減傷 10%" },
  { id: "a_06", slot: "armor", rank: 6,  name: "星界奧術防護袍", val: "archmage", tier: "elite", stars: 1, bonusHp: 105, bonusDmg: 14, desc: "生命 +105，攻擊 +14" },
  { id: "a_07", slot: "armor", rank: 7,  name: "巨神兵反應裝甲", val: "heavy", tier: "elite", stars: 1, bonusHp: 165, dmgReduce: 0.14, desc: "生命 +165，減傷 14%" },
  { id: "a_08", slot: "armor", rank: 8,  name: "暗物質力場戰衣", val: "archmage", tier: "legendary", stars: 1, bonusHp: 190, bonusDmg: 28, desc: "生命 +190，攻擊 +28" },
  { id: "a_09", slot: "armor", rank: 9,  name: "星宿天災神話戰袍", val: "archmage", tier: "legendary", stars: 1, bonusHp: 240, bonusDmg: 40, desc: "生命 +240，攻擊 +40" },
  { id: "a_10", slot: "armor", rank: 10, name: "永恆壁壘深淵神鎧", val: "heavy", tier: "legendary", stars: 1, bonusHp: 320, dmgReduce: 0.22, desc: "生命 +320，減傷 22%" },

  // ==================== 4. 手套 (gloves) - 10 階 ====================
  { id: "g_01", slot: "gloves", rank: 1,  name: "戰術防滑露指手套", val: "scout", tier: "common", stars: 1, bonusDmg: 4, desc: "提升握持穩定 (攻擊 +4)" },
  { id: "g_02", slot: "gloves", rank: 2,  name: "絕緣橡膠防護手甲", val: "scout", tier: "common", stars: 1, bonusDmg: 6, bonusHp: 10, desc: "攻擊 +6，生命 +10" },
  { id: "g_03", slot: "gloves", rank: 3,  name: "快速裝填機械護腕", val: "scout", tier: "rare", stars: 1, bonusDmg: 10, fireRateMult: 0.94, desc: "攻擊 +10，射速 +6%" },
  { id: "g_04", slot: "gloves", rank: 4,  name: "重鋼指虎拳套", val: "heavy", tier: "rare", stars: 1, bonusDmg: 14, bonusHp: 20, desc: "攻擊 +14，生命 +20" },
  { id: "g_05", slot: "gloves", rank: 5,  name: "高壓電漿增幅手甲", val: "archmage", tier: "elite", stars: 1, bonusDmg: 20, fireRateMult: 0.90, desc: "攻擊 +20，射速 +10%" },
  { id: "g_06", slot: "gloves", rank: 6,  name: "泰坦液壓動力腕", val: "heavy", tier: "elite", stars: 1, bonusDmg: 24, bonusHp: 40, desc: "攻擊 +24，生命 +40" },
  { id: "g_07", slot: "gloves", rank: 7,  name: "幻影神經連結手套", val: "scout", tier: "elite", stars: 1, bonusDmg: 30, fireRateMult: 0.86, desc: "攻擊 +30，射速 +14%" },
  { id: "g_08", slot: "gloves", rank: 8,  name: "虛空共鳴秘法護手", val: "archmage", tier: "legendary", stars: 1, bonusDmg: 44, bonusHp: 55, desc: "攻擊 +44，生命 +55" },
  { id: "g_09", slot: "gloves", rank: 9,  name: "諸神黃昏毀滅手甲", val: "heavy", tier: "legendary", stars: 1, bonusDmg: 58, bonusHp: 80, desc: "攻擊 +58，生命 +80" },
  { id: "g_10", slot: "gloves", rank: 10, name: "光速超頻神聖護腕", val: "archmage", tier: "legendary", stars: 1, bonusDmg: 50, fireRateMult: 0.78, desc: "攻擊 +50，射速 +22%" },

  // ==================== 5. 鞋子 (boots) - 10 階 ====================
  { id: "b_01", slot: "boots", rank: 1,  name: "標準軍用作戰靴", val: "scout", tier: "common", stars: 1, bonusSpeed: 0.15, desc: "輕便行軍靴 (移速 +0.15)" },
  { id: "b_02", slot: "boots", rank: 2,  name: "淺灘涉水防滑靴", val: "scout", tier: "common", stars: 1, bonusSpeed: 0.22, bonusHp: 10, desc: "移速 +0.22，生命 +10" },
  { id: "b_03", slot: "boots", rank: 3,  name: "氣墊避震突擊靴", val: "scout", tier: "rare", stars: 1, bonusSpeed: 0.32, desc: "大幅提升機動性 (移速 +0.32)" },
  { id: "b_04", slot: "boots", rank: 4,  name: "重裝磁力錨定靴", val: "heavy", tier: "rare", stars: 1, bonusSpeed: 0.20, bonusHp: 35, desc: "移速 +0.20，生命 +35" },
  { id: "b_05", slot: "boots", rank: 5,  name: "噴射推進滑翔靴", val: "scout", tier: "elite", stars: 1, bonusSpeed: 0.45, dashCdMult: 0.92, desc: "移速 +0.45，衝刺冷卻 -8%" },
  { id: "b_06", slot: "boots", rank: 6,  name: "秘銀符文輕靈靴", val: "archmage", tier: "elite", stars: 1, bonusSpeed: 0.40, bonusDmg: 10, desc: "移速 +0.40，攻擊 +10" },
  { id: "b_07", slot: "boots", rank: 7,  name: "音速離子推進戰靴", val: "scout", tier: "elite", stars: 1, bonusSpeed: 0.56, dashCdMult: 0.86, desc: "移速 +0.56，衝刺冷卻 -14%" },
  { id: "b_08", slot: "boots", rank: 8,  name: "山嶽巨靈重踏鐵靴", val: "heavy", tier: "legendary", stars: 1, bonusSpeed: 0.45, bonusHp: 110, desc: "移速 +0.45，生命 +110" },
  { id: "b_09", slot: "boots", rank: 9,  name: "赫爾墨斯光翼神靴", val: "scout", tier: "legendary", stars: 1, bonusSpeed: 0.85, dashCdMult: 0.75, desc: "極限神速 (移速 +0.85，衝刺冷卻 -25%)" },
  { id: "b_10", slot: "boots", rank: 10, name: "星辰漫步者神話靴", val: "archmage", tier: "legendary", stars: 1, bonusSpeed: 0.70, bonusDmg: 25, bonusHp: 60, desc: "移速 +0.70，攻擊 +25，生命 +60" },

  // ==================== 6. 護符/寵物 (talisman) - 10 階 (無詞條，隨白/藍/黃/橘進化不同動物) ====================
  { id: "t_01", slot: "talisman", rank: 1,  name: "微型電漿浮游蟲", val: "atk_pet", petAnimal: "seagull", petMode: "atk", tier: "common", stars: 1, petPower: 1.0, desc: "召喚伴生靈獸協助作戰" },
  { id: "t_02", slot: "talisman", rank: 2,  name: "淺海療癒水母卵", val: "heal_pet", petAnimal: "seagull", petMode: "atk", tier: "common", stars: 1, petPower: 1.15, desc: "強化伴生靈獸協同作戰" },
  { id: "t_03", slot: "talisman", rank: 3,  name: "雙極磁力吸引核", val: "pull_pet", petAnimal: "turtle", petMode: "heal", tier: "rare", stars: 1, petPower: 1.3, desc: "強化靈獸守護能力" },
  { id: "t_04", slot: "talisman", rank: 4,  name: "超頻雷光無人機", val: "atk_pet", petAnimal: "turtle", petMode: "heal", tier: "rare", stars: 1, petPower: 1.45, bonusDmg: 8, desc: "強化靈獸共鳴 (攻擊 +8)" },
  { id: "t_05", slot: "talisman", rank: 5,  name: "珊瑚生命共鳴石", val: "heal_pet", petAnimal: "shark", petMode: "hunt", tier: "elite", stars: 1, petPower: 1.65, bonusHp: 45, desc: "進階狩獵靈獸核心 (生命 +45)" },
  { id: "t_06", slot: "talisman", rank: 6,  name: "重力奇點微縮儀", val: "pull_pet", petAnimal: "shark", petMode: "hunt", tier: "elite", stars: 1, petPower: 1.85, bonusDmg: 15, desc: "高階狩獵靈獸核心 (攻擊 +15)" },
  { id: "t_07", slot: "talisman", rank: 7,  name: "天火自律殲滅機", val: "atk_pet", petAnimal: "shark", petMode: "hunt", tier: "elite", stars: 1, petPower: 2.05, bonusDmg: 22, desc: "高能靈獸增幅核心 (攻擊 +22)" },
  { id: "t_08", slot: "talisman", rank: 8,  name: "海洋之心聖靈水母", val: "heal_pet", petAnimal: "dragon", petMode: "omni", tier: "legendary", stars: 1, petPower: 2.35, bonusHp: 100, desc: "傳說神獸聖物 (生命 +100)" },
  { id: "t_09", slot: "talisman", rank: 9,  name: "終焉黑洞吞噬者", val: "pull_pet", petAnimal: "dragon", petMode: "omni", tier: "legendary", stars: 1, petPower: 2.75, bonusDmg: 35, desc: "神話級靈獸聖物 (攻擊 +35)" },
  { id: "t_10", slot: "talisman", rank: 10, name: "奧林帕斯審判之眼", val: "atk_pet", petAnimal: "dragon", petMode: "omni", tier: "legendary", stars: 1, petPower: 3.1, bonusDmg: 45, bonusHp: 60, desc: "終極神獸聖物 (攻擊 +45，生命 +60)" },

  // ==================== 7. 戰術法器 (artifact) - 10 階 (無詞條，品質越高技能威力倍率越強) ====================
  { id: "art_01", slot: "artifact", rank: 1,  name: "基礎爆裂手雷核", skillType: "nova", tier: "common", stars: 1, skillMult: 1.0, cooldownFrames: 240, desc: "主動技：周圍 360 度烈焰爆炸" },
  { id: "art_02", slot: "artifact", rank: 2,  name: "低溫液氮擴散器", skillType: "freeze", tier: "common", stars: 1, skillMult: 1.15, cooldownFrames: 240, desc: "主動技：全場冰霜新星減速敵群" },
  { id: "art_03", slot: "artifact", rank: 3,  name: "高壓電容引雷針", skillType: "thunder", tier: "rare", stars: 1, skillMult: 1.35, cooldownFrames: 215, desc: "主動技：召喚 5 道天雷轟擊強敵" },
  { id: "art_04", slot: "artifact", rank: 4,  name: "微型引力坍縮彈", skillType: "blackhole", tier: "rare", stars: 1, skillMult: 1.55, cooldownFrames: 215, desc: "主動技：場中央生成黑洞聚怪引燃" },
  { id: "art_05", slot: "artifact", rank: 5,  name: "赤紅超新星核心", skillType: "nova", tier: "elite", stars: 1, skillMult: 1.85, cooldownFrames: 190, bonusDmg: 12, desc: "強化爆裂範圍與傷害 (攻擊 +12)" },
  { id: "art_06", slot: "artifact", rank: 6,  name: "絕對零度永凍核", skillType: "freeze", tier: "elite", stars: 1, skillMult: 2.1, cooldownFrames: 190, bonusHp: 40, desc: "強化冰凍傷害與緩速 (生命 +40)" },
  { id: "art_07", slot: "artifact", rank: 7,  name: "雷神索爾之怒核心", skillType: "thunder", tier: "elite", stars: 1, skillMult: 2.4, cooldownFrames: 190, bonusDmg: 22, desc: "天罰雷暴傷害劇增 (攻擊 +22)" },
  { id: "art_08", slot: "artifact", rank: 8,  name: "深淵虛空奇點核", skillType: "blackhole", tier: "legendary", stars: 1, skillMult: 2.8, cooldownFrames: 165, bonusHp: 85, desc: "深淵黑洞持續牽引 (生命 +85)" },
  { id: "art_09", slot: "artifact", rank: 9,  name: "太陽神阿波羅熾陽核", skillType: "nova", tier: "legendary", stars: 1, skillMult: 3.25, cooldownFrames: 165, bonusDmg: 38, desc: "神話級核爆衝擊波 (攻擊 +38)" },
  { id: "art_10", slot: "artifact", rank: 10, name: "宙斯天罰滅世雷核", skillType: "thunder", tier: "legendary", stars: 1, skillMult: 3.6, cooldownFrames: 165, bonusDmg: 42, bonusHp: 60, desc: "神話級連鎖天雷轟殺 (攻擊 +42，生命 +60)" }
];

/* ==================== 品階基礎定義 ==================== */
const TIER_META = {
  common:    { name: '普通', color: '#f1f5f9', affixCount: 0 },
  rare:      { name: '稀有', color: '#38bdf8', affixCount: 1 },
  elite:     { name: '菁英', color: '#facc15', affixCount: 2 },
  legendary: { name: '傳說', color: '#fb923c', affixCount: 3 }
};

/* ==================== 1. 武器專屬詞條池（10 種純攻擊輸出型） ==================== */
const WEAPON_AFFIX_POOL = [
  { id: 'w_crit',      name: '致命暴擊',   tag: '暴擊率+18% (2倍傷)',       val: 0.18 },
  { id: 'w_crit_dmg',  name: '毀滅暴傷',   tag: '暴擊傷害額外+65%',         val: 0.65 },
  { id: 'w_multishot', name: '雙重齊射',   tag: '28%機率發射分裂副彈',     val: 0.28 },
  { id: 'w_pierce',    name: '穿甲貫穿',   tag: '子彈穿透+1名敵軍',         val: 1 },
  { id: 'w_chain',     name: '連鎖閃電',   tag: '25%機率電流彈射35%傷',     val: 0.25 },
  { id: 'w_execute',   name: '處決重擊',   tag: '低血量目標傷害+60%',       val: 0.60 },
  { id: 'w_ignite',    name: '高熱灼燒',   tag: '命中附加3秒持續燃燒',      val: 0.14 },
  { id: 'w_frost_atk', name: '極寒破甲',   tag: '命中緩速40%並增傷15%',     val: 0.15 },
  { id: 'w_giant_slay',name: '巨獸獵手',   tag: '對首領BOSS傷害+25%',       val: 0.25 },
  { id: 'w_blast',     name: '高爆彈頭',   tag: '20%機率命中引發小範圍爆炸', val: 0.20 }
];

/* ==================== 2. 防具專屬詞條池（30 種多元生存/機能/反擊/經濟型，支援跨部位疊加） ==================== */
const ARMOR_AFFIX_POOL = [
  // --- 【減傷與防禦類 (6種)】 ---
  { id: 'a_armor',       name: '重甲防護',   tag: '承受傷害-14%(乘法疊加)',   stackType: 'mult_reduce', val: 0.14 },
  { id: 'a_boss_def',    name: '霸主抗性',   tag: '首領與彈幕傷害-18%',       stackType: 'mult_reduce', val: 0.18 },
  { id: 'a_dodge',       name: '光學偏折',   tag: '閃避攻擊機率+10%(上限45%)', stackType: 'add', val: 0.10, cap: 0.45 },
  { id: 'a_shield_start',name: '相位力場',   tag: '進場獲得45點能量護盾',     stackType: 'add', val: 45,   cap: 250 },
  { id: 'a_flat_block',  name: '合金格擋',   tag: '每次受擊固定減免3點傷害',  stackType: 'add', val: 3,    cap: 18 },
  { id: 'a_low_hp_def',  name: '背水鐵壁',   tag: '生命低於40%時減傷+20%',    stackType: 'mult_reduce', val: 0.20 },

  // --- 【生命與回復類 (6種)】 ---
  { id: 'a_hp_pct',      name: '泰坦核心',   tag: '最大生命上限+12%',         stackType: 'add', val: 0.12, cap: 0.80 },
  { id: 'a_vamp',        name: '嗜血汲取',   tag: '擊殺10%機率回復8HP',       stackType: 'add', val: 0.10, cap: 0.45 },
  { id: 'a_regen',       name: '奈米修復',   tag: '每3秒回復1.8%最大生命',    stackType: 'add', val: 0.018,cap: 0.09 },
  { id: 'a_heal_boost',  name: '生機增幅',   tag: '所有治療與吸血效果+20%',   stackType: 'add', val: 0.20, cap: 1.00 },
  { id: 'a_level_heal',  name: '進化湧泉',   tag: '升級時額外回復30%生命',    stackType: 'add', val: 0.30, cap: 1.00 },
  { id: 'a_orb_heal',    name: '結晶滋養',   tag: '拾取經驗球回復1點生命',    stackType: 'add', val: 1,    cap: 5 },

  // --- 【機動與冷卻類 (6種)】 ---
  { id: 'a_rush',        name: '迅捷推進',   tag: '衝刺冷卻-18%(乘法疊加)',   stackType: 'mult_reduce', val: 0.18 },
  { id: 'a_art_cd',      name: '超頻法核',   tag: '法器冷卻-15%(乘法疊加)',   stackType: 'mult_reduce', val: 0.15 },
  { id: 'a_move_spd',    name: '噴射滑行',   tag: '基礎移動速度+8%',          stackType: 'add', val: 0.08, cap: 0.45 },
  { id: 'a_kill_spd',    name: '獵殺狂熱',   tag: '擊殺後2秒內移速+15%',      stackType: 'add', val: 0.15, cap: 0.60 },
  { id: 'a_dash_invul',  name: '殘影相位',   tag: '衝刺後額外獲得0.4秒無敵',  stackType: 'add', val: 24,   cap: 90 },
  { id: 'a_dash_nova',   name: '衝刺震波',   tag: '衝刺起點釋放電漿震退敵軍', stackType: 'count', val: 1,  cap: 4 },

  // --- 【反擊與輔助戰術類 (6種)】 ---
  { id: 'a_thorns',      name: '反傷電網',   tag: '受擊反彈40點範圍電擊',     stackType: 'add', val: 40,   cap: 200 },
  { id: 'a_aura_shock',  name: '靜電立場',   tag: '每秒對周圍90px敵軍造成15傷',stackType: 'add', val: 15,   cap: 75 },
  { id: 'a_auto_missile',name: '肩射微飛彈', tag: '每3秒自動發射1枚追蹤飛彈', stackType: 'count', val: 1,  cap: 4 },
  { id: 'a_pet_boost',   name: '靈獸共鳴',   tag: '寵物攻擊與治療威力+22%',   stackType: 'add', val: 0.22, cap: 1.00 },
  { id: 'a_art_dmg',     name: '奧義增幅',   tag: '法器技能最終傷害+18%',     stackType: 'add', val: 0.18, cap: 0.90 },
  { id: 'a_berserk_atk', name: '戰損狂怒',   tag: '每損失10%生命，攻擊力+4%',  stackType: 'add', val: 0.04, cap: 0.20 },

  // --- 【拾取、經驗與經濟類 (6種)】 ---
  { id: 'a_magnet',      name: '超導磁場',   tag: '經驗吸附半徑+55px',        stackType: 'add', val: 55,   cap: 250 },
  { id: 'a_exp_gain',    name: '戰術解析',   tag: '經驗值獲取效率+15%',       stackType: 'add', val: 0.15, cap: 0.75 },
  { id: 'a_gold_gain',   name: '賞金獵人',   tag: '通關金幣結算+15%',         stackType: 'add', val: 0.15, cap: 0.75 },
  { id: 'a_drop_luck',   name: '幸運羅盤',   tag: '戰場磁鐵與炸彈掉落率+3%',  stackType: 'add', val: 0.03, cap: 0.15 },
  { id: 'a_bomb_power',  name: '連鎖引爆',   tag: 'EMP炸彈額外掉落雙倍結晶',  stackType: 'count', val: 1,  cap: 3 },
  { id: 'a_salvage_up',  name: '精密拆解',   tag: '裝備拆解回收金幣+15%',     stackType: 'add', val: 0.15, cap: 0.75 }
];

/* ==================== 3. 護符(寵物)依品質對應不同動物設定 (無詞條) ==================== */
const PET_ANIMAL_BY_TIER = {
  common:    { animal: 'seagull', name: '機械偵察海鷗', mode: 'atk',  color: '#f1f5f9', desc: '伴飛海鷗，定期發射風刃攻擊海嗣' },
  rare:      { animal: 'turtle',  name: '深海碧波靈龜', mode: 'heal', color: '#38bdf8', desc: '守護靈龜，定期釋放治癒水波回復生命' },
  elite:     { animal: 'shark',   name: '雷霆虎鯊獵犬', mode: 'hunt', color: '#facc15', desc: '兇猛虎鯊，高頻雷射撕咬並震退近身敵軍' },
  legendary: { animal: 'dragon',  name: '太古蒼穹應龍', mode: 'omni', color: '#fb923c', desc: '傳說神獸，兼具高傷龍息、生命回復與引力聚怪' }
};

/* ==================== 依據部位與品質生成詞條（寵物與法器無詞條） ==================== */
function generateAffixesForTier(tier, slot = 'weapon') {
  if (slot === 'talisman' || slot === 'artifact') return [];

  const count = (TIER_META[tier] && TIER_META[tier].affixCount) ? TIER_META[tier].affixCount : 0;
  if (count <= 0) return [];

  const pool = (slot === 'weapon') ? WEAPON_AFFIX_POOL : ARMOR_AFFIX_POOL;
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(a => ({ ...a }));
}

function getItemAffixList(item) {
  if (!item || item.slot === 'talisman' || item.slot === 'artifact') return [];
  if (Array.isArray(item.affixes)) return item.affixes;
  if (item.affix) return [item.affix];
  return [];
}
