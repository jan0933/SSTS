/**
 * SSTS - 美術渲染與紙娃娃動畫引擎
 */

// 裝備色彩與樣式配置表
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
    mantle: { color: "rgba(56, 189, 248, 0.4)" }, // 能量披風
    relic: { color: "#f59e0b" } // 懸浮配件
  },
  talismans: {
    orb: { glow: "#06b6d4" },    // 旋轉守護法器
    totem: { glow: "#e11d48" }
  }
};

/**
 * 繪製具備走路與攻擊動作的紙娃娃玩家
 */
function drawPlayerPaperdoll(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);

  // 面朝向翻轉 (Facing Left/Right)
  if (p.facing < 0) {
    ctx.scale(-1, 1);
  }

  // 1. 動畫姿態參數計算
  let walkCycle = 0;
  let bobbing = 0;
  if (p.isMoving) {
    walkCycle = Math.sin(p.animTimer * 12);
    bobbing = Math.abs(Math.cos(p.animTimer * 12)) * 2;
  }

  const eq = p.equipment;
  const helmConfig = EQUIPMENT_REGISTRY.helmets[eq.helmet];
  const armorConfig = EQUIPMENT_REGISTRY.armors[eq.armor];
  const gloveColor = EQUIPMENT_REGISTRY.gloves[eq.gloves];
  const bootColor = EQUIPMENT_REGISTRY.boots[eq.boots];
  const talisman = EQUIPMENT_REGISTRY.talismans[eq.talisman];

  // 2. 懸浮法器 (浮遊於背後旋轉)
  const orbY = -18 + Math.sin(p.animTimer * 4) * 4;
  const orbX = -18 + Math.cos(p.animTimer * 4) * 3;
  ctx.fillStyle = talisman.glow;
  ctx.shadowColor = talisman.glow;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(orbX, orbY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // 3. 配件：能量披風 (隨走動與風力擺盪)
  const capeSway = (walkCycle * 6) + (p.vx * -2);
  ctx.fillStyle = EQUIPMENT_REGISTRY.accessories[eq.accessory].color;
  ctx.beginPath();
  ctx.moveTo(-6, -4 - bobbing);
  ctx.lineTo(-14 + capeSway, 14);
  ctx.lineTo(-4 + capeSway, 16);
  ctx.lineTo(2, -4 - bobbing);
  ctx.closePath();
  ctx.fill();

  // 4. 下肢：鞋子與腿部動作
  const leftLegAngle = walkCycle * 0.45;
  const rightLegAngle = -walkCycle * 0.45;

  // 左腳 (後)
  ctx.save();
  ctx.translate(-4, 6 - bobbing);
  ctx.rotate(leftLegAngle);
  ctx.fillStyle = bootColor;
  ctx.fillRect(-2, 0, 4, 8);
  ctx.restore();

  // 右腳 (前)
  ctx.save();
  ctx.translate(4, 6 - bobbing);
  ctx.rotate(rightLegAngle);
  ctx.fillStyle = bootColor;
  ctx.fillRect(-2, 0, 4, 8);
  ctx.restore();

  // 5. 軀幹：盔甲
  ctx.save();
  ctx.translate(0, -bobbing);
  ctx.fillStyle = armorConfig.base;
  ctx.fillRect(-7, -8, 14, 14);
  // 胸甲外凸護片
  ctx.fillStyle = armorConfig.plate;
  ctx.beginPath();
  ctx.moveTo(-5, -6);
  ctx.lineTo(5, -6);
  ctx.lineTo(3, 4);
  ctx.lineTo(-3, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 6. 頭部：頭盔與面罩
  ctx.save();
  ctx.translate(0, -12 - bobbing);
  ctx.fillStyle = helmConfig.color;
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();

  // 戰術目鏡 / 護目鏡
  ctx.fillStyle = helmConfig.visor;
  ctx.shadowColor = helmConfig.visor;
  ctx.shadowBlur = 6;
  ctx.fillRect(1, -2, 7, 4);
  ctx.shadowBlur = 0;

  // 重裝頭盔角狀護角
  if (helmConfig.horn) {
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath();
    ctx.moveTo(-4, -6); ctx.lineTo(-10, -12); ctx.lineTo(-2, -8);
    ctx.fill();
  }
  ctx.restore();

  // 7. 手臂與三種武器型態 (近戰、弓箭、法杖)
  drawWeaponSystem(ctx, p, gloveColor, bobbing);

  ctx.restore();
}

/**
 * 繪製手臂與武器攻擊姿態
 */
function drawWeaponSystem(ctx, p, gloveColor, bobbing) {
  const w = p.equipment.weapon; // { type: 'melee' | 'bow' | 'staff', name: '...' }
  const isAttacking = p.attackTimer > 0;
  const attackProgress = 1 - (p.attackTimer / p.attackDuration); // 0 -> 1

  ctx.save();
  ctx.translate(2, -2 - bobbing);

  if (w.type === 'melee') {
    // 【近戰軍刀】：未攻擊時持械待機，攻擊時 120 度大範圍揮擊
    let swingAngle = -0.4;
    if (isAttacking) {
      // 揮刀弧度由後方甩至前方
      swingAngle = -1.2 + attackProgress * 2.8;
      // 揮刀軌跡劍氣殘影
      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 22, -1.2, swingAngle);
      ctx.stroke();
    }
    ctx.rotate(swingAngle);

    // 手套
    ctx.fillStyle = gloveColor;
    ctx.fillRect(0, -2, 5, 4);

    // 刀柄與等離子光刃
    ctx.fillStyle = "#334155";
    ctx.fillRect(4, -1.5, 4, 3);
    ctx.fillStyle = "#38bdf8";
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 10;
    ctx.fillRect(8, -1, 16, 2);

  } else if (w.type === 'bow') {
    // 【電磁弓弩】：攻擊時有拉弦蓄力動作
    let drawPull = 0;
    if (isAttacking) {
      drawPull = Math.sin(attackProgress * Math.PI) * 4;
    }

    // 手臂前伸
    ctx.fillStyle = gloveColor;
    ctx.fillRect(0, -2, 7, 4);

    // 弓身 (弧形)
    ctx.save();
    ctx.translate(8, 0);
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 12, -Math.PI / 2.3, Math.PI / 2.3);
    ctx.stroke();

    // 弓弦
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(4, -11);
    ctx.lineTo(-drawPull, 0);
    ctx.lineTo(4, 11);
    ctx.stroke();

    // 箭矢 (攻擊時裝填)
    if (isAttacking) {
      ctx.fillStyle = "#67e8f9";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 6;
      ctx.fillRect(-drawPull, -1, 16, 2);
    }
    ctx.restore();

  } else if (w.type === 'staff') {
    // 【元素法杖】：攻擊時舉杖前指，頂部充能聚光
    let staffTilt = 0.2;
    if (isAttacking) {
      staffTilt = -0.5 + Math.sin(attackProgress * Math.PI) * 0.4;
      // 法杖法陣光環
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

    // 手臂
    ctx.fillStyle = gloveColor;
    ctx.fillRect(0, -2, 5, 4);

    // 木質/合金杖身
    ctx.fillStyle = "#64748b";
    ctx.fillRect(4, -1.5, 20, 3);

    // 頂部法器寶珠
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
 * 繪製海嗣突變敵人
 */
function drawEnemies(ctx, enemies) {
  for (const e of enemies) {
    ctx.save();
    ctx.translate(e.x, e.y);

    if (e.type === 'jelly') {
      // 幽浮水母：半透明發光傘蓋 + 4 條飄逸正弦波觸鬚
      ctx.fillStyle = 'rgba(236, 72, 153, 0.85)';
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, -2, e.radius, Math.PI, 0);
      ctx.closePath();
      ctx.fill();

      // 觸鬚
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
      // 突變寄生魚：梭狀身形 + 快速甩尾鰭
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
      // 身體
      ctx.beginPath();
      ctx.ellipse(0, 0, e.radius * 1.2, e.radius * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();

      // 擺動尾鰭
      const tailWiggle = Math.sin(e.pulse * 2) * 5;
      ctx.beginPath();
      ctx.moveTo(-e.radius * 0.8, 0);
      ctx.lineTo(-e.radius * 1.5, -5 + tailWiggle);
      ctx.lineTo(-e.radius * 1.5, 5 + tailWiggle);
      ctx.closePath();
      ctx.fill();

      // 凶暴眼珠
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(e.radius * 0.6, -2, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
