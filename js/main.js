/**
 * ANOUAR IQQI (أنوار إقي) - OFFICIAL MOBILE PROFILE
 * Lightweight, Ultra-Fast Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initActions();
});

/* Subtle ambient floating dust effect */
function initBackgroundCanvas() {
  const canvas = document.getElementById('dust-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = Math.min(Math.floor(window.innerWidth / 22), 35);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.5 ? '0, 242, 152' : '0, 180, 216'
    });
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(loop);
  }

  loop();
}

/* Copy phone number and native share */
function initActions() {
  const copyBtn = document.getElementById('btn-copy-num');
  const shareBtn = document.getElementById('btn-share-profile');
  const phoneNumber = '0633323534';

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(phoneNumber).then(() => {
        showToast(`تم نسخ رقم الهاتف: ${phoneNumber} 📋`);
      }).catch(() => {
        showToast(`رقم الهاتف: ${phoneNumber}`);
      });
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'Anouar Iqqi | أنوار إقي',
          text: 'الحسابات الرسمية للكوتش والرياضي أنوار إقي',
          url: window.location.href
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast('تم نسخ رابط الصفحة للمشاركة! 🔗');
        });
      }
    });
  }
}

/* Toast message */
function showToast(text) {
  let toast = document.getElementById('toast-box');
  if (!toast) return;

  toast.innerHTML = `<i class="fas fa-check-circle" style="color: #00f298;"></i> <span>${text}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
