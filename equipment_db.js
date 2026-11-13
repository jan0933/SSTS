/**
 * SSTS - 全遊戲 70 件裝備資料庫 (equipment_db.js)
 * 包含 7 大槽位（武器、頭盔、盔甲、手套、鞋子、護符、法器），每個部位各有 10 種裝備
 * 涵蓋 5 大品階：common (普通/白)、rare (稀有/藍)、elite (菁英/黃)、epic (史詩/紫)、legendary (傳說/橘)
 */

const MASTER_EQUIPMENT_DB = [
  // ==================== 1. 遠程武器 (weapon) - 10 種 ====================
  { id: "w_01", slot: "weapon", name: "新兵製式獵弓", type: "bow", tier: "common", stars: 1, damage: 30, speed: 10, desc: "基礎電磁弦弓 (傷害 30)" },
  { id: "w_02", slot: "weapon", name: "海防速射短弩", type: "bow", tier: "common", stars: 1, damage: 36, speed: 12, desc: "輕量化連發弩 (傷害 36)" },
  { id: "w_03", slot: "weapon", name: "深海穿甲重弩", type: "bow", tier: "rare", stars: 1, damage: 48, speed: 11, desc: "高初速破甲箭 (傷害 48)" },
  { id: "w_04", slot: "weapon", name: "星芒脈衝法杖", type: "staff", tier: "rare", stars: 1, damage: 55, speed: 8.5, desc: "凝聚海洋星能球 (傷害 55)" },
  { id: "w_05", slot: "weapon", name: "雷鳴連發電磁弓", type: "bow", tier: "elite", stars: 1, damage: 72, speed: 13, desc: "高壓電弧箭矢 (傷害 72)" },
  { id: "w_06", slot: "weapon", name: "寒霜極光魔導杖", type: "staff", tier: "elite", stars: 1, damage: 82, speed: 9.5, desc: "極寒結晶光彈 (傷害 82)" },
  { id: "w_07", slot: "weapon", name: "虛空裂隙狙擊弩", type: "bow", tier: "epic", stars: 1, damage: 108, speed: 15, desc: "超視距貫穿光束 (傷害 108)" },
  { id: "w_08", slot: "weapon", name: "深淵引力星辰杖", type: "staff", tier: "epic", stars: 1, damage: 120, speed: 10, desc: "暗物質坍縮法球 (傷害 120)" },
  { id: "w_09", slot: "weapon", name: "弒神逆鱗天罰弩", type: "bow", tier: "legendary", stars: 1, damage: 155, speed: 16, desc: "毀滅級電磁砲矢 (傷害 155)" },
  { id: "w_10", slot: "weapon", name: "超新星創世天災杖", type: "staff", tier: "legendary", stars: 1, damage: 175, speed: 11.5, desc: "恆星核爆衝擊球 (傷害 175)" },

  // ==================== 2. 頭盔 (helmet) - 10 種 ====================
  { id: "h_01", slot: "helmet", name: "偵察兵護目鏡", val: "scout", tier: "common", stars: 1, bonusHp: 15, desc: "基礎戰術目鏡 (生命 +15)" },
  { id: "h_02", slot: "helmet", name: "海防通信面罩", val: "scout", tier: "common", stars: 1, bonusHp: 25, desc: "強化聲納接收 (生命 +25)" },
  { id: "h_03", slot: "helmet", name: "合金防彈頭盔", val: "heavy", tier: "rare", stars: 1, bonusHp: 40, dmgReduce: 0.05, desc: "生命 +40，減傷 5%" },
  { id: "h_04", slot: "helmet", name: "深潛抗壓面甲", val: "scout", tier: "rare", stars: 1, bonusHp: 50, bonusDmg: 5, desc: "生命 +50，攻擊 +5" },
  { id: "h_05", slot: "helmet", name: "破浪先鋒角盔", val: "heavy", tier: "elite", stars: 1, bonusHp: 75, dmgReduce: 0.08, desc: "生命 +75，減傷 8%" },
  { id: "h_06", slot: "helmet", name: "星靈感應頭冠", val: "archmage", tier: "elite", stars: 1, bonusHp: 65, bonusDmg: 12, desc: "生命 +65，攻擊 +12" },
  { id: "h_07", slot: "helmet", name: "泰坦重裝堡壘盔", val: "heavy", tier: "epic", stars: 1, bonusHp: 110, dmgReduce: 0.12, desc: "生命 +110，減傷 12%" },
  { id: "h_08", slot: "helmet", name: "虛空視界戰術兜帽", val: "archmage", tier: "epic", stars: 1, bonusHp: 90, bonusDmg: 20, desc: "生命 +90，攻擊 +20" },
  { id: "h_09", slot: "helmet", name: "海神王權不朽皇冠", val: "archmage", tier: "legendary", stars: 1, bonusHp: 150, bonusDmg: 32, desc: "生命 +150，攻擊 +32" },
  { id: "h_10", slot: "helmet", name: "深淵逆鱗滅世戰盔", val: "heavy", tier: "legendary", stars: 1, bonusHp: 200, dmgReduce: 0.18, desc: "生命 +200，減傷 18%" },

  // ==================== 3. 胸部盔甲 (armor) - 10 種 ====================
  { id: "a_01", slot: "armor", name: "輕型纖維作戰服", val: "scout", tier: "common", stars: 1, bonusHp: 30, desc: "基礎防護內襯 (生命 +30)" },
  { id: "a_02", slot: "armor", name: "海岸巡邏防彈衣", val: "scout", tier: "common", stars: 1, bonusHp: 45, desc: "陶瓷插板護甲 (生命 +45)" },
  { id: "a_03", slot: "armor", name: "鈦合金複合胸甲", val: "heavy", tier: "rare", stars: 1, bonusHp: 70, dmgReduce: 0.05, desc: "生命 +70，減傷 5%" },
  { id: "a_04", slot: "armor", name: "潮汐能量導流鎧", val: "scout", tier: "rare", stars: 1, bonusHp: 85, bonusDmg: 6, desc: "生命 +85，攻擊 +6" },
  { id: "a_05", slot: "armor", name: "無畏先鋒重型板甲", val: "heavy", tier: "elite", stars: 1, bonusHp: 120, dmgReduce: 0.10, desc: "生命 +120，減傷 10%" },
  { id: "a_06", slot: "armor", name: "星界奧術防護袍", val: "archmage", tier: "elite", stars: 1, bonusHp: 105, bonusDmg: 14, desc: "生命 +105，攻擊 +14" },
  { id: "a_07", slot: "armor", name: "巨神兵反應裝甲", val: "heavy", tier: "epic", stars: 1, bonusHp: 175, dmgReduce: 0.15, desc: "生命 +175，減傷 15%" },
  { id: "a_08", slot: "armor", name: "暗物質力場戰衣", val: "archmage", tier: "epic", stars: 1, bonusHp: 150, bonusDmg: 24, desc: "生命 +150，攻擊 +24" },
  { id: "a_09", slot: "armor", name: "星宿天災神話戰袍", val: "archmage", tier: "legendary", stars: 1, bonusHp: 240, bonusDmg: 40, desc: "生命 +240，攻擊 +40" },
  { id: "a_10", slot: "armor", name: "永恆壁壘深淵神鎧", val: "heavy", tier: "legendary", stars: 1, bonusHp: 320, dmgReduce: 0.22, desc: "生命 +320，減傷 22%" },

  // ==================== 4. 手套 (gloves) - 10 種 ====================
  { id: "g_01", slot: "gloves", name: "戰術防滑露指手套", val: "scout", tier: "common", stars: 1, bonusDmg: 4, desc: "提升握持穩定 (攻擊 +4)" },
  { id: "g_02", slot: "gloves", name: "絕緣橡膠防護手甲", val: "scout", tier: "common", stars: 1, bonusDmg: 6, bonusHp: 10, desc: "攻擊 +6，生命 +10" },
  { id: "g_03", slot: "gloves", name: "快速裝填機械護腕", val: "scout", tier: "rare", stars: 1, bonusDmg: 10, fireRateMult: 0.94, desc: "攻擊 +10，射速 +6%" },
  { id: "g_04", slot: "gloves", name: "重鋼指虎拳套", val: "heavy", tier: "rare", stars: 1, bonusDmg: 14, bonusHp: 20, desc: "攻擊 +14，生命 +20" },
  { id: "g_05", slot: "gloves", name: "高壓電漿增幅手甲", val: "archmage", tier: "elite", stars: 1, bonusDmg: 20, fireRateMult: 0.90, desc: "攻擊 +20，射速 +10%" },
  { id: "g_06", slot: "gloves", name: "泰坦液壓動力腕", val: "heavy", tier: "elite", stars: 1, bonusDmg: 24, bonusHp: 40, desc: "攻擊 +24，生命 +40" },
  { id: "g_07", slot: "gloves", name: "幻影神經連結手套", val: "scout", tier: "epic", stars: 1, bonusDmg: 32, fireRateMult: 0.85, desc: "攻擊 +32，射速 +15%" },
  { id: "g_08", slot: "gloves", name: "虛空共鳴秘法護手", val: "archmage", tier: "epic", stars: 1, bonusDmg: 40, bonusHp: 50, desc: "攻擊 +40，生命 +50" },
  { id: "g_09", slot: "gloves", name: "諸神黃昏毀滅手甲", val: "heavy", tier: "legendary", stars: 1, bonusDmg: 58, bonusHp: 80, desc: "攻擊 +58，生命 +80" },
  { id: "g_10", slot: "gloves", name: "光速超頻神聖護腕", val: "archmage", tier: "legendary", stars: 1, bonusDmg: 50, fireRateMult: 0.78, desc: "攻擊 +50，射速 +22%" },

  // ==================== 5. 鞋子 (boots) - 10 種 ====================
  { id: "b_01", slot: "boots", name: "標準軍用作戰靴", val: "scout", tier: "common", stars: 1, bonusSpeed: 0.15, desc: "輕便行軍靴 (移速 +0.15)" },
  { id: "b_02", slot: "boots", name: "淺灘涉水防滑靴", val: "scout", tier: "common", stars: 1, bonusSpeed: 0.22, bonusHp: 10, desc: "移速 +0.22，生命 +10" },
  { id: "b_03", slot: "boots", name: "氣墊避震突擊靴", val: "scout", tier: "rare", stars: 1, bonusSpeed: 0.32, desc: "大幅提升機動性 (移速 +0.32)" },
  { id: "b_04", slot: "boots", name: "重裝磁力錨定靴", val: "heavy", tier: "rare", stars: 1, bonusSpeed: 0.20, bonusHp: 35, desc: "移速 +0.20，生命 +35" },
  { id: "b_05", slot: "boots", name: "噴射推進滑翔靴", val: "scout", tier: "elite", stars: 1, bonusSpeed: 0.45, dashCdMult: 0.92, desc: "移速 +0.45，衝刺冷卻 -8%" },
  { id: "b_06", slot: "boots", name: "秘銀符文輕靈靴", val: "archmage", tier: "elite", stars: 1, bonusSpeed: 0.40, bonusDmg: 10, desc: "移速 +0.40，攻擊 +10" },
  { id: "b_07", slot: "boots", name: "音速離子推進戰靴", val: "scout", tier: "epic", stars: 1, bonusSpeed: 0.60, dashCdMult: 0.85, desc: "移速 +0.60，衝刺冷卻 -15%" },
  { id: "b_08", slot: "boots", name: "山嶽巨靈重踏鐵靴", val: "heavy", tier: "epic", stars: 1, bonusSpeed: 0.35, bonusHp: 90, desc: "移速 +0.35，生命 +90" },
  { id: "b_09", slot: "boots", name: "赫爾墨斯光翼神靴", val: "scout", tier: "legendary", stars: 1, bonusSpeed: 0.85, dashCdMult: 0.75, desc: "極限神速 (移速 +0.85，衝刺冷卻 -25%)" },
  { id: "b_10", slot: "boots", name: "星辰漫步者神話靴", val: "archmage", tier: "legendary", stars: 1, bonusSpeed: 0.70, bonusDmg: 25, bonusHp: 60, desc: "移速 +0.70，攻擊 +25，生命 +60" },

  // ==================== 6. 護符/寵物 (talisman) - 10 種 ====================
  { id: "t_01", slot: "talisman", name: "微型電漿浮游蟲", val: "atk_pet", tier: "common", stars: 1, petPower: 1.0, desc: "召喚【電漿浮游蟲】定期雷射協攻" },
  { id: "t_02", slot: "talisman", name: "淺海療癒水母卵", val: "heal_pet", tier: "common", stars: 1, petPower: 1.0, desc: "召喚【醫療水母】定期恢復生命" },
  { id: "t_03", slot: "talisman", name: "雙極磁力吸引核", val: "pull_pet", tier: "rare", stars: 1, petPower: 1.0, desc: "召喚【磁暴黑洞核】定期聚攏周圍敵群" },
  { id: "t_04", slot: "talisman", name: "超頻雷光無人機", val: "atk_pet", tier: "rare", stars: 1, petPower: 1.4, bonusDmg: 8, desc: "強化協攻無人機 (攻擊 +8)" },
  { id: "t_05", slot: "talisman", name: "珊瑚生命共鳴石", val: "heal_pet", tier: "elite", stars: 1, petPower: 1.5, bonusHp: 45, desc: "強化醫療水母 (生命 +45)" },
  { id: "t_06", slot: "talisman", name: "重力奇點微縮儀", val: "pull_pet", tier: "elite", stars: 1, petPower: 1.5, bonusDmg: 15, desc: "強化黑洞核牽引力 (攻擊 +15)" },
  { id: "t_07", slot: "talisman", name: "天火自律殲滅機", val: "atk_pet", tier: "epic", stars: 1, petPower: 2.0, bonusDmg: 22, desc: "高能雷射浮游砲 (攻擊 +22)" },
  { id: "t_08", slot: "talisman", name: "海洋之心聖靈水母", val: "heal_pet", tier: "epic", stars: 1, petPower: 2.2, bonusHp: 90, desc: "大幅提升治療量 (生命 +90)" },
  { id: "t_09", slot: "talisman", name: "終焉黑洞吞噬者", val: "pull_pet", tier: "legendary", stars: 1, petPower: 2.8, bonusDmg: 35, desc: "神話級引力核心 (攻擊 +35)" },
  { id: "t_10", slot: "talisman", name: "奧林帕斯審判之眼", val: "atk_pet", tier: "legendary", stars: 1, petPower: 3.0, bonusDmg: 45, bonusHp: 60, desc: "毀滅光束伴侶 (攻擊 +45，生命 +60)" },

  // ==================== 7. 戰術法器 (artifact) - 10 種 ====================
  { id: "art_01", slot: "artifact", name: "基礎爆裂手雷核", skillType: "nova", tier: "common", stars: 1, skillMult: 1.0, desc: "主動技：周圍 360 度烈焰爆炸" },
  { id: "art_02", slot: "artifact", name: "低溫液氮擴散器", skillType: "freeze", tier: "common", stars: 1, skillMult: 1.0, desc: "主動技：全場冰霜新星減速敵群" },
  { id: "art_03", slot: "artifact", name: "高壓電容引雷針", skillType: "thunder", tier: "rare", stars: 1, skillMult: 1.1, desc: "主動技：召喚 5 道天雷轟擊強敵" },
  { id: "art_04", slot: "artifact", name: "微型引力坍縮彈", skillType: "blackhole", tier: "rare", stars: 1, skillMult: 1.1, desc: "主動技：場中央生成黑洞聚怪引燃" },
  { id: "art_05", slot: "artifact", name: "赤紅超新星核心", skillType: "nova", tier: "elite", stars: 1, skillMult: 1.4, bonusDmg: 12, desc: "強化爆裂範圍與傷害 (攻擊 +12)" },
  { id: "art_06", slot: "artifact", name: "絕對零度永凍核", skillType: "freeze", tier: "elite", stars: 1, skillMult: 1.4, bonusHp: 40, desc: "強化冰凍傷害與緩速 (生命 +40)" },
  { id: "art_07", slot: "artifact", name: "雷神索爾之怒核心", skillType: "thunder", tier: "epic", stars: 1, skillMult: 1.8, bonusDmg: 22, desc: "天罰雷暴傷害劇增 (攻擊 +22)" },
  { id: "art_08", slot: "artifact", name: "深淵虛空奇點核", skillType: "blackhole", tier: "epic", stars: 1, skillMult: 1.8, bonusHp: 75, desc: "深淵黑洞持續牽引 (生命 +75)" },
  { id: "art_09", slot: "artifact", name: "太陽神阿波羅熾陽核", skillType: "nova", tier: "legendary", stars: 1, skillMult: 2.5, bonusDmg: 38, desc: "神話級核爆衝擊波 (攻擊 +38)" },
  { id: "art_10", slot: "artifact", name: "宙斯天罰滅世雷核", skillType: "thunder", tier: "legendary", stars: 1, skillMult: 2.5, bonusDmg: 42, bonusHp: 60, desc: "神話級連鎖天雷轟殺 (攻擊 +42，生命 +60)" }
];
