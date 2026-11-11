/**
 * SSTS - 美術渲染、紙娃娃、大洲建物、戰地道具與四大法器華麗粒子特效 (render_art.js)
 */

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
    mantle: { color: "rgba(56, 189, 248, 0.4)" },
    relic: { color: "#f59e0b" }
  },
  talismans: {
    atk_pet: { glow: "#38bdf8", name: "電漿浮游蟲" },
    heal_pet: { glow: "#34d399", name: "醫療水母" },
    pull_pet: { glow: "#c084fc", name: "磁暴黑洞核" }
  }
};

/**
 * 繪製四大法器專屬動態法術粒子特效
 */
function drawArtifactSkillEffects(ctx, fxList, time) {
  for (let i = fxList.length - 1; i >= 0; i--) {
    const fx = fxList[i];
    fx.timer--;
    const progress = 1 - (fx.timer / fx.maxDuration); // 0 -> 1

    ctx.save();

    if (fx.type === 'freeze') {
      // 1. 極寒霜環：全螢幕向外擴散六角冰霜星、碎冰與冰霧環
      const ringRadius = progress * (ctx.canvas.width * 0.7);
      ctx.strokeStyle = `rgba(186, 230, 253, ${1 - progress})`;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 18;
      ctx.lineWidth = 3 * (1 - progress);
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      // 飛散冰晶粒子
      for (const p of fx.particles) {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        ctx.fillStyle = `rgba(224, 242, 254, ${1 - progress})`;
        ctx.beginPath();
        // 繪製微型菱形六角碎冰
        ctx.moveTo(p.x, p.y - 4);
        ctx.lineTo(p.x + 4, p.y);
        ctx.lineTo(p.x, p.y + 4);
        ctx.lineTo(p.x - 4, p.y);
        ctx.closePath();
        ctx.fill();
      }

    } else if (fx.type === 'thunder') {
      // 2. 天罰雷霆：頂部直劈地面的白紫電弧與裂地光斑
      for (const strike of fx.strikes) {
        ctx.strokeStyle = "#ffffff";
        ctx.shadowColor = "#c084fc";
        ctx.shadowBlur = 16;
        ctx.lineWidth = 3.5 * (1 - progress);

        ctx.beginPath();
        ctx.moveTo(strike.x, 0);
        let curX = strike.x;
        let curY = 0;
        for (const pt of strike.points) {
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.lineTo(strike.targetX, strike.targetY);
        ctx.stroke();

        // 地面雷擊爆裂環
        ctx.fillStyle = `rgba(192, 132, 252, ${0.8 * (1 - progress)})`;
        ctx.beginPath();
        ctx.arc(strike.targetX, strike.targetY, (progress * 25), 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (fx.type === 'nova') {
      // 3. 等離子爆裂：周圍 360 度烈焰衝擊波
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
      // 4. 深淵黑洞：向心引力漩渦與紫色重力光圈
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

      // 黑洞核心
      ctx.fillStyle = "#090514";
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 向心吸附暗紫引力流
      for (const p of fx.particles) {
        const d = Math.hypot(cx - p.x, cy - p.y);
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

  if (p.isDashing) {
    ctx.save();
    ctx.strokeStyle = "rgba(103, 232, 249, 0.8)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#38bdf8"; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.ellipse(0, 0, 18, 22, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  const eq = p.equipment;
  const helmConfig = eq.helmet ? EQUIPMENT_REGISTRY.helmets[eq.helmet] : null;
  const armorConfig = eq.armor ? EQUIPMENT_REGISTRY.armors[eq.armor] : null;
  const gloveColor = eq.gloves ? EQUIPMENT_REGISTRY.gloves[eq.gloves] : "#475569";
  const bootColor = eq.boots ? EQUIPMENT_REGISTRY.boots[eq.boots] : "#334155";

  if (eq.accessory && EQUIPMENT_REGISTRY.accessories[eq.accessory]) {
    const capeSway = (walkCycle * 6) + (p.vx * -2);
    ctx.fillStyle = EQUIPMENT_REGISTRY.accessories[eq.accessory].color;
    ctx.beginPath();
    ctx.moveTo(-6, -4 - bobbing);
    ctx.lineTo(-14 + capeSway, 14);
    ctx.lineTo(-4 + capeSway, 16);
    ctx.lineTo(2, -4 - bobbing);
    ctx.closePath();
    ctx.fill();
  }

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

  ctx.save();
  ctx.translate(0, -bobbing);
  ctx.fillStyle = armorConfig ? armorConfig.base : "#1e293b";
  ctx.fillRect(-6, -8, 12, 14);
  if (armorConfig) {
    ctx.fillStyle = armorConfig.plate;
    ctx.beginPath();
    ctx.moveTo(-5, -6); ctx.lineTo(5, -6); ctx.lineTo(3, 4); ctx.lineTo(-3, 4);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.translate(0, -12 - bobbing);
  ctx.fillStyle = helmConfig ? helmConfig.color : "#334155";
  ctx.beginPath(); ctx.arc(0, 0, 7.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = helmConfig ? helmConfig.visor : "#38bdf8";
  ctx.fillRect(1, -2, 6, 3);
  if (helmConfig && helmConfig.horn) {
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath(); ctx.moveTo(-4, -6); ctx.lineTo(-10, -12); ctx.lineTo(-2, -8); ctx.fill();
  }
  ctx.restore();

  drawWeaponSystem(ctx, p, gloveColor, bobbing);
  ctx.restore();
}

function drawWeaponSystem(ctx, p, gloveColor, bobbing) {
  const w = p.equipment.weapon;
  const isAttacking = p.attackTimer > 0;
  const attackProgress = 1 - (p.attackTimer / p.attackDuration);

  ctx.save();
  ctx.translate(2, -2 - bobbing);

  if (!w || w.type === 'bare') {
    let punchX = 0;
    if (isAttacking) punchX = Math.sin(attackProgress * Math.PI) * 10;
    ctx.fillStyle = gloveColor;
    ctx.fillRect(punchX, -2, 6, 4);
    if (isAttacking) {
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath(); ctx.arc(punchX + 8, 0, 3, 0, Math.PI * 2); ctx.fill();
    }
  } else if (w.type === 'melee') {
    let swingAngle = -0.4;
    if (isAttacking) {
      swingAngle = -1.2 + attackProgress * 2.8;
      ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, 0, 22, -1.2, swingAngle); ctx.stroke();
    }
    ctx.rotate(swingAngle);
    ctx.fillStyle = gloveColor; ctx.fillRect(0, -2, 5, 4);
    ctx.fillStyle = "#334155"; ctx.fillRect(4, -1.5, 4, 3);
    ctx.fillStyle = w.color || "#38bdf8";
    ctx.shadowColor = w.color || "#38bdf8"; ctx.shadowBlur = 10;
    ctx.fillRect(8, -1, 16, 2);
  } else if (w.type === 'bow') {
    let drawPull = 0;
    if (isAttacking) drawPull = Math.sin(attackProgress * Math.PI) * 4;
    ctx.fillStyle = gloveColor; ctx.fillRect(0, -2, 7, 4);
    ctx.save();
    ctx.translate(8, 0);
    ctx.strokeStyle = w.color || "#0284c7";
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(0, 0, 12, -Math.PI / 2.3, Math.PI / 2.3); ctx.stroke();
    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(4, -11); ctx.lineTo(-drawPull, 0); ctx.lineTo(4, 11); ctx.stroke();
    if (isAttacking) {
      ctx.fillStyle = "#67e8f9"; ctx.shadowColor = "#38bdf8"; ctx.shadowBlur = 6;
      ctx.fillRect(-drawPull, -1, 16, 2);
    }
    ctx.restore();
  } else if (w.type === 'staff') {
    let staffTilt = 0.2;
    if (isAttacking) {
      staffTilt = -0.5 + Math.sin(attackProgress * Math.PI) * 0.4;
      ctx.save();
      ctx.translate(18, -14);
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.5 + Math.sin(p.animTimer * 10) * 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
    ctx.rotate(staffTilt);
    ctx.fillStyle = gloveColor; ctx.fillRect(0, -2, 5, 4);
    ctx.fillStyle = "#64748b"; ctx.fillRect(4, -1.5, 20, 3);
    ctx.fillStyle = w.color || "#c084fc";
    ctx.shadowColor = w.color || "#a855f7"; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(24, 0, 4.5, 0, Math.PI * 2); ctx.fill();
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
