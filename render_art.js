/**
 * SSTS - 戰場環境、22種世界各國特色建築地標、12種高細節生態海嗣、10大傳說巨獸BOSS與精細人形機甲繪圖引擎 (render_art.js)
 */

/* ==================== 大洲戰場背景 ==================== */
function drawContinentBackground(ctx, continent, width, height) {
  let bgTop = '#071326';
  let bgBot = '#030814';
  let gridColor = 'rgba(56, 189, 248, 0.06)';

  if (continent === 'EU' || continent === 'GL') {
    bgTop = '#081b33'; bgBot = '#030b1a'; gridColor = 'rgba(125, 211, 252, 0.07)';
  } else if (continent === 'AS') {
    bgTop = '#071f24'; bgBot = '#020d12'; gridColor = 'rgba(45, 212, 191, 0.07)';
  } else if (continent === 'AF') {
    bgTop = '#1f1408'; bgBot = '#0d0702'; gridColor = 'rgba(251, 191, 36, 0.06)';
  } else if (continent === 'AM') {
    bgTop = '#0d1a14'; bgBot = '#040a07'; gridColor = 'rgba(52, 211, 153, 0.07)';
  } else if (continent === 'OC') {
    bgTop = '#051e2e'; bgBot = '#020c14'; gridColor = 'rgba(6, 182, 212, 0.08)';
  }

  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, bgTop);
  grad.addColorStop(1, bgBot);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 戰術格線
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  const step = 45;
  ctx.beginPath();
  for (let x = 0; x <= width; x += step) {
    ctx.moveTo(x, 0); ctx.lineTo(x, height);
  }
  for (let y = 0; y <= height; y += step) {
    ctx.moveTo(0, y); ctx.lineTo(width, y);
  }
  ctx.stroke();
}

/* ==================== 世界百國特色建築障礙物繪製引擎 (22種地標) ==================== */
function drawObstacles(ctx, obstacles, continent, globalTime) {
  if (!obstacles || obstacles.length === 0) return;

  for (const obs of obstacles) {
    const x = obs.x;
    const y = obs.y;
    const w = obs.width || 48;
    const h = obs.height || 48;
    const halfW = w / 2;
    const halfH = h / 2;
    const type = obs.landmark || 'eu_castle';

    ctx.save();

    // 1. 戰術防護底座（標示精準物理碰撞箱範圍）
    ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x - halfW, y - halfH, w, h, 6);
    } else {
      ctx.rect(x - halfW, y - halfH, w, h);
    }
    ctx.fill();
    ctx.stroke();

    // 底座四角定位光點
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x - halfW + 2, y - halfH + 2, 3, 3);
    ctx.fillRect(x + halfW - 5, y - halfH + 2, 3, 3);
    ctx.fillRect(x - halfW + 2, y + halfH - 5, 3, 3);
    ctx.fillRect(x + halfW - 5, y + halfH - 5, 3, 3);

    // 2. 繪製對應國家特色建築地標
    ctx.translate(x, y + 6);

    switch (type) {
      case 'vatican_dome': // 梵蒂岡：聖彼得大教堂圓頂
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(-16, -2, 32, 12);
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(0, -2, 13, Math.PI, 0);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -15); ctx.lineTo(0, -24);
        ctx.moveTo(-4, -20); ctx.lineTo(4, -20);
        ctx.stroke();
        break;

      case 'casino_palace': // 摩納哥：蒙地卡羅皇宮雙塔
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(-15, -4, 30, 14);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(-9, -4, 5, Math.PI, 0);
        ctx.arc(9, -4, 5, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(-4, 2, 8, 8);
        break;

      case 'singapore_mbs': // 新加坡：濱海灣金沙酒店空中船型花園
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-11, -10, 5, 20);
        ctx.fillRect(-2.5, -10, 5, 20);
        ctx.fillRect(6, -10, 5, 20);
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(-16, -13);
        ctx.quadraticCurveTo(0, -9, 17, -15);
        ctx.lineTo(15, -10);
        ctx.lineTo(-15, -10);
        ctx.closePath();
        ctx.fill();
        break;

      case 'merlion_statue': // 新加坡：魚尾獅噴泉像
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(-6, 10);
        ctx.quadraticCurveTo(-8, -4, -1, -14);
        ctx.quadraticCurveTo(6, -8, 4, 10);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(3, -10);
        ctx.quadraticCurveTo(12, -8, 15, 6);
        ctx.stroke();
        break;

      case 'taipei_101': // 台灣：台北 101 竹節摩天大樓
        ctx.fillStyle = '#0ea5e9';
        ctx.fillRect(-10, 4, 20, 8);
        for (let tier = 0; tier < 4; tier++) {
          const ty = -2 - tier * 5;
          const tw = 14 - tier * 1.2;
          ctx.fillStyle = tier % 2 === 0 ? '#38bdf8' : '#0284c7';
          ctx.beginPath();
          ctx.moveTo(-tw / 2, ty + 5);
          ctx.lineTo(-tw / 2 - 2, ty);
          ctx.lineTo(tw / 2 + 2, ty);
          ctx.lineTo(tw / 2, ty + 5);
          ctx.closePath();
          ctx.fill();
        }
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, -22); ctx.lineTo(0, -30);
        ctx.stroke();
        break;

      case 'kor_palace': // 韓國：景福宮雙層歇山殿樓
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(-14, 3, 28, 7);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-10, -4, 20, 7);
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(-17, -4); ctx.lineTo(0, -14); ctx.lineTo(17, -4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        break;

      case 'jp_torii': // 日本：嚴島海上鳥居
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-11, -14, 3.5, 25);
        ctx.fillRect(7.5, -14, 3.5, 25);
        ctx.fillRect(-14, -8, 28, 3);
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(-17, -16);
        ctx.quadraticCurveTo(0, -13, 17, -16);
        ctx.lineTo(15, -12);
        ctx.lineTo(-15, -12);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-2, -13, 4, 5);
        break;

      case 'jp_pagoda':
      case 'pagoda_temple': // 亞洲：飛簷五重塔 / 東方廟宇
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(-12, 2, 24, 9);
        for (let floor = 0; floor < 3; floor++) {
          const fy = -2 - floor * 7;
          const fw = 28 - floor * 5;
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(-fw / 2, fy + 3);
          ctx.quadraticCurveTo(0, fy + 1, fw / 2, fy + 3);
          ctx.lineTo(fw / 2 - 4, fy - 2);
          ctx.lineTo(-fw / 2 + 4, fy - 2);
          ctx.closePath();
          ctx.fill();
        }
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(0, -25); ctx.stroke();
        break;

      case 'th_stupa': // 東南亞：金頂佛塔
        ctx.fillStyle = '#facc15';
        ctx.fillRect(-13, 4, 26, 6);
        ctx.beginPath();
        ctx.arc(0, 4, 10, Math.PI, 0);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-5, -4); ctx.lineTo(0, -24); ctx.lineTo(5, -4);
        ctx.closePath();
        ctx.fill();
        break;

      case 'in_tajmahal': // 印度：泰姬瑪哈陵
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-12, -2, 24, 12);
        ctx.beginPath();
        ctx.arc(0, -4, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-16, -12, 2.5, 22);
        ctx.fillRect(13.5, -12, 2.5, 22);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-3, 2, 6, 8);
        break;

      case 'fr_eiffel': // 法國：艾菲爾鐵塔
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-14, 11); ctx.quadraticCurveTo(-4, -4, 0, -24);
        ctx.moveTo(14, 11);  ctx.quadraticCurveTo(4, -4, 0, -24);
        ctx.moveTo(-9, 2);   ctx.lineTo(9, 2);
        ctx.moveTo(-5, -8);  ctx.lineTo(5, -8);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 11, 6, Math.PI, 0);
        ctx.stroke();
        break;

      case 'eg_pyramid': // 埃及：吉薩金字塔
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.moveTo(-17, 11);
        ctx.lineTo(0, -18);
        ctx.lineTo(5, 11);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#a16207';
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(17, 11);
        ctx.lineTo(5, 11);
        ctx.closePath();
        ctx.fill();
        break;

      case 'obelisk_monument': // 非洲/古文明：方尖碑紀念柱
        ctx.fillStyle = '#d97706';
        ctx.fillRect(-8, 5, 16, 6);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(-5, 5);
        ctx.lineTo(-3, -18);
        ctx.lineTo(0, -24);
        ctx.lineTo(3, -18);
        ctx.lineTo(5, 5);
        ctx.closePath();
        ctx.fill();
        break;

      case 'islamic_mosque': // 中東/伊斯蘭世界：圓頂清真寺與宣禮塔
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(-11, -1, 22, 11);
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(0, -2, 8, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-15, -14, 3, 24);
        ctx.fillRect(12, -14, 3, 24);
        break;

      case 'ziggurat_step': // 美索不達米亞/中亞：巴比倫階梯神廟
        ctx.fillStyle = '#b45309';
        ctx.fillRect(-16, 3, 32, 7);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(-12, -4, 24, 7);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-7, -11, 14, 7);
        break;

      case 'au_opera': // 澳洲：雪梨歌劇院風帆
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        for (let s = 0; s < 3; s++) {
          const sx = -12 + s * 8;
          const sh = 18 - s * 3;
          ctx.beginPath();
          ctx.moveTo(sx, 10);
          ctx.quadraticCurveTo(sx + 2, 10 - sh, sx + 12, 10 - sh + 4);
          ctx.lineTo(sx + 9, 10);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        break;

      case 'it_colosseum': // 義大利：羅馬競技場
        ctx.fillStyle = '#d6d3d1';
        ctx.fillRect(-16, -6, 32, 17);
        ctx.fillStyle = '#a8a29e';
        ctx.fillRect(-16, -6, 18, 8);
        ctx.fillStyle = '#0f172a';
        for (let ax = -12; ax <= 9; ax += 7) {
          ctx.beginPath();
          ctx.arc(ax + 1.5, 4, 2, Math.PI, 0);
          ctx.fillRect(ax - 0.5, 4, 4, 6);
          ctx.fill();
        }
        break;

      case 'roman_pillar': // 古希臘/羅馬：帕德嫩神殿多立克石柱群
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(-15, 6, 30, 4);
        ctx.fillRect(-12, -10, 4, 16);
        ctx.fillRect(-2, -10, 4, 16);
        ctx.fillRect(8, -10, 4, 16);
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(-16, -10); ctx.lineTo(0, -19); ctx.lineTo(16, -10);
        ctx.closePath();
        ctx.fill();
        break;

      case 'cn_greatwall': // 中國：萬里長城烽火台
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(-14, -6, 28, 17);
        for (let bx = -14; bx <= 10; bx += 6) {
          ctx.fillRect(bx, -10, 4, 4);
        }
        const flicker = Math.sin(globalTime * 8) * 2;
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(0, -13, 4 + flicker * 0.3, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'us_liberty': // 美國：自由女神火炬台
        ctx.fillStyle = '#64748b';
        ctx.fillRect(-10, 2, 20, 9);
        ctx.fillStyle = '#2dd4bf';
        ctx.fillRect(-6, -12, 12, 14);
        ctx.strokeStyle = '#5eead4';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-6, -12); ctx.lineTo(-10, -17);
        ctx.moveTo(0, -12);  ctx.lineTo(0, -19);
        ctx.moveTo(6, -12);  ctx.lineTo(10, -17);
        ctx.stroke();
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(10, -18, 3.5, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'br_christ': // 巴西/南美：救世基督像聖壇
        ctx.fillStyle = '#64748b';
        ctx.fillRect(-7, 3, 14, 7);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-3, -15, 6, 18);
        ctx.fillRect(-14, -12, 28, 3.5);
        break;

      case 'mayan_temple': // 拉丁美洲：瑪雅庫庫爾坎階梯神殿
        ctx.fillStyle = '#10b981';
        ctx.fillRect(-16, 4, 32, 6);
        ctx.fillStyle = '#059669';
        ctx.fillRect(-12, -2, 24, 6);
        ctx.fillStyle = '#047857';
        ctx.fillRect(-8, -8, 16, 6);
        ctx.fillStyle = '#a7f3d0';
        ctx.fillRect(-4, -14, 8, 6);
        break;

      case 'ca_cntower': // 加拿大：多倫多 CN 電視塔
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(-6, 10); ctx.lineTo(-1.5, -24); ctx.lineTo(1.5, -24); ctx.lineTo(6, 10);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(-7, -14, 14, 4);
        break;

      case 'uk_bigben': // 英國：倫敦大笨鐘鐘樓
        ctx.fillStyle = '#d97706';
        ctx.fillRect(-8, -14, 16, 25);
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath(); ctx.arc(0, -7, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(-9, -14); ctx.lineTo(0, -26); ctx.lineTo(9, -14);
        ctx.closePath();
        ctx.fill();
        break;

      case 'ru_kremlin': // 俄羅斯：聖瓦西里洋蔥頭教堂
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(-13, -2, 26, 13);
        const domes = [{ dx: -9, h: 12, c: '#38bdf8' }, { dx: 0, h: 18, c: '#facc15' }, { dx: 9, h: 12, c: '#34d399' }];
        domes.forEach(dm => {
          ctx.fillStyle = dm.c;
          ctx.beginPath();
          ctx.arc(dm.dx, -4, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(dm.dx - 3, -6); ctx.lineTo(dm.dx, -4 - dm.h * 0.6); ctx.lineTo(dm.dx + 3, -6);
          ctx.fill();
        });
        break;

      case 'skyscraper_twin': // 美洲/現代都市：摩天雙子星大樓
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(-13, -18, 11, 29);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(2, -13, 11, 24);
        ctx.fillStyle = '#bae6fd';
        for (let wy = -14; wy <= 6; wy += 5) {
          ctx.fillRect(-10, wy, 5, 2);
          if (wy >= -10) ctx.fillRect(5, wy, 5, 2);
        }
        break;

      case 'viking_hall': // 北歐：維京木板尖頂教堂
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-11, -3, 22, 13);
        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.moveTo(-14, -3); ctx.lineTo(0, -16); ctx.lineTo(14, -3);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-6, -13); ctx.lineTo(0, -24); ctx.lineTo(6, -13);
        ctx.closePath();
        ctx.fill();
        break;

      case 'coral_totem':
      case 'maldives_bungalow': // 大洋洲：珊瑚巨石柱 / 海島水上屋
        ctx.fillStyle = '#14b8a6';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(-10, -14, 20, 25, 4);
        else ctx.rect(-10, -14, 20, 25);
        ctx.fill();
        ctx.strokeStyle = '#5eead4';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-6, -9, 12, 5);
        ctx.strokeRect(-5, 0, 10, 4);
        break;

      case 'polar_beacon': // 極地/寒冷帶：科學雷達觀測塔
        ctx.fillStyle = '#64748b';
        ctx.fillRect(-9, -4, 18, 15);
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(0, -6, 8, Math.PI, 0);
        ctx.fill();
        const wave = (globalTime * 15) % 10;
        ctx.strokeStyle = `rgba(56, 189, 248, ${1 - wave / 10})`;
        ctx.beginPath();
        ctx.arc(0, -14, 3 + wave, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
        break;

      case 'eu_castle':
      default: // 歐陸：中世紀堡壘雙塔
        ctx.fillStyle = '#64748b';
        ctx.fillRect(-14, -8, 9, 19);
        ctx.fillRect(5, -8, 9, 19);
        ctx.fillRect(-5, -2, 10, 13);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(-15, -8); ctx.lineTo(-9.5, -18); ctx.lineTo(-4, -8);
        ctx.moveTo(4, -8);   ctx.lineTo(9.5, -18);  ctx.lineTo(15, -8);
        ctx.fill();
        break;
    }

    ctx.restore();
  }
}

/* ==================== 戰場磁鐵與 EMP 炸彈掉落物 ==================== */
function drawBattlePickups(ctx, pickups, globalTime) {
  if (!pickups) return;
  for (const bp of pickups) {
    const bob = Math.sin(globalTime * 5) * 3;
    ctx.save();
    ctx.translate(bp.x, bp.y + bob);
    if (bp.type === 'magnet') {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 0, 9, Math.PI, 0);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ef4444';
      ctx.stroke();
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-10, 0, 4, 5);
      ctx.fillRect(6, 0, 4, 5);
    } else {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
  }
}

/* ==================== 12 種高細節生態小怪與 10 大傳說海怪 BOSS 繪製引擎 ==================== */
function drawEnemies(ctx, enemies, boss) {
  for (const e of enemies) {
    ctx.save();
    ctx.translate(e.x, e.y);
    const s = 1 + Math.sin(e.pulse) * 0.06;
    ctx.scale(s, s);
    const r = e.radius || 10;
    const facing = (e.vx !== undefined && e.vx < 0) ? -1 : 1;

    switch (e.kind) {
      case 'tiger_shark':
      case 'great_white': { // 掠食巨鯊（流線魚身 + 背鰭 + 擺動尾鰭 + 利齒）
        ctx.scale(facing, 1);
        ctx.fillStyle = e.kind === 'great_white' ? '#475569' : '#0284c7';
        ctx.beginPath();
        ctx.ellipse(0, 0, r + 5, r - 3, 0, 0, Math.PI * 2);
        ctx.fill();
        // 腹部銀白
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.ellipse(1, 2.5, r + 2, r - 6, 0, 0, Math.PI);
        ctx.fill();
        // 高聳背鰭與擺動尾鰭
        const tailWag = Math.sin(e.pulse * 2.5) * 3;
        ctx.fillStyle = e.kind === 'great_white' ? '#334155' : '#0369a1';
        ctx.beginPath();
        ctx.moveTo(-1, -r + 3); ctx.lineTo(-5, -r - 6); ctx.lineTo(4, -r + 3);
        ctx.moveTo(-r - 3, 0); ctx.lineTo(-r - 9, -6 + tailWag); ctx.lineTo(-r - 9, 6 + tailWag);
        ctx.closePath();
        ctx.fill();
        // 凶狠紅眼
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath(); ctx.arc(6, -2, 2, 0, Math.PI * 2); ctx.fill();
        break;
      }

      case 'armored_crab':
      case 'coral_golem': { // 重甲巨鉗蟹（鋸齒甲殼 + 兩側步足 + 雙巨螯）
        const crabColor = e.kind === 'coral_golem' ? '#991b1b' : '#c2410c';
        const clawColor = e.kind === 'coral_golem' ? '#ef4444' : '#f97316';
        // 兩側六條步足
        ctx.strokeStyle = crabColor;
        ctx.lineWidth = 2;
        const legMove = Math.sin(e.pulse * 2) * 2;
        for (let side of [-1, 1]) {
          for (let ly = -3; ly <= 4; ly += 3.5) {
            ctx.beginPath();
            ctx.moveTo(side * (r - 2), ly);
            ctx.lineTo(side * (r + 6), ly + 3 + (ly === 0 ? legMove : -legMove));
            ctx.stroke();
          }
        }
        // 扁橢圓鋸齒背甲
        ctx.fillStyle = crabColor;
        ctx.beginPath();
        ctx.ellipse(0, 1, r + 2, r - 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fdba74';
        ctx.lineWidth = 1;
        ctx.stroke();
        // 雙大螯
        ctx.fillStyle = clawColor;
        ctx.beginPath();
        ctx.ellipse(-r - 2, -6, 4.5, 3.2, -0.4, 0, Math.PI * 2);
        ctx.ellipse(r + 2, -6, 4.5, 3.2, 0.4, 0, Math.PI * 2);
        ctx.fill();
        // 雙眼柄
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(-3.5, -4, 2, 0, Math.PI * 2); ctx.arc(3.5, -4, 2, 0, Math.PI * 2); ctx.fill();
        break;
      }

      case 'angler_fish': { // 幽光燈籠魚（圓鼓深海魚身 + 尾鰭 + 利齒大口 + 頭頂發光燈籠）
        ctx.scale(facing, 1);
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath(); ctx.ellipse(-1, 0, r + 1, r - 1, 0, 0, Math.PI * 2); ctx.fill();
        // 尾鰭
        ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(-r - 6, -5); ctx.lineTo(-r - 6, 5); ctx.closePath(); ctx.fill();
        // 利齒巨口
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(4, 2, 5, -0.3, Math.PI * 0.8); ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(3, -1, 1.5, 2.5); ctx.fillRect(6, 0, 1.5, 2.5);
        // 頭頂發光誘餌
        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(1, -r + 1); ctx.quadraticCurveTo(8, -r - 8, 11, -r - 2); ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(11, -r - 2, 3, 0, Math.PI * 2); ctx.fill();
        break;
      }

      case 'ink_octopus': { // 墨淵毒章魚（囊狀頭冠 + 6 條波浪觸腕）
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        for (let t = -7; t <= 7; t += 3.5) {
          const wave = Math.sin(e.pulse * 1.8 + t) * 3.5;
          ctx.beginPath();
          ctx.moveTo(t * 0.7, 2);
          ctx.quadraticCurveTo(t + wave, 7, t * 1.1 - wave * 0.5, r + 5);
          ctx.stroke();
        }
        ctx.fillStyle = '#6b21a8';
        ctx.beginPath();
        ctx.ellipse(0, -3, r - 1, r + 1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fde047';
        ctx.beginPath(); ctx.arc(-3, -1, 1.8, 0, Math.PI * 2); ctx.arc(3, -1, 1.8, 0, Math.PI * 2); ctx.fill();
        break;
      }

      case 'siren_eel':
      case 'abyss_worm': { // 電擊鰻 / 海溝蠕蟲（多節蛇形蠕動身軀）
        const bodyCol = e.kind === 'siren_eel' ? '#0284c7' : '#be123c';
        const glowCol = e.kind === 'siren_eel' ? '#7dd3fc' : '#fda4af';
        for (let seg = -2; seg <= 2; seg++) {
          const sx = seg * 4.5 * facing;
          const sy = Math.sin(e.pulse * 2 + seg * 1.1) * 3.5;
          const sr = (seg === 2) ? 5.5 : (4.5 - Math.abs(seg) * 0.5);
          ctx.fillStyle = bodyCol;
          ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = glowCol; ctx.lineWidth = 1; ctx.stroke();
        }
        break;
      }

      case 'sting_ray': { // 幻影魔鬼魚（流線寬翼 + 長毒尾針）
        ctx.scale(facing, 1);
        ctx.strokeStyle = '#5eead4';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-r, 0);
        ctx.quadraticCurveTo(-r - 6, Math.sin(e.pulse * 2) * 4, -r - 12, 0);
        ctx.stroke();

        ctx.fillStyle = '#0f766e';
        ctx.beginPath();
        ctx.moveTo(r + 4, 0);
        ctx.quadraticCurveTo(0, -r - 5, -r - 2, -3);
        ctx.lineTo(-r + 2, 0);
        ctx.lineTo(-r - 2, 3);
        ctx.quadraticCurveTo(0, r + 5, r + 4, 0);
        ctx.fill();
        break;
      }

      case 'frost_urchin': { // 冰淵棘海膽（深藍核心 + 12 根長短冰晶尖刺）
        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 1.8;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
          const spikeLen = (Math.round(a * 10) % 2 === 0) ? r + 6 : r + 3;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * (r - 3), Math.sin(a) * (r - 3));
          ctx.lineTo(Math.cos(a) * spikeLen, Math.sin(a) * spikeLen);
          ctx.stroke();
        }
        ctx.fillStyle = '#0369a1';
        ctx.beginPath(); ctx.arc(0, 0, r - 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
        break;
      }

      case 'box_jelly':
      case 'ice_jelly':
      default: { // 寒霜/箱型水母（半透明傘蓋 + 4 條飄動觸鬚）
        const domeColor = e.kind === 'box_jelly' ? 'rgba(6, 182, 212, 0.85)' : 'rgba(99, 102, 241, 0.85)';
        const tentacleColor = e.kind === 'box_jelly' ? '#67e8f9' : '#a5b4fc';
        // 飄動觸鬚
        ctx.strokeStyle = tentacleColor;
        ctx.lineWidth = 1.5;
        for (let tx = -5; tx <= 5; tx += 3.3) {
          const sway = Math.sin(e.pulse * 1.8 + tx) * 3;
          ctx.beginPath();
          ctx.moveTo(tx, 1);
          ctx.quadraticCurveTo(tx + sway, 6, tx - sway * 0.6, r + 5);
          ctx.stroke();
        }
        // 半圓傘蓋
        ctx.fillStyle = domeColor;
        ctx.beginPath();
        ctx.arc(0, 1, r, Math.PI, 0);
        ctx.quadraticCurveTo(0, 4, -r, 1);
        ctx.fill();
        ctx.strokeStyle = '#e0e7ff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        break;
      }
    }
    ctx.restore();
  }

  /* ==================== 傳說海怪 BOSS 專屬視覺繪製 ==================== */
  if (boss && boss.active) {
    ctx.save();
    ctx.translate(boss.x, boss.y);
    const r = boss.radius;
    const visual = boss.visual || 'leviathan';
    const pulse = Math.sin(boss.pulse * 2);

    // 1. 深淵霸主氣場光暈
    const aura = ctx.createRadialGradient(0, 0, r * 0.25, 0, 0, r + 18 + pulse * 3);
    aura.addColorStop(0, 'rgba(244, 63, 94, 0.55)');
    aura.addColorStop(1, 'rgba(2, 6, 23, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath(); ctx.arc(0, 0, r + 18 + pulse * 3, 0, Math.PI * 2); ctx.fill();

    // 2. 依據傳說海怪種類繪製專屬霸主外型
    switch (visual) {
      case 'umibozu': // 【海坊主】：漆黑幽冥僧巨影 + 冥火雙瞳 + 念珠光環
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.arc(0, -4, r * 0.85, Math.PI, 0);
        ctx.lineTo(r * 0.95, r * 0.85);
        ctx.lineTo(-r * 0.95, r * 0.85);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 5) {
          ctx.fillStyle = '#d8b4fe';
          ctx.beginPath();
          ctx.arc(Math.cos(a + boss.pulse * 0.3) * (r + 5), Math.sin(a + boss.pulse * 0.3) * (r + 5), 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.ellipse(-11, -6, 6, 3.5, -0.2, 0, Math.PI * 2);
        ctx.ellipse(11, -6, 6, 3.5, 0.2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'bloop': // 【THE BLOOP】：深海超巨型聲納鯨怪 + 聲波同心圓
        ctx.fillStyle = '#0c4a6e';
        ctx.beginPath();
        ctx.ellipse(0, 0, r + 6, r * 0.82, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.5;
        for (let ly = 4; ly <= 16; ly += 5) {
          ctx.beginPath(); ctx.moveTo(-r * 0.6, ly); ctx.lineTo(r * 0.6, ly); ctx.stroke();
        }
        const sonarR = ((boss.pulse * 25) % 24);
        ctx.strokeStyle = `rgba(56, 189, 248, ${1 - sonarR / 24})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, r + sonarR, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#bae6fd';
        ctx.beginPath(); ctx.arc(-14, -6, 4.5, 0, Math.PI * 2); ctx.arc(14, -6, 4.5, 0, Math.PI * 2); ctx.fill();
        break;

      case 'el_gran_maja': // 【EL GRAN MAJA】：裂口深淵海蛇皇 + 生物螢光斑紋 + 鋸齒巨顎
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = '#22d3ee';
        for (let sx = -18; sx <= 18; sx += 9) {
          ctx.beginPath(); ctx.arc(sx, -14, 2.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#881337';
        ctx.beginPath(); ctx.ellipse(0, 6, r * 0.68, r * 0.42 + pulse * 2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        for (let tx = -14; tx <= 14; tx += 7) {
          ctx.beginPath(); ctx.moveTo(tx - 2, -2); ctx.lineTo(tx, 5); ctx.lineTo(tx + 2, -2); ctx.fill();
          ctx.beginPath(); ctx.moveTo(tx - 2, 14); ctx.lineTo(tx, 8); ctx.lineTo(tx + 2, 14); ctx.fill();
        }
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(-12, -9, 3.5, 0, Math.PI * 2); ctx.arc(12, -9, 3.5, 0, Math.PI * 2);
        ctx.arc(-18, -3, 2.5, 0, Math.PI * 2); ctx.arc(18, -3, 2.5, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'leviathan': // 【利維坦】：滅世海龍王 + 金色逆鱗皇冠 + 龍角
        ctx.fillStyle = '#7f1d1d';
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.5;
        ctx.stroke();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(-14, -r + 4); ctx.lineTo(-24, -r - 14); ctx.lineTo(-4, -r + 2);
        ctx.moveTo(14, -r + 4);  ctx.lineTo(24, -r - 14);  ctx.lineTo(4, -r + 2);
        ctx.moveTo(-4, -r);      ctx.lineTo(0, -r - 12);   ctx.lineTo(4, -r);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(-11, -4, 5, 0, Math.PI * 2); ctx.arc(11, -4, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.fillRect(-12, -8, 2, 8); ctx.fillRect(10, -8, 2, 8);
        break;

      case 'kraken': // 【克拉肯】：千腕巨妖 + 8 條揮舞巨觸手
        ctx.strokeStyle = '#e11d48';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        for (let k = 0; k < 8; k++) {
          const ang = (Math.PI * 2 / 8) * k + Math.sin(boss.pulse + k) * 0.25;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * (r * 0.6), Math.sin(ang) * (r * 0.6));
          ctx.quadraticCurveTo(
            Math.cos(ang + 0.4) * (r + 12), Math.sin(ang + 0.4) * (r + 12),
            Math.cos(ang) * (r + 20), Math.sin(ang) * (r + 20)
          );
          ctx.stroke();
        }
        ctx.fillStyle = '#9f1239';
        ctx.beginPath(); ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fde047';
        ctx.beginPath(); ctx.arc(-9, -4, 4.5, 0, Math.PI * 2); ctx.arc(9, -4, 4.5, 0, Math.PI * 2); ctx.fill();
        break;

      case 'jormungandr':
      case 'shenlong': // 【耶夢加得 / 蜃龍】：盤踞巨蟒 / 古神龍首
        ctx.strokeStyle = visual === 'jormungandr' ? '#10b981' : '#eab308';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.arc(0, 0, r + 4, 0.2, Math.PI * 1.8);
        ctx.stroke();
        ctx.fillStyle = visual === 'jormungandr' ? '#065f46' : '#854d0e';
        ctx.beginPath(); ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(-10, -5, 4.5, 0, Math.PI * 2); ctx.arc(10, -5, 4.5, 0, Math.PI * 2); ctx.fill();
        break;

      case 'charybdis': // 【卡律布狄斯】：深海漩渦齒輪巨口
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        for (let ring = 0; ring < 3; ring++) {
          ctx.beginPath();
          ctx.arc(0, 0, r - ring * 9, boss.pulse * (ring % 2 === 0 ? 1 : -1), boss.pulse + Math.PI * 1.6);
          ctx.stroke();
        }
        ctx.fillStyle = '#020617';
        ctx.beginPath(); ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2); ctx.fill();
        break;

      default: // 【刻托 / 盧斯卡】：遠古深海巨獸
        ctx.fillStyle = boss.isApex ? '#9f1239' : '#b45309';
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = boss.isApex ? '#fb7185' : '#fcd34d';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(-10, -5, 4.5, 0, Math.PI * 2); ctx.arc(10, -5, 4.5, 0, Math.PI * 2); ctx.fill();
        break;
    }

    ctx.restore();
  }
}

/* ==================== Boss 彈幕繪製 (支援專屬海怪彈幕色彩) ==================== */
function drawBossBullets(ctx, bossBullets) {
  if (!bossBullets) return;
  for (const bb of bossBullets) {
    ctx.save();
    ctx.fillStyle = bb.color || (bb.isApex ? '#f43f5e' : '#fb923c');
    ctx.beginPath();
    ctx.arc(bb.x, bb.y, bb.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(bb.x, bb.y, bb.radius * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/* ==================== 法器技能特效 ==================== */
function drawArtifactSkillEffects(ctx, effects, globalTime) {
  if (!effects) return;
  for (let i = effects.length - 1; i >= 0; i--) {
    const ef = effects[i];
    ef.timer--;
    const progress = 1 - (ef.timer / ef.maxDuration);

    ctx.save();
    if (ef.type === 'nova') {
      const r = 30 + progress * 155;
      ctx.strokeStyle = `rgba(249, 115, 22, ${1 - progress})`;
      ctx.lineWidth = 5 * (1 - progress);
      ctx.beginPath(); ctx.arc(ef.x, ef.y, r, 0, Math.PI * 2); ctx.stroke();
      for (const p of ef.particles) {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        ctx.fillStyle = `rgba(250, 204, 21, ${1 - progress})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      }
    } else if (ef.type === 'freeze') {
      const r = 40 + progress * 220;
      ctx.fillStyle = `rgba(56, 189, 248, ${0.22 * (1 - progress)})`;
      ctx.beginPath(); ctx.arc(ef.x, ef.y, r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(186, 230, 253, ${1 - progress})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (ef.type === 'thunder') {
      ctx.strokeStyle = `rgba(250, 204, 21, ${1 - progress})`;
      ctx.lineWidth = 3;
      for (const st of ef.strikes) {
        ctx.beginPath();
        ctx.moveTo(st.x, 0);
        for (const pt of st.points) ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
      }
    } else if (ef.type === 'blackhole') {
      const r = 90 * (1 - progress * 0.5);
      ctx.fillStyle = `rgba(88, 28, 135, ${0.5 * (1 - progress)})`;
      ctx.beginPath(); ctx.arc(ef.x, ef.y, r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(192, 132, 252, ${1 - progress})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    ctx.restore();

    if (ef.timer <= 0) effects.splice(i, 1);
  }
}

/* ==================== 寶箱掉落物繪製 ==================== */
function drawChestItem(ctx, chest, globalTime) {
  if (!chest || !chest.active) return;
  const bob = Math.sin(globalTime * 4) * 4;
  ctx.save();
  ctx.translate(chest.x, chest.y + bob);

  ctx.fillStyle = chest.isApex ? '#eab308' : '#0284c7';
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2;
  ctx.fillRect(-14, -10, 28, 20);
  ctx.strokeRect(-14, -10, 28, 20);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(-3, -3, 6, 6);
  ctx.restore();
}

/* ==================== 衝刺殘影繪製 ==================== */
function drawDashGhosts(ctx, ghosts) {
  if (!ghosts) return;
  for (const g of ghosts) {
    ctx.save();
    ctx.translate(g.x, g.y);
    ctx.fillStyle = `rgba(56, 189, 248, ${g.alpha * 0.45})`;
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/* ==================== 玩家人形機甲紙娃娃繪製 (頭部/護目鏡/胸甲/肩甲/雙腿擺動/實體武器) ==================== */
function drawPlayerPaperdoll(ctx, player) {
  ctx.save();
  ctx.translate(player.x, player.y);

  // 1. 腳下戰術光環
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(0, 14, 12, 4.5, 0, 0, Math.PI * 2);
  ctx.stroke();

  const facing = player.facing >= 0 ? 1 : -1;
  ctx.scale(facing, 1);

  const eq = player.equipment || {};
  const armorStyle = eq.armor || 'default';
  const helmStyle = eq.helmet || 'default';
  const wep = eq.weapon || { type: 'bow' };

  // 依胸甲類型切換裝甲主色調
  let bodyColor = '#334155';
  let trimColor = '#38bdf8';
  if (armorStyle === 'heavy') {
    bodyColor = '#475569'; trimColor = '#f59e0b';
  } else if (armorStyle === 'archmage') {
    bodyColor = '#312e81'; trimColor = '#c084fc';
  } else if (armorStyle === 'scout') {
    bodyColor = '#0f766e'; trimColor = '#34d399';
  }

  const walkSwing = player.isMoving ? Math.sin(player.animTimer * 5) * 4.5 : 0;
  const bobY = player.isMoving ? Math.abs(Math.sin(player.animTimer * 5)) * -1.8 : 0;

  // 2. 雙腿與戰靴（跑步時前後交叉擺動）
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  // 後腿
  ctx.strokeStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(-2, 4 + bobY);
  ctx.lineTo(-2 - walkSwing, 13);
  ctx.stroke();
  // 前腿
  ctx.strokeStyle = '#64748b';
  ctx.beginPath();
  ctx.moveTo(2, 4 + bobY);
  ctx.lineTo(2 + walkSwing, 13);
  ctx.stroke();

  // 3. 戰術披風 / 噴射背包
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-8, -5 + bobY, 4, 10);

  // 4. 人形軀幹胸甲
  ctx.fillStyle = bodyColor;
  ctx.strokeStyle = trimColor;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(-6, -6 + bobY, 12, 12, 3);
  } else {
    ctx.rect(-6, -6 + bobY, 12, 12);
  }
  ctx.fill();
  ctx.stroke();

  // 胸口反應爐核心光點
  ctx.fillStyle = trimColor;
  ctx.beginPath();
  ctx.arc(2, -1 + bobY, 2, 0, Math.PI * 2);
  ctx.fill();

  // 5. 頭部與頭盔護目鏡
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.arc(0, -11 + bobY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // 頭盔裝飾（重裝角盔 / 奧術頭冠）
  if (helmStyle === 'heavy') {
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-2, -16 + bobY); ctx.lineTo(-5, -21 + bobY); ctx.lineTo(1, -16 + bobY);
    ctx.fill();
  } else if (helmStyle === 'archmage') {
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-4, -16 + bobY); ctx.lineTo(0, -21 + bobY); ctx.lineTo(4, -16 + bobY);
    ctx.stroke();
  }

  // 發光戰術護目鏡
  ctx.fillStyle = trimColor;
  ctx.fillRect(1, -13 + bobY, 5.5, 3);

  // 6. 手臂與實體遠程武器（電磁弓 / 魔導法杖）
  const recoil = (player.attackTimer > 0) ? -2 : 0;
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.moveTo(0, -3 + bobY);
  ctx.lineTo(8 + recoil, 0 + bobY);
  ctx.stroke();

  if (wep.type === 'staff') {
    // 魔導法杖：長杖身 + 頂端發光星核
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(7 + recoil, 8 + bobY);
    ctx.lineTo(13 + recoil, -12 + bobY);
    ctx.stroke();

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(13 + recoil, -13 + bobY, 3.2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // 電磁獵弓 / 連發弩：弧形弓臂 + 能量弓弦
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(8 + recoil, 0 + bobY, 9, -Math.PI * 0.42, Math.PI * 0.42);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(250, 204, 21, 0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10 + recoil, -8.5 + bobY);
    ctx.lineTo(6 + recoil, 0 + bobY);
    ctx.lineTo(10 + recoil, 8.5 + bobY);
    ctx.stroke();
  }

  ctx.restore();
}

/* ==================== 護符隨行動物靈獸繪製 (白:海鷗 / 藍:靈龜 / 黃:虎鯊 / 橘:應龍) ==================== */
function drawPet(ctx, pet, player, globalTime) {
  if (!pet || !pet.active) return;
  ctx.save();
  ctx.translate(pet.x, pet.y);
  const flap = Math.sin(globalTime * 10);
  const animal = pet.animal || 'seagull';

  if (animal === 'turtle') {
    // 藍裝：深海碧波靈龜
    ctx.fillStyle = '#0284c7';
    ctx.beginPath(); ctx.ellipse(0, 0, 8, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#34d399';
    ctx.beginPath(); ctx.arc(player.facing * 8, -1, 3, 0, Math.PI * 2); ctx.fill();
  } else if (animal === 'shark') {
    // 黃裝：雷霆虎鯊獵犬
    ctx.fillStyle = '#eab308';
    ctx.beginPath(); ctx.ellipse(0, 0, 10, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(-3, -9); ctx.lineTo(3, -4); ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath(); ctx.arc(player.facing * 5, -1, 1.8, 0, Math.PI * 2); ctx.fill();
  } else if (animal === 'dragon') {
    // 橘裝：太古蒼穹應龍
    ctx.strokeStyle = '#fb923c';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-10, flap * 3);
    ctx.quadraticCurveTo(0, -flap * 5, 10, flap * 2);
    ctx.stroke();
    ctx.fillStyle = '#facc15';
    ctx.beginPath(); ctx.arc(player.facing * 8, 0, 4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(player.facing * 6, -3); ctx.lineTo(player.facing * 2, -9); ctx.stroke();
  } else {
    // 白裝：機械偵察海鷗
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-8, flap * 4);
    ctx.quadraticCurveTo(-3, -4, 0, 0);
    ctx.quadraticCurveTo(3, -4, 8, flap * 4);
    ctx.stroke();
  }
  ctx.restore();
}
