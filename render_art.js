/**
 * SSTS - 美術渲染與紙娃娃動畫模組
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
  gloves: {
    scout: "#2dd4bf",
    heavy: "#94a3b8",
    archmage: "#a78bfa"
  },
  boots: {
    scout: "#0d9488",
    heavy: "#1e293b",
    archmage: "#5b21b6"
  },
  accessories: {
    mantle: { color: "rgba(56, 189, 248, 0.4)" },
    relic: { color: "#f59e0b" }
  },
  talismans: {
    orb: { glow: "#06b6d4" },
    totem: { glow: "#e11d48" }
  }
};

/**
 * 繪製衝刺時留下的電磁等離子殘影
 */
function drawDashGhosts(ctx, ghosts) {
  for (let i = 0; i < ghosts.length; i++) {
    const g = ghosts[i];
    ctx.save();
    ctx.translate(g.x, g.y);
    if (g.facing < 0) ctx.scale(-1, 1);

    ctx.fillStyle = `rgba(56, 189, 248, ${g.alpha * 0.45})`;
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 10 * g.alpha;

    // 簡化機甲剪影
    ctx.beginPath();
    ctx.arc(0, -10, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-6, -6, 12, 16);
    ctx.restore();
  }
}

/**
 * 繪製紙娃娃玩家本體 (包含骨骼走路、衝刺無敵光暈與呼吸)
 */
function drawPlayerPaperdoll(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);

  if (p.facing < 0) {
    ctx.scale(-1, 1);
  }

  let walkCycle = 0;
  let bobbing = 0;
  if (p.isMoving) {
    walkCycle = Math.sin(p.animTimer * 12);
    bobbing = Math.abs(Math.cos(p.animTimer * 12)) * 2;
  }

  // 衝刺中的高亮過載護盾光環
  if (p.isDashing) {
    ctx.save();
    ctx.strokeStyle = "rgba(103, 232, 249, 0.8)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 22, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  const eq = p.equipment;
  const helmConfig = EQUIPMENT_REGISTRY.helmets[eq.helmet];
  const armorConfig = EQUIPMENT_REGISTRY.armors[eq.armor];
  const gloveColor = EQUIPMENT_REGISTRY.gloves[eq.gloves];
  const bootColor = EQUIPMENT_REGISTRY.boots[eq.boots];
  const talisman = EQUIPMENT_REGISTRY.talismans[eq.talisman];

  // 1. 懸浮法器
  const orbY = -18 + Math.sin(p.animTimer * 4) * 4;
  const orbX = -18 + Math.cos(p.animTimer * 4) * 3;
  ctx.fillStyle = talisman.glow;
  ctx.shadowColor = talisman.glow;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(orbX, orbY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // 2. 披風配件
  const capeSway = (walkCycle * 6) + (p.vx * -2);
  ctx.fillStyle = EQUIPMENT_REGISTRY.accessories[eq.accessory].color;
  ctx.beginPath();
  ctx.moveTo(-6, -4 - bobbing);
  ctx.lineTo(-14 + capeSway, 14);
  ctx.lineTo(-4 + capeSway, 16);
  ctx.lineTo(2, -4 - bobbing);
  ctx.closePath();
  ctx.fill();

  // 3. 雙腿與鞋子
  const leftLegAngle = walkCycle * 0.45;
  const rightLegAngle = -walkCycle * 0.45;

  ctx.save();
  ctx.translate(-4, 6 - bobbing);
  ctx.rotate(leftLegAngle);
  ctx.fillStyle = bootColor;
  ctx.fillRect(-2, 0, 4, 8);
  ctx.restore();

  ctx.save();
  ctx.translate(4, 6 - bobbing);
  ctx.rotate(rightLegAngle);
  ctx.fillStyle = bootColor;
  ctx.fillRect(-2, 0, 4, 8);
  ctx.restore();

  // 4. 軀幹與盔甲
  ctx.save();
  ctx.translate(0, -bobbing);
  ctx.fillStyle = armorConfig.base;
  ctx.fillRect(-7, -8, 14, 14);
  ctx.fillStyle = armorConfig.plate;
  ctx.beginPath();
  ctx.moveTo(-5, -6);
  ctx.lineTo(5, -6);
  ctx.lineTo(3, 4);
  ctx.lineTo(-3, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 5. 頭盔與目鏡
  ctx.save();
  ctx.translate(0, -12 - bobbing);
  ctx.fillStyle = helmConfig.color;
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = helmConfig.visor;
  ctx.shadowColor = helmConfig.visor;
  ctx.shadowBlur = 6;
  ctx.fillRect(1, -2, 7, 4);
  ctx.shadowBlur = 0;

  if (helmConfig.horn) {
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath();
    ctx.moveTo(-4, -6); ctx.lineTo(-10, -12); ctx.lineTo(-2, -8);
    ctx.fill();
  }
  ctx.restore();

  // 6. 手臂與武器
  drawWeaponSystem(ctx, p, gloveColor, bobbing);

  ctx.restore();
}

/**
 * 繪製武器與各異的攻擊動作姿態
 */
function drawWeaponSystem(ctx, p, gloveColor, bobbing) {
  const w = p.equipment.weapon;
  const isAttacking = p.attackTimer > 0;
  const attackProgress = 1 - (p.attackTimer / p.attackDuration);

  ctx.save();
  ctx.translate(2, -2 - bobbing);

  if (w.type === 'melee') {
    let swingAngle = -0.4;
    if (isAttacking) {
      swingAngle = -1.2 + attackProgress * 2.8;
      ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 22, -1.2, swingAngle);
      ctx.stroke();
    }
    ctx.rotate(swingAngle);

    ctx.fillStyle = gloveColor;
    ctx.fillRect(0, -2, 5, 4);

    ctx.fillStyle = "#334155";
    ctx.fillRect(4, -1.5, 4, 3);
    ctx.fillStyle = "#38bdf8";
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 10;
    ctx.fillRect(8, -1, 16, 2);

  } else if (w.type === 'bow') {
    let drawPull = 0;
    if (isAttacking) {
      drawPull = Math.sin(attackProgress * Math.PI) * 4;
    }

    ctx.fillStyle = gloveColor;
    ctx.fillRect(0, -2, 7, 4);

    ctx.save();
    ctx.translate(8, 0);
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 12, -Math.PI / 2.3, Math.PI / 2.3);
    ctx.stroke();

    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(4, -11);
    ctx.lineTo(-drawPull, 0);
    ctx.lineTo(4, 11);
    ctx.stroke();

    if (isAttacking) {
      ctx.fillStyle = "#67e8f9";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 6;
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
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.rotate(staffTilt);

    ctx.fillStyle = gloveColor;
    ctx.fillRect(0, -2, 5, 4);

    ctx.fillStyle = "#64748b";
    ctx.fillRect(4, -1.5, 20, 3);

    ctx.fillStyle = "#c084fc";
    ctx.shadowColor = "#a855f7";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(24, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 繪製海嗣敵群
 */
function drawEnemies(ctx, enemies) {
  for (const e of enemies) {
    ctx.save();
    ctx.translate(e.x, e.y);

    if (e.type === 'jelly') {
      ctx.fillStyle = 'rgba(236, 72, 153, 0.85)';
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, -2, e.radius, Math.PI, 0);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 1.5;
      for (let t = -3; t <= 3; t += 2) {
        ctx.beginPath();
        ctx.moveTo(t * 2.5, -2);
        const wave = Math.sin(e.pulse + t) * 3;
        ctx.quadraticCurveTo(t * 2.5 + wave, 6, t * 2.5 - wave, 12);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.ellipse(0, 0, e.radius * 1.2, e.radius * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();

      const tailWiggle = Math.sin(e.pulse * 2) * 5;
      ctx.beginPath();
      ctx.moveTo(-e.radius * 0.8, 0);
      ctx.lineTo(-e.radius * 1.5, -5 + tailWiggle);
      ctx.lineTo(-e.radius * 1.5, 5 + tailWiggle);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(e.radius * 0.6, -2, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

/**
 * 背包視窗專用的特寫放大預覽 (2.2x)
 */
function drawInventoryPreview(ctx, p, animTime) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const mockPlayer = {
    ...p,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    isMoving: false,
    attackTimer: 0,
    isDashing: false,
    facing: 1,
    animTimer: animTime
  };

  ctx.save();
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2 + 10);
  ctx.scale(2.2, 2.2);
  drawPlayerPaperdoll(ctx, mockPlayer);
  ctx.restore();
}
