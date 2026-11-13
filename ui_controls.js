/**
 * SSTS - 鍵盤輸入、全螢幕浮動虛擬搖桿(支援多點觸控)、音效合成與全螢幕控制 (ui_controls.js)
 */

const keys = {};
window.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  keys[k] = true;
  if (k === ' ' || k === 'shift') triggerDash();
  if (k === 'e' || k === 'q') triggerArtifactSkill();
});
window.addEventListener('keyup', e => {
  keys[e.key.toLowerCase()] = false;
});

/* ==================== Web Audio 音效合成器 ==================== */
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq, type = 'sine', duration = 0.1, vol = 0.08) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

/* ==================== 全螢幕切換控制 ==================== */
function toggleGlobalFullscreen() {
  const docEl = document.documentElement;
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen().catch(() => {});
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/* ==================== 全螢幕浮動虛擬搖桿 (支援多點觸控與滑鼠模擬) ==================== */
const joyBase = document.getElementById('joystick-base');
const joyThumb = document.getElementById('joystick-thumb');

const joystick = {
  active: false,
  touchId: null,
  originX: 0,
  originY: 0,
  maxRadius: 42,
  vectorX: 0,
  vectorY: 0
};

function startJoystick(clientX, clientY, touchId = null) {
  joystick.active = true;
  joystick.touchId = touchId;
  joystick.originX = clientX;
  joystick.originY = clientY;
  joystick.vectorX = 0;
  joystick.vectorY = 0;

  if (joyBase) {
    joyBase.style.display = 'block';
    joyBase.style.left = `${clientX - 48}px`;
    joyBase.style.top = `${clientY - 48}px`;
  }
  if (joyThumb) {
    joyThumb.style.transform = `translate(0px, 0px)`;
  }
}

function updateJoystick(clientX, clientY) {
  if (!joystick.active) return;
  const dx = clientX - joystick.originX;
  const dy = clientY - joystick.originY;
  const dist = Math.hypot(dx, dy);
  const clampedDist = Math.min(dist, joystick.maxRadius);
  const angle = Math.atan2(dy, dx);

  const offsetX = dist > 0 ? Math.cos(angle) * clampedDist : 0;
  const offsetY = dist > 0 ? Math.sin(angle) * clampedDist : 0;

  if (joyThumb) {
    joyThumb.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }

  // 保留微小死區 (4px) 避免指尖輕微抖動造成角色原地亂轉
  if (dist > 4) {
    joystick.vectorX = offsetX / joystick.maxRadius;
    joystick.vectorY = offsetY / joystick.maxRadius;
  } else {
    joystick.vectorX = 0;
    joystick.vectorY = 0;
  }
}

function resetJoystick() {
  joystick.active = false;
  joystick.touchId = null;
  joystick.vectorX = 0;
  joystick.vectorY = 0;
  if (joyBase) joyBase.style.display = 'none';
  if (joyThumb) joyThumb.style.transform = `translate(0px, 0px)`;
}

function initJoystickEvents(targetCanvas) {
  if (!targetCanvas) return;

  // 1. 觸控操作：全螢幕任意位置皆可喚出浮動搖桿（自動排除技能按鈕）
  targetCanvas.addEventListener('touchstart', (e) => {
    if (typeof isPaused !== 'undefined' && isPaused) return;
    if (e.target && e.target.closest('#battle-action-cluster, button')) return;

    if (!joystick.active && e.changedTouches.length > 0) {
      const t = e.changedTouches[0];
      startJoystick(t.clientX, t.clientY, t.identifier);
    }
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (!joystick.active) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === joystick.touchId) {
        updateJoystick(t.clientX, t.clientY);
        break;
      }
    }
  }, { passive: false });

  const handleTouchEnd = (e) => {
    if (!joystick.active) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joystick.touchId) {
        resetJoystick();
        break;
      }
    }
  };
  window.addEventListener('touchend', handleTouchEnd);
  window.addEventListener('touchcancel', handleTouchEnd);

  // 2. 電腦滑鼠拖曳模擬（全畫布任意位置皆可操作）
  targetCanvas.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    if (typeof isPaused !== 'undefined' && isPaused) return;
    if (e.target && e.target.closest('#battle-action-cluster, button')) return;
    startJoystick(e.clientX, e.clientY, 'mouse');
  });

  window.addEventListener('mousemove', (e) => {
    if (joystick.active && joystick.touchId === 'mouse') {
      updateJoystick(e.clientX, e.clientY);
    }
  });

  window.addEventListener('mouseup', () => {
    if (joystick.active && joystick.touchId === 'mouse') {
      resetJoystick();
    }
  });

  // 3. 綁定右側「法器」與「衝刺」雙手零延遲觸控/點擊事件
  const btnArtifact = document.getElementById('btn-act-artifact');
  const btnDash = document.getElementById('btn-act-dash');

  if (btnArtifact) {
    btnArtifact.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof triggerArtifactSkill === 'function') triggerArtifactSkill();
    }, { passive: false });
    btnArtifact.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      if (typeof triggerArtifactSkill === 'function') triggerArtifactSkill();
    });
  }

  if (btnDash) {
    btnDash.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof triggerDash === 'function') triggerDash();
    }, { passive: false });
    btnDash.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      if (typeof triggerDash === 'function') triggerDash();
    });
  }
}
