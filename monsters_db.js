case 'puffer_bomb': { // 深淵爆裂河豚（鼓脹刺球 + 閃爍紅光核心）
        const flash = Math.sin(e.pulse * 4) > 0 ? '#ef4444' : '#f59e0b';
        ctx.fillStyle = flash;
        ctx.beginPath(); ctx.arc(0, 0, r + 1, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 1.5;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
          ctx.lineTo(Math.cos(a) * (r + 4), Math.sin(a) * (r + 4));
          ctx.stroke();
        }
        break;
      }

      case 'nautilus_gun':
      case 'mantis_shrimp':
      case 'dread_lobster': { // 重砲鸚鵡螺 / 拳擊蝦 / 滅世龍蝦重坦（多節甲殼 + 砲管/重拳）
        ctx.scale(facing, 1);
        ctx.fillStyle = e.color || '#b45309';
        ctx.beginPath(); ctx.ellipse(-2, 0, r + 3, r - 1, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 1.5; ctx.stroke();
        // 前方重砲/重拳
        ctx.fillStyle = '#facc15';
        ctx.fillRect(r - 3, -4, 8, 8);
        break;
      }

      case 'slime_brood':
      case 'mini_slime':
      case 'elder_jelly': { // 分裂海綿母體 / 幼體 / 星雲母艦（雙層半透明細胞核結構）
        ctx.fillStyle = e.color || '#84cc16';
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.beginPath(); ctx.arc(-r * 0.25, -r * 0.2, r * 0.45, 0, Math.PI * 2); ctx.fill();
        if (e.kind !== 'mini_slime') {
          ctx.beginPath(); ctx.arc(r * 0.3, r * 0.2, r * 0.35, 0, Math.PI * 2); ctx.fill();
        }
        break;
      }

      case 'whale_titan':
      case 'magma_turtle': { // 骸骨巨鯨戰艦 / 熔岩玄武巨龜（超巨型裝甲巨獸）
        ctx.scale(facing, 1);
        ctx.fillStyle = e.color || '#1e293b';
        ctx.beginPath(); ctx.ellipse(0, 0, r + 6, r - 2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2.5; ctx.stroke();
        // 背部裝甲板紋路
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-r * 0.5, -r * 0.4); ctx.lineTo(r * 0.5, -r * 0.4); ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(r * 0.55, -2, 3, 0, Math.PI * 2); ctx.fill();
        break;
      }

      case 'acid_starfish': { // 劇毒棘冠海星（五角星形旋轉體）
        ctx.rotate(e.pulse * 0.5);
        ctx.fillStyle = '#be185d';
        ctx.beginPath();
        for (let p = 0; p < 10; p++) {
          const rad = (p % 2 === 0) ? r + 4 : r * 0.45;
          const ang = (Math.PI * 2 / 10) * p;
          if (p === 0) ctx.moveTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
          else ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
        }
        ctx.closePath();
        ctx.fill();
        break;
      }

      case 'hydra_serpent':
      case 'omega_leviathan_spawn': { // 九頭深海毒蛟 / 逆鱗禁衛龍嗣（龍角 + 雙翼鰭）
        ctx.scale(facing, 1);
        ctx.fillStyle = e.color || '#065f46';
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2; ctx.stroke();
        // 雙龍角
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(-2, -r + 2); ctx.lineTo(-10, -r - 7); ctx.lineTo(3, -r + 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(5, -2, 2.5, 0, Math.PI * 2); ctx.fill();
        break;
      }
