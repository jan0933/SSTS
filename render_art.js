/**
 * SSTS - 美術渲染、紙娃娃、5大品階光環、1~5星粒子反饋與戰鬥特效模組 (render_art.js)
 */

const TIER_VISUALS = {
  common: { glow: "rgba(241, 245, 249, 0.4)", text: "#f1f5f9", shadow: "#94a3b8", blur: 4 },
  rare: { glow: "rgba(56, 189, 248, 0.65)", text: "#38bdf8", shadow: "#0284c7", blur: 10 },
  elite: { glow: "rgba(250, 204, 21, 0.75)", text: "#facc15", shadow: "#ca8a04", blur: 14 },
  epic: { glow: "rgba(192, 132, 252, 0.85)", text: "#c084fc", shadow: "#9333ea", blur: 18 },
  legendary: { glow: "rgba(251, 146, 60, 0.95)", text: "#fb923c", shadow: "#ea580c", blur: 24 }
};

const EQUIPMENT_REGISTRY = {
  helmets: {
    scout: { color: "#38bdf8", visor: "#0284c7", horn: false },
    heavy: { color: "#475569", visor: "#ef4444", horn: true },
    archmage: { color: "#8b5cf6", visor: "#ec4899", horn: false }
  },
  armors: {
    scout: { base: "#0f766e", plate: "#14b8a6" },
    heavy: { base: "#334155", plate: "#64748b" },
    archmage: { base: "#4c1d95", plate: "#7c3aed" }
  },
  gloves: { scout: "#2dd4bf", heavy: "#94a3b8", archmage: "#a78bfa" },
  boots: { scout: "#0d9488", heavy: "#1e293b", archmage: "#5b21b6" },
  accessories: {
    mantle: { color: "rgba(56, 189, 248, 0.45)" },
    relic: { color: "#f59e0b" }
  },
  talismans: {
    atk_pet: { glow: "#38bdf8", name: "電漿浮游蟲" },
    heal_pet: { glow: "#34d399", name: "醫療水母" },
    pull_pet: { glow: "#c084fc", name: "磁暴黑洞核" }
  }
};

function parseGearMeta(gearSlot, defaultTier = "common") {
  if (!gearSlot) return { val: null, tier: defaultTier, stars: 1 };
  if (typeof gearSlot === "string") return { val: gearSlot, tier: defaultTier, stars: 1 };
  return {
    val: gearSlot.val || gearSlot.id || null,
    tier: gearSlot.tier || defaultTier,
    stars: gearSlot.stars || 1,
    affix: gearSlot.affix || null,
    raw: gearSlot
  };
}

function drawPlayerPaperdoll(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);

  if (p.facing < 0) ctx.scale(-1, 1);

  let walkCycle = 0;
  let bobbing = 0;
  if (p.isMoving) {
    walkCycle = Math.sin(p.animTimer * 12);
    bobbing = Math.abs(Math.cos(p.animTimer * 12)) * 2;
  }

  const eq = p.equipment || {};
  const helm = parseGearMeta(eq.helmet);
  const armor = parseGearMeta(eq.armor);
  const gloves = parseGearMeta(eq.gloves);
  const boots = parseGearMeta(eq.boots);
  const talisman = parseGearMeta(eq.talisman);
  const accessory = parseGearMeta(eq.accessory);
  const wepObj = eq.weapon || p.weapon || { type: 'bow', tier: 'common', stars: 1, damage: 30 };

  const helmConfig = helm.val ? EQUIPMENT_REGISTRY.helmets[helm.val] : null;
  const armorConfig = armor.val ? EQUIPMENT_REGISTRY.armors[armor.val] : null;
  const gloveColor = gloves.val ? (EQUIPMENT_REGISTRY.gloves[gloves.val] || "#475569") : "#475569";
  const bootColor = boots.val ? (EQUIPMENT_REGISTRY.boots[boots.val] || "#334155") : "#334155";

  // 滿星覺醒或傳說裝備散發神話氣場
  if (wepObj.tier === 'legendary' || armor.tier === 'legendary' || wepObj.stars === 5) {
    ctx.save();
    const auraPulse = Math.sin(p.animTimer * 6) * 3;
    const tierMeta = TIER_VISUALS[wepObj.tier] || TIER_VISUALS.legendary;
    ctx.strokeStyle = tierMeta.glow;
    ctx.shadowColor = tierMeta.shadow;
    ctx.shadowBlur = tierMeta.blur + (wepObj.stars * 2.5);
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(0, -2 - bobbing, 16 + auraPulse, 22 + auraPulse, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (p.isDashing) {
    ctx.save();
    ctx.strokeStyle = "rgba(103, 232, 249, 0.9)";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 22, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 1. 披風配件
  if (accessory.val && EQUIPMENT_REGISTRY.accessories[accessory.val]) {
    const capeSway = (walkCycle * 6) + (p.vx * -2);
    ctx.fillStyle = EQUIPMENT_REGISTRY.accessories[accessory.val].color;
    ctx.beginPath();
    ctx.moveTo(-6, -4 - bobbing);
    ctx.lineTo(-14 + capeSway, 14);
    ctx.lineTo(-4 + capeSway, 16);
    ctx.lineTo(2, -4 - bobbing);
    ctx.closePath();
    ctx.fill();
  }

  // 2. 雙腿與鞋子
  const leftLegAngle = walkCycle * 0.45;
  const rightLegAngle = -walkCycle * 0.45;

  ctx.save();
  ctx.translate(-4, 6 - bobbing); ctx.rotate(leftLegAngle);
  ctx.fillStyle = bootColor; ctx.fillRect(-2, 0, 4, 8);
  ctx.restore();

  ctx.save();
  ctx.translate(4, 6 - bobbing); ctx.rotate(rightLegAngle);
  ctx.fillStyle = bootColor; ctx.fillRect(-2, 0, 4, 8);
  ctx.restore();

  // 3. 軀幹與胸甲
  ctx.save();
  ctx.translate(0, -bobbing);
  ctx.fillStyle = armorConfig ? armorConfig.base : "#1e293b";
  ctx.fillRect(-6, -8, 12, 14);

  if (armorConfig) {
    const armorTierMeta = TIER_VISUALS[armor.tier] || TIER_VISUALS.common;
    ctx.fillStyle = armorConfig.plate;
    ctx.shadowColor = armorTierMeta.shadow;
    ctx.shadowBlur = armor.stars >= 3 ? armorTierMeta.blur : 0;
    ctx.beginPath();
    ctx.moveTo(-5, -6); ctx.lineTo(5, -6); ctx.lineTo(3, 4); ctx.lineTo(-3, 4);
    ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.restore();

  // 4. 頭部與頭盔
  ctx.save();
  ctx.translate(0, -12 - bobbing);
  ctx.fillStyle = helmConfig ? helmConfig.color : "#334155";
  ctx.beginPath(); ctx.arc(0, 0, 7.5, 0, Math.PI * 2); ctx.fill();

  const helmTierMeta = TIER_VISUALS[helm.tier] || TIER_VISUALS.common;
  ctx.fillStyle = helmConfig ? helmConfig.visor : "#38bdf8";
  ctx.shadowColor = helmTierMeta.shadow;
  ctx.shadowBlur = helm.stars >= 3 ? helmTierMeta.blur : 0;
  ctx.fillRect(1, -2, 6, 3);
  ctx.shadowBlur = 0;

  if (helmConfig && helmConfig.horn) {
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath(); ctx.moveTo(-4, -6); ctx.lineTo(-10, -12); ctx.lineTo(-2, -8); ctx.fill();
  }
  ctx.restore();

  // 5. 單一遠程武器
  drawSingleRangedWeapon(ctx, p, wepObj, gloveColor, bobbing);

  ctx.restore();
}

function drawSingleRangedWeapon(ctx, p, wep, gloveColor, bobbing) {
  const isAttacking = p.attackTimer > 0;
  const attackProgress = 1 - (p.attackTimer / p.attackDuration);
  const tierMeta = TIER_VISUALS[wep.tier || 'common'] || TIER_VISUALS.common;
  const stars = Math.min(5, Math.max(1, wep.stars || 1));

  ctx.save();
  ctx.translate(3, -2 - bobbing);

  ctx.fillStyle = gloveColor;
  ctx.fillRect(0, -2, 7, 4);

  ctx.shadowColor = tierMeta.shadow;
  ctx.shadowBlur = tierMeta.blur + (stars * 2);

  if (wep.type === 'staff') {
    let staffTilt = 0.2;
    if (isAttacking) {
      staffTilt = -0.5 + Math.sin(attackProgress * Math.PI) * 0.4;
      ctx.save();
      ctx.translate(20, -14);
      ctx.strokeStyle = tierMeta.glow;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 7 + stars, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.rotate(staffTilt);

    ctx.fillStyle = "#475569";
    ctx.fillRect(4, -1.5, 20, 3);

    ctx.fillStyle = tierMeta.text;
    ctx.beginPath();
    ctx.arc(24, 0, 4 + (stars * 0.7), 0, Math.PI * 2);
    ctx.fill();

  } else {
    let drawPull = 0;
    if (isAttacking) drawPull = Math.sin(attackProgress * Math.PI) * 5;

    ctx.save();
    ctx.translate(8, 0);

    ctx.strokeStyle = tierMeta.text;
    ctx.lineWidth = 2 + (stars * 0.4);
    ctx.beginPath();
    ctx.arc(0, 0, 11 + stars, -Math.PI / 2.3, Math.PI / 2.3);
    ctx.stroke();

    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(4, -10 - stars);
    ctx.lineTo(-drawPull, 0);
    ctx.lineTo(4, 10 + stars);
    ctx.stroke();

    if (isAttacking) {
      ctx.fillStyle = tierMeta.text;
      ctx.fillRect(-drawPull, -1.5, 16 + (stars * 2), 3);
    }
    ctx.restore();
  }

  // 滿星 5★ 附加旋轉星芒光點
  if (stars >= 4) {
    const starAngle = (p.animTimer * 5);
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(12 + Math.cos(starAngle) * 8, Math.sin(starAngle) * 8, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawArtifactSkillEffects(ctx, fxList, time) {
  for (let i = fxList.length - 1; i >= 0; i--) {
    const fx = fxList[i];
    fx.timer--;
    const progress = 1 - (fx.timer / fx.maxDuration);

    ctx.save();

    if (fx.type === 'freeze') {
      const ringRadius = progress * (ctx.canvas.width * 0.7);
      ctx.strokeStyle = `rgba(186, 230, 253, ${1 - progress})`;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 18;
      ctx.lineWidth = 3.5 * (1 - progress);
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      for (const p of fx.particles) {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        ctx.fillStyle = `rgba(224, 242, 254, ${1 - progress})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - 4);
        ctx.lineTo(p.x + 4, p.y);
        ctx.lineTo(p.x, p.y + 4);
        ctx.lineTo(p.x - 4, p.y);
        ctx.closePath();
        ctx.fill();
      }

    } else if (fx.type === 'thunder') {
      for (const strike of fx.strikes) {
        ctx.strokeStyle = "#ffffff";
        ctx.shadowColor = "#c084fc";
        ctx.shadowBlur = 16;
        ctx.lineWidth = 3.5 * (1 - progress);

        ctx.beginPath();
        ctx.moveTo(strike.x, 0);
        for (const pt of strike.points) {
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.lineTo(strike.targetX, strike.targetY);
        ctx.stroke();

        ctx.fillStyle = `rgba(192, 132, 252, ${0.8 * (1 - progress)})`;
        ctx.beginPath();
        ctx.arc(strike.targetX, strike.targetY, (progress * 25), 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (fx.type === 'nova') {
      const r = progress * 190;
      ctx.strokeStyle = `rgba(244, 63, 94, ${1 - progress})`;
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 20;
      ctx.lineWidth = 5 * (1 - progress);
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, r, 0, Math.PI * 2);
      ctx.stroke();

      for (const p of fx.particles) {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        ctx.fillStyle = `rgba(253, 224, 71, ${1 - progress})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - progress), 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (fx.type === 'blackhole') {
      const cx = fx.x;
      const cy = fx.y;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 6);
      ctx.strokeStyle = `rgba(168, 85, 247, ${1 - progress * 0.4})`;
      ctx.shadowColor = "#a855f7";
      ctx.shadowBlur = 24;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 32 + Math.sin(time * 10) * 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#090514";
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      for (const p of fx.particles) {
        const ang = Math.atan2(cy - p.y, cx - p.x);
        p.x += Math.cos(ang) * 5;
        p.y += Math.sin(ang) * 5;
        ctx.fillStyle = `rgba(216, 180, 254, ${1 - progress})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();

    if (fx.timer <= 0) {
      fxList.splice(i, 1);
    }
  }
}

function drawObstacles(ctx, obstacles, continent, time) {
  for (const obs of obstacles) {
    ctx.save();
    ctx.translate(obs.x, obs.y);

    if (continent === 'EU') {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.beginPath();
      ctx.moveTo(-obs.width / 4, -obs.height / 2); ctx.lineTo(-obs.width / 4, obs.height / 2);
      ctx.moveTo(obs.width / 4, -obs.height / 2); ctx.lineTo(obs.width / 4, obs.height / 2);
      ctx.stroke();
    } else if (continent === 'AM') {
      ctx.fillStyle = '#261118';
      ctx.fillRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
    } else if (continent === 'AS') {
      ctx.fillStyle = '#06261c';
      ctx.fillRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.strokeRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
      ctx.fillStyle = '#34d399';
      ctx.shadowColor = '#10b981'; ctx.shadowBlur = 8;
      ctx.fillRect(-6, -6, 12, 12);
    } else if (continent === 'OC') {
      ctx.fillStyle = '#083344';
      ctx.beginPath();
      ctx.roundRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height, 8);
      ctx.fill();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (continent === 'AF') {
      ctx.fillStyle = '#27170a';
      ctx.fillRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
    } else {
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.strokeRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
    }
    ctx.restore();
  }
}

function drawBattlePickups(ctx, pickups, time) {
  for (const p of pickups) {
    ctx.save();
    ctx.translate(p.x, p.y + Math.sin(time * 5) * 3);

    if (p.type === 'magnet') {
      ctx.shadowColor = "#38bdf8"; ctx.shadowBlur = 12;
      ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, -2, 7, Math.PI, 0, true);
      ctx.lineTo(7, 6);
      ctx.moveTo(-7, -2);
      ctx.lineTo(-7, 6);
      ctx.stroke();
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(-9, 4, 4, 4);
      ctx.fillRect(5, 4, 4, 4);
    } else if (p.type === 'bomb') {
      ctx.shadowColor = "#ef4444"; ctx.shadowBlur = 14;
      ctx.fillStyle = "#b91c1c";
      ctx.beginPath(); ctx.arc(0, 2, 8, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#fde047"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(3, -11); ctx.stroke();
      ctx.fillStyle = "#fde047";
      ctx.beginPath(); ctx.arc(3, -11, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
}

function drawContinentBackground(ctx, continent, width, height) {
  const continentColors = {
    EU: "rgba(2, 132, 199, 0.08)",
    OC: "rgba(6, 182, 212, 0.09)",
    AM: "rgba(220, 38, 38, 0.07)",
    AS: "rgba(16, 185, 129, 0.08)",
    AF: "rgba(217, 119, 6, 0.08)",
    GL: "rgba(124, 58, 237, 0.08)"
  };

  ctx.strokeStyle = continentColors[continent] || "rgba(14, 165, 233, 0.06)";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }
}

function drawChestItem(ctx, chest, time) {
  if (!chest.active) return;
  ctx.save();
  ctx.translate(chest.x, chest.y);
  ctx.translate(0, Math.sin(time * 3) * 3);

  ctx.fillStyle = "rgba(234, 179, 8, 0.15)";
  ctx.beginPath();
  ctx.moveTo(-16, 12); ctx.lineTo(16, 12); ctx.lineTo(24, -30); ctx.lineTo(-24, -30);
  ctx.closePath();
  ctx.fill();

  ctx.shadowColor = "#eab308"; ctx.shadowBlur = 14;
  ctx.fillStyle = "#854d0e";
  ctx.fillRect(-12, -8, 24, 16);
  ctx.strokeStyle = "#fde047"; ctx.lineWidth = 1.5;
  ctx.strokeRect(-12, -8, 24, 16);
  ctx.fillStyle = "#facc15";
  ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();

  ctx.font = "800 10px monospace";
  ctx.fillStyle = "#fde047";
  ctx.textAlign = "center";
  ctx.fillText("〔 碰觸開箱 〕", 0, -14);
  ctx.restore();
}

function drawPet(ctx, pet, p, time) {
  if (!pet || !pet.active) return;
  ctx.save();
  ctx.translate(pet.x, pet.y);

  if (pet.type === 'atk') {
    ctx.fillStyle = "#38bdf8";
    ctx.shadowColor = "#0284c7"; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#7dd3fc"; ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      const a = time * 4 + i * (Math.PI * 2 / 3);
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 4, Math.sin(a) * 4);
      ctx.lineTo(Math.cos(a) * 10, Math.sin(a) * 10);
      ctx.stroke();
    }
  } else if (pet.type === 'heal') {
    ctx.fillStyle = "rgba(52, 211, 153, 0.85)";
    ctx.shadowColor = "#10b981"; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(0, -2, 7, Math.PI, 0); ctx.fill();
    ctx.strokeStyle = "#a7f3d0"; ctx.lineWidth = 1;
    for (let t = -2; t <= 2; t += 2) {
      ctx.beginPath();
      ctx.moveTo(t * 2, -2); ctx.lineTo(t * 2 + Math.sin(time * 3 + t) * 3, 8);
      ctx.stroke();
    }
  } else if (pet.type === 'pull') {
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#c084fc"; ctx.shadowColor = "#a855f7"; ctx.shadowBlur = 10; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 9 + Math.sin(time * 6) * 2, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
}

function drawEnemies(ctx, enemies, boss) {
  for (const e of enemies) {
    ctx.save();
    ctx.translate(e.x, e.y);

    if (e.kind === 'shark') {
      ctx.fillStyle = '#0f766e';
      ctx.beginPath();
      ctx.ellipse(0, 0, e.radius * 1.3, e.radius * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#14b8a6';
      ctx.beginPath();
      ctx.moveTo(-2, -e.radius * 0.6);
      ctx.lineTo(2, -e.radius * 1.2);
      ctx.lineTo(6, -e.radius * 0.4);
      ctx.fill();
    } else if (e.kind === 'crab') {
      ctx.fillStyle = '#b45309';
      ctx.beginPath(); ctx.arc(0, 0, e.radius, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.stroke();
    } else if (e.kind === 'ice_jelly') {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(0, -2, e.radius, Math.PI, 0); ctx.closePath(); ctx.fill();
    } else {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.ellipse(0, 0, e.radius * 1.2, e.radius * 0.7, 0, 0, Math.PI * 2); ctx.fill();
      const tailWiggle = Math.sin(e.pulse * 2) * 5;
      ctx.beginPath(); ctx.moveTo(-e.radius * 0.8, 0); ctx.lineTo(-e.radius * 1.5, -5 + tailWiggle); ctx.lineTo(-e.radius * 1.5, 5 + tailWiggle); ctx.fill();
    }
    ctx.restore();
  }

  if (boss && boss.active) {
    ctx.save();
    ctx.translate(boss.x, boss.y);
    const isApex = boss.isApex;
    ctx.shadowColor = isApex ? '#ef4444' : '#f59e0b';
    ctx.shadowBlur = isApex ? 28 : 16;
    ctx.fillStyle = isApex ? '#7f1d1d' : '#854d0e';
    ctx.beginPath(); ctx.arc(0, 0, boss.radius, 0, Math.PI * 2); ctx.fill();

    ctx.save();
    ctx.rotate(boss.pulse * 0.5);
    ctx.strokeStyle = isApex ? '#f87171' : '#fde047';
    ctx.lineWidth = isApex ? 4 : 2.5;
    const spokes = isApex ? 6 : 4;
    for (let a = 0; a < Math.PI * 2; a += Math.PI * 2 / spokes) {
      ctx.beginPath(); ctx.arc(Math.cos(a) * 20, Math.sin(a) * 20, 9, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();

    ctx.fillStyle = isApex ? '#ef4444' : '#eab308';
    ctx.beginPath(); ctx.arc(0, 0, 14 + Math.sin(boss.pulse * 3) * 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

function drawBossBullets(ctx, bossBullets) {
  for (const b of bossBullets) {
    ctx.save();
    ctx.fillStyle = b.isApex ? '#f87171' : '#fde047';
    ctx.shadowColor = b.isApex ? '#ef4444' : '#eab308';
    ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

function drawDashGhosts(ctx, ghosts) {
  for (let i = 0; i < ghosts.length; i++) {
    const g = ghosts[i];
    ctx.save();
    ctx.translate(g.x, g.y);
    if (g.facing < 0) ctx.scale(-1, 1);
    ctx.fillStyle = `rgba(56, 189, 248, ${g.alpha * 0.45})`;
    ctx.shadowColor = "#38bdf8"; ctx.shadowBlur = 10 * g.alpha;
    ctx.beginPath(); ctx.arc(0, -10, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(-6, -6, 12, 16);
    ctx.restore();
  }
}

function drawInventoryPreview(ctx, p, animTime) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const mockPlayer = { ...p, x: 0, y: 0, vx: 0, vy: 0, isMoving: false, attackTimer: 0, isDashing: false, facing: 1, animTimer: animTime };
  ctx.save();
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2 + 10);
  ctx.scale(2.2, 2.2);
  drawPlayerPaperdoll(ctx, mockPlayer);
  ctx.restore();
}
