/**
 * SSTS - 裝備分階掉寶(1~10階)、獨立品質機率表(白/藍/黃/橘)與寶箱三選一系統 (loot_system.js)
 */

// 1. 依據國家編號 (1~100) 計算可掉落的裝備階級 (1~10階)
function getAllowedEquipmentRanks(countryId) {
  const currentRank = Math.min(10, Math.max(1, Math.ceil(countryId / 10)));
  if (currentRank === 1) {
    return [1];
  }
  return [currentRank - 1, currentRank];
}

// 2. 依據小 Boss (第5關) / 大 Boss (第10關) 獨立骰出裝備品質 (白/藍/黃/橘)
function rollChestRarity(isApex) {
  const r = Math.random() * 100;
  if (!isApex) {
    // 小 Boss：白裝 60% | 藍裝 32% | 黃裝 8% (低機率)
    if (r < 60) return 'common';
    if (r < 92) return 'rare';
    return 'elite';
  } else {
    // 大 Boss：藍裝 62% | 黃裝 30% | 橘裝 8% (低機率)
    if (r < 62) return 'rare';
    if (r < 92) return 'elite';
    return 'legendary';
  }
}

// 3. 取得資料庫中每件裝備所屬的 1~10 階級編號
function resolveItemRank(item, db) {
  if (typeof item.rank === 'number') return item.rank;
  if (typeof item.levelReq === 'number') return item.levelReq;
  const sameSlotItems = db.filter(x => x.slot === item.slot);
  const idx = sameSlotItems.findIndex(x => x.id === item.id);
  return idx >= 0 ? (idx + 1) : 1;
}

// 4. 依骰出的品質動態調整裝備詞條、顏色與基礎數值倍率
function applyRolledTierToItem(baseItem, rolledTier, rank) {
  const tierQualityMult = {
    common: 1.0,     // 白裝：標準數值
    rare: 1.12,      // 藍裝：+12%
    elite: 1.25,     // 黃裝：+25%
    legendary: 1.40  // 橘裝：+40%
  };
  const mult = tierQualityMult[rolledTier] || 1.0;
  const rolledAffixes = (typeof generateAffixesForTier === 'function')
    ? generateAffixesForTier(rolledTier)
    : [];

  const upgraded = {
    ...baseItem,
    tier: rolledTier,
    rank: rank,
    stars: 1,
    affixes: rolledAffixes
  };

  if (upgraded.damage) upgraded.damage = Math.round(upgraded.damage * mult);
  if (upgraded.bonusDmg) upgraded.bonusDmg = Math.round(upgraded.bonusDmg * mult);
  if (upgraded.bonusHp) upgraded.bonusHp = Math.round(upgraded.bonusHp * mult);
  if (upgraded.bonusSpeed) upgraded.bonusSpeed = parseFloat((upgraded.bonusSpeed * (1 + (mult - 1) * 0.5)).toFixed(2));
  if (upgraded.dmgReduce) upgraded.dmgReduce = parseFloat(Math.min(0.45, upgraded.dmgReduce * mult).toFixed(3));
  if (upgraded.skillMult) upgraded.skillMult = parseFloat((upgraded.skillMult * mult).toFixed(2));
  if (upgraded.petPower) upgraded.petPower = parseFloat((upgraded.petPower * mult).toFixed(2));

  const tierLabelMap = { common: '普通', rare: '稀有', elite: '菁英', legendary: '傳說' };
  upgraded.desc = `[第${rank}階·${tierLabelMap[rolledTier]}] ` + (baseItem.desc || '').replace(/^\[.*?\]\s*/, '');

  return upgraded;
}

// 5. 開啟 Boss 戰利品三選一彈窗
function openChestSelection(isApex) {
  isPaused = true;
  chestModal.style.display = 'flex';
  chestOptionsContainer.innerHTML = '';

  const allowedRanks = getAllowedEquipmentRanks(activeCountryStageId);
  const db = (typeof MASTER_EQUIPMENT_DB !== 'undefined') ? MASTER_EQUIPMENT_DB : [];

  const rankPool = db.filter(item => allowedRanks.includes(resolveItemRank(item, db)));
  const finalPool = rankPool.length > 0 ? rankPool : db;

  const shuffled = [...finalPool].sort(() => 0.5 - Math.random());
  const pickedBases = shuffled.slice(0, 3);

  const slotNames = {
    weapon: "遠程武器", helmet: "頭盔", armor: "胸部盔甲",
    gloves: "手套", boots: "鞋子", talisman: "護符", artifact: "戰術法器"
  };

  const rankText = allowedRanks.length === 1 ? `第 ${allowedRanks[0]} 階` : `第 ${allowedRanks[0]}~${allowedRanks[1]} 階`;
  chestTitle.innerText = isApex
    ? `👑 擊破領土霸主 · ${rankText}戰利品自選`
    : `⚔️ 擊破先鋒 Boss · ${rankText}裝備自選`;
  chestStageInfo.innerText = isApex
    ? `掉落品質：藍裝(62%) · 黃裝(30%) · 橘裝(8%)`
    : `掉落品質：白裝(60%) · 藍裝(32%) · 黃裝(8%)`;

  pickedBases.forEach(baseItem => {
    const itemRank = resolveItemRank(baseItem, db);
    const rolledTier = rollChestRarity(isApex);
    const rolledItem = applyRolledTierToItem(baseItem, rolledTier, itemRank);

    const affixPreviewHtml = (rolledItem.affixes && rolledItem.affixes.length > 0)
      ? rolledItem.affixes.map(a => `<div style="font-size:9.5px; color:#fde047; margin-top:2px;">${a.name} (${a.tag})</div>`).join('')
      : `<div style="font-size:9.5px; color:#64748b; margin-top:2px;">無附魔詞條</div>`;

    const card = document.createElement('div');
    card.className = 'chest-card';
    const tierMeta = TIER_META[rolledTier] || TIER_META.common;
    card.style.borderColor = tierMeta.color;

    card.innerHTML = `
      <div class="chest-card-type" style="color: ${tierMeta.color}">
        [ T${itemRank} · ${tierMeta.name} · ${slotNames[rolledItem.slot] || '裝備'} ]
      </div>
      <div class="chest-card-name" style="color: ${tierMeta.color}">${rolledItem.name}</div>
      <div class="chest-card-desc">${rolledItem.desc}</div>
      ${affixPreviewHtml}
      <div style="font-size: 10px; color: #eab308; margin-top: 6px;">★ 點擊獲取 ★</div>
    `;
    card.onclick = () => {
      const instanceItem = {
        ...rolledItem,
        id: `${baseItem.id}_${Date.now()}_${Math.floor(Math.random() * 1000)}`
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
