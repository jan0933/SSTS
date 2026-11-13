/**
 * SSTS - 大洲生態小怪與傳說級深海巨獸 BOSS 資料庫 (monsters_db.js)
 */

/* ==================== 12 種大洲特色海嗣小怪池 ==================== */
const CONTINENT_ENEMY_POOL = {
  // 歐洲 / 極地：寒霜與深海浮游系
  EU: [
    { kind: 'ice_jelly',   name: '極光冰水母', speedMult: 0.95, hpMult: 1.0,  radius: 10 },
    { kind: 'siren_eel',   name: '北海電擊鰻', speedMult: 1.35, hpMult: 0.85, radius: 9  }
  ],
  GL: [
    { kind: 'frost_urchin',name: '冰淵棘海膽', speedMult: 0.75, hpMult: 1.45, radius: 12 },
    { kind: 'ice_jelly',   name: '極光冰水母', speedMult: 1.0,  hpMult: 1.0,  radius: 10 }
  ],
  // 亞洲：甲殼、深海燈籠魚與毒章魚
  AS: [
    { kind: 'armored_crab',name: '重甲帝王蟹', speedMult: 0.72, hpMult: 1.4,  radius: 12 },
    { kind: 'angler_fish', name: '幽光燈籠魚', speedMult: 1.05, hpMult: 1.1,  radius: 11 },
    { kind: 'ink_octopus', name: '墨淵毒章魚', speedMult: 1.15, hpMult: 0.95, radius: 10 }
  ],
  // 美洲：掠食巨鯊與海溝蠕蟲
  AM: [
    { kind: 'tiger_shark', name: '狂暴虎鯊嗣', speedMult: 1.38, hpMult: 0.95, radius: 11 },
    { kind: 'abyss_worm',  name: '海溝血口蟲', speedMult: 1.1,  hpMult: 1.2,  radius: 10 }
  ],
  // 非洲：熔岩貝殼與刺鰩
  AF: [
    { kind: 'sting_ray',   name: '紅海幻影鰩', speedMult: 1.3,  hpMult: 0.9,  radius: 11 },
    { kind: 'coral_golem', name: '礁岩巨鉗蟹', speedMult: 0.7,  hpMult: 1.5,  radius: 13 }
  ],
  // 大洋洲：劇毒水母與大白鯊
  OC: [
    { kind: 'great_white', name: '深淵大白鯊', speedMult: 1.45, hpMult: 1.0,  radius: 12 },
    { kind: 'box_jelly',   name: '澳洲箱型水母', speedMult: 1.1, hpMult: 0.9, radius: 10 }
  ]
};

/* ==================== 10 大傳說深海巨獸 BOSS 圖鑑 ==================== */
const LEGENDARY_SEA_BOSSES = {
  // 1. 海坊主 (Umibozu) - 東亞/日本海域傳說巨怪
  umibozu: {
    id: 'umibozu',
    name: '海坊主 · 幽冥僧巨影',
    visual: 'umibozu',
    hpMult: 1.05,
    speed: 0.82,
    bulletPattern: 'ring',
    bulletColor: '#a855f7'
  },
  // 2. The Bloop (布魯普) - 南太平洋神秘超低頻聲納巨怪
  bloop: {
    id: 'bloop',
    name: 'THE BLOOP · 深淵聲納巨鯨',
    visual: 'bloop',
    hpMult: 1.2,
    speed: 0.78,
    bulletPattern: 'sonar_wave',
    bulletColor: '#38bdf8'
  },
  // 3. El Gran Maja (埃爾·格蘭·馬哈) - 傳說級巨口海蛇皇
  el_gran_maja: {
    id: 'el_gran_maja',
    name: 'EL GRAN MAJA · 裂口海蛇皇',
    visual: 'el_gran_maja',
    hpMult: 1.25,
    speed: 1.05,
    bulletPattern: 'spiral',
    bulletColor: '#f43f5e'
  },
  // 4. 利維坦 (Leviathan) - 聖經深淵海龍王
  leviathan: {
    id: 'leviathan',
    name: '利維坦 · 滅世深淵海龍',
    visual: 'leviathan',
    hpMult: 1.35,
    speed: 0.98,
    bulletPattern: 'spiral',
    bulletColor: '#fbbf24'
  },
  // 5. 克拉肯 (Kraken) - 北歐神話深海巨妖
  kraken: {
    id: 'kraken',
    name: '克拉肯 · 北海千腕巨妖',
    visual: 'kraken',
    hpMult: 1.15,
    speed: 0.85,
    bulletPattern: 'ring',
    bulletColor: '#fb7185'
  },
  // 6. 耶夢加得 (Jörmungandr) - 塵世巨蟒
  jormungandr: {
    id: 'jormungandr',
    name: '耶夢加得 · 環世毒蟒',
    visual: 'jormungandr',
    hpMult: 1.3,
    speed: 1.02,
    bulletPattern: 'spiral',
    bulletColor: '#34d399'
  },
  // 7. 卡律布狄斯 (Charybdis) - 地中海吞噬漩渦巨獸
  charybdis: {
    id: 'charybdis',
    name: '卡律布狄斯 · 漩渦巨口獸',
    visual: 'charybdis',
    hpMult: 1.1,
    speed: 0.75,
    bulletPattern: 'ring',
    bulletColor: '#60a5fa'
  },
  // 8. 刻托 (Cetus) - 古希臘海獸
  cetus: {
    id: 'cetus',
    name: '刻托 · 遠古深海巨獸',
    visual: 'cetus',
    hpMult: 1.05,
    speed: 0.9,
    bulletPattern: 'ring',
    bulletColor: '#f59e0b'
  },
  // 9. 大海蛇 (Lusca) - 加勒比藍洞巨獸
  lusca: {
    id: 'lusca',
    name: '盧斯卡 · 藍洞鯊章獸',
    visual: 'lusca',
    hpMult: 1.15,
    speed: 0.95,
    bulletPattern: 'sonar_wave',
    bulletColor: '#2dd4bf'
  },
  // 10. 鲲鵬 / 蜃龍 (Shenlong) - 東方古海蜃氣巨龍
  shenlong: {
    id: 'shenlong',
    name: '深海蜃龍 · 逆鱗古神',
    visual: 'shenlong',
    hpMult: 1.3,
    speed: 0.95,
    bulletPattern: 'spiral',
    bulletColor: '#facc15'
  }
};

// 依據國家名稱、大洲與是否為第 10 關終極霸主，指派專屬傳說海怪 BOSS
function resolveStageBossData(countryData, countryId, isApex) {
  const name = (countryData && countryData.name) ? countryData.name : '';
  const cont = (countryData && countryData.continent) ? countryData.continent : 'EU';

  // 1. 特定國家專屬彩蛋海怪
  if (name.includes('日本') || name.includes('Japan') || name.includes('韓國')) {
    return isApex ? LEGENDARY_SEA_BOSSES.umibozu : LEGENDARY_SEA_BOSSES.shenlong;
  }
  if (name.includes('台灣') || name.includes('Taiwan') || name.includes('中國') || name.includes('China')) {
    return isApex ? LEGENDARY_SEA_BOSSES.shenlong : LEGENDARY_SEA_BOSSES.umibozu;
  }
  if (name.includes('梵蒂岡') || name.includes('義大利') || name.includes('希臘')) {
    return isApex ? LEGENDARY_SEA_BOSSES.charybdis : LEGENDARY_SEA_BOSSES.cetus;
  }
  if (name.includes('挪威') || name.includes('冰島') || name.includes('瑞典') || name.includes('英國')) {
    return isApex ? LEGENDARY_SEA_BOSSES.jormungandr : LEGENDARY_SEA_BOSSES.kraken;
  }
  if (name.includes('澳洲') || name.includes('紐西蘭') || name.includes('智利') || name.includes('秘魯')) {
    return isApex ? LEGENDARY_SEA_BOSSES.bloop : LEGENDARY_SEA_BOSSES.el_gran_maja;
  }
  if (name.includes('美國') || name.includes('墨西哥') || name.includes('巴西') || name.includes('巴哈馬')) {
    return isApex ? LEGENDARY_SEA_BOSSES.el_gran_maja : LEGENDARY_SEA_BOSSES.lusca;
  }
  if (name.includes('以色列') || name.includes('埃及') || name.includes('沙烏地') || name.includes('俄羅斯')) {
    return isApex ? LEGENDARY_SEA_BOSSES.leviathan : LEGENDARY_SEA_BOSSES.charybdis;
  }

  // 2. 依大洲輪替傳說海怪池
  const continentBossMap = {
    EU: isApex ? LEGENDARY_SEA_BOSSES.kraken : LEGENDARY_SEA_BOSSES.cetus,
    GL: isApex ? LEGENDARY_SEA_BOSSES.jormungandr : LEGENDARY_SEA_BOSSES.kraken,
    AS: isApex ? LEGENDARY_SEA_BOSSES.umibozu : LEGENDARY_SEA_BOSSES.shenlong,
    OC: isApex ? LEGENDARY_SEA_BOSSES.bloop : LEGENDARY_SEA_BOSSES.el_gran_maja,
    AM: isApex ? LEGENDARY_SEA_BOSSES.el_gran_maja : LEGENDARY_SEA_BOSSES.lusca,
    AF: isApex ? LEGENDARY_SEA_BOSSES.leviathan : LEGENDARY_SEA_BOSSES.cetus
  };

  // 第 90~100 關終極霸主強制升格為滅世級巨獸（利維坦 / El Gran Maja / The Bloop）
  if (isApex && countryId >= 90) {
    const apexTitans = [LEGENDARY_SEA_BOSSES.leviathan, LEGENDARY_SEA_BOSSES.el_gran_maja, LEGENDARY_SEA_BOSSES.bloop];
    return apexTitans[countryId % apexTitans.length];
  }

  return continentBossMap[cont] || LEGENDARY_SEA_BOSSES.leviathan;
}
